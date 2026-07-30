import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { updateUserProfile } from "@/lib/wyzmind";

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
    const { name, bio, phone, website, avatarUrl, instagram, facebook } = body;

    const updated = await updateUserProfile(session.user.email, {
      name, bio, phone, website, avatarUrl, instagram, facebook,
    });

    return NextResponse.json({ user: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
