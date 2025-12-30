"use client";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import ReactFlow, {
  Background,
  MiniMap,
  BackgroundVariant,
  NodeTypes,
  ConnectionMode,
  Panel,
  useReactFlow,
  OnConnectStartParams
} from "reactflow";
import "reactflow/dist/style.css";
import { useEditorStore } from "@/store/editorStore";
import CustomNode from "./nodes/CustomNode";
import StartNode from "./nodes/StartNode";
import EndNode from "./nodes/EndNode";
import ContextMenu from "./ContextMenu";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

// Define nodeTypes outside component to ensure stability
const nodeTypes: NodeTypes = {
  custom: CustomNode,
  Start: StartNode,
  End: EndNode,
  // Legacy support
  start: StartNode,
  loop: EndNode
};

export default function NodeCanvas() {
  const { theme, setTheme } = useTheme();
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
    source?: { nodeId: string; handleId: string | null; handleType: string } | null;
  } | null>(null);

  const [connectionStart, setConnectionStart] = useState<{
    nodeId: string;
    handleId: string | null;
    handleType: "source" | "target";
  } | null>(null);

  const { screenToFlowPosition, fitView } = useReactFlow();

  const onConnectStart = useCallback((_: React.MouseEvent | React.TouchEvent, { nodeId, handleId, handleType }: OnConnectStartParams) => {
    if (nodeId && handleType) {
      setConnectionStart({ nodeId, handleId, handleType });
    }
  }, []);

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!connectionStart) return;
      
      const targetIsPane = (event.target as Element).classList.contains('react-flow__pane');
      
      if (targetIsPane) {
        let clientX, clientY;
        if ('clientX' in event) {
            clientX = event.clientX;
            clientY = event.clientY;
        } else {
            const touch = event.changedTouches[0];
            clientX = touch.clientX;
            clientY = touch.clientY;
        }

        const position = screenToFlowPosition({
          x: clientX,
          y: clientY,
        });
        
        setContextMenu({
          x: clientX,
          y: clientY,
          position,
          source: connectionStart
        });
      }
      setConnectionStart(null);
    },
    [connectionStart, screenToFlowPosition]
  );

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
    <div className="h-full w-full bg-background transition-colors duration-300" style={{ height: '100%', width: '100%', minHeight: '500px' }}>
      <ReactFlow
        nodes={nodes.length > 0 ? nodes : debugNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
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
        className="bg-background transition-colors duration-300"
        defaultEdgeOptions={{
          type: "default",
          animated: false,
          style: { 
            strokeWidth: 2, 
            stroke: theme === 'dark' ? "#52525b" : "#a1a1aa",
          }
        }}
        connectionLineStyle={{
          strokeWidth: 2,
          stroke: theme === 'dark' ? "#a1a1aa" : "#52525b"
        }}
        minZoom={0.2}
        maxZoom={4}
        deleteKeyCode="Delete"
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color={theme === 'dark' ? "#27272a" : "#e4e4e7"}
        />
        <MiniMap
          className="!bg-card !border !border-border !rounded-lg !shadow-md"
          nodeColor={() => theme === 'dark' ? "#52525b" : "#a1a1aa"}
          maskColor={theme === 'dark' ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.6)"}
        />
        <Panel position="top-left">
          <div className="bg-card/80 backdrop-blur-md border border-border rounded-lg px-4 py-3 text-xs text-muted-foreground max-w-xs shadow-sm">
            <div className="font-semibold text-foreground mb-2 text-sm">Quick Start</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2"><span className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-[10px]">Space</span> Add nodes</div>
              <div className="flex items-center gap-2"><span className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-[10px]">Drag</span> Move nodes</div>
              <div className="flex items-center gap-2"><span className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-[10px]">Del</span> Remove selected</div>
              <div className="pt-1 border-t border-border mt-1">Nodes: <span className="text-foreground font-mono">{nodes.length}</span></div>
            </div>
          </div>
        </Panel>
        <Panel position="bottom-left" className="flex gap-1.5">
          <button onClick={() => fitView({ duration: 800 })} className="p-2 bg-card hover:bg-accent text-foreground border border-border rounded-lg transition-colors shadow-sm" title="Fit View">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
          </button>
          <button onClick={() => useReactFlow().zoomIn()} className="p-2 bg-card hover:bg-accent text-foreground border border-border rounded-lg transition-colors shadow-sm" title="Zoom In">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </button>
          <button onClick={() => useReactFlow().zoomOut()} className="p-2 bg-card hover:bg-accent text-foreground border border-border rounded-lg transition-colors shadow-sm" title="Zoom Out">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </button>
        </Panel>
      </ReactFlow>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          position={contextMenu.position}
          source={contextMenu.source}
          onClose={onContextMenuClose}
        />
      )}
    </div>
  );
}
