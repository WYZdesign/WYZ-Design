import { NextRequest, NextResponse } from "next/server";
import { checkRedisHealth } from "@/lib/rate-limit-redis";
import { markCronRun } from "@/lib/cron-heartbeat";

export async function GET(req: NextRequest) {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const mins = Math.floor((uptime % 3600) / 60);
  const redisOk = await checkRedisHealth();

  // Only the scheduled probe (Vercel cron) feeds the heartbeat, so a human
  // opening the Health tab can't make a broken scheduler look alive.
  if (req.headers.get("x-vercel-cron")) {
    await markCronRun("health", redisOk, redisOk ? "redis ok" : "redis down");
  }

  return NextResponse.json({
    status: "ok",
    uptime: hours > 0 ? `${hours}h ${mins}m` : `${mins}m`,
    env: process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown",
    redis: redisOk ? "ok" : "down",
    timestamp: new Date().toISOString(),
  });
}
