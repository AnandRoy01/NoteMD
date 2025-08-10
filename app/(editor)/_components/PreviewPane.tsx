"use client";

import { AnimatePresence, motion } from "motion/react";
import { Copy, Maximize2, Minimize2 } from "lucide-react";
import { MotionButton } from "@/components/ui/motion-button";
import { useToast } from "@/components/ui/use-toast";
import MarkdownPreview from "@/components/markdown-preview";
import { markdownToText } from "@/lib/convert";

interface Props {
  value: string;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export function PreviewPane({ value, isFullscreen, onToggleFullscreen }: Props) {
  const { toast } = useToast();

  const handleCopyPlainText = () => {
    const text = markdownToText(value);
    navigator.clipboard.writeText(text);
    toast({ title: "Copied plain text", description: "Markdown converted to text and copied" });
  };

  return (
    <div className="flex flex-col min-h-0 h-full">
      <div className="mb-2 flex items-center gap-2">
        <h2 className="text-sm font-bold">Preview</h2>
        <div className="ml-auto flex items-center gap-2">
          <MotionButton variant="ghost" size="icon" onClick={handleCopyPlainText} whileHoverScale={1.05} whileTapScale={0.95} aria-label="Copy plain text">
            <Copy className="h-4 w-4" />
          </MotionButton>
          <MotionButton variant="ghost" size="icon" onClick={onToggleFullscreen} whileHoverScale={1.05} whileTapScale={0.95} aria-label="Toggle fullscreen">
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </MotionButton>
        </div>
      </div>
  <div className="rounded-md border flex-1 min-h-0 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={`preview`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="p-4"
          >
            <MarkdownPreview markdown={value} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
