import { NextResponse } from "next/server";
import { loginCustomer } from "@/lib/portal/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { loginIdentifier, password } = body;

    if (!loginIdentifier || !password) {
      return NextResponse.json({ error: "Email or Phone and password are required." }, { status: 400 });
    }

    const result = await loginCustomer(loginIdentifier, password);

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Authentication failed." }, { status: 401 });
    }

    return NextResponse.json({ success: true, message: "Welcome back!" });
  } catch (err) {
    console.error("Portal Auth Login Route Error:", err);
    return NextResponse.json({ error: "Server error during login." }, { status: 500 });
  }
}
