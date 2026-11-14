import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { deletePreview } from "@/lib/admin/deletes";

/** How many linked records a customer or booking delete would also remove. */
export async function GET(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const kind = url.searchParams.get("kind");
  const id = url.searchParams.get("id");
  if ((kind !== "customer" && kind !== "booking") || !id) {
    return NextResponse.json({ error: "kind (customer or booking) and id are required." }, { status: 400 });
  }

  try {
    return NextResponse.json(await deletePreview(kind, id));
  } catch (err) {
    console.error("GET delete-preview error:", err);
    return NextResponse.json({ error: "Couldn't check linked records." }, { status: 500 });
  }
}
