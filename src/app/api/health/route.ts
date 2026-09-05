import { NextResponse } from "next/server";

export async function GET() {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const mins = Math.floor((uptime % 3600) / 60);

  return NextResponse.json({
    status: "ok",
    uptime: hours > 0 ? `${hours}h ${mins}m` : `${mins}m`,
    env: process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown",
    timestamp: new Date().toISOString(),
  });
}
