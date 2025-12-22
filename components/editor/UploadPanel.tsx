"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";

export default function UploadPanel() {
  const [port, setPort] = useState<string>("");
  const [board, setBoard] = useState<string>("arduino:avr:uno");
  const [code, setCode] = useState<string>("");
  const [status, setStatus] = useState<string>("Idle");

  const upload = async () => {
    setStatus("Uploading...");
    try {
      const res = await fetch("/api/arduino/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, port, board }),
      });
      const data = await res.json();
      setStatus(data.message || (data.ok ? "Uploaded" : "Failed"));
    } catch (err) {
      setStatus("Network error");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-sm font-semibold">Upload</h2>
      <label className="text-xs text-gray-600">Port</label>
      <input value={port} onChange={(e) => setPort(e.target.value)} placeholder="COM3" className="rounded-md border border-gray-300 px-3 py-2 text-sm" />
      <label className="text-xs text-gray-600">Board</label>
      <input value={board} onChange={(e) => setBoard(e.target.value)} placeholder="arduino:avr:uno" className="rounded-md border border-gray-300 px-3 py-2 text-sm" />
      <label className="text-xs text-gray-600">Code (optional override)</label>
      <textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder="Paste Arduino code..." className="rounded-md border border-gray-300 px-3 py-2 text-xs" rows={6} />
      <Button onClick={upload}>Upload</Button>
      <p className="text-xs text-gray-600">Status: {status}</p>
      {/* TODO: Replace with WebSerial or Arduino CLI pipeline integrated via lib.arduino.uploader */}
    </div>
  );
}
