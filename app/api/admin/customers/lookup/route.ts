import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { findCustomerByIdentifier } from "@/lib/portal/auth";

/** Finds an existing customer by email (or mobile) so a booking can be made for them. */
export async function GET(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = (new URL(request.url).searchParams.get("q") || "").trim();
  if (q.length < 5) return NextResponse.json({ customer: null });

  try {
    const c = await findCustomerByIdentifier(q);
    return NextResponse.json({
      customer: c ? { id: c.id, name: c.name, phone: c.phone, email: c.email, hasAccount: Boolean(c.passwordHash) } : null,
    });
  } catch (err) {
    console.error("GET customer lookup error:", err);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}
