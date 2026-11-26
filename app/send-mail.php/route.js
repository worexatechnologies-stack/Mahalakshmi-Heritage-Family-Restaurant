import { NextResponse } from "next/server";
import { POST, OPTIONS } from "../api/reserve/route";

/**
 * Security: Prevent direct download of PHP source code.
 * Rejects GET requests with HTTP 405 Method Not Allowed.
 */
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: "Method Not Allowed. PHP source code cannot be downloaded.",
    },
    {
      status: 405,
      headers: {
        Allow: "POST, OPTIONS",
        "Content-Type": "application/json",
      },
    }
  );
}

export { POST, OPTIONS };
