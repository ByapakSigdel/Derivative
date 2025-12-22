"use client";
import { useEffect, useState } from "react";
import { useEditorStore } from "@/store/editorStore";
import Button from "@/components/ui/Button";

export default function CodePreview() {
  const { graph } = useEditorStore();
  const [code, setCode] = useState<string>("// Generate code from nodes\n");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    // auto-generate on changes for now
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graph]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold">Arduino Code</h2>
        <Button variant="secondary" onClick={generate}>
          {loading ? "Generating..." : "Refresh"}
        </Button>
      </div>
      {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
      <pre className="max-h-64 overflow-auto rounded-md bg-gray-900 p-3 text-xs text-gray-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}
