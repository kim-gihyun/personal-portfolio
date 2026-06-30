"use client";

import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const cur = document.documentElement.getAttribute("data-theme") as Theme | null;
    if (cur) setTheme(cur);
    // keep every consumer (gyroid shader, globe, toggle…) in sync on change
    const onChange = (e: Event) => setTheme((e as CustomEvent<Theme>).detail);
    const onStorage = (e: StorageEvent) => {
      if (e.key === "gk-theme" && (e.newValue === "light" || e.newValue === "dark")) {
        document.documentElement.setAttribute("data-theme", e.newValue);
        setTheme(e.newValue);
      }
    };
    window.addEventListener("themechange", onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("themechange", onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const apply = useCallback((t: Theme) => {
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem("gk-theme", t);
    } catch {
      /* ignore */
    }
    setTheme(t);
    window.dispatchEvent(new CustomEvent("themechange", { detail: t }));
  }, []);

  const toggle = useCallback(() => apply(theme === "dark" ? "light" : "dark"), [theme, apply]);

  return { theme, toggle, setTheme: apply };
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
