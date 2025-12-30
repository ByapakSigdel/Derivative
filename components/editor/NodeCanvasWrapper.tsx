"use client";
import { ReactFlowProvider } from "reactflow";
import NodeCanvas from "@/components/editor/NodeCanvas";

export default function NodeCanvasWrapper() {
  return (
    <ReactFlowProvider>
      <NodeCanvas />
    </ReactFlowProvider>
  );
}
