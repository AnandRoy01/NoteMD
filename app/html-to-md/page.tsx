"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MotionButton } from "@/components/ui/motion-button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { htmlToMarkdown } from "@/lib/convert";

export default function HtmlToMdPage() {
  const [html, setHtml] = useState("");
  const [md, setMd] = useState("");
  const { toast } = useToast();

  const convert = () => {
    const out = htmlToMarkdown(html);
    setMd(out);
    toast({ title: "Converted", description: "HTML converted to Markdown" });
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(md);
    toast({ title: "Copied", description: "Markdown copied to clipboard" });
  };

  return (
    <main className="container py-6">
      <h1 className="text-xl font-semibold mb-4">HTML → Markdown</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col">
          <h2 className="mb-2 text-sm font-medium">HTML Input</h2>
          <Textarea
            className="min-h-[300px] font-mono text-sm"
            placeholder="Paste your HTML here..."
            value={html}
            onChange={(e) => setHtml(e.target.value)}
          />
          <div className="mt-2 flex gap-2">
            <MotionButton onClick={convert} whileHoverScale={1.03} whileTapScale={0.97}>Convert</MotionButton>
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className="mb-2 text-sm font-medium">Markdown Output</h2>
          <Textarea
            className="min-h-[300px] font-mono text-sm"
            placeholder="Converted Markdown will appear here..."
            value={md}
            onChange={(e) => setMd(e.target.value)}
          />
          <div className="mt-2">
            <MotionButton variant="outline" onClick={copyOutput} whileHoverScale={1.03} whileTapScale={0.97}>Copy Markdown</MotionButton>
          </div>
        </div>
      </div>
    </main>
  );
}
