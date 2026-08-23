import { logger } from "@/lib/logger";

const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL || "";

export async function sendDiscordAlert(title: string, fields: Record<string, string>) {
  if (!DISCORD_WEBHOOK) return;
  try {
    const fieldArray = Object.entries(fields).map(([name, value]) => ({
      name: name.length > 256 ? name.slice(0, 253) + "..." : name,
      value: String(value).slice(0, 1024) || "N/A",
    }));

    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [{
          title,
          color: 0xDF3131,
          fields: fieldArray.slice(0, 25),
          timestamp: new Date().toISOString(),
          footer: { text: "WYZ Design - Form Notification" },
        }],
      }),
    });
  } catch (e) { logger.error("[discord:sendAlert]", e); }
}
