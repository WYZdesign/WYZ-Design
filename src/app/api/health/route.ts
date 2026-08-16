import { NextResponse } from "next/server";

export async function GET() {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const mins = Math.floor((uptime % 3600) / 60);

  return NextResponse.json({
    status: "ok",
    uptime: hours > 0 ? `${hours}h ${mins}m` : `${mins}m`,
    node: process.version,
    env: process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown",
    version: process.env.npm_package_version || "1.0",
    timestamp: new Date().toISOString(),
  });
}
