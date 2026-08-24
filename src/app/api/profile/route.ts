import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { updateUserProfile } from "@/lib/wyzmind";
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
    return NextResponse.json({ user: updated });
  } catch (e: unknown) {
    logger.error("profile:update", e);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
