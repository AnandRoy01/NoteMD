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
        <nav className="ml-6 hidden sm:flex items-center gap-4 text-sm">
          {[
            { href: "/", label: "Home" },
            { href: "/html-to-md", label: "HTML → MD" },
          ].map(({ href, label }) => {
            const active = pathname === href;
            return (
              <div key={href} className="relative">
                <Link href={href} className="hover:text-foreground/80 transition-colors">
                  {label}
                </Link>
                <motion.span
                  layoutId="nav-underline"
                  className="absolute left-0 -bottom-1 h-0.5 bg-foreground"
                  style={{ width: active ? "100%" : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
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
