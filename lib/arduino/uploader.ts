import type { BoardTarget, UploadRequest, UploadResult } from "@/types/arduino";

// Abstraction placeholder; replace implementation with WebSerial or Arduino CLI
export async function uploadArduinoSketch(req: UploadRequest): Promise<UploadResult> {
  // TODO: Implement board detection, compile, and upload pipeline.
  // For now, return a mocked response.
  const { port, board } = req;
  const message = `Mock upload to ${board ?? "unknown"} via ${port ?? "no-port"}.`;
  return { ok: false, message };
}

export async function detectBoards(): Promise<BoardTarget[]> {
  // TODO: Integrate with WebSerial/USB to detect connected boards.
  return [];
}
