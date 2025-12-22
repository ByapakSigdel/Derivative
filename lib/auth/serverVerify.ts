import { createHmac } from "node:crypto";
import { SESSION_SECRET } from "@/utils/constants";

export function verifySessionToken(token: string): { userId: string } | null {
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return null;
  const serialized = Buffer.from(b64, "base64url").toString("utf8");
  const hmac = createHmac("sha256", SESSION_SECRET);
  hmac.update(serialized);
  const expected = hmac.digest("hex");
  if (expected !== sig) return null;
  try {
    const payload = JSON.parse(serialized) as { userId: string };
    return payload;
  } catch {
    return null;
  }
}
