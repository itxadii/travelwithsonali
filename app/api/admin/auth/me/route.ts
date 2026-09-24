import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/auth";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ authenticated: false, admin: null });
    }
    return NextResponse.json({
      authenticated: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (err) {
    return NextResponse.json({ authenticated: false, admin: null });
  }
}
