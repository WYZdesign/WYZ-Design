import { NextResponse } from "next/server";
import { checkRedisHealth } from "@/lib/rate-limit-redis";

export async function GET() {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const mins = Math.floor((uptime % 3600) / 60);
  const redisOk = await checkRedisHealth();

  return NextResponse.json({
    status: "ok",
    uptime: hours > 0 ? `${hours}h ${mins}m` : `${mins}m`,
    env: process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown",
    redis: redisOk ? "ok" : "down",
    timestamp: new Date().toISOString(),
  });
}
