"use client";
import { useEditorStore } from "@/store/editorStore";
import { createDefaultRegistry } from "@/lib/engine/nodeRegistry";
import { useMemo } from "react";
import { 
  Cpu, 
  Activity, 
  Clock, 
  GitBranch, 
  Repeat, 
  Calculator, 
  Terminal, 
  Variable, 
  Settings2,
  Box
} from "lucide-react";

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "IO": return <Cpu size={12} />;
    case "Logic": return <GitBranch size={12} />;
    case "Timing": return <Clock size={12} />;
    case "Data": return <Variable size={12} />;
    case "Math": return <Calculator size={12} />;
    default: return <Box size={12} />;
  }
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

export default function NodePanel() {
  const { addNode, nodes } = useEditorStore();
  
  const groups = useMemo(() => {
    const registry = createDefaultRegistry();
    const all = registry.list();
    const groups: Record<string, typeof all> = {};
    
    all.forEach(def => {
      if (def.type === "Start" || def.type === "End") return;
      const cat = def.category || "Other";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(def);
    });
    
    return groups;
  }, []);

  const add = (type: string) => () => {
    const baseX = 250;
    const baseY = 100;
    const offset = nodes.length * 20; // Smaller offset
    addNode(type as any, { x: baseX + offset, y: baseY + offset });
  };

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([category, items]) => {
        const colors = getCategoryColor(category);
        return (
          <div key={category} className="animate-in fade-in slide-in-from-left-2 duration-300">
            <div className={`flex items-center gap-2 mb-2 px-1 ${colors.text}`}>
              {getCategoryIcon(category)}
              <h3 className="text-[10px] font-bold uppercase tracking-wider">
                {category}
              </h3>
            </div>
            <div className="space-y-1">
              {items.map((def) => (
                <button
                  key={def.type}
                  onClick={add(def.type)}
                  className={`
                    w-full text-left px-3 py-2 rounded-md transition-all duration-200 
                    border group shadow-sm hover:shadow-md
                    ${colors.bg} ${colors.border} ${colors.hover}
                  `}
                >
                  <div className="font-medium text-xs text-foreground group-hover:text-foreground flex items-center justify-between">
                    {def.title}
                    <span className={`opacity-0 group-hover:opacity-100 text-[10px] ${colors.text} transition-opacity`}>+</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

