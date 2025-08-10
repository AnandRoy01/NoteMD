"use client";

import { motion } from "motion/react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Tab } from "../types";

interface Props {
  tabs: Tab[];
  activeTabId: string;
  onChange: (id: string) => void;
  onClose: (id: string, e: React.MouseEvent) => void;
  onCreate: () => void;
}

export function Tabs({ tabs, activeTabId, onChange, onClose, onCreate }: Props) {
  return (
    <div className="flex items-center border-b mb-4">
      <div className="flex-1 flex overflow-x-auto">
        {tabs.map((tab) => (
          <motion.div
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            initial={false}
            key={tab.id}
            onClick={() => onChange(tab.id)}
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
                onChange(tab.id);
              }
            }}
          >
            <span className="truncate max-w-[150px]">{tab.name}</span>
            <button
              onClick={(e) => onClose(tab.id, e)}
              className="opacity-60 hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Close tab</span>
            </button>
          </motion.div>
        ))}
      </div>
      <Button variant="ghost" size="sm" className="ml-2" onClick={onCreate}>
        <Plus className="h-4 w-4 mr-1" />
        New Tab
      </Button>
    </div>
  );
}
