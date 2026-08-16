import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import fs from "fs";
import path from "path";

export async function GET() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.SANITY_API_WRITE_TOKEN;

  const ndjsonPath = path.join(process.cwd(), "sanity-seed.ndjson");
  if (!fs.existsSync(ndjsonPath)) {
    return NextResponse.json({ error: "sanity-seed.ndjson file not found" }, { status: 404 });
  }

  const rawLines = fs.readFileSync(ndjsonPath, "utf-8").split("\n").filter(Boolean);
  const docs = rawLines.map((line) => JSON.parse(line));

  if (!token || !projectId || projectId === "your_project_id_here") {
    return NextResponse.json({
      message: "Seed dataset generated successfully!",
      totalDocuments: docs.length,
      instructions: [
        "To push these 14 documents into your Sanity project dataset, run:",
        "npx sanity dataset import sanity-seed.ndjson production --replace",
        "Or add SANITY_API_WRITE_TOKEN to .env.local and re-fetch this endpoint.",
      ],
      sampleDocuments: docs.slice(0, 3),
    });
  }

  try {
    const writeClient = createClient({
      projectId,
      dataset,
      apiVersion: "2024-03-01",
      token,
      useCdn: false,
    });

    const transaction = writeClient.transaction();
    for (const doc of docs) {
      transaction.createOrReplace(doc);
    }
    await transaction.commit();

    return NextResponse.json({
      success: true,
      message: `Successfully created or updated ${docs.length} tour and destination documents in Sanity!`,
      totalDocuments: docs.length,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
