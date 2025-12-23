"use client";
import { useEffect, useState, useRef } from "react";
import { useEditorStore } from "@/store/editorStore";
import Button from "@/components/ui/Button";

export default function CodePreview() {
  const { graph } = useEditorStore();
  const [code, setCode] = useState<string>("// Generate code from nodes\n");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/arduino/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ graph }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to generate code");
      } else {
        setCode(data.code);
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce auto-generate to prevent multiple API calls
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(() => {
      generate();
    }, 500); // Wait 500ms after last change before generating

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graph.nodes.length, graph.edges.length]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-700">Generated Code</h2>
        <button
          onClick={generate}
          disabled={loading}
          className="px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors disabled:opacity-50"
        >
          {loading ? "Generating..." : "Refresh"}
        </button>
      </div>
      {error && <p className="text-xs text-red-400 mb-2">{error}</p>}
      <pre className="max-h-64 overflow-auto rounded bg-slate-950 p-3 text-xs text-slate-300 font-mono border border-slate-700">
        <code>{code}</code>
      </pre>
    </div>
  );
}
