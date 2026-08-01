import { NextRequest } from "next/server";
import { createHmac, randomBytes } from "crypto";

const ALLOWED_ORIGINS = [
  "https://wyzdesign.com",
  "https://www.wyzdesign.com",
  "https://wyzdesign.vercel.app",
  process.env.NEXT_PUBLIC_URL,
].filter(Boolean) as string[];

export function validateCsrf(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host") || "";

  if (!origin) return false;
  if (origin === "null") return false;

  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (host === "localhost:3000" && origin.startsWith("http://localhost")) return true;

  return false;
}

const CSRF_SECRET = process.env.CSRF_SECRET || process.env.NEXTAUTH_SECRET || "wyz-csrf-fallback";

export function generateCsrfToken(): string {
  const nonce = randomBytes(32).toString("hex");
  const hmac = createHmac("sha256", CSRF_SECRET).update(nonce).digest("hex");
  return `${nonce}.${hmac.slice(0, 32)}`;
}

export function validateCsrfToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [nonce, sig] = parts;
  const expected = createHmac("sha256", CSRF_SECRET).update(nonce).digest("hex").slice(0, 32);

  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(sig);
    if (a.length !== b.length) return false;
    return require("crypto").timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
