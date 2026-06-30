"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Img = { src: string; alt: string };

export function Gallery({ images, className }: { images: Img[]; className?: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;
  const boxRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const go = useCallback(
    (dir: number) => setIndex((i) => (i === null ? i : (i + dir + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement as HTMLElement;

    const focusables = () => Array.from(boxRef.current?.querySelectorAll<HTMLElement>("button") ?? []);
    const id = requestAnimationFrame(() => focusables()[0]?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (e.key === "ArrowRight") return go(1);
      if (e.key === "ArrowLeft") return go(-1);
      if (e.key === "Tab") {
        const f = focusables();
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      triggerRef.current?.focus();
    };
  }, [open, close, go]);

  return (
    <>
      <div className={`gallery ${className ?? ""}`}>
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            className="gallery-thumb"
            onClick={() => setIndex(i)}
            data-cursor="view"
            data-cursor-label="view"
            aria-label={`View ${img.alt}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.alt} loading="lazy" />
            <span className="readout gallery-fig">FIG {String(i + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open && index !== null && (
          <motion.div
            ref={boxRef}
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`Image ${index + 1} of ${images.length}: ${images[index].alt}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <button className="lightbox-close" onClick={close} aria-label="Close" data-cursor="link">
              ✕
            </button>
            <button
              className="lightbox-nav lightbox-prev"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              aria-label="Previous"
              data-cursor="link"
            >
              ←
            </button>
            <motion.figure
              key={index}
              className="lightbox-fig"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images[index].src} alt={images[index].alt} />
              <figcaption className="readout">
                FIG {String(index + 1).padStart(2, "0")} — {images[index].alt}
              </figcaption>
            </motion.figure>
            <button
              className="lightbox-nav lightbox-next"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              aria-label="Next"
              data-cursor="link"
            >
              →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
