"use client";
import { useEditorStore } from "@/store/editorStore";
import Button from "@/components/ui/Button";

export default function NodeCanvas() {
  const { nodes, edges, clear } = useEditorStore();

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold">Canvas</h2>
        <Button variant="secondary" onClick={clear}>Clear</Button>
      </div>
      <div className="min-h-[400px] rounded-md border border-gray-200">
        <ul className="p-3 text-sm text-gray-700">
          {nodes.map((n) => (
            <li key={n.id}>
              <span className="font-mono">{n.type}</span> {JSON.stringify(n.payload)}
            </li>
          ))}
        </ul>
        {edges.length > 0 && (
          <div className="p-3">
            <h3 className="text-xs font-medium text-gray-500">Edges</h3>
            <ul className="text-xs text-gray-600">
              {edges.map((e) => (
                <li key={`${e.from}->${e.to}`}>{e.from} → {e.to}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
