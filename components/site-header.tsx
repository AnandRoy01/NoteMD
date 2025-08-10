"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="container flex h-14 items-center px-4">
        <Link href="/" className="text-xl font-semibold">
          Markdown Generator
        </Link>
        <nav className="ml-6 hidden sm:flex items-center gap-3 text-sm">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/html-to-md" className="hover:underline">HTML → MD</Link>
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
