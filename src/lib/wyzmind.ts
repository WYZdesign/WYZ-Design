import neo4j, { Driver } from "neo4j-driver";
import Redis from "ioredis";
import { logger } from "@/lib/logger";

let neo4jDriver: Driver | null = null;
let redisClient: Redis | null = null;

export function getNeo4j(): Driver {
  if (!neo4jDriver) {
    neo4jDriver = neo4j.driver(
      process.env.NEO4J_URI || "bolt://localhost:7687",
      neo4j.auth.basic(
        process.env.NEO4J_USER || "neo4j",
        process.env.NEO4J_PASSWORD || "password"
      ),
      { disableLosslessIntegers: true }
    );
  }
  return neo4jDriver;
}

export function getRedis(): Redis {
  if (!redisClient) {
    redisClient = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379"),
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) return null;
        return Math.min(times * 200, 2000);
      },
    });
  }
  return redisClient;
}

export async function findOrCreateUser(email: string, name?: string) {
  const driver = getNeo4j();
  const session = driver.session();
  try {
    const result = await session.run(
      `MERGE (u:User {email: $email})
       ON CREATE SET u.name = $name, u.createdAt = datetime(), u.role = 'member'
       ON MATCH SET u.lastLogin = datetime()
       RETURN u { .email, .name, .role, .createdAt, .bio, .phone, .website, .avatarUrl, .instagram, .facebook, .provider } as user`,
      { email, name: name || email.split("@")[0] }
    );
    return result.records[0]?.get("user") || null;
  } finally {
    await session.close();
  }
}

export async function updateUserIdentity(email: string, data: { provider?: string; providerAccountId?: string; image?: string }) {
  const driver = getNeo4j();
  const session = driver.session();
  try {
    const sets: string[] = [];
    const params: Record<string, any> = { email };
    if (data.provider) { sets.push("u.provider = $provider"); params.provider = data.provider; }
    if (data.providerAccountId) { sets.push("u.providerAccountId = $providerAccountId"); params.providerAccountId = data.providerAccountId; }
    if (data.image) { sets.push("u.avatarUrl = $avatarUrl"); params.avatarUrl = data.image; }
    if (sets.length === 0) return;
    await session.run(`MATCH (u:User {email: $email}) SET ${sets.join(", ")}`, params);
  } finally {
    await session.close();
  }
}

export async function updateUserProfile(email: string, profile: { name?: string; bio?: string; phone?: string; website?: string; avatarUrl?: string; instagram?: string; facebook?: string }) {
  const driver = getNeo4j();
  const session = driver.session();
  try {
    const sets: string[] = [];
    const params: Record<string, any> = { email };
    for (const [k, v] of Object.entries(profile)) {
      if (v !== undefined) { sets.push(`u.${k} = $${k}`); params[k] = v; }
    }
    if (sets.length === 0) return null;
    const result = await session.run(
      `MATCH (u:User {email: $email}) SET ${sets.join(", ")} RETURN u { .email, .name, .role, .bio, .phone, .website, .avatarUrl, .instagram, .facebook, .provider, .createdAt } as user`,
      params
    );
    return result.records[0]?.get("user") || null;
  } finally {
    await session.close();
  }
}

export async function isAdmin(email: string): Promise<boolean> {
  const driver = getNeo4j();
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (u:User {email: $email}) RETURN u.role = 'admin' AS isAdmin`,
      { email }
    );
    return result.records[0]?.get("isAdmin") || false;
  } finally {
    await session.close();
  }
}

export async function getAllUsers() {
  const driver = getNeo4j();
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (u:User) RETURN u { .email, .name, .role, .createdAt, .lastLogin, .provider } as user ORDER BY u.createdAt DESC`
    );
    return result.records.map(r => r.get("user"));
  } finally {
    await session.close();
  }
}

export async function addNewsletterSubscriber(email: string, active = true) {
  try {
    const driver = getNeo4j();
    const session = driver.session();
    try {
      await session.run(
        `MERGE (s:NewsletterSubscriber {email: $email})
         ON CREATE SET s.subscribedAt = datetime(), s.active = $active
         ON MATCH SET s.active = $active, s.resubscribedAt = datetime()`,
        { email, active }
      );
    } finally {
      await session.close();
    }
  } catch (e) { logger.error("[wyzmind:addNewsletterSubscriber]", e); }
}

export async function removeNewsletterSubscriber(email: string) {
  try {
    const driver = getNeo4j();
    const session = driver.session();
    try {
      await session.run(
        `MATCH (s:NewsletterSubscriber {email: $email}) SET s.active = false, s.unsubscribedAt = datetime()`,
        { email }
      );
    } finally {
      await session.close();
    }
  } catch (e) { logger.error("[wyzmind:removeNewsletterSubscriber]", e); }
}

export async function getNewsletterSubscribers() {
  const driver = getNeo4j();
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (s:NewsletterSubscriber {active: true}) RETURN s.email AS email, s.subscribedAt AS subscribedAt ORDER BY s.subscribedAt DESC`
    );
    return result.records.map(r => ({ email: r.get("email"), subscribedAt: r.get("subscribedAt") }));
  } finally {
    await session.close();
  }
}

export async function getDashboardStats() {
  const driver = getNeo4j();
  const session = driver.session();
  try {
    const usersResult = await session.run(
      `MATCH (u:User) RETURN count(u) AS totalUsers, count(CASE WHEN u.role = 'admin' THEN 1 END) AS adminCount`,
    );
    const subCount = await session.run(`MATCH (s:NewsletterSubscriber {active: true}) RETURN count(s) AS count`);
    return {
      totalUsers: usersResult.records[0]?.get("totalUsers") || 0,
      adminCount: usersResult.records[0]?.get("adminCount") || 0,
      newsletterSubs: subCount.records[0]?.get("count") || 0,
    };
  } finally {
    await session.close();
  }
}

export async function getUserByEmail(email: string) {
  const driver = getNeo4j();
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (u:User {email: $email}) RETURN u { .email, .name, .role, .createdAt } as user`,
      { email }
    );
    return result.records[0]?.get("user") || null;
  } finally {
    await session.close();
  }
}

export async function setCache(key: string, value: unknown, ttl = 3600) {
  const redis = getRedis();
  await redis.setex(key, ttl, JSON.stringify(value));
}

export async function getCache<T>(key: string): Promise<T | null> {
  const redis = getRedis();
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}

export async function qdrantSearch(query: string, limit = 5): Promise<{ text: string; score: number; source: string }[]> {
  try {
    const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
    const embedResp = await fetch(`${ollamaUrl}/api/embed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "nomic-embed-text", input: query }),
    });
    const embedData = await embedResp.json();
    const vector = embedData.embeddings?.[0];
    if (!vector) return [];

    const qdrantUrl = process.env.QDRANT_URL || "http://localhost:6333";
    const searchResp = await fetch(`${qdrantUrl}/collections/wyzmind_v3/points/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vector,
        limit,
        with_payload: true,
        with_vector: false,
      }),
    });
    const searchData = await searchResp.json();
    return (searchData.result || []).map((r: any) => ({
      text: r.payload?.text || "",
      score: r.score,
      source: r.payload?.source || "",
    }));
  } catch {
    return [];
  }
}

export async function getLoyaltyPoints(email: string) {
  const driver = getNeo4j();
  const session = driver.session();
  try {
    const result = await session.run(
      `       MERGE (u:User {email: $email}) ON CREATE SET u.points = 0, u.tier = 'recruit'
       RETURN u.points AS points, u.tier AS tier, u.createdAt AS joined`,
      { email }
    );
    const r = result.records[0];
    return { points: r.get("points") || 0, tier: r.get("tier") || "recruit", joined: r.get("joined") };
  } finally { await session.close(); }
}

export async function addLoyaltyPoints(email: string, amount: number, reason: string): Promise<{ points: number; tier: string }> {
  const driver = getNeo4j();
  const session = driver.session();
  try {
    const result = await session.run(
      `       MERGE (u:User {email: $email}) ON CREATE SET u.points = 0, u.tier = 'recruit'
       SET u.points = COALESCE(u.points, 0) + $amount
       CREATE (u)-[:EARNED_POINTS]->(:LoyaltyTransaction {amount: $amount, reason: $reason, timestamp: datetime()})
       WITH u,
         CASE WHEN u.points >= 5000 THEN 'legend'
              WHEN u.points >= 2000 THEN 'champion'
              WHEN u.points >= 500 THEN 'zealot'
              ELSE 'recruit' END AS newTier
       SET u.tier = newTier
       RETURN u.points AS points, u.tier AS tier`,
      { email, amount, reason }
    );
    const r = result.records[0];
    return { points: r.get("points") || 0, tier: r.get("tier") || "recruit" };
  } finally { await session.close(); }
}

export async function getLoyaltyHistory(email: string) {
  const driver = getNeo4j();
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (u:User {email: $email})-[:EARNED_POINTS]->(t:LoyaltyTransaction)
       RETURN t.amount AS amount, t.reason AS reason, t.timestamp AS timestamp
       ORDER BY t.timestamp DESC LIMIT 50`,
      { email }
    );
    return result.records.map(r => ({ amount: r.get("amount"), reason: r.get("reason"), timestamp: r.get("timestamp") }));
  } finally { await session.close(); }
}
