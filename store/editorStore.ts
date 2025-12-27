"use client";
import { create } from "zustand";
import type { Graph, NodeType, Node as GraphNode, Edge as GraphEdge } from "@/types/graph";
import { type Node, type Edge, type XYPosition, addEdge, applyNodeChanges, applyEdgeChanges, type OnNodesChange, type OnEdgesChange } from "reactflow";
import type { CustomNodeData } from "@/components/editor/nodes/CustomNode";

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `n${idCounter}`;
}

type EditorState = {
  nodes: Node<CustomNodeData>[];
  edges: Edge[];
  graph: Graph;
  addNode: (type: NodeType, position?: XYPosition) => string;
  updateNodePosition: (id: string, position: XYPosition) => void;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  deleteNode: (id: string) => void;
  deleteEdge: (id: string) => void;
  setValidationStatus: (status: { nodes: { id: string; status: "valid" | "warning" | "invalid"; message?: string }[]; edges: { id: string; status: "valid" | "warning" | "invalid"; message?: string }[] }) => void;
  clear: () => void;
  initialize: () => void;
};

const getInitialNodes = (): Node<CustomNodeData>[] => [
  {
    id: "start-1",
    type: "Start",
    position: { x: 400, y: 50 },
    data: { label: "Start", type: "Start" },
    draggable: true,
    selectable: true,
  },
  {
    id: "end-1",
    type: "End",
    position: { x: 400, y: 400 },
    data: { label: "End", type: "End" },
    draggable: true,
    selectable: true,
  },
];

const initial: Pick<EditorState, "nodes" | "edges"> = { 
  nodes: getInitialNodes(), 
  edges: [] 
};

// Helper to convert ReactFlow nodes to graph nodes
const toGraphNodes = (nodes: Node<CustomNodeData>[]): GraphNode[] => {
  return nodes
    .filter(n => !["start", "loop", "Start", "End"].includes(n.data.type))
    .map(n => {
      const params = n.data.params || [];
      const getParam = (name: string) => params.find(p => p.name === name)?.value;
      
      switch (n.data.type) {
        case "DigitalWrite":
          return {
            id: n.id,
            type: "DigitalWrite" as const,
            payload: { 
              pin: Number(getParam("Pin")) || 13, 
              value: getParam("State") === "HIGH" || getParam("State") === true 
            }
          };
        case "AnalogRead":
          return {
            id: n.id,
            type: "AnalogRead" as const,
            payload: { pin: Number(String(getParam("Pin")).replace("A", "")) || 0 }
          };
        case "Delay":
          return {
            id: n.id,
            type: "Delay" as const,
            payload: { ms: Number(getParam("Time (ms)")) || 1000 }
          };
        case "If":
        case "IfCondition":
          return {
            id: n.id,
            type: "IfCondition" as const,
            payload: { condition: String(getParam("Condition")) || "true" }
          };
        case "Loop":
          return {
            id: n.id,
            type: "Loop" as const,
            payload: { iterations: Number(getParam("Times")) || 10 }
          };
        case "Variable":
          return {
            id: n.id,
            type: "Variable" as const,
            payload: { name: getParam("Name"), initial: getParam("Initial") }
          };
        case "VariableSet":
          return {
            id: n.id,
            type: "VariableSet" as const,
            payload: { name: getParam("Name"), value: getParam("Value") }
          };
        case "MathOperation":
          return {
            id: n.id,
            type: "MathOperation" as const,
            payload: { target: getParam("Target"), left: getParam("Left"), op: getParam("Op"), right: getParam("Right") }
          };
        case "PinConfig":
          return {
            id: n.id,
            type: "PinConfig" as const,
            payload: { pin: getParam("Pin"), mode: getParam("Mode") }
          };
        default:
          // Fallback for unknown nodes to avoid type errors, but ideally we should handle all
          return {
            id: n.id,
            type: "Delay" as const,
            payload: { ms: 1000 }
          };
      }
    });
};

// Helper to convert ReactFlow edges to graph edges
const toGraphEdges = (edges: Edge[]): GraphEdge[] => {
  return edges.map(e => ({
    from: e.source,
    to: e.target
  }));
};

import { createDefaultRegistry } from "@/lib/engine/nodeRegistry";

const registry = createDefaultRegistry();

export const useEditorStore = create<EditorState>((set, get) => ({
  ...initial,
  get graph() {
    const state = get();
    return {
      nodes: toGraphNodes(state.nodes),
      edges: toGraphEdges(state.edges)
    };
  },
  
  addNode(type, position = { x: 250, y: 150 }) {
    console.log('Store addNode called:', type, position);
    const id = nextId();
    let nodeData: CustomNodeData;
    
    const def = registry.get(type);
    if (def) {
      // Map registry config to params for UI
      const params = Object.entries(def.defaultConfig)
        .filter(([key]) => key !== "kind")
        .map(([key, value]) => ({ name: key.charAt(0).toUpperCase() + key.slice(1), value }));

      nodeData = {
        label: def.title,
        type: def.type,
        inputs: def.io.inputs,
        outputs: def.io.outputs,
        outputLabels: def.outputLabels,
        params,
        isValueNode: def.isValueNode
      };
    } else {
      // Fallback for legacy or unknown types
      switch (type) {
        case "DigitalWrite":
          nodeData = {
            label: "Turn LED On/Off",
            type: "DigitalWrite",
            params: [
              { name: "Pin", value: 13 },
              { name: "State", value: "HIGH" }
            ]
          };
          break;
        // ... other legacy cases if needed, but registry should cover them
        default:
          nodeData = {
            label: "Unknown",
            type: "Delay",
            params: []
          };
      }
    }
    
    const newNode: Node<CustomNodeData> = {
      id,
      type: "custom",
      position,
      data: nodeData!,
      draggable: true,
      selectable: true
    };
    
    console.log('Creating new node:', newNode);
    set((state) => {
      const updatedNodes = [...state.nodes, newNode];
      console.log('Updated nodes array length:', updatedNodes.length);
      return { nodes: updatedNodes };
    });
    return id;
  },

  updateNodePosition(id, position) {
    set((state) => ({
      nodes: state.nodes.map(n => 
        n.id === id ? { ...n, position } : n
      )
    }));
  },

  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes)
    }));
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges)
    }));
  },

  onConnect(connection) {
    console.log('onConnect triggered:', connection);
    set((state) => {
      const newEdges = addEdge({ 
        ...connection, 
        type: "default", 
        animated: false, 
        style: { stroke: "#64748b", strokeWidth: 3 } 
      }, state.edges);
      console.log('New edges:', newEdges);
      return { edges: newEdges };
    });
  },

  deleteNode(id) {
    set((state) => ({
      nodes: state.nodes.filter(n => n.id !== id),
      edges: state.edges.filter(e => e.source !== id && e.target !== id)
    }));
  },

  deleteEdge(id) {
    set((state) => ({
      edges: state.edges.filter(e => e.id !== id)
    }));
  },

  setValidationStatus(status) {
    set((state) => {
      const nodeStatusMap = new Map(status.nodes.map(s => [s.id, s]));
      const edgeStatusMap = new Map(status.edges.map(s => [s.id, s]));

      return {
        nodes: state.nodes.map(n => {
          const s = nodeStatusMap.get(n.id);
          return s ? { ...n, data: { ...n.data, status: s.status, statusMessage: s.message } } : { ...n, data: { ...n.data, status: undefined, statusMessage: undefined } };
        }),
        edges: state.edges.map(e => {
          const s = edgeStatusMap.get(e.id);
          // React Flow edges support style and label, but for custom styling we might need a custom edge type or just update style.
          // Let's update style for now.
          let style = { stroke: "#64748b", strokeWidth: 3 };
          if (s?.status === "invalid") style = { stroke: "#ef4444", strokeWidth: 3 };
          else if (s?.status === "warning") style = { stroke: "#eab308", strokeWidth: 3 };
          
          return { ...e, style };
        })
      };
    });
  },

  clear() {
    set(initial);
  },
  
  initialize() {
    const state = get();
    console.log('Initialize called, current nodes:', state.nodes.length);
    if (state.nodes.length === 0) {
      console.log('Setting initial nodes');
      set(initial);
    }
  },
}));
