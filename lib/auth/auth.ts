import { cookies } from "next/headers";
import { createHmac } from "node:crypto";
import { SESSION_COOKIE_NAME, SESSION_SECRET } from "@/utils/constants";
import type { User } from "@/types/user";
import { getSupabaseClient } from "@/lib/auth/supabase";

export type SessionPayload = { userId: string };

function sign(payload: SessionPayload): string {
  const serialized = JSON.stringify(payload);
  const hmac = createHmac("sha256", SESSION_SECRET);
  hmac.update(serialized);
  const signature = hmac.digest("hex");
  return Buffer.from(serialized).toString("base64url") + "." + signature;
}

function verify(token: string): SessionPayload | null {
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return null;
  const serialized = Buffer.from(b64, "base64url").toString("utf8");
  const hmac = createHmac("sha256", SESSION_SECRET);
  hmac.update(serialized);
  const expected = hmac.digest("hex");
  if (expected !== sig) return null;
  try {
    const payload = JSON.parse(serialized) as SessionPayload;
    return payload;
  } catch {
    return null;
  }
}

export async function issueSession(res: Response, payload: SessionPayload): Promise<void> {
  const token = sign(payload);
  // @ts-expect-error NextResponse supports cookies
  res.cookies.set(SESSION_COOKIE_NAME, token, { httpOnly: true, sameSite: "lax", path: "/" });
}

export async function getSessionFromCookies(): Promise<SessionPayload | null> {
  try {
    const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return verify(token);
  } catch {
    return null;
  }
}

// Admin backdoor and allowlist-based login via Supabase
const BACKDOOR_ID = process.env.BACKDOOR_ID ?? "admin";
const BACKDOOR_PASSWORD = process.env.BACKDOOR_PASSWORD ?? "admin";
const ALLOWED_USER_IDS = (process.env.ALLOWED_USER_IDS ?? "").split(",").map((s) => s.trim()).filter(Boolean);

export async function authenticateUserById(id: string, password: string): Promise<User | null> {
  // Static backdoor
  if (id === BACKDOOR_ID && password === BACKDOOR_PASSWORD) {
    return { id: "backdoor", email: `${id}@local` };
  }

  // If env provides a single allowed credential pair
  const pairId = process.env.ALLOWED_USER_ID;
  const pairPassword = process.env.ALLOWED_USER_PASSWORD;
  if (pairId && pairPassword && id === pairId && password === pairPassword) {
    return { id: "env-allowed", email: `${id}@env` };
  }

  // Otherwise try Supabase email/password sign-in
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email: id, password });
    if (error || !data.user) return null;
    // Restrict access to allowlist if provided
    if (ALLOWED_USER_IDS.length > 0 && !ALLOWED_USER_IDS.includes(id) && !ALLOWED_USER_IDS.includes(data.user.email ?? "")) {
      return null;
    }
    return { id: data.user.id, email: data.user.email ?? id };
  } catch {
    return null;
  }
}
