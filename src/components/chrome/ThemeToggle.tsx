"use client";

import { useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      className="theme-toggle"
      aria-pressed={dark}
      aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
      data-cursor="link"
    >
      <span className="theme-toggle-track" data-dark={dark ? "1" : "0"}>
        <span className="theme-toggle-knob" />
      </span>
      <span className="readout theme-toggle-label">{dark ? "DARK" : "LIGHT"}</span>
    </button>
  );
}
