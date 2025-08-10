"use client";

import React from "react";
import clsx from "clsx";

type LogoProps = {
  size?: number;
  className?: string;
  title?: string;
};

// NoteMD Logo: rounded square with a Markdown-style symbol
export function Logo({ size = 20, className, title = "NoteMD" }: LogoProps) {
  const common = {
    fill: "none" as const,
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      className={clsx("shrink-0", className)}
    >
      <title>{title}</title>
      {/* Outer rounded board */}
      <rect x="6" y="6" rx="12" ry="12" width="52" height="52" {...common} strokeWidth={3} />
      {/* Folded corner */}
      <path d="M46 6c4 0 6 2 6 6v10" {...common} strokeWidth={3} />
      {/* Markdown chevrons </> style */}
      <path d="M26 24 18 32 26 40" {...common} strokeWidth={4} />
      <path d="M38 24 46 32 38 40" {...common} strokeWidth={4} />
      {/* Tiny baseline underscore to hint markdown/code */}
      <path d="M24 46h16" {...common} strokeWidth={3} />
    </svg>
  );
}
