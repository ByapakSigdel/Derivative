"use client";
import { useEditorStore } from "@/store/editorStore";
import { NodeType } from "@/types/graph";

type NodeConfig = {
  type: NodeType;
  label: string;
  description: string;
};

const nodeConfigs: NodeConfig[] = [
  {
    type: "DigitalWrite",
    label: "Digital Write",
    description: "Set pin HIGH/LOW"
  },
  {
    type: "AnalogRead",
    label: "Analog Read",
    description: "Read sensor"
  },
  {
    type: "Delay",
    label: "Delay",
    description: "Wait (ms)"
  },
  {
    type: "If",
    label: "If",
    description: "Conditional"
  },
  {
    type: "Loop",
    label: "For Loop",
    description: "Repeat N times"
  }
];

export default function NodePanel() {
  const { addNode, nodes } = useEditorStore();

  const add = (type: NodeType) => () => {
    const baseX = 250;
    const baseY = 100;
    const offset = nodes.length * 80;
    
    addNode(type, { x: baseX, y: baseY + offset });
  };

  return (
    <div>
      <h2 className="text-xs font-semibold mb-3 text-slate-400 uppercase tracking-wider">Add Node</h2>
      <div className="space-y-1.5">
        {nodeConfigs.map((config) => (
          <button
            key={config.type}
            onClick={add(config.type)}
            className="w-full text-left px-2.5 py-2 rounded bg-slate-700 hover:bg-slate-600 transition-colors border border-slate-600 hover:border-slate-500"
          >
            <div className="font-medium text-xs text-white">
              {config.label}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {config.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
