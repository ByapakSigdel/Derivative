"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Graph, NodeType, Node, Edge } from "@/types/graph";

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `n${idCounter}`;
}

type EditorState = {
  nodes: Node[];
  edges: Edge[];
  graph: Graph;
  addNode: (type: NodeType) => void;
  clear: () => void;
};

const initial: Pick<EditorState, "nodes" | "edges"> = { nodes: [], edges: [] };

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      ...initial,
      get graph() {
        return { nodes: get().nodes, edges: get().edges };
      },
      addNode(type) {
        const id = nextId();
        let node: Node;
        switch (type) {
          case "DigitalWrite":
            node = { id, type, payload: { pin: 13, value: true } };
            break;
          case "AnalogRead":
            node = { id, type, payload: { pin: 0 } };
            break;
          case "Delay":
            node = { id, type, payload: { ms: 1000 } };
            break;
          case "If":
            node = { id, type, payload: { condition: "true" } };
            break;
          case "Loop":
            node = { id, type, payload: { iterations: undefined } };
            break;
        }
        set((state) => ({ nodes: [...state.nodes, node] }));
      },
      clear() {
        set({ nodes: [], edges: [] });
      },
    }),
    { name: "editor-state" }
  )
);
