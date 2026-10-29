import { logger } from "@/lib/logger";
import { getServiceClient } from "@/lib/supabase";

export interface SeoCheckRecord {
  id?: string;
  url: string;
  score: number;
  title?: string;
  description?: string;
  title_length?: number;
  description_length?: number;
  has_h1?: number;
  has_canonical?: number;
  has_og?: number;
  has_schema?: number;
  issues?: string;
  created_at?: string;
}

const SEO_PAGES = [
  "/", "/about", "/services", "/photography", "/events", "/designs",
  "/web-design", "/printing", "/plans", "/contact", "/faq", "/merch",
  "/community", "/wyzmind", "/blog", "/loyalty",
];

async function runSinglePageCheck(base: string, path: string): Promise<SeoCheckRecord | null> {
  try {
    const r = await fetch(`${base}${path}`, {
      headers: { "User-Agent": "Mozilla/5.0 (SEO Audit)" },
      signal: AbortSignal.timeout(5000),
    });
    const html = await r.text();

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i) || [null, ""];
    const title = titleMatch[1] || "";

    const descMatch = html.match(/<meta\s+name=["']description["'][^>]*content=["']([^"']+)["']/i) || [null, ""];
    const description = descMatch[1] || "";

    const canonical = /<link\s+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i.test(html);
    const hasOg = /<meta\s+property=["']og:image["']/i.test(html);
    const hasH1 = /<h1[\s>]/i.test(html);
    const hasSchema = /application\/ld\+json/i.test(html);

    const issues: string[] = [];
    if (!title) issues.push("Missing title tag");
    if (!description) issues.push("Missing meta description");
    if (title.length > 60) issues.push(`Title too long (${title.length} chars)`);
    if (description.length > 160) issues.push(`Description too long (${description.length} chars)`);
    if (description.length < 50) issues.push(`Description too short (${description.length} chars)`);

    const score = Math.round(
      [canonical, hasOg, hasH1, hasSchema, title ? 1 : 0, description ? 1 : 0]
        .reduce<number>((a, b) => a + (b ? 1 : 0), 0) * 100 / 7,
    );

    return {
      id: `${path}-${Date.now()}`,
      url: path,
      score,
      title_length: title.length,
      description_length: description.length,
      has_h1: hasH1 ? 1 : 0,
      has_canonical: canonical ? 1 : 0,
      has_og: hasOg ? 1 : 0,
      has_schema: hasSchema ? 1 : 0,
      issues: JSON.stringify(issues),
      created_at: new Date().toISOString(),
    };
  } catch (e) {
    logger.warn("seo-persist", `Failed to check ${path}: ${e instanceof Error ? e.message : String(e)}`);
    return null;
  }
}

export async function persistSeoChecks() {
  const supabase = getServiceClient();
  const base = "https://wyzdesign.com";
  const results: SeoCheckRecord[] = [];

  for (const path of SEO_PAGES) {
    const check = await runSinglePageCheck(base, path);
    if (check) {
      results.push(check);
      await supabase.from("seo_checks").upsert({
        url: check.url,
        score: check.score,
        title_length: check.title_length,
        description_length: check.description_length,
        has_h1: check.has_h1,
        has_canonical: check.has_canonical,
        has_og: check.has_og,
        has_schema: check.has_schema,
        issues: check.issues,
        created_at: check.created_at,
      }, { onConflict: "url" });
    }
  }

  return results;
}

export async function getSeoHistory(path?: string, limit = 50): Promise<SeoCheckRecord[]> {
  const supabase = getServiceClient();
  let query = supabase.from("seo_checks").select("*").order("created_at", { ascending: false }).limit(limit);
  if (path) query = query.eq("url", path);
  const { data, error } = await query;
  if (error) {
    logger.error("seo-persist", error.message);
    return [];
  }
  return data || [];
}

export async function getLatestSeoScores() {
  const records = await getSeoHistory(undefined, 100);
  const byUrl = new Map<string, SeoCheckRecord>();
  records.forEach((r) => {
    if (!byUrl.has(r.url)) byUrl.set(r.url, r);
  });
  return [...byUrl.values()]
    .sort((a, b) => a.score - b.score)
    .map((r) => ({ url: r.url, score: r.score, last_check: r.created_at }));
}
