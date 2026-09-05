import { getRedis } from "@/lib/wyzmind";
import { loadZealState, saveZealState, addLoyaltyPoints, getLoyaltyHistory } from "@/lib/zeal-store";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

/**
 * Zeal points engine. Actions, achievements, and quests with
 * Redis-backed cooldowns and Neo4j-backed counters/history.
 */

export type ZealCategory = "daily" | "weekly" | "milestone" | "easter" | "auto";

export interface ZealActionDef {
  zeal: number;
  category: ZealCategory;
  reason: string;
  /** Cooldown in ms. 0 means once per user forever. */
  cooldownMs: number;
}

export const ZEAL_ACTIONS: Record<string, ZealActionDef> = {
  // Daily habits
  "daily-login":        { zeal: 2,   category: "daily", cooldownMs: 20 * 3600000, reason: "Daily login" },
  "visit-homepage":     { zeal: 1,   category: "daily", cooldownMs: 24 * 3600000, reason: "Visited homepage" },
  "visit-service-page": { zeal: 2,   category: "daily", cooldownMs: 6 * 3600000,  reason: "Explored a service" },
  "visit-pricing":      { zeal: 2,   category: "daily", cooldownMs: 24 * 3600000, reason: "Checked out pricing" },
  "visit-gallery":      { zeal: 3,   category: "daily", cooldownMs: 24 * 3600000, reason: "Browsed the gallery" },
  "read-blog-post":     { zeal: 3,   category: "daily", cooldownMs: 1 * 3600000,  reason: "Read a blog post" },
  "use-search":         { zeal: 1,   category: "daily", cooldownMs: 1 * 3600000,  reason: "Used site search" },
  "open-chat":          { zeal: 2,   category: "daily", cooldownMs: 24 * 3600000, reason: "Opened the chat widget" },
  "scroll-full-page":   { zeal: 1,   category: "daily", cooldownMs: 12 * 3600000, reason: "Read a page start to finish" },

  // Weekly engagement
  "community-comment":    { zeal: 10, category: "weekly", cooldownMs: 4 * 3600000,  reason: "Left a community comment" },
  "share-social":         { zeal: 15, category: "weekly", cooldownMs: 24 * 3600000, reason: "Shared WYZ on social media" },

  // One-time milestones
  "visit-about":             { zeal: 5,   category: "milestone", cooldownMs: 0, reason: "Read the About page" },
  "subscribe-newsletter":    { zeal: 50,  category: "milestone", cooldownMs: 0, reason: "Subscribed to the newsletter" },
  "complete-wizard":         { zeal: 40,  category: "milestone", cooldownMs: 0, reason: "Completed the strategy wizard" },
  "leave-review":            { zeal: 30,  category: "milestone", cooldownMs: 0, reason: "Left an honest review" },
  "book-consultation":       { zeal: 100, category: "milestone", cooldownMs: 0, reason: "Booked a consultation" },
  "buy-gift-card":           { zeal: 75,  category: "milestone", cooldownMs: 0, reason: "Purchased a gift card" },
  "refer-friend":            { zeal: 500, category: "milestone", cooldownMs: 0, reason: "Referred a friend" },
  "upload-model-photo":      { zeal: 30,  category: "milestone", cooldownMs: 0, reason: "Submitted to the model archive" },
  "submit-featured-artist":  { zeal: 40,  category: "milestone", cooldownMs: 0, reason: "Applied as featured artist" },
  "submit-design-brief":     { zeal: 35,  category: "milestone", cooldownMs: 0, reason: "Sent a design brief" },
  "view-all-services":       { zeal: 20,  category: "milestone", cooldownMs: 0, reason: "Viewed every service page" },
  "read-5-blog-posts":       { zeal: 25,  category: "milestone", cooldownMs: 0, reason: "Read 5 different blog posts" },
  "browse-gallery-10":       { zeal: 15,  category: "milestone", cooldownMs: 0, reason: "Opened 10 gallery photos" },

  // Easter eggs
  "logo-easter-egg":  { zeal: 50,  category: "easter", cooldownMs: 0, reason: "Found the logo easter egg" },
  "hidden-page":      { zeal: 100, category: "easter", cooldownMs: 0, reason: "Found the hidden page" },
  "scroll-trio":      { zeal: 20,  category: "easter", cooldownMs: 0, reason: "Finished 3 pages in one visit" },
  "konami-code":      { zeal: 200, category: "easter", cooldownMs: 0, reason: "Entered the Konami code" },
  "double-tap":       { zeal: 10,  category: "easter", cooldownMs: 0, reason: "Double-tapped a gallery photo" },
  "speed-reader":     { zeal: 15,  category: "easter", cooldownMs: 0, reason: "Speed reader (skimmed in under 5s)" },
  "thorough-reader":  { zeal: 20,  category: "easter", cooldownMs: 0, reason: "Thorough reader (3+ minutes on a post)" },
  "watch-recap":      { zeal: 10,  category: "easter", cooldownMs: 7 * 24 * 3600000, reason: "Watched an event recap" },
};

export interface AchievementDef {
  zeal: number;
  title: string;
  description: string;
}

export const ZEAL_ACHIEVEMENTS: Record<string, AchievementDef> = {
  "first-login":       { zeal: 25,  title: "Ignited",       description: "Sign in for the first time" },
  "profile-complete":  { zeal: 25,  title: "Identified",    description: "Complete your profile" },
  "social-connected":  { zeal: 10,  title: "Connected",     description: "Add a social link to your profile" },
  "avatar-uploaded":   { zeal: 15,  title: "Visible",       description: "Upload a profile picture" },
  "service-explorer":  { zeal: 30,  title: "Explorer",      description: "Visit all 6 service pages" },
  "blog-reader":       { zeal: 20,  title: "Bookworm",      description: "Read 10 blog posts" },
  "gallery-regular":   { zeal: 20,  title: "Art Lover",     description: "Visit the gallery 5 times" },
  "night-owl":         { zeal: 25,  title: "Night Owl",     description: "Visit between midnight and 5am" },
  "streak-3":          { zeal: 15,  title: "Starter",       description: "Visit 3 days in a row" },
  "streak-7":          { zeal: 50,  title: "On Fire",       description: "Visit 7 days in a row" },
  "streak-14":         { zeal: 100, title: "Dedicated",     description: "Visit 14 days in a row" },
  "streak-30":         { zeal: 200, title: "Unstoppable",   description: "Visit 30 days in a row" },
};

export interface QuestDef {
  title: string;
  description: string;
  steps: string[];
  bonusZeal: number;
}

export const ZEAL_QUESTS: Record<string, QuestDef> = {
  "first-steps": {
    title: "First Steps",
    description: "Get to know WYZ Design",
    steps: ["visit-about", "visit-service-page", "visit-pricing", "subscribe-newsletter", "book-consultation"],
    bonusZeal: 75,
  },
  "content-creator": {
    title: "Content Creator",
    description: "Join the conversation and put your work out there",
    steps: ["community-comment", "share-social", "leave-review", "submit-featured-artist"],
    bonusZeal: 95,
  },
  "social-butterfly": {
    title: "Social Butterfly",
    description: "Spread the word and bring friends along",
    steps: ["share-social", "refer-friend", "subscribe-newsletter"],
    bonusZeal: 80,
  },
  "deep-dive": {
    title: "Deep Dive",
    description: "Explore everything the site has to offer",
    steps: ["read-blog-post", "browse-gallery-10", "complete-wizard", "view-all-services"],
    bonusZeal: 65,
  },
};

export const ZEAL_TIERS = [
  { name: "Recruit",  min: 0,    color: "#757575" },
  { name: "Zealot",   min: 500,  color: "#DF3131" },
  { name: "Champion", min: 2000, color: "#FFD700" },
  { name: "Legend",   min: 5000, color: "#00D4FF" },
];

/**
 * Redemption catalog. Priced at roughly 5-6% real-value back
 * (1 Zeal is earned per $1 spent, so 500 Zeal ~= $25 of value).
 */
export const ZEAL_REWARDS = [
  { id: "discount-25",       title: "$25 off any service",              cost: 500,  note: "Discount code honored on any booking" },
  { id: "free-retouch",      title: "Free photo retouching session",    cost: 750,  note: "$50 value, one session" },
  { id: "merch-item",        title: "Any merch item under $40",         cost: 1000, note: "Applied at fulfillment" },
  { id: "shoot-extra-hour",  title: "Extra hour on any photoshoot",     cost: 1200, note: "$100 value, mention when booking" },
  { id: "discount-100",      title: "$100 off any booking",             cost: 1750, note: "Best value per Zeal" },
] as const;

export type ZealRewardId = (typeof ZEAL_REWARDS)[number]["id"];

export function tierForPoints(points: number): { name: string; color: string; index: number } {
  let index = 0;
  for (let i = 0; i < ZEAL_TIERS.length; i++) {
    if (points >= ZEAL_TIERS[i].min) index = i;
  }
  return { name: ZEAL_TIERS[index].name, color: ZEAL_TIERS[index].color, index };
}

interface UserZealState {
  points: number;
  tier: string;
  actions: string[];
  achievements: string[];
  questsCompleted: string[];
  counters: Record<string, number>;
  visitStreak: number;
  longestStreak: number;
  lastVisitDay: string | null;
}

const DEFAULT_STATE: Omit<UserZealState, "points" | "tier"> = {
  actions: [],
  achievements: [],
  questsCompleted: [],
  counters: {},
  visitStreak: 0,
  longestStreak: 0,
  lastVisitDay: null,
};

async function loadUserState(email: string): Promise<UserZealState> {
  const row = await loadZealState(email);
  return {
    points: row.points,
    tier: row.tier,
    actions: row.actions,
    achievements: row.achievements,
    questsCompleted: row.quests_completed,
    counters: row.counters,
    visitStreak: row.visit_streak,
    longestStreak: row.longest_streak,
    lastVisitDay: row.last_visit_day,
  };
}

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayUtc(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

async function saveUserState(email: string, state: UserZealState): Promise<void> {
  await saveZealState(email, {
    email,
    points: state.points,
    tier: state.tier,
    actions: state.actions,
    achievements: state.achievements,
    quests_completed: state.questsCompleted,
    counters: state.counters,
    visit_streak: state.visitStreak,
    longest_streak: state.longestStreak,
    last_visit_day: state.lastVisitDay,
  });
}

/** Atomic Redis cooldown. Returns false when already earned inside the window. */
async function claimCooldown(email: string, action: string, cooldownMs: number, subKey?: string): Promise<boolean> {
  if (cooldownMs === 0) return true;
  const key = `zeal:cd:${email}:${action}${subKey ? `:${subKey}` : ""}`;
  try {
    // getRedis() inside the try: client construction itself must never escape
    // (a sync throw here was producing instant unhandled 500s in production).
    const redis = getRedis();
    const res = await redis.set(key, "1", "EX", Math.ceil(cooldownMs / 1000), "NX");
    return res === "OK";
  } catch (e) {
    logger.warn("zeal:cooldown", e instanceof Error ? e.message : String(e));
    return true;
  }
}

/** Atomic permanent claim for one-time actions. Returns false when already claimed. */
async function claimOnce(email: string, action: string): Promise<boolean> {
  try {
    const redis = getRedis();
    const res = await redis.set(`zeal:once:${email}:${action}`, "1", "NX");
    return res === "OK";
  } catch (e) {
    logger.warn("zeal:once", e instanceof Error ? e.message : String(e));
    return true;
  }
}

/** Serializes earns per user so concurrent requests can't double-award or clobber state. */
async function acquireUserLock(email: string): Promise<boolean> {
  try {
    const redis = getRedis();
    const res = await redis.set(`zeal:lock:${email}`, "1", "EX", 10, "NX");
    return res === "OK";
  } catch (e) {
    logger.warn("zeal:lock", e instanceof Error ? e.message : String(e));
    return true;
  }
}

async function releaseUserLock(email: string): Promise<void> {
  try {
    await getRedis().del(`zeal:lock:${email}`);
  } catch {}
}

export interface EarnResult {
  success: boolean;
  zeal?: number;
  total?: number;
  tier?: string;
  tierUp?: boolean;
  reason?: string;
  achievement?: { id: string; title: string; zeal: number };
  quest?: { id: string; title: string; bonusZeal: number };
  error?: string;
  cooldown?: boolean;
  busy?: boolean;
  unavailable?: boolean;
}

/**
 * Awards zeal for an action, then evaluates achievements and quests.
 * Handles daily-login streak logic and auto achievements internally.
 */
export async function earnZeal(email: string, actionId: string, opts?: { localHour?: number; metaPath?: string }): Promise<EarnResult> {
  const limited = await rateLimit(`zeal-earn:${email}`, 60, 3600000);
  if (!limited.ok) return { success: false, error: "Rate limit exceeded" };

  const def = ZEAL_ACTIONS[actionId];
  if (!def) return { success: false, error: "Unknown action" };

  // Normalize to top-level path segment so /photography/events can't farm distinct-service tracking
  let normalizedPath: string | undefined;
  if (opts?.metaPath && /^\/[a-z0-9-]*$/i.test(opts.metaPath.split("?")[0])) {
    normalizedPath = opts.metaPath.split("/")[1]?.toLowerCase();
  }

  // Serialize all earns for this user: prevents double-awards and state clobbering
  const locked = await acquireUserLock(email);
  if (!locked) return { success: false, error: "Busy, try again", busy: true };
  try {
    return await earnZealLocked(email, actionId, def, { localHour: opts?.localHour, normalizedPath });
  } catch (e) {
    // Degrade gracefully instead of throwing — the store (Supabase) may be
    // unreachable from serverless. Mirrors getZealStatus' unavailable signal.
    logger.error("zeal:earn", e);
    return { success: false, error: "Zeal is temporarily unavailable", unavailable: true };
  } finally {
    await releaseUserLock(email);
  }
}

async function earnZealLocked(
  email: string,
  actionId: string,
  def: ZealActionDef,
  ctx: { localHour?: number; normalizedPath?: string }
): Promise<EarnResult> {
  const state = await loadUserState(email);

  if (def.cooldownMs === 0) {
    const fastPath = state.actions.includes(actionId);
    if (fastPath) return { success: true, zeal: 0, total: state.points, tier: state.tier, reason: def.reason };
    const once = await claimOnce(email, actionId);
    if (!once) {
      state.actions.push(actionId);
      await saveUserState(email, state);
      return { success: true, zeal: 0, total: state.points, tier: state.tier, reason: def.reason };
    }
  } else {
    // Per-post cooldown keys stop re-reads of one post from farming blog rewards
    const subKey = actionId === "read-blog-post" && ctx.normalizedPath ? `post:${ctx.normalizedPath}` : undefined;
    const claimed = await claimCooldown(email, actionId, def.cooldownMs, subKey);
    if (!claimed) return { success: false, cooldown: true, error: "Cooldown active" };
  }

  const beforeTier = tierForPoints(state.points);

  // Daily login updates the visit streak
  if (actionId === "daily-login") {
    const today = todayUtc();
    if (state.lastVisitDay !== today) {
      state.visitStreak = state.lastVisitDay === yesterdayUtc() ? state.visitStreak + 1 : 1;
      state.longestStreak = Math.max(state.longestStreak, state.visitStreak);
      state.lastVisitDay = today;
    }
  }

  // Counter actions feed achievements
  const counterMap: Record<string, string> = {
    "read-blog-post": "blogs_read",
    "visit-gallery": "gallery_visits",
    "community-comment": "comments",
    "share-social": "shares",
  };
  if (counterMap[actionId]) {
    const key = counterMap[actionId];
    state.counters[key] = (state.counters[key] || 0) + 1;
  }

  // Distinct service page tracking for view-all-services + service-explorer
  let distinctServices = -1;
  if (actionId === "visit-service-page" && ctx.normalizedPath) {
    try {
      const redis = getRedis();
      await redis.sadd(`zeal:svcs:${email}`, ctx.normalizedPath);
      distinctServices = await redis.scard(`zeal:svcs:${email}`);
      state.counters.services_distinct = distinctServices;
    } catch (e) {
      logger.warn("zeal:svc-track", e instanceof Error ? e.message : String(e));
    }
  }

  state.actions.push(actionId);

  const pendingAchievements: string[] = [];

  if (!state.achievements.includes("first-login")) pendingAchievements.push("first-login");
  if (ctx.localHour !== undefined && ctx.localHour >= 0 && ctx.localHour < 5 && !state.achievements.includes("night-owl")) {
    pendingAchievements.push("night-owl");
  }
  for (const [achId, threshold] of [["streak-3", 3], ["streak-7", 7], ["streak-14", 14], ["streak-30", 30]] as const) {
    if (state.visitStreak >= threshold && !state.achievements.includes(achId)) pendingAchievements.push(achId);
  }
  let bonusDescriptions: string[] = [];
  if ((state.counters.blogs_read || 0) >= 5 && !state.actions.includes("read-5-blog-posts")) {
    const ok = await awardDirect(email, ZEAL_ACTIONS["read-5-blog-posts"].zeal, ZEAL_ACTIONS["read-5-blog-posts"].reason);
    if (ok) { state.actions.push("read-5-blog-posts"); bonusDescriptions.push(ZEAL_ACTIONS["read-5-blog-posts"].reason); }
  }
  if (distinctServices >= 6 && !state.actions.includes("view-all-services")) {
    const svcDef = ZEAL_ACTIONS["view-all-services"];
    const ok = await awardDirect(email, svcDef.zeal, svcDef.reason);
    if (ok) { state.actions.push("view-all-services"); bonusDescriptions.push(svcDef.reason); }
  }
  if ((state.counters.services_distinct || distinctServices) >= 6 && !state.achievements.includes("service-explorer")) {
    pendingAchievements.push("service-explorer");
  }
  if ((state.counters.blogs_read || 0) >= 10 && !state.achievements.includes("blog-reader")) pendingAchievements.push("blog-reader");
  if ((state.counters.gallery_visits || 0) >= 5 && !state.achievements.includes("gallery-regular")) pendingAchievements.push("gallery-regular");

  let achievementReward: EarnResult["achievement"];
  let achievementZeal = 0;
  for (const achId of pendingAchievements) {
    state.achievements.push(achId);
    const ach = ZEAL_ACHIEVEMENTS[achId];
    achievementZeal += ach.zeal;
    if (!achievementReward) achievementReward = { id: achId, title: ach.title, zeal: ach.zeal };
  }

  await addLoyaltyPoints(email, def.zeal + achievementZeal,
    bonusDescriptions.length > 0
      ? `${def.reason} + ${bonusDescriptions.join(", ")}`
      : achievementZeal > 0
        ? `${def.reason} + Achievement: ${achievementReward?.title}`
        : def.reason);

  // Quest completion check
  let questReward: EarnResult["quest"];
  for (const [questId, quest] of Object.entries(ZEAL_QUESTS)) {
    if (state.questsCompleted.includes(questId)) continue;
    const allDone = quest.steps.every(s => state.actions.includes(s));
    if (allDone) {
      const ok = await awardDirect(email, quest.bonusZeal, `Quest Complete: ${quest.title}`);
      if (ok) {
        state.questsCompleted.push(questId);
        questReward = { id: questId, title: quest.title, bonusZeal: quest.bonusZeal };
      }
    }
  }

  await saveUserState(email, state);

  const updated = await loadUserState(email);
  const afterTier = tierForPoints(updated.points);

  return {
    success: true,
    zeal: def.zeal + achievementZeal,
    total: updated.points,
    tier: afterTier.name.toLowerCase(),
    tierUp: afterTier.index > beforeTier.index,
    reason: def.reason,
    achievement: achievementReward,
    quest: questReward,
  };
}

/** Direct point award without cooldown/action bookkeeping (used for bonuses). Returns false on failure. */
async function awardDirect(email: string, amount: number, reason: string): Promise<boolean> {
  try {
    await addLoyaltyPoints(email, amount, reason);
    return true;
  } catch (e) {
    logger.error("zeal:awardDirect", e);
    return false;
  }
}

/** Server-side profile awards, called from the profile API where data is trusted. */
export async function evaluateProfileAchievements(email: string, profile: {
  avatarUrl?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  website?: string | null;
  bio?: string | null;
  phone?: string | null;
}): Promise<string[]> {
  const state = await loadUserState(email);
  const unlocked: string[] = [];
  const bioDone = Boolean(profile.bio && profile.phone);
  const socialDone = Boolean(profile.instagram || profile.facebook || profile.website);

  if (bioDone && !state.achievements.includes("profile-complete")) {
    state.achievements.push("profile-complete");
    unlocked.push("profile-complete");
    await awardDirect(email, ZEAL_ACHIEVEMENTS["profile-complete"].zeal, `Achievement: ${ZEAL_ACHIEVEMENTS["profile-complete"].title}`);
  }
  if (socialDone && !state.achievements.includes("social-connected")) {
    state.achievements.push("social-connected");
    unlocked.push("social-connected");
    await awardDirect(email, ZEAL_ACHIEVEMENTS["social-connected"].zeal, `Achievement: ${ZEAL_ACHIEVEMENTS["social-connected"].title}`);
  }
  if (profile.avatarUrl && !state.achievements.includes("avatar-uploaded")) {
    state.achievements.push("avatar-uploaded");
    unlocked.push("avatar-uploaded");
    await awardDirect(email, ZEAL_ACHIEVEMENTS["avatar-uploaded"].zeal, `Achievement: ${ZEAL_ACHIEVEMENTS["avatar-uploaded"].title}`);
  }
  if (unlocked.length > 0) await saveUserState(email, state);
  return unlocked;
}

export interface RedeemResult {
  success: boolean;
  code?: string;
  title?: string;
  remaining?: number;
  error?: string;
  unavailable?: boolean;
}

function generateRedemptionCode(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `WYZ-${suffix}`;
}

/**
 * Spends Zeal on a reward. Deducts points atomically under the user lock,
 * stores the redemption code in Redis for validation, and returns the code.
 */
export async function redeemZeal(email: string, rewardId: string): Promise<RedeemResult> {
  const reward = ZEAL_REWARDS.find(r => r.id === rewardId);
  if (!reward) return { success: false, error: "Unknown reward" };

  const locked = await acquireUserLock(email);
  if (!locked) return { success: false, error: "Busy, try again" };
  try {
    const state = await loadUserState(email);
    if (state.points < reward.cost) {
      return { success: false, error: `Not enough Zeal. You need ${reward.cost - state.points} more.` };
    }

    const code = generateRedemptionCode();

    // Persist the redemption record BEFORE deducting points. If this write
    // fails we fail closed with no points spent; if the deduction fails after
    // a successful write, we delete the orphan record to compensate.
    let recordStored = false;
    try {
      const redis = getRedis();
      const record = JSON.stringify({ email, rewardId, title: reward.title, code, timestamp: Date.now() });
      await redis.set(`zeal:redemption:${code}`, record, "EX", 180 * 24 * 3600);
      recordStored = true;
    } catch (e) {
      logger.warn("zeal:redeem-store", e instanceof Error ? e.message : String(e));
    }
    if (!recordStored) {
      return { success: false, error: "Redemption failed. Try again." };
    }

    try {
      await addLoyaltyPoints(email, -reward.cost, `Redeemed: ${reward.title} (${code})`);
    } catch (e) {
      logger.error("zeal:redeem-deduct", e);
      try {
        await getRedis().del(`zeal:redemption:${code}`);
      } catch {}
      return { success: false, error: "Redemption failed. Try again." };
    }

    const updated = await loadUserState(email);
    return { success: true, code, title: reward.title, remaining: updated.points };
  } catch (e) {
    // Degrade gracefully instead of throwing — the store (Supabase) may be
    // unreachable from serverless. Mirrors getZealStatus' unavailable signal.
    logger.error("zeal:redeem", e);
    return { success: false, error: "Zeal is temporarily unavailable", unavailable: true };
  } finally {
    await releaseUserLock(email);
  }
}

/** Full status payload for the Zeal HQ page. */
export async function getZealStatus(email: string): Promise<{
  points: number;
  tier: string;
  tierColor: string;
  tierIndex: number;
  nextTier: { name: string; min: number; color: string } | null;
  visitStreak: number;
  longestStreak: number;
  counters: Record<string, number>;
  achievementsUnlocked: string[];
  questsCompleted: string[];
  actionsEarned: string[];
  history: { amount: number; reason: string; timestamp: unknown }[];
  unavailable?: boolean;
}> {
  try {
    const state = await loadUserState(email);
    const history = await getLoyaltyHistory(email);
    const tier = tierForPoints(state.points);
    return {
      points: state.points,
      tier: tier.name,
      tierColor: tier.color,
      tierIndex: tier.index,
      nextTier: tier.index < ZEAL_TIERS.length - 1 ? ZEAL_TIERS[tier.index + 1] : null,
      visitStreak: state.visitStreak,
      longestStreak: state.longestStreak,
      counters: state.counters,
      achievementsUnlocked: state.achievements,
      questsCompleted: state.questsCompleted,
      actionsEarned: state.actions,
      history: history.slice(0, 20),
    };
  } catch (e) {
    logger.error("zeal:status", e);
    return {
      points: 0,
      tier: ZEAL_TIERS[0].name,
      tierColor: ZEAL_TIERS[0].color,
      tierIndex: 0,
      nextTier: ZEAL_TIERS[1] ?? null,
      visitStreak: 0,
      longestStreak: 0,
      counters: {},
      achievementsUnlocked: [],
      questsCompleted: [],
      actionsEarned: [],
      history: [],
      unavailable: true,
    };
  }
}
