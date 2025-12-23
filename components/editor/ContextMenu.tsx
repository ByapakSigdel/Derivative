"use client";
import { useEffect, useRef, useState } from "react";
import { NodeType } from "@/types/graph";
import { useEditorStore } from "@/store/editorStore";

type NodeMenuItem = {
  type: NodeType;
  label: string;
  description: string;
  category: string;
  color: string;
};

const nodeMenuItems: NodeMenuItem[] = [
  // Flow Control
  {
    type: "If",
    label: "If Condition",
    description: "Branch based on condition",
    category: "Flow Control",
    color: "emerald"
  },
  {
    type: "Loop",
    label: "Repeat Loop",
    description: "Repeat actions N times",
    category: "Flow Control",
    color: "emerald"
  },
  
  // Digital I/O
  {
    type: "DigitalWrite",
    label: "Turn LED On/Off",
    description: "Control digital pin (LED, relay)",
    category: "Digital Output",
    color: "yellow"
  },
  
  // Analog I/O
  {
    type: "AnalogRead",
    label: "Read Sensor",
    description: "Read analog sensor value",
    category: "Analog Input",
    color: "purple"
  },
  
  // Timing
  {
    type: "Delay",
    label: "Wait",
    description: "Pause program execution",
    category: "Timing",
    color: "orange"
  }
];

type ContextMenuProps = {
  x: number;
  y: number;
  onClose: () => void;
  position: { x: number; y: number };
};

export default function ContextMenu({ x, y, onClose, position }: ContextMenuProps) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { addNode } = useEditorStore();

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

  const handleAddNode = (type: NodeType) => {
    console.log('Adding node:', type, 'at position:', position);
    addNode(type, position);
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
      className="context-menu fixed z-50 bg-slate-800 border border-slate-600 rounded shadow-2xl min-w-[280px] max-w-[320px]"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Search Bar */}
      <div className="p-2 border-b border-slate-700">
        <input
          ref={searchInputRef}
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedIndex(0);
          }}
          placeholder="Search nodes..."
          className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-600 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Node List */}
      <div className="max-h-[400px] overflow-y-auto">
        {Object.keys(grouped).length === 0 ? (
          <div className="p-4 text-xs text-slate-500 text-center">
            No nodes found
          </div>
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-900">
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
                        ? "bg-blue-600 text-white border-blue-400"
                        : "text-slate-200 hover:bg-slate-700 border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        item.color === 'emerald' ? 'bg-emerald-400' :
                        item.color === 'yellow' ? 'bg-yellow-400' :
                        item.color === 'purple' ? 'bg-purple-400' :
                        item.color === 'orange' ? 'bg-orange-400' :
                        'bg-slate-400'
                      }`} />
                      <div className="flex-1">
                        <div className="font-semibold">{item.label}</div>
                        <div className={`text-[10px] mt-0.5 ${
                          selectedIndex === globalIndex ? "text-blue-100" : "text-slate-400"
                        }`}>
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Footer Hint */}
      <div className="px-3 py-1.5 text-[9px] text-slate-500 border-t border-slate-700 bg-slate-900">
        <span className="text-slate-400">↑↓</span> Navigate • <span className="text-slate-400">Enter</span> Select • <span className="text-slate-400">Esc</span> Close
      </div>
    </div>
  );
}
