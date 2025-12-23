"use client";
import { useState } from "react";
import { useEditorStore } from "@/store/editorStore";

export default function UploadPanel() {
  const { graph } = useEditorStore();
  const [port, setPort] = useState<string>("");
  const [board, setBoard] = useState<string>("arduino:avr:uno");
  const [status, setStatus] = useState<string>("Ready");
  const [uploading, setUploading] = useState(false);

  const upload = async () => {
    setUploading(true);
    setStatus("Generating code...");
    
    try {
      // Generate code from graph
      const codeRes = await fetch("/api/arduino/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ graph }),
      });
      
      if (!codeRes.ok) {
        setStatus("Code generation failed");
        setUploading(false);
        return;
      }
      
      const { code } = await codeRes.json();
      
      // Upload to board
      setStatus("Uploading to board...");
      const uploadRes = await fetch("/api/arduino/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, port, board }),
      });
      
      const data = await uploadRes.json();
      setStatus(data.message || (uploadRes.ok ? "Upload successful!" : "Upload failed"));
    } catch (err) {
      setStatus("Network error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Upload</h2>
      
      <input 
        value={port} 
        onChange={(e) => setPort(e.target.value)} 
        placeholder="Port" 
        className="rounded border border-slate-600 bg-slate-900 px-2 py-1 text-[10px] text-slate-200 placeholder-slate-500" 
      />
      
      <input 
        value={board} 
        onChange={(e) => setBoard(e.target.value)} 
        placeholder="Board" 
        className="rounded border border-slate-600 bg-slate-900 px-2 py-1 text-[10px] text-slate-200 placeholder-slate-500" 
      />
      
      <button 
        onClick={upload}
        disabled={uploading || !port}
        className="mt-1 px-2 py-1.5 text-[10px] bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? "..." : "Upload"}
      </button>
      
      <div className="mt-0.5 text-[9px]">
        <div className={`${status.includes("successful") ? "text-green-400" : status.includes("failed") || status.includes("error") ? "text-red-400" : "text-slate-400"}`}>
          {status}
        </div>
      </div>
    </div>
  );
}
