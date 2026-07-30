import { NextResponse } from "next/server";
import { readdirSync, existsSync, statSync } from "fs";
import path from "path";

/**
 * Returns server health status including uptime, memory, and uploads directory integrity.
 * @method GET
 * @request None
 * @response JSON with uptime, memory_mb, uploads stats, and status ("ok"|"degraded")
 * @auth None
 */
export async function GET() {
  const checks: Record<string, any> = {};

  // Server uptime
  checks.uptime = process.uptime();
  checks.timestamp = new Date().toISOString();
  checks.memory_mb = Math.round(process.memoryUsage().rss / 1024 / 1024);
  checks.status = "ok";

  // Uploads directory integrity
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (existsSync(uploadsDir)) {
    let fileCount = 0;
    let totalSize = 0;
    for (const sub of ["images", "videos"]) {
      const subDir = path.join(uploadsDir, sub);
      if (existsSync(subDir)) {
        const files = readdirSync(subDir);
        fileCount += files.length;
        for (const f of files) {
          try { totalSize += statSync(path.join(subDir, f)).size; } catch {}
        }
      }
    }
    checks.uploads = { files: fileCount, size_mb: Math.round(totalSize / 1024 / 1024) };
  } else {
    checks.uploads = { files: 0, size_mb: 0, error: "uploads directory missing" };
    checks.status = "degraded";
  }

  const status = checks.status === "ok" ? 200 : 207;
  return NextResponse.json(checks, { status });
}
