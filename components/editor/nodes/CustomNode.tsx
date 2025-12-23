"use client";
import { Handle, Position, NodeProps } from "reactflow";
import { memo } from "react";

export type CustomNodeData = {
  label: string;
  type: string;
  inputs?: number;
  outputs?: number;
  params?: Array<{ name: string; value: any }>;
};

const getNodeColor = (type: string) => {
  switch (type) {
    case "DigitalWrite":
      return { bg: "bg-yellow-600", header: "bg-yellow-700", border: "border-yellow-500" };
    case "AnalogRead":
      return { bg: "bg-purple-600", header: "bg-purple-700", border: "border-purple-500" };
    case "Delay":
      return { bg: "bg-orange-600", header: "bg-orange-700", border: "border-orange-500" };
    case "If":
      return { bg: "bg-emerald-600", header: "bg-emerald-700", border: "border-emerald-500" };
    case "Loop":
      return { bg: "bg-emerald-600", header: "bg-emerald-700", border: "border-emerald-500" };
    default:
      return { bg: "bg-slate-600", header: "bg-slate-700", border: "border-slate-500" };
  }
};

const CustomNode = ({ data, selected }: NodeProps<CustomNodeData>) => {
  // console.log('Rendering CustomNode:', data.label);
  const hasInputs = (data.inputs ?? 1) > 0;
  const hasOutputs = (data.outputs ?? 1) > 0;
  const colors = getNodeColor(data.type);
  
  return (
    <div
      className={`
        ${colors.bg} rounded-lg shadow-2xl transition-all cursor-move border-2
        ${selected ? `ring-4 ring-orange-400 ${colors.border}` : `${colors.border} hover:shadow-orange-500/20`}
        min-w-[200px] max-w-[240px]
      `}
      style={{ opacity: 1, visibility: 'visible' }}
    >
      {/* Header */}
      <div className={`px-4 py-2 ${colors.header} rounded-t-md`}>
        <div className="text-white text-sm font-bold">{data.label}</div>
      </div>
      
      {/* Parameters */}
      {data.params && data.params.length > 0 && (
        <div className="px-4 py-3 space-y-2 bg-slate-800/50">
          {data.params.map((param, idx) => (
            <div key={idx} className="flex justify-between items-center gap-3">
              <span className="text-slate-200 text-xs font-medium flex-shrink-0">
                {param.name}:
              </span>
              <span className="text-white font-mono bg-slate-900 px-2 py-1 rounded text-xs text-right border border-slate-700">
                {String(param.value)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Input Handle */}
      {hasInputs && (
        <>
          <Handle
            type="target"
            position={Position.Top}
            className="!w-4 !h-4 !bg-emerald-400 !border-2 !border-slate-900 !rounded-full hover:!scale-125 transition-transform"
            style={{ top: -8 }}
          />
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] text-emerald-400 font-semibold pointer-events-none">
            IN
          </div>
        </>
      )}

      {/* Output Handle */}
      {hasOutputs && (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            className="!w-4 !h-4 !bg-sky-400 !border-2 !border-slate-900 !rounded-full hover:!scale-125 transition-transform"
            style={{ bottom: -8 }}
          />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] text-sky-400 font-semibold pointer-events-none">
            OUT
          </div>
        </>
      )}
    </div>
  );
};

export default CustomNode;
