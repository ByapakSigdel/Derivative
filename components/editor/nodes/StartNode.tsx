"use client";
import { Handle, Position, NodeProps } from "reactflow";
import { memo } from "react";
import { CustomNodeData } from "./CustomNode";
import { Play } from "lucide-react";

const StartNode = ({ selected, data, isConnectable }: NodeProps<CustomNodeData>) => {
  const isInvalid = data.status === "invalid";
  const isWarning = data.status === "warning";
  
  let borderColor = "border-green-500/50";
  if (isInvalid) borderColor = "border-destructive/50";
  else if (isWarning) borderColor = "border-yellow-500/50";

  return (
    <div
      className={`
        bg-card rounded-2xl shadow-md transition-all duration-300
        ${selected ? "ring-2 ring-primary shadow-xl scale-105" : "hover:shadow-lg hover:scale-105"}
        min-w-[160px] relative overflow-hidden group
      `}
    >
      {/* Status Message */}
      {data.status && data.status !== "valid" && (
        <div className="absolute -top-8 left-0 right-0 bg-destructive text-destructive-foreground text-[10px] p-1 rounded border border-destructive/50 shadow-lg z-50 whitespace-normal text-center">
          {data.statusMessage}
        </div>
      )}

      <div className="bg-green-500 px-5 py-3 flex items-center justify-center relative z-10 shadow-sm">
        <div className="text-white font-bold tracking-wide text-sm flex items-center gap-2">
          <Play size={16} fill="currentColor" />
          START
        </div>
      </div>

      <div className="px-5 py-4 flex flex-col items-center justify-center gap-1 relative z-10">
        <div className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">program start</div>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="!w-3.5 !h-3.5 !bg-background !border-2 !border-green-500 !rounded-full hover:!scale-125 transition-transform z-50 shadow-sm"
        style={{ bottom: -7 }}
      />
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground font-medium pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        OUT
      </div>
    </div>
  );
};

export default memo(StartNode);
