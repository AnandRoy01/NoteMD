"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { MotionButton } from "@/components/ui/motion-button";
import { useToast } from "@/components/ui/use-toast";
import { htmlToMarkdown } from "@/lib/convert";

function sanitizeHtml(html: string) {
  // Basic sanitization: strip script/style/iframe and event handlers
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("script, style, iframe, object, embed").forEach((el) => el.remove());
  doc.querySelectorAll("*").forEach((el) => {
    // Remove on* handlers
    for (const attr of Array.from(el.attributes)) {
      if (/^on/i.test(attr.name)) el.removeAttribute(attr.name);
    }
  });
  return doc.body.innerHTML;
}

export default function RichPasteToMdPage() {
  const { toast } = useToast();
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [markdown, setMarkdown] = useState("");
  const [filename, setFilename] = useState("pasted-content.md");
  const [pulse, setPulse] = useState(false);

  const handlePaste: React.ClipboardEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const html = e.clipboardData.getData("text/html");
    const text = e.clipboardData.getData("text/plain");
    const content = html ? sanitizeHtml(html) : `<p>${text.replaceAll("\n", "<br/>")}</p>`;
    if (editorRef.current) {
      // Insert as HTML to preserve formatting
      editorRef.current.innerHTML = content;
      convertNow();
      toast({ title: "Pasted", description: "Rich content pasted and converted." });
    }
  };

  const convertNow = () => {
    const html = editorRef.current?.innerHTML || "";
    const md = htmlToMarkdown(html);
    setMarkdown(md);
    setPulse(true);
  };

  useEffect(() => {
    if (!pulse) return;
    const t = setTimeout(() => setPulse(false), 220);
    return () => clearTimeout(t);
  }, [pulse]);

  const copyMd = async () => {
    await navigator.clipboard.writeText(markdown);
    toast({ title: "Copied", description: "Markdown copied to clipboard" });
  };

  const downloadMd = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.trim() || "pasted-content.md";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="container py-6">
      <h1 className="text-xl font-semibold mb-4">Rich Paste → Markdown</h1>
  <p className="text-sm text-muted-foreground mb-8">
        Paste content from any web page (Cmd/Ctrl+V). We preserve structure like headings, bold/italic, links, lists, code, and tables.
      </p>
  <div className="grid items-start gap-4 md:grid-cols-2">
        <div className="flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-medium">Paste Area</h2>
            <div className="text-xs h-8 flex items-center text-muted-foreground">Rich text is supported</div>
          </div>
          <div
            ref={editorRef}
            onPaste={handlePaste}
            contentEditable
            suppressContentEditableWarning
            className="h-[420px] overflow-auto rounded-md border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring/70"
            onInput={convertNow}
          />
          <div className="mt-2 flex gap-2">
            <MotionButton onClick={convertNow} whileHoverScale={1.03} whileTapScale={0.97}>
              Convert Now
            </MotionButton>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-medium">Markdown Output</h2>
            <input
              className="h-8 w-[210px] rounded-md border bg-background px-2 text-xs"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="filename.md"
            />
          </div>
          <motion.textarea
            animate={{ boxShadow: pulse ? "0 0 0 2px hsl(var(--ring))" : "0 0 0 0px rgba(0,0,0,0)" }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="h-[420px] w-full resize-none overflow-auto rounded-md border bg-background p-3 font-mono text-xs"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
          />
          <div className="mt-2 flex gap-2">
            <MotionButton
              variant="outline"
              onClick={copyMd}
              whileHoverScale={1.03}
              whileTapScale={0.97}
              disabled={!markdown.trim()}
              aria-disabled={!markdown.trim()}
            >
              Copy Markdown
            </MotionButton>
            <MotionButton
              variant="secondary"
              onClick={downloadMd}
              whileHoverScale={1.03}
              whileTapScale={0.97}
              disabled={!markdown.trim()}
              aria-disabled={!markdown.trim()}
            >
              Download .md
            </MotionButton>
          </div>
        </div>
      </div>
    </main>
  );
}
