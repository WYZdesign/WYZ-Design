import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function runSEOCheck(url: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/analytics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "seo_check", url }),
    });
    return response.json();
  } catch (error) {
    return { error: String(error) };
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all public pages from sitemap or known routes
    const pages = [
      "/",
      "/about",
      "/services",
      "/photography",
      "/designs",
      "/booking",
      "/contact",
      "/blog",
      "/loyalty",
      "/merch",
      "/tray",
      "/tray/book",
      "/tray/press",
      "/tray/resume",
      "/tray/card",
      "/legal/privacy",
      "/legal/terms",
      "/legal/refund",
      "/legal/shipping",
      "/legal/copyright",
    ];

    const results = [];
    for (const page of pages) {
      const url = `${process.env.NEXT_PUBLIC_SITE_URL}${page}`;
      const result = await runSEOCheck(url);
      results.push({ page, url, ...result });
      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Store summary in Supabase
    const { data, error } = await supabase
      .from("seo_snapshots")
      .insert({
        checked_at: new Date().toISOString(),
        pages_checked: pages.length,
        results,
        summary: {
          passed: results.filter((r) => r.passed).length,
          failed: results.filter((r) => !r.passed && !r.error).length,
          errors: results.filter((r) => r.error).length,
        },
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, snapshotId: data.id, results });
  } catch (error) {
    console.error("SEO snapshot cron failed:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}