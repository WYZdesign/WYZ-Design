import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { getLoyaltyPoints, getLoyaltyHistory } from "@/lib/wyzmind";

/**
 * Returns loyalty points balance and history for the authenticated user.
 * @method GET
 * @request None
 * @response JSON with points balance and transaction history
 * @auth Required — user must be authenticated
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const points = await getLoyaltyPoints(session.user.email);
    const history = await getLoyaltyHistory(session.user.email);
    return NextResponse.json({ ...points, history });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
