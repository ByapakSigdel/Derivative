"use client";
import NodeCanvasWrapper from "@/components/editor/NodeCanvasWrapper";
import UploadPanel from "@/components/editor/UploadPanel";

export default function EditorPage() {
  return (
    <main 
      className="grid grid-cols-12 gap-3 p-3 h-screen bg-slate-900"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="col-span-11 rounded border border-slate-700 bg-slate-800 overflow-hidden h-full">
        <NodeCanvasWrapper />
      </div>
      <div className="col-span-1 flex flex-col gap-3 overflow-y-auto h-full">
        <div className="rounded border border-slate-700 bg-slate-800 p-3">
          <UploadPanel />
        </div>
      </div>
    </main>
  );
}
