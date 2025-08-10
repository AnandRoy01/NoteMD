"use client";

import React from "react";
import { useTheme } from "next-themes";

// Wraps page content and animates when the theme changes
export function ThemeTransition({ children }: { children: React.ReactNode }) {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  const [active, setActive] = React.useState(true);
  const [reduced, setReduced] = React.useState(false);
  const firstPaint = React.useRef(true);

  // Respect prefers-reduced-motion
  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  React.useEffect(() => {
    if (firstPaint.current) {
      // Skip animation on initial mount
      firstPaint.current = false;
      setActive(true);
      return;
    }
    // Reset and trigger animation on theme change
    setActive(false);
    const id = requestAnimationFrame(() => setActive(true));
    return () => cancelAnimationFrame(id);
  }, [currentTheme]);

  const style: React.CSSProperties = reduced
    ? {
        transition: "opacity 240ms linear, transform 240ms linear",
        opacity: active ? 1 : 0.95,
        transform: active ? "translate3d(0,0,0)" : "translate3d(10px,-10px,0)",
      }
    : {
        transition:
          "opacity 800ms cubic-bezier(0.22,1,0.36,1), transform 800ms cubic-bezier(0.22,1,0.36,1), filter 800ms cubic-bezier(0.22,1,0.36,1)",
        opacity: active ? 1 : 0.96,
        transform: active ? "translate3d(0,0,0) scale(1)" : "translate3d(14px,-14px,0) scale(0.998)",
        filter: active ? "blur(0px)" : "blur(1.5px)",
        willChange: "opacity, transform, filter",
      };

  return (
    <div style={style}>
      {children}
    </div>
  );
}
