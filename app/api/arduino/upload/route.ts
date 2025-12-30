import { NextRequest, NextResponse } from "next/server";
import { uploadArduinoSketch } from "@/lib/arduino/uploader";

/**
 * Arduino Upload API Endpoint
 * 
 * This endpoint is called from the frontend but the actual upload happens
 * in the browser using WebSerial API. This endpoint mainly validates the request.
 * 
 * The actual upload flow is:
 * 1. Frontend calls this endpoint to validate
 * 2. Frontend calls compilation endpoint to get hex file
 * 3. Frontend uses WebSerial API to upload hex directly to Arduino
 * 
 * NOTE: Most of the upload logic runs client-side for WebSerial compatibility.
 */

export async function POST(req: NextRequest) {
  try {
    const { code, port, board } = await req.json();
    
    // Validate request
    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { ok: false, message: "Missing or invalid 'code' parameter" },
        { status: 400 }
      );
    }

    // Note: The upload happens client-side via WebSerial API
    // This endpoint exists for backward compatibility and validation
    // For actual uploads, use the client-side uploadArduinoSketch function
    
    return NextResponse.json({
      ok: true,
      message: "Request validated. Use WebSerial API client-side upload for actual upload.",
      note: "Call uploadArduinoSketch() from client-side code with WebSerial support"
    });
    
  } catch (e) {
    return NextResponse.json(
      { ok: false, message: "Malformed request" },
      { status: 400 }
    );
  }
}
