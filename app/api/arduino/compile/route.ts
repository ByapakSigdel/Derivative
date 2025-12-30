import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import { writeFile, readFile, mkdir, rm } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

const execAsync = promisify(exec);

/**
 * Arduino Compilation API Endpoint
 * 
 * This endpoint compiles Arduino code (.ino) to hex format using Arduino CLI.
 * The compiled hex file can then be uploaded to Arduino boards via WebSerial API.
 * 
 * REQUIREMENTS:
 * - Arduino CLI must be installed on the server
 * - Install: https://arduino.github.io/arduino-cli/latest/installation/
 * - Configure: arduino-cli config init
 * - Install cores: arduino-cli core install arduino:avr
 * 
 * REQUEST:
 * POST /api/arduino/compile
 * Body: { code: string, board: string }
 * 
 * RESPONSE:
 * Success: { success: true, hex: string (base64) }
 * Failure: { success: false, error: string }
 */

// Board FQBN (Fully Qualified Board Name) mapping
const BOARD_FQBN: Record<string, string> = {
  "arduino:avr:uno": "arduino:avr:uno",
  "arduino:avr:nano": "arduino:avr:nano:cpu=atmega328",
  "arduino:avr:mega": "arduino:avr:mega:cpu=atmega2560",
  "arduino:avr:leonardo": "arduino:avr:leonardo"
};

/**
 * Check if Arduino CLI is available
 */
async function checkArduinoCLI(): Promise<boolean> {
  try {
    await execAsync("arduino-cli version");
    return true;
  } catch {
    return false;
  }
}

/**
 * Compile Arduino sketch using Arduino CLI
 */
async function compileSketch(
  code: string, 
  board: string
): Promise<{ success: boolean; hex?: string; error?: string; logs?: string }> {
  const fqbn = BOARD_FQBN[board] || BOARD_FQBN["arduino:avr:uno"];
  
  // Create temporary directory for compilation
  const tempDir = join(tmpdir(), `arduino-compile-${Date.now()}`);
  const sketchDir = join(tempDir, "sketch");
  const sketchFile = join(sketchDir, "sketch.ino");
  const buildDir = join(tempDir, "build");

  try {
    // Create directories
    await mkdir(sketchDir, { recursive: true });
    await mkdir(buildDir, { recursive: true });

    // Write Arduino code to .ino file
    await writeFile(sketchFile, code, "utf-8");

    // Compile using Arduino CLI
    const compileCmd = `arduino-cli compile --fqbn ${fqbn} --output-dir ${buildDir} ${sketchDir}`;
    
    const { stdout, stderr } = await execAsync(compileCmd, {
      timeout: 30000, // 30 second timeout
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    });

    // Find the compiled hex file
    const hexFileName = "sketch.ino.hex";
    const hexFilePath = join(buildDir, hexFileName);

    // Read the hex file
    const hexContent = await readFile(hexFilePath, "utf-8");
    
    // Convert to base64 for safe transmission
    const hexBase64 = Buffer.from(hexContent).toString("base64");

    // Clean up temporary files
    await rm(tempDir, { recursive: true, force: true });

    return {
      success: true,
      hex: hexBase64,
      logs: stdout + "\n" + stderr
    };

  } catch (err) {
    // Clean up on error
    try {
      await rm(tempDir, { recursive: true, force: true });
    } catch {}

    const error = err as Error & { stdout?: string; stderr?: string };
    return {
      success: false,
      error: error.message,
      logs: (error.stdout || "") + "\n" + (error.stderr || "")
    };
  }
}

/**
 * Fallback: Mock compilation for development/testing
 * Returns a mock hex file that won't actually work but allows testing the upload flow
 */
function mockCompilation(code: string): { success: boolean; hex: string; logs: string } {
  // Generate a mock Intel HEX format (not functional, just for testing)
  const mockHex = `:100000000C9434000C943E000C943E000C943E0082
:100010000C943E000C943E000C943E000C943E0068
:100020000C943E000C943E000C943E000C943E0058
:100030000C943E000C943E000C943E000C943E0048
:00000001FF`;
  
  const hexBase64 = Buffer.from(mockHex).toString("base64");
  
  return {
    success: true,
    hex: hexBase64,
    logs: "MOCK COMPILATION - Arduino CLI not available. Using mock hex file for testing."
  };
}

export async function POST(req: NextRequest) {
  try {
    const { code, board = "arduino:avr:uno" } = await req.json();

    // Validate input
    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid or missing 'code' parameter" },
        { status: 400 }
      );
    }

    // Check if Arduino CLI is available
    const hasArduinoCLI = await checkArduinoCLI();

    let result;
    if (hasArduinoCLI) {
      // Use real Arduino CLI compilation
      result = await compileSketch(code, board);
    } else {
      // Fallback to mock compilation for development
      console.warn("Arduino CLI not found. Using mock compilation.");
      result = mockCompilation(code);
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        hex: result.hex,
        logs: result.logs,
        usedMock: !hasArduinoCLI
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          logs: result.logs
        },
        { status: 500 }
      );
    }

  } catch (err) {
    console.error("Compilation endpoint error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error during compilation",
        details: (err as Error).message
      },
      { status: 500 }
    );
  }
}
