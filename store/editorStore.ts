"use client";
import { create } from "zustand";
import type { Graph, NodeType, Node as GraphNode, Edge as GraphEdge } from "@/types/graph";
import type { Node, Edge, XYPosition } from "reactflow";
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
  addNode: (type: NodeType, position?: XYPosition) => void;
  updateNodePosition: (id: string, position: XYPosition) => void;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  deleteNode: (id: string) => void;
  deleteEdge: (id: string) => void;
  clear: () => void;
  initialize: () => void;
};

const getInitialNodes = (): Node<CustomNodeData>[] => [
  {
    id: "start-1",
    type: "start",
    position: { x: 400, y: 50 },
    data: { label: "Setup", type: "start" },
    draggable: true,
    selectable: true,
  },
  {
    id: "loop-1",
    type: "loop",
    position: { x: 400, y: 250 },
    data: { label: "Loop", type: "loop" },
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
    .filter(n => n.data.type !== "start" && n.data.type !== "loop")
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
          return {
            id: n.id,
            type: "If" as const,
            payload: { condition: String(getParam("Condition")) || "true" }
          };
        case "Loop":
          return {
            id: n.id,
            type: "Loop" as const,
            payload: { iterations: Number(getParam("Times")) || 10 }
          };
        default:
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
      case "AnalogRead":
        nodeData = {
          label: "Read Sensor",
          type: "AnalogRead",
          inputs: 0,
          params: [
            { name: "Pin", value: "A0" }
          ]
        };
        break;
      case "Delay":
        nodeData = {
          label: "Wait",
          type: "Delay",
          params: [
            { name: "Time (ms)", value: 1000 }
          ]
        };
        break;
      case "If":
        nodeData = {
          label: "If Condition",
          type: "If",
          outputs: 2,
          params: [
            { name: "Condition", value: "value > 500" }
          ]
        };
        break;
      case "Loop":
        nodeData = {
          label: "Repeat Loop",
          type: "Loop",
          outputs: 1,
          params: [
            { name: "Times", value: 10 }
          ]
        };
        break;
      default:
        nodeData = {
          label: "Unknown",
          type: "Delay",
          params: []
        };
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
  },

  updateNodePosition(id, position) {
    set((state) => ({
      nodes: state.nodes.map(n => 
        n.id === id ? { ...n, position } : n
      )
    }));
  },

  onNodesChange(changes) {
    set((state) => {
      let newNodes = [...state.nodes];
      
      changes.forEach((change: any) => {
        if (change.type === "position" && change.position) {
          newNodes = newNodes.map(n =>
            n.id === change.id ? { ...n, position: change.position } : n
          );
        } else if (change.type === "remove") {
          newNodes = newNodes.filter(n => n.id !== change.id);
        } else if (change.type === "select") {
          newNodes = newNodes.map(n =>
            n.id === change.id ? { ...n, selected: change.selected } : n
          );
        }
      });
      
      return { nodes: newNodes };
    });
  },

  onEdgesChange(changes) {
    set((state) => {
      let newEdges = [...state.edges];
      
      changes.forEach((change: any) => {
        if (change.type === "remove") {
          newEdges = newEdges.filter(e => e.id !== change.id);
        } else if (change.type === "select") {
          newEdges = newEdges.map(e =>
            e.id === change.id ? { ...e, selected: change.selected } : e
          );
        }
      });
      
      return { edges: newEdges };
    });
  },

  onConnect(connection) {
    const edge: Edge = {
      id: `e${connection.source}-${connection.target}`,
      source: connection.source,
      target: connection.target,
      type: "default",
      animated: false,
      style: { 
        stroke: "#64748b", 
        strokeWidth: 3 
      }
    };
    
    set((state) => ({ edges: [...state.edges, edge] }));
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
