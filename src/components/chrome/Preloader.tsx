"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { prefersReducedMotion } from "@/lib/theme";

export function Preloader({ name }: { name: string }) {
  const [show, setShow] = useState(true);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    // play once per tab session
    if (typeof window !== "undefined" && sessionStorage.getItem("gk-loaded")) {
      setShow(false);
      return;
    }
    if (prefersReducedMotion()) {
      const t = setTimeout(() => finish(), 300);
      return () => clearTimeout(t);
    }
    let v = 0;
    const id = setInterval(() => {
      v = Math.min(100, v + Math.random() * 18 + 6);
      setPct(Math.floor(v));
      if (v >= 100) {
        clearInterval(id);
        setTimeout(finish, 380);
      }
    }, 130);
    return () => clearInterval(id);
    function finish() {
      try {
        sessionStorage.setItem("gk-loaded", "1");
      } catch {}
      setShow(false);
    }
  }, []);

  const [a, b] = name.split(" ");

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="preloader"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="preloader-inner shell">
            <motion.div
              className="preloader-name"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <span>{a}</span>
              <span className="preloader-accent">{b}</span>
            </motion.div>
            <div className="preloader-meta">
              <span className="readout">Mechanical Engineering · HKU</span>
              <span className="readout preloader-pct tnum">{String(pct).padStart(3, "0")}%</span>
            </div>
            <div className="preloader-bar">
              <motion.span style={{ width: `${pct}%` }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
