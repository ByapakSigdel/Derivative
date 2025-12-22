import { NextRequest, NextResponse } from "next/server";
import { authGuard } from "@/lib/auth/middleware";

export function middleware(req: NextRequest) {
  const pathname = new URL(req.url).pathname;
  if (pathname.startsWith("/editor")) {
    const res = authGuard(req);
    if (res) return res;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/editor"],
};
