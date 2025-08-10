"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <Link href="/" className="text-xl font-semibold">
          Markdown Generator
        </Link>
        <nav className="flex-1 flex justify-center items-center gap-8 text-sm">
          {[{ href: "/", label: "Home" },{ href: "/html-to-md", label: "HTML → MD" },{ href: "/rich-paste", label: "Rich Paste" },].map(({ href, label }) => {
            const active = pathname === href;
            return (
              <div key={href} className="relative">
                <Link
                  href={href}
                  className={`px-3 py-1 rounded-md transition-colors ${active ? "font-bold text-foreground bg-muted/40 shadow-sm" : "hover:text-foreground/80"}`}
                >
                  {label}
                </Link>
              </div>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="sm" asChild>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <Github className="h-3.5 w-3.5" />
              <span>GitHub</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
