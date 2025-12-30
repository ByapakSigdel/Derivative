"use client";
import { useEffect, useRef, useState } from "react";
import { NodeType } from "@/types/graph";
import { useEditorStore } from "@/store/editorStore";
import { createDefaultRegistry } from "@/lib/engine/nodeRegistry";

type NodeMenuItem = {
  type: string;
  label: string;
  description: string;
  category: string;
  color: string;
};

const registry = createDefaultRegistry();
const nodeMenuItems: NodeMenuItem[] = registry.list()
  .filter(def => def.type !== "Start" && def.type !== "End")
  .map(def => {
    let color = "slate";
    if (def.category === "IO") color = "amber";
    else if (def.category === "Logic") color = "blue";
    else if (def.category === "Timing") color = "purple";
    else if (def.category === "Data") color = "emerald";
    else if (def.category === "Math") color = "rose";

    return {
      type: def.type,
      label: def.title,
      description: def.description || `Add ${def.title} block`,
      category: def.category || "General",
      color
    };
  });

type ContextMenuProps = {
  x: number;
  y: number;
  onClose: () => void;
  position: { x: number; y: number };
  source?: { nodeId: string; handleId: string | null; handleType: string } | null;
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "IO": return { text: "text-amber-500", bg: "bg-amber-500/5", border: "border-amber-500/20", hover: "hover:bg-amber-500/10 hover:border-amber-500/30" };
    case "Logic": return { text: "text-blue-500", bg: "bg-blue-500/5", border: "border-blue-500/20", hover: "hover:bg-blue-500/10 hover:border-blue-500/30" };
    case "Timing": return { text: "text-purple-500", bg: "bg-purple-500/5", border: "border-purple-500/20", hover: "hover:bg-purple-500/10 hover:border-purple-500/30" };
    case "Data": return { text: "text-emerald-500", bg: "bg-emerald-500/5", border: "border-emerald-500/20", hover: "hover:bg-emerald-500/10 hover:border-emerald-500/30" };
    case "Math": return { text: "text-rose-500", bg: "bg-rose-500/5", border: "border-rose-500/20", hover: "hover:bg-rose-500/10 hover:border-rose-500/30" };
    default: return { text: "text-slate-500", bg: "bg-slate-500/5", border: "border-slate-500/20", hover: "hover:bg-slate-500/10 hover:border-slate-500/30" };
  }
};

export default function ContextMenu({ x, y, onClose, position, source }: ContextMenuProps) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { addNode, onConnect } = useEditorStore();

  const filteredItems = nodeMenuItems.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
        e.preventDefault();
        handleAddNode(filteredItems[selectedIndex].type);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [filteredItems, selectedIndex, onClose]);

  const handleAddNode = (type: string) => {
    console.log('Adding node:', type, 'at position:', position);
    const newNodeId = addNode(type as any, position);
    
    if (source && newNodeId) {
      setTimeout(() => {
        if (source.handleType === 'source') {
          onConnect({
            source: source.nodeId,
            sourceHandle: source.handleId,
            target: newNodeId,
            targetHandle: 'target'
          });
        } else {
          onConnect({
            source: newNodeId,
            sourceHandle: 'source',
            target: source.nodeId,
            targetHandle: source.handleId
          });
        }
      }, 50);
    }

    console.log('Node added, closing menu');
    onClose();
  };

  // Group by category
  const grouped = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, NodeMenuItem[]>);

  return (
    <div
      className="context-menu fixed z-50 bg-popover border border-border rounded-lg shadow-2xl min-w-[280px] max-w-[320px] overflow-hidden"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Search Bar */}
      <div className="p-2 border-b border-border bg-muted/30">
        <input
          ref={searchInputRef}
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedIndex(0);
          }}
          placeholder="Search nodes..."
          className="w-full px-3 py-1.5 text-xs bg-background border border-input rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Node List */}
      <div className="max-h-[400px] overflow-y-auto bg-popover">
        {Object.keys(grouped).length === 0 ? (
          <div className="p-4 text-xs text-muted-foreground text-center">
            No nodes found
          </div>
        ) : (
          Object.entries(grouped).map(([category, items]) => {
            const colors = getCategoryColor(category);
            return (
              <div key={category}>
                <div className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider bg-muted/50 ${colors.text}`}>
                  {category}
                </div>
                {items.map((item, idx) => {
                  const globalIndex = filteredItems.indexOf(item);
                  return (
                    <button
                      key={item.type}
                      onClick={() => handleAddNode(item.type)}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      className={`w-full text-left px-3 py-2.5 text-xs transition-colors border-l-2 ${
                        selectedIndex === globalIndex
                          ? `bg-accent text-accent-foreground ${colors.border.replace('border-', 'border-l-')}`
                          : "text-foreground hover:bg-accent hover:text-accent-foreground border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          item.color === 'emerald' ? 'bg-emerald-500' :
                          item.color === 'amber' ? 'bg-amber-500' :
                          item.color === 'blue' ? 'bg-blue-500' :
                          item.color === 'purple' ? 'bg-purple-500' :
                          item.color === 'rose' ? 'bg-rose-500' :
                          'bg-slate-500'
                        }`} />
                        <div className="flex-1">
                          <div className="font-semibold">{item.label}</div>
                          <div className={`text-[10px] mt-0.5 ${
                            selectedIndex === globalIndex ? "text-muted-foreground" : "text-muted-foreground"
                          }`}>
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Hint */}
      <div className="px-3 py-1.5 text-[9px] text-muted-foreground border-t border-border bg-muted/30">
        <span className="text-foreground/70">↑↓</span> Navigate • <span className="text-foreground/70">Enter</span> Select • <span className="text-foreground/70">Esc</span> Close
      </div>
    </div>
  );
}
