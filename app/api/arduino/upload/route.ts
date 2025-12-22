import { NextRequest, NextResponse } from "next/server";
import { uploadArduinoSketch } from "@/lib/arduino/uploader";

export async function POST(req: NextRequest) {
  try {
    const { code, port, board } = await req.json();
    const result = await uploadArduinoSketch({ code, port, board });
    return NextResponse.json(result, { status: result.ok ? 200 : 500 });
  } catch (e) {
    return NextResponse.json({ ok: false, message: "Malformed request" }, { status: 400 });
  }
}
