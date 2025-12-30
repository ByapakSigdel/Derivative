"use client";
import { Handle, Position, NodeProps } from "reactflow";
import { memo } from "react";
import { motion } from "framer-motion";
import { 
  Cpu, 
  Activity, 
  Clock, 
  GitBranch, 
  Repeat, 
  Calculator, 
  Terminal, 
  Variable, 
  Settings2 
} from "lucide-react";

export type CustomNodeData = {
  label: string;
  type: string;
  inputs?: number;
  outputs?: number;
  outputLabels?: string[];
  params?: Array<{ name: string; value: any }>;
  status?: "valid" | "warning" | "invalid";
  statusMessage?: string;
  isValueNode?: boolean;
};

const getNodeIcon = (type: string) => {
  switch (type) {
    case "DigitalWrite":
    case "DigitalRead":
    case "PinMode":
      return <Cpu size={14} />;
    case "AnalogRead":
    case "AnalogWrite":
      return <Activity size={14} />;
    case "Delay":
    case "Millis":
    case "Micros":
      return <Clock size={14} />;
    case "If":
    case "IfCondition":
    case "While":
    case "For":
    case "LogicOperation":
      return <GitBranch size={14} />;
    case "Loop":
      return <Repeat size={14} />;
    case "MathOperation":
    case "Map":
    case "Constrain":
    case "Random":
      return <Calculator size={14} />;
    case "SerialBegin":
    case "SerialPrint":
      return <Terminal size={14} />;
    case "Variable":
    case "VariableSet":
      return <Variable size={14} />;
    default:
      return <Settings2 size={14} />;
  }
};

const getNodeColor = (type: string, status?: string) => {
  if (status === "invalid") return { 
    bg: "bg-card", 
    header: "bg-destructive text-destructive-foreground", 
    border: "ring-1 ring-destructive",
    handle: "bg-destructive"
  };
  if (status === "warning") return { 
    bg: "bg-card", 
    header: "bg-yellow-500 text-white", 
    border: "ring-1 ring-yellow-500",
    handle: "bg-yellow-500"
  };

  switch (type) {
    case "DigitalWrite":
    case "DigitalRead":
    case "PinMode":
      return { 
        bg: "bg-card", 
        header: "bg-amber-500 text-white", 
        border: "ring-1 ring-amber-500/20",
        handle: "bg-amber-500"
      };
    case "AnalogRead":
    case "AnalogWrite":
      return { 
        bg: "bg-card", 
        header: "bg-purple-500 text-white", 
        border: "ring-1 ring-purple-500/20",
        handle: "bg-purple-500"
      };
    case "Delay":
    case "Millis":
    case "Micros":
      return { 
        bg: "bg-card", 
        header: "bg-orange-500 text-white", 
        border: "ring-1 ring-orange-500/20",
        handle: "bg-orange-500"
      };
    case "If":
    case "IfCondition":
    case "While":
    case "For":
    case "LogicOperation":
      return { 
        bg: "bg-card", 
        header: "bg-emerald-500 text-white", 
        border: "ring-1 ring-emerald-500/20",
        handle: "bg-emerald-500"
      };
    case "Loop":
      return { 
        bg: "bg-card", 
        header: "bg-green-600 text-white", 
        border: "ring-1 ring-green-600/20",
        handle: "bg-green-600"
      };
    case "MathOperation":
    case "Map":
    case "Constrain":
    case "Random":
      return { 
        bg: "bg-card", 
        header: "bg-blue-500 text-white", 
        border: "ring-1 ring-blue-500/20",
        handle: "bg-blue-500"
      };
    case "SerialBegin":
    case "SerialPrint":
      return { 
        bg: "bg-card", 
        header: "bg-teal-500 text-white", 
        border: "ring-1 ring-teal-500/20",
        handle: "bg-teal-500"
      };
    case "Variable":
    case "VariableSet":
      return { 
        bg: "bg-card", 
        header: "bg-pink-500 text-white", 
        border: "ring-1 ring-pink-500/20",
        handle: "bg-pink-500"
      };
    default:
      return { 
        bg: "bg-card", 
        header: "bg-slate-500 text-white", 
        border: "ring-1 ring-slate-500/20",
        handle: "bg-slate-500"
      };
  }
};

const CustomNode = ({ data, selected, isConnectable }: NodeProps<CustomNodeData>) => {
  const hasInputs = (data.inputs ?? 1) > 0;
  const hasOutputs = (data.outputs ?? 1) > 0;
  const colors = getNodeColor(data.type, data.status);
  const Icon = getNodeIcon(data.type);
  
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`
        ${colors.bg} rounded-2xl shadow-md
        ${selected ? `ring-2 ring-primary shadow-xl scale-[1.02]` : `${colors.border} hover:shadow-lg`}
        min-w-[200px] max-w-[240px] relative overflow-hidden group transition-all duration-300
      `}
    >
      {/* Status Message Tooltip */}
      {data.status && data.status !== "valid" && (
        <div className="absolute -top-8 left-0 right-0 bg-destructive text-destructive-foreground text-[10px] p-1 rounded-lg border border-destructive shadow-lg z-50 whitespace-normal text-center animate-in fade-in slide-in-from-bottom-1 font-medium">
          {data.statusMessage}
        </div>
      )}

      {/* Header */}
      <div className={`px-4 py-3 ${colors.header} relative flex items-center justify-between shadow-sm`}>
        <div className="flex items-center gap-2.5">
          <div className="p-1 bg-white/20 rounded-md backdrop-blur-sm">
            {Icon}
          </div>
          <div className="text-xs font-bold tracking-wide uppercase">{data.label}</div>
        </div>
        {/* Value Output Handle (Right side of header) */}
        {data.isValueNode && (
          <Handle
            type="source"
            position={Position.Right}
            id="value-output"
            isConnectable={isConnectable}
            className={`!w-3.5 !h-3.5 !bg-white !border-2 !border-${colors.handle.replace('bg-', '')} !rounded-full hover:!scale-125 transition-transform z-50 shadow-sm`}
            style={{ right: -6, top: '50%' }}
          />
        )}
      </div>
      
      {/* Parameters */}
      {data.params && data.params.length > 0 && (
        <div className="px-4 py-4 space-y-3">
          {data.params.map((param, idx) => (
            <div key={idx} className="relative flex justify-between items-center gap-3 group/param">
              {/* Parameter Input Handle */}
              <Handle
                type="target"
                position={Position.Left}
                id={`param-${param.name}`}
                isConnectable={isConnectable}
                className={`!w-3 !h-3 !bg-background !border-2 !border-blue-500 !rounded-full hover:!scale-150 transition-transform z-50 opacity-0 group-hover/param:opacity-100 shadow-sm`}
                style={{ left: -20 }}
              />
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                {param.name}
              </span>
              <span className="font-mono bg-muted/50 px-2.5 py-1 rounded-md text-[10px] text-right border border-border text-foreground shadow-sm min-w-[40px] font-medium">
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
            isConnectable={isConnectable}
            className={`!w-3.5 !h-3.5 !bg-background !border-2 !border-${colors.handle.replace('bg-', '')} !rounded-full hover:!scale-125 transition-transform z-50 shadow-sm`}
            style={{ top: -7 }}
          />
        </>
      )}

      {/* Output Handle */}
      {hasOutputs && (
        <>
          {data.outputs && data.outputs > 1 ? (
            // Multiple outputs
            Array.from({ length: data.outputs }).map((_, i) => {
              const left = `${((i + 1) / (data.outputs! + 1)) * 100}%`;
              return (
                <div key={i} className="absolute bottom-0" style={{ left, transform: 'translateX(-50%)' }}>
                  <Handle
                    id={`source-${i}`}
                    type="source"
                    position={Position.Bottom}
                    isConnectable={isConnectable}
                    className={`!w-3.5 !h-3.5 !bg-background !border-2 !border-${colors.handle.replace('bg-', '')} !rounded-full hover:!scale-125 transition-transform z-50 shadow-sm`}
                    style={{ bottom: -7 }}
                  />
                  {data.outputLabels && data.outputLabels[i] && (
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground font-semibold pointer-events-none whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 px-2 py-0.5 rounded-full border border-border shadow-sm backdrop-blur-sm">
                      {data.outputLabels[i]}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            // Single output
            <>
              <Handle
                type="source"
                position={Position.Bottom}
                isConnectable={isConnectable}
                className={`!w-3.5 !h-3.5 !bg-background !border-2 !border-${colors.handle.replace('bg-', '')} !rounded-full hover:!scale-125 transition-transform z-50 shadow-sm`}
                style={{ bottom: -7 }}
              />
            </>
          )}
        </>
      )}
    </motion.div>
  );
};

export default memo(CustomNode);
