import { NextRequest } from "next/server";

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
  if (process.env.NODE_ENV !== "production" && origin.startsWith("http://localhost")) return true;

  return false;
}
