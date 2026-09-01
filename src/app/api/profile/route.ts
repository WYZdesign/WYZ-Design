import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { updateUserProfile } from "@/lib/wyzmind";
import { evaluateProfileAchievements } from "@/lib/zeal";
import { validateCsrf } from "@/lib/csrf";
import { logger } from "@/lib/logger";

const FIELD_MAX_LEN: Record<string, number> = {
  name: 100, bio: 500, phone: 20, website: 200,
  avatarUrl: 500, instagram: 100, facebook: 100,
};

/**
 * Updates the authenticated user's profile fields in Neo4j.
 * @method PUT
 * @request Body `{ name?, bio?, phone?, website?, avatarUrl?, instagram?, facebook? }`
 * @response JSON with updated user object
 * @auth Required — user must be authenticated
 */
export async function PUT(req: NextRequest) {
  if (!validateCsrf(req)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const raw: Record<string, string> = {};
    for (const [key, maxLen] of Object.entries(FIELD_MAX_LEN)) {
      const val = body[key];
      if (typeof val === "string") raw[key] = val.slice(0, maxLen);
    }

    const updated = await updateUserProfile(session.user.email, raw);
    let unlockedAchievements: string[] = [];
    if (updated && typeof updated === "object") {
      const u = updated as Record<string, unknown>;
      unlockedAchievements = await evaluateProfileAchievements(session.user.email, {
        avatarUrl: typeof u.avatarUrl === "string" ? u.avatarUrl : null,
        instagram: typeof u.instagram === "string" ? u.instagram : null,
        facebook: typeof u.facebook === "string" ? u.facebook : null,
        website: typeof u.website === "string" ? u.website : null,
        bio: typeof u.bio === "string" ? u.bio : null,
        phone: typeof u.phone === "string" ? u.phone : null,
      }).catch(() => []);
    }
    return NextResponse.json({ user: updated, unlockedAchievements });
  } catch (e: unknown) {
    logger.error("profile:update", e);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
