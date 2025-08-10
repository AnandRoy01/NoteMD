"use client";

import type React from "react";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Copy,
  Download,
  Maximize2,
  Minimize2,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MotionButton } from "@/components/ui/motion-button";
import { Toaster } from "@/components/ui/toaster";
import { Textarea } from "@/components/ui/textarea";
import MarkdownPreview from "@/components/markdown-preview";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { markdownToText } from "@/lib/convert";

const initialMarkdown = `# Welcome to Markdown Generator

## Features

- **Real-time preview** as you type
- Clean, minimal interface
- Support for all standard markdown syntax
- Easy export options
- Multiple tabs support

## How to use

1. Type your markdown in the editor panel
2. See the preview update in real-time
3. Create new tabs for different documents
4. Copy or download your markdown when finished

## Code Example

\`\`\`javascript
function greet() {
  console.log("Hello, markdown!");
}
\`\`\`

## Table Example

| Feature | Description |
|---------|-------------|
| Preview | Real-time markdown rendering |
| Export | Download as .md file |
| Styling | Clean, minimal design |
| Tabs | Work on multiple documents |

> Enjoy creating beautiful documents with markdown!
`;

interface Tab {
  id: string;
  name: string;
  content: string;
}

export default function Home() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: "tab-1", name: "Document 1", content: initialMarkdown },
  ]);
  const [activeTabId, setActiveTabId] = useState("tab-1");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editorFocused, setEditorFocused] = useState(false);
  const { toast } = useToast();

  const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0];

  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId);
  };

  const handleTabContentChange = (content: string) => {
    setTabs(
      tabs.map((tab) => (tab.id === activeTabId ? { ...tab, content } : tab))
    );
  };

  const createNewTab = () => {
    const newTabId = `tab-${Date.now()}`;
    const newTabNumber = tabs.length + 1;
    const newTab = {
      id: newTabId,
      name: `Document ${newTabNumber}`,
      content: `# Document ${newTabNumber}\n\nStart writing your markdown here...`,
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTabId);
  };

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (tabs.length === 1) {
      toast({
        title: "Cannot close tab",
        description: "You must have at least one tab open",
        variant: "destructive",
      });
      return;
    }

    const newTabs = tabs.filter((tab) => tab.id !== tabId);
    setTabs(newTabs);

    if (activeTabId === tabId) {
      setActiveTabId(newTabs[0].id);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeTab.content);
    toast({
      title: "Copied to clipboard",
      description: `"${activeTab.name}" has been copied to clipboard`,
    });
  };

  const handleCopyPlainText = () => {
    const text = markdownToText(activeTab.content);
    navigator.clipboard.writeText(text);
    toast({ title: "Copied plain text", description: "Markdown converted to text and copied" });
  };

  const handleDownload = () => {
    const blob = new Blob([activeTab.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTab.name.toLowerCase().replace(/\s+/g, "-")}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded",
      description: `"${activeTab.name}" has been downloaded`,
    });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <main className="flex min-h-screen flex-col">
  {/* Removed page-local toolbar; fullscreen control moved to Preview actions */}

      <div className="container flex-1 min-h-0 p-4 flex flex-col">
        <div className="flex items-center border-b mb-4">
          <div className="flex-1 flex overflow-x-auto">
            {tabs.map((tab) => (
              <motion.div
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                // Remove layout to avoid sibling relayout animations
                initial={false}
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  "px-4 py-2 flex items-center gap-2 border-r",
                  activeTabId === tab.id
                    ? "bg-secondary text-secondary-foreground font-medium"
                    : "hover:bg-muted/50"
                )}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleTabChange(tab.id);
                  }
                }}
              >
                <span className="truncate max-w-[150px]">{tab.name}</span>
                <button
                  onClick={(e) => closeTab(tab.id, e)}
                  className="opacity-60 hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5" />
                  <span className="sr-only">Close tab</span>
                </button>
              </motion.div>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2"
            onClick={createNewTab}
          >
            <Plus className="h-4 w-4 mr-1" />
            New Tab
          </Button>
        </div>

        <motion.div
          className={"grid flex-1 min-h-0 gap-4 grid-cols-1 md:[grid-template-columns:var(--cols)]"}
          style={{ ["--cols" as any]: "50% 50%" }}
          animate={{ ["--cols" as any]: isFullscreen ? "0% 100%" : "50% 50%" }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          initial={false}
        >
          {/* Editor panel (fades and shrinks on fullscreen) */}
          <motion.div
            className="flex flex-col min-h-0"
            animate={{ opacity: isFullscreen ? 0 : 1 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            aria-hidden={isFullscreen}
            style={{ pointerEvents: isFullscreen ? "none" : "auto" }}
          >
              <div className="mb-2 flex items-center gap-2">
                <h2 className="text-sm font-bold">Editor</h2>
                <div className="ml-auto flex items-center gap-2">
                  {/* Copy markdown */}
                  <MotionButton variant="ghost" size="icon" onClick={handleCopy} whileHoverScale={1.05} whileTapScale={0.95} aria-label="Copy markdown">
                    <Copy className="h-4 w-4" />
                  </MotionButton>
                  {/* Download markdown */}
                  <MotionButton variant="ghost" size="icon" onClick={handleDownload} whileHoverScale={1.05} whileTapScale={0.95} aria-label="Download markdown">
                    <Download className="h-4 w-4" />
                  </MotionButton>
                </div>
              </div>
              <motion.div
                animate={{ boxShadow: editorFocused ? "0 0 0 2px hsl(var(--ring))" : "0 0 0 0px rgba(0,0,0,0)" }}
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                className="rounded-md flex-1 flex overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`editor-${activeTabId}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="flex-1 flex"
                  >
                    <Textarea
                      className="flex-1 h-full resize-none font-mono text-sm"
                      value={activeTab.content}
                      onFocus={() => setEditorFocused(true)}
                      onBlur={() => setEditorFocused(false)}
                      onChange={(e) => handleTabContentChange(e.target.value)}
                      placeholder="Type your markdown here..."
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
          </motion.div>

          {/* Preview panel (expands to full width on fullscreen) */}
          <motion.div className={cn("flex flex-col min-h-0")}>
            <div className="mb-2 flex items-center gap-2">
              <h2 className="text-sm font-bold">Preview</h2>
              <div className="ml-auto flex items-center gap-2">
                {/* Copy plain text */}
                <MotionButton variant="ghost" size="icon" onClick={handleCopyPlainText} whileHoverScale={1.05} whileTapScale={0.95} aria-label="Copy plain text">
                  <Copy className="h-4 w-4" />
                </MotionButton>
                {/* Toggle fullscreen for preview/editor layout */}
                <MotionButton variant="ghost" size="icon" onClick={toggleFullscreen} whileHoverScale={1.05} whileTapScale={0.95} aria-label="Toggle fullscreen">
                  {isFullscreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </MotionButton>
              </div>
            </div>
            <div className="rounded-md border flex-1 overflow-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`preview-${activeTabId}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="p-4"
                >
                  <MarkdownPreview markdown={activeTab.content} />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <footer className="border-t py-4">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          Built with Next.js and Tailwind CSS
        </div>
      </footer>
      <Toaster />
    </main>
  );
}
