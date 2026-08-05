import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

const ORGANIZER_URL = "https://www.eventbrite.com/o/fd-photo-studio-14334915883";
const SEARCH_URL = "https://www.eventbrite.com/d/ca--los-angeles/fd-photo-studio/";

let cachedEvents: FdEvent[] | null = null;
let cachedAt: number | null = null;
const CACHE_TTL = 5 * 60 * 1000;

interface FdEvent {
  title: string;
  date: string;
  dateLabel: string;
  time: string;
  location: string;
  url: string;
  image: string | null;
  price: string;
  source: string;
}

function parseDate(dateStr: string): string {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toISOString().split("T")[0];
}

async function scrapeOrganizerPage(): Promise<FdEvent[]> {
  const events: FdEvent[] = [];

  try {
    const r = await fetch(ORGANIZER_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const html = await r.text();
    const $ = cheerio.load(html);

    $('[data-testid="event-card"], .eds-event-card__content, .g-cell-1-2, .g-cell-1-3, article').each((_: any, el: any) => {
      const card = $(el);
      const titleEl = card.find('[data-testid="event-card-title"], .eds-event-card__title, h3, a[title]');
      let title = titleEl.text().trim() || card.find("h3").text().trim();
      if (!title) {
        const linkEl = card.find("a[href*='eventbrite']").first();
        title = linkEl.attr("title")?.trim() || linkEl.text().trim();
      }
      if (!title) return;

      const link = card.find("a").first().attr("href") || "";
      const url = link.startsWith("http") ? link : `https://www.eventbrite.com${link}`;

      const imgEl = card.find("img").first();
      const image = imgEl.attr("src") || null;

      const dateEl = card.find('[data-testid="event-card-date"], .eds-event-card__date, time, .date');
      const dateLabel = dateEl.text().trim() || "";
      const dateAttr = dateEl.attr("datetime") || "";

      const locationEl = card.find('[data-testid="event-card-location"], .eds-event-card__location, [class*="location"]');
      const location = locationEl.text().trim() || "Los Angeles, CA";

      const priceEl = card.find('[data-testid="event-card-price"], .eds-event-card__price, [class*="price"]');
      const price = priceEl.text().trim() || "";

      events.push({
        title,
        date: parseDate(dateAttr),
        dateLabel,
        time: "",
        location,
        url,
        image,
        price: price || "Free",
        source: "eventbrite_organizer",
      });
    });

    if (events.length === 0) {
      $("script:contains('window.__INITIAL_STATE__')").each((_: any, el: any) => {
        const text = $(el).html() || "";
        const match = text.match(/window\.__INITIAL_STATE__\s*=\s*({.*?});/);
        if (match) {
          try {
            const data = JSON.parse(match[1]);
            const listing = data?.eventListing?.events || data?.searchResults?.events || [];
            listing.forEach((e: any) => {
              events.push({
                title: e.name || e.title || "",
                date: e.startDate || e.date || "",
                dateLabel: e.dateLabel || "",
                time: e.timeLabel || "",
                location: e.location || "Los Angeles, CA",
                url: e.url || e.webUrl || "",
                image: e.image?.url || e.imageUrl || null,
                price: e.price || "Free",
                source: "eventbrite_ssr",
              });
            });
          } catch (e) { console.error("[fd:parseSsr]", e); }
        }
      });
    }
  } catch (err) {
    console.error("Organizer scrape failed:", err);
  }

  return events;
}

async function scrapeSearchPage(): Promise<FdEvent[]> {
  const events: FdEvent[] = [];

  try {
    const r = await fetch(SEARCH_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const html = await r.text();
    const $ = cheerio.load(html);

    $('[data-testid="event-card"], .eds-event-card__content, article').each((_: any, el: any) => {
      const card = $(el);
      const titleEl = card.find('[data-testid="event-card-title"]');
      const title = titleEl.text().trim();
      if (!title) return;
      if (!title.toLowerCase().includes("fd") && !title.toLowerCase().includes("photo")) return;

      const link = card.find("a").first().attr("href") || "";
      const url = link.startsWith("http") ? link : `https://www.eventbrite.com${link}`;

      const imgEl = card.find("img").first();
      const image = imgEl.attr("src") || null;

      const dateEl = card.find('[data-testid="event-card-date"], time');
      const dateLabel = dateEl.text().trim() || "";

      const locationEl = card.find('[data-testid="event-card-location"]');
      const location = locationEl.text().trim() || "Los Angeles, CA";

      const priceEl = card.find('[data-testid="event-card-price"]');
      const price = priceEl.text().trim() || "";

      events.push({
        title,
        date: "",
        dateLabel,
        time: "",
        location,
        url,
        image,
        price: price || "Free",
        source: "eventbrite_search",
      });
    });
  } catch (err) {
    console.error("Search scrape failed:", err);
  }

  return events;
}

export async function GET() {
  if (cachedEvents && cachedAt && Date.now() - cachedAt < CACHE_TTL) {
    return NextResponse.json({ events: cachedEvents, cached: true, cachedAt });
  }

  const orgEvents = await scrapeOrganizerPage();
  let searchEvents: FdEvent[] = [];
  if (orgEvents.length === 0) {
    searchEvents = await scrapeSearchPage();
  }

  const all = orgEvents.length > 0 ? orgEvents : searchEvents;
  const unique = Array.from(new Map(all.map(e => [e.title + e.dateLabel, e])).values());

  cachedEvents = unique;
  cachedAt = Date.now();

  return NextResponse.json({ events: unique, cached: false, count: unique.length });
}

export async function POST() {
  cachedEvents = null;
  cachedAt = null;
  const orgEvents = await scrapeOrganizerPage();
  const unique = Array.from(new Map(orgEvents.map(e => [e.title + e.dateLabel, e])).values());
  cachedEvents = unique;
  cachedAt = Date.now();
  return NextResponse.json({ events: unique, cached: false, count: unique.length, rescanned: true });
}
