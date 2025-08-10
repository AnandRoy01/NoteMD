"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Copy, Download } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { MotionButton } from "@/components/ui/motion-button";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function EditorPane({ value, onChange }: Props) {
  const [focused, setFocused] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast({ title: "Copied to clipboard", description: "Markdown copied" });
  };

  const handleDownload = () => {
    const blob = new Blob([value], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `document-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded", description: "File saved as .md" });
  };

  return (
    <div className="flex flex-col min-h-0 h-full">
      <div className="mb-2 flex items-center gap-2">
        <h2 className="text-sm font-bold">Editor</h2>
        <div className="ml-auto flex items-center gap-2">
          <MotionButton variant="ghost" size="icon" onClick={handleCopy} whileHoverScale={1.05} whileTapScale={0.95} aria-label="Copy markdown">
            <Copy className="h-4 w-4" />
          </MotionButton>
          <MotionButton variant="ghost" size="icon" onClick={handleDownload} whileHoverScale={1.05} whileTapScale={0.95} aria-label="Download markdown">
            <Download className="h-4 w-4" />
          </MotionButton>
        </div>
      </div>
      <motion.div
        animate={{ boxShadow: focused ? "0 0 0 2px hsl(var(--ring))" : "0 0 0 0px rgba(0,0,0,0)" }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        className="rounded-md flex-1 min-h-0 h-full flex overflow-hidden"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`editor`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="flex-1 min-h-0 flex"
          >
            <Textarea
              className="flex-1 h-full min-h-0 resize-none font-mono text-sm"
              value={value}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Type your markdown here..."
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
