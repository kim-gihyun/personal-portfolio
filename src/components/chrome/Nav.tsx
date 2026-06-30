"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navItems, profile } from "@/lib/data/profile";
import { ThemeToggle } from "./ThemeToggle";
import { Magnetic } from "@/components/ui/Magnetic";

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;

    const focusables = () =>
      Array.from(overlayRef.current?.querySelectorAll<HTMLElement>("a, button") ?? []);
    const id = requestAnimationFrame(() => focusables()[0]?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setOpen(false);
      if (e.key !== "Tab") return;
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
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      burgerRef.current?.focus();
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
        <div className="nav-inner shell">
          <Magnetic strength={0.25}>
            <Link href="/" className="brand" aria-label="Gihyun Kim — home" data-cursor="link">
              <span className="brand-mark" aria-hidden>
                <span>G</span>
                <span>K</span>
              </span>
              <span className="brand-text">
                <b>Gihyun Kim</b>
                <span className="readout">Mechanical Engineering · HKU</span>
              </span>
            </Link>
          </Magnetic>

          <nav className="nav-links" aria-label="Primary">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive(item.href) ? "is-active" : ""}`}
                data-cursor="link"
              >
                <i className="readout">{item.index}</i>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="nav-right">
            <ThemeToggle />
            <button
              ref={burgerRef}
              type="button"
              className={`nav-burger ${open ? "is-open" : ""}`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              data-cursor="link"
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={overlayRef}
            className="nav-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="nav-overlay-inner shell">
              <ul>
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link href={item.href} className={isActive(item.href) ? "is-active" : ""}>
                      <i className="readout">{item.index}</i>
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="nav-overlay-foot readout">
                <span>{profile.location}</span>
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
