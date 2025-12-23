"use client";
import { useCallback, useMemo, useState, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  NodeTypes,
  ConnectionMode,
  Panel,
  useReactFlow
} from "reactflow";
import "reactflow/dist/style.css";
import { useEditorStore } from "@/store/editorStore";
import CustomNode from "./nodes/CustomNode";
import StartNode from "./nodes/StartNode";
import LoopNode from "./nodes/EndNode";
import ContextMenu from "./ContextMenu";

// Define nodeTypes outside component to ensure stability
const nodeTypes: NodeTypes = {
  custom: CustomNode,
  start: StartNode,
  loop: LoopNode
};

export default function NodeCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    clear,
    initialize,
    addNode
  } = useEditorStore();

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    position: { x: number; y: number };
  } | null>(null);

  const { screenToFlowPosition, fitView } = useReactFlow();

  // Initialize with Start and Loop nodes
  useEffect(() => {
    console.log('NodeCanvas mounted, calling initialize');
    initialize();
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 200 });
    }, 100);
  }, [initialize, fitView]);

  // Log nodes for debugging
  useEffect(() => {
    console.log('NodeCanvas nodes updated:', nodes.length, nodes);
  }, [nodes]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
    },
    []
  );

  const onPaneContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        position,
      });
    },
    [screenToFlowPosition]
  );

  const onPaneClick = useCallback(() => {
    if (contextMenu) {
      setContextMenu(null);
    }
  }, [contextMenu]);

  // Handle keyboard shortcuts (like UE's spacebar for search)
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Open context menu at center when pressing spacebar
      if (event.code === "Space" && !contextMenu) {
        event.preventDefault();
        const canvasElement = document.querySelector(".react-flow__pane");
        if (canvasElement) {
          const rect = canvasElement.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          
          const position = screenToFlowPosition({
            x: centerX,
            y: centerY,
          });

          setContextMenu({
            x: centerX,
            y: centerY,
            position,
          });
        }
      }
    },
    [screenToFlowPosition, contextMenu]
  );

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const onContextMenuClose = useCallback(() => {
    setContextMenu(null);
  }, []);

  const debugNodes = [
    {
      id: 'debug-1',
      type: 'custom',
      position: { x: 100, y: 100 },
      data: { label: 'Debug Custom', type: 'Debug' }
    },
    {
      id: 'debug-2',
      type: 'default',
      position: { x: 100, y: 200 },
      data: { label: 'Debug Default' }
    }
  ];

  return (
    <div className="h-full w-full" style={{ height: '100%', width: '100%', minHeight: '500px' }}>
      <ReactFlow
        nodes={nodes.length > 0 ? nodes : debugNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onPaneClick={onPaneClick}
        onPaneContextMenu={onPaneContextMenu}
        nodeTypes={nodeTypes}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        connectionMode={ConnectionMode.Loose}
        snapToGrid={true}
        snapGrid={[15, 15]}
        fitView
        fitViewOptions={{
          padding: 0.2,
          minZoom: 0.5,
          maxZoom: 1.5
        }}
        className="bg-slate-900"
        defaultEdgeOptions={{
          type: "default",
          animated: false,
          style: { 
            strokeWidth: 3, 
            stroke: "#64748b",
          }
        }}
        connectionLineStyle={{
          strokeWidth: 3,
          stroke: "#94a3b8"
        }}
        minZoom={0.2}
        maxZoom={4}
        deleteKeyCode="Delete"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          color="#475569"
        />
        <Controls 
          className="!bg-slate-800 !border !border-slate-700 !rounded"
          showInteractive={false}
        />
        <MiniMap
          className="!bg-slate-800 !border !border-slate-700 !rounded"
          nodeColor={() => "#64748b"}
          maskColor="rgba(15, 23, 42, 0.8)"
        />
        <Panel position="top-right" className="flex gap-2">
          <button
            onClick={() => addNode("If", { x: 300, y: 300 })}
            className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white border border-blue-500 rounded transition-colors"
          >
            + Test Node
          </button>
          <button
            onClick={clear}
            className="px-3 py-1.5 text-xs bg-red-600 hover:bg-red-500 text-white border border-red-500 rounded transition-colors"
          >
            Clear Canvas
          </button>
        </Panel>
        <Panel position="top-left">
          <div className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-xs text-slate-300 max-w-xs">
            <div className="font-semibold text-slate-200 mb-1">Quick Start</div>
            <div className="text-[10px] text-slate-400 space-y-0.5">
              <div><span className="text-slate-300">Right Click / Space</span> - Add nodes</div>
              <div><span className="text-slate-300">Drag</span> - Move nodes</div>
              <div><span className="text-slate-300">Delete</span> - Remove selected</div>
              <div>Nodes: {nodes.length}</div>
            </div>
          </div>
        </Panel>
      </ReactFlow>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          position={contextMenu.position}
          onClose={onContextMenuClose}
        />
      )}
    </div>
  );
}
