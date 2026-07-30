import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { isAdmin, getAllUsers, getDashboardStats, getNewsletterSubscribers } from "@/lib/wyzmind";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const admin = await isAdmin(session.user.email);
    if (!admin) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const tab = req.nextUrl.searchParams.get("tab") || "overview";

    if (tab === "users") {
      const users = await getAllUsers();
      return NextResponse.json({ users });
    }

    if (tab === "newsletter") {
      const subscribers = await getNewsletterSubscribers();
      return NextResponse.json({ subscribers });
    }

    const stats = await getDashboardStats();
    return NextResponse.json({ stats });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
