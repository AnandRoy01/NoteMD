import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/toaster";
import { ThemeTransition } from "@/components/theme-transition";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NoteMD",
  description: "A modern, minimal markdown editor with real-time preview",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/notemd-logo.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SiteHeader />
          <ThemeTransition>{children}</ThemeTransition>
          {/* Global toaster for notifications across the app */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
