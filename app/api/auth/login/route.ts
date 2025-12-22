import { NextRequest, NextResponse } from "next/server";
import { authenticateUserById, issueSession } from "@/lib/auth/auth";

export async function POST(req: NextRequest) {
  try {
    const { id, password } = await req.json();
    const user = await authenticateUserById(id, password);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email } });
    await issueSession(res, { userId: user.id });
    return res;
  } catch (e) {
    return NextResponse.json({ error: "Malformed request" }, { status: 400 });
  }
}
