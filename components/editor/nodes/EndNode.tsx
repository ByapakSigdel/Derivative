"use client";
import { Handle, Position, NodeProps } from "reactflow";
import { memo } from "react";

const LoopNode = ({ selected }: NodeProps) => {
  return (
    <div
      className={`
        bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-2xl transition-all 
        ${selected ? "ring-4 ring-orange-400 scale-105" : "hover:scale-105 hover:shadow-blue-500/30"}
        min-w-[160px] border-2 border-blue-500
      `}
      style={{ opacity: 1, visibility: 'visible' }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-5 !h-5 !bg-emerald-400 !border-2 !border-slate-900 !rounded-full hover:!scale-125 transition-transform"
        style={{ top: -10 }}
      />
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] text-emerald-400 font-semibold pointer-events-none">
        IN
      </div>
      
      <div className="px-5 py-4 text-center">
        <div className="text-2xl mb-1">🔄</div>
        <div className="text-white text-sm font-bold">LOOP</div>
        <div className="text-blue-200 text-[10px] mt-1">runs forever</div>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-5 !h-5 !bg-sky-400 !border-2 !border-slate-900 !rounded-full hover:!scale-125 transition-transform"
        style={{ bottom: -10 }}
      />
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] text-sky-400 font-semibold pointer-events-none">
        OUT
      </div>
    </div>
  );
};

export default LoopNode;
