import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/utils/constants";

// Edge-safe guard: only checks for cookie presence.
// Full verification happens in server layout using Node APIs.
export function authGuard(req: NextRequest): NextResponse | null {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return null;
}
