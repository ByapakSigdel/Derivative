import { NextRequest, NextResponse } from "next/server";
import { generateArduinoCode } from "@/lib/arduino/codeGenerator";
import { Graph } from "@/types/graph";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const graph: Graph = body.graph;
    const code = generateArduinoCode(graph);
    return NextResponse.json({ code });
  } catch (e) {
    return NextResponse.json({ error: "Malformed graph" }, { status: 400 });
  }
}
