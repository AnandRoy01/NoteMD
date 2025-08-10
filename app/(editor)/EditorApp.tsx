"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "motion/react";
import { EditorPane } from "./_components/EditorPane";
import { PreviewPane } from "./_components/PreviewPane";
import { Tabs } from "./_components/Tabs";
import type { Tab } from "./types";
import { initialMarkdown } from "./constants";

export function EditorApp() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: "tab-1", name: "Document 1", content: initialMarkdown },
  ]);
  const [activeTabId, setActiveTabId] = useState("tab-1");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0];

  const handleTabChange = (tabId: string) => setActiveTabId(tabId);
  const handleTabContentChange = (content: string) =>
    setTabs(tabs.map((t) => (t.id === activeTabId ? { ...t, content } : t)));

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
    if (tabs.length === 1) return; // Prevent closing the last tab
    const newTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(newTabs);
    if (activeTabId === tabId) setActiveTabId(newTabs[0].id);
  };

  return (
    <main className="flex min-h-screen flex-col">
      <div className="container flex-1 min-h-0 p-4 flex flex-col">
        <Tabs
          tabs={tabs}
          activeTabId={activeTabId}
          onChange={handleTabChange}
          onClose={closeTab}
          onCreate={createNewTab}
        />

        <motion.div
          className={"grid flex-1 min-h-0 gap-4 grid-cols-1 md:[grid-template-columns:var(--cols)]"}
          style={{ ["--cols" as any]: "50% 50%" }}
          animate={{ ["--cols" as any]: isFullscreen ? "0% 100%" : "50% 50%" }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          initial={false}
        >
          <motion.div
            className="flex flex-col min-h-0 h-full"
            animate={{ opacity: isFullscreen ? 0 : 1 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            aria-hidden={isFullscreen}
            style={{ pointerEvents: isFullscreen ? "none" : "auto" }}
          >
            <EditorPane value={activeTab.content} onChange={handleTabContentChange} />
          </motion.div>

          <div className="flex flex-col min-h-0 h-full">
            <PreviewPane
              value={activeTab.content}
              isFullscreen={isFullscreen}
              onToggleFullscreen={() => setIsFullscreen((v) => !v)}
            />
          </div>
        </motion.div>
      </div>

      <footer className="border-t py-4">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          Built with Next.js and Tailwind CSS
        </div>
      </footer>
    </main>
  );
}
