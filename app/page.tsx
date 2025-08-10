"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Copy,
  Download,
  Github,
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
import { ThemeToggle } from "@/components/theme-toggle";
import { markdownToText } from "@/lib/convert";
import Link from "next/link";

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
      {/* Page-local toolbar below the persistent header */}
      <div className="border-b">
        <div className="container flex h-12 items-center px-4 gap-2">
          <div className="text-sm text-muted-foreground">Editor actions</div>
          <div className="ml-auto flex items-center gap-2">
            <MotionButton variant="ghost" size="icon" onClick={handleCopy} whileHoverScale={1.05} whileTapScale={0.95}>
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy markdown</span>
            </MotionButton>
            <MotionButton variant="ghost" size="sm" onClick={handleCopyPlainText} title="Copy as plain text" whileHoverScale={1.03} whileTapScale={0.97}>
              Copy Text
            </MotionButton>
            <MotionButton variant="ghost" size="icon" onClick={handleDownload} whileHoverScale={1.05} whileTapScale={0.95}>
              <Download className="h-4 w-4" />
              <span className="sr-only">Download markdown</span>
            </MotionButton>
            <MotionButton variant="ghost" size="icon" onClick={toggleFullscreen} whileHoverScale={1.05} whileTapScale={0.95}>
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle fullscreen</span>
            </MotionButton>
          </div>
        </div>
      </div>

      <div className="container flex-1 p-4 flex flex-col">
        <div className="flex items-center border-b mb-4">
          <div className="flex-1 flex overflow-x-auto">
            {tabs.map((tab) => (
              <motion.button
                whileHover={{ y: -1 }}
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  "px-4 py-2 flex items-center gap-2 border-r",
                  activeTabId === tab.id
                    ? "bg-secondary text-secondary-foreground font-medium"
                    : "hover:bg-muted/50"
                )}
              >
                <span className="truncate max-w-[150px]">{tab.name}</span>
                <button
                  onClick={(e) => closeTab(tab.id, e)}
                  className="opacity-60 hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5" />
                  <span className="sr-only">Close tab</span>
                </button>
              </motion.button>
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

        <div
          className={`grid flex-1 gap-4 ${
            isFullscreen ? "" : "md:grid-cols-2"
          }`}
        >
          {!isFullscreen && (
            <div className="flex flex-col">
              <h2 className="mb-2 text-sm font-medium">Editor</h2>
              <Textarea
                className="flex-1 resize-none font-mono text-sm"
                value={activeTab.content}
                onChange={(e) => handleTabContentChange(e.target.value)}
                placeholder="Type your markdown here..."
              />
            </div>
          )}

          <div className="flex flex-col">
            <h2 className="mb-2 text-sm font-medium">Preview</h2>
            <div className="rounded-md border flex-1 p-4 overflow-auto">
              <MarkdownPreview markdown={activeTab.content} />
            </div>
          </div>
        </div>
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
