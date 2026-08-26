import type { Metadata } from "next";
import { getNeo4j, getRedis } from "@/lib/wyzmind";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "System Status | WYZ Design",
  description: "Live health of WYZ Design services.",
  robots: { index: false, follow: false },
};

interface ServiceStatus {
  name: string;
  detail: string;
  healthy: boolean;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`No response within ${ms}ms`)), ms)
    ),
  ]);
}

async function checkNeo4j(): Promise<ServiceStatus> {
  const session = getNeo4j().session();
  try {
    await withTimeout(session.run("RETURN 1"), 4000);
    return { name: "Neo4j", detail: "Query round trip succeeded", healthy: true };
  } catch (err) {
    return {
      name: "Neo4j",
      detail: err instanceof Error ? err.message : "Connection failed",
      healthy: false,
    };
  } finally {
    try {
      await session.close();
    } catch {}
  }
}

async function checkRedis(): Promise<ServiceStatus> {
  try {
    // Connection-error events are handled inside getRedis(); here we only
    // care whether a PING round-trips.
    await withTimeout(getRedis().ping(), 4000);
    return { name: "Redis", detail: "PING returned PONG", healthy: true };
  } catch (err) {
    return {
      name: "Redis",
      detail: err instanceof Error ? err.message : "PING failed",
      healthy: false,
    };
  }
}

function checkSupabase(): ServiceStatus {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";
  const configured = !!(url && key);
  return {
    name: "Supabase",
    detail: configured ? "Client env vars present" : "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY missing",
    healthy: configured,
  };
}

function checkStripe(): ServiceStatus {
  const configured = !!process.env.STRIPE_SECRET_KEY;
  return {
    name: "Stripe",
    detail: configured ? "STRIPE_SECRET_KEY present" : "STRIPE_SECRET_KEY missing",
    healthy: configured,
  };
}

export default async function StatusPage() {
  let neo4j: ServiceStatus;
  let redis: ServiceStatus;
  try {
    [neo4j, redis] = await Promise.all([checkNeo4j(), checkRedis()]);
  } catch (err) {
    neo4j = { name: "Neo4j", detail: err instanceof Error ? err.message : "Check failed", healthy: false };
    redis = { name: "Redis", detail: "Check failed", healthy: false };
  }
  const supabase = checkSupabase();
  const stripe = checkStripe();
  const services = [neo4j, supabase, stripe, redis];

  const commitSha = process.env.VERCEL_GIT_COMMIT_SHA || "unknown";
  const buildTimestamp = new Date().toISOString();

  return (
    <main className="min-h-screen bg-white dark:bg-[#1C1C1E] py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-heading font-black text-[#333] dark:text-white tracking-[0.15em] text-[2rem] sm:text-[2.5rem] mb-2">S Y S T E M . S T A T U S</h1>
        <p className="text-[#666] dark:text-white/50 text-sm mb-10">
          Live health of the services powering WYZ Design. Checked at request time.
        </p>

        <div className="space-y-3 mb-12">
          {services.map((s) => (
            <div
              key={s.name}
              className="bg-white dark:bg-[#1C1C1E] border border-[#E2E2E2] dark:border-[#444] rounded-xl p-5 flex items-start justify-between gap-4"
            >
              <div>
                <h3 className="font-heading font-bold text-[#333] dark:text-white">{s.name}</h3>
                <p className="text-[#666] dark:text-white/50 text-sm mt-1 break-all">{s.detail}</p>
              </div>
              <span
                aria-hidden
                className="inline-block w-3 h-3 rounded-full shrink-0 mt-1.5"
                style={{ backgroundColor: s.healthy ? "#22c55e" : "#ef4444" }}
              />
            </div>
          ))}
        </div>

        <section className="bg-white dark:bg-[#1C1C1E] border border-[#E2E2E2] dark:border-[#444] rounded-xl p-5">
          <h2 className="font-heading font-bold text-[#333] dark:text-white mb-3">Build Info</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="text-[#666] dark:text-white/50">Commit</dt>
            <dd className="text-[#333] dark:text-white font-mono break-all">{commitSha}</dd>
            <dt className="text-[#666] dark:text-white/50">Build time (UTC)</dt>
            <dd className="text-[#333] dark:text-white font-mono break-all">{buildTimestamp}</dd>
          </dl>
        </section>
      </div>
    </main>
  );
}
