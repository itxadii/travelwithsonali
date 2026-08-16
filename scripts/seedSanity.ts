import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// 1. First ensure sanity-seed.ndjson is generated
const generatorScript = path.join(__dirname, "generateSeedNdjson.ts");
console.log("📦 Generating Sanity seed dataset...");
execSync(`npx tsx "${generatorScript}"`, { stdio: "inherit" });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

async function seed() {
  const ndjsonPath = path.join(process.cwd(), "sanity-seed.ndjson");
  if (!fs.existsSync(ndjsonPath)) {
    console.error("❌ sanity-seed.ndjson file not found.");
    process.exit(1);
  }

  const rawLines = fs.readFileSync(ndjsonPath, "utf-8").split("\n").filter(Boolean);
  const docs = rawLines.map((line) => JSON.parse(line));

  if (token && projectId && projectId !== "your_project_id_here") {
    console.log(`🚀 Seeding ${docs.length} documents directly using SANITY_API_WRITE_TOKEN...`);
    const client = createClient({
      projectId,
      dataset,
      apiVersion: "2024-03-01",
      token,
      useCdn: false,
    });

    const tx = client.transaction();
    for (const doc of docs) {
      tx.createOrReplace(doc);
    }
    await tx.commit();
    console.log(`✅ Successfully imported ${docs.length} tours and destinations into Sanity!`);
    return;
  }

  console.log("ℹ️ Attempting Sanity CLI import...");
  try {
    execSync(`npx sanity dataset import sanity-seed.ndjson ${dataset} --replace`, { stdio: "inherit" });
    console.log(`✅ Successfully imported ${docs.length} documents into Sanity!`);
  } catch {
    console.log("\n🔑 SANITY AUTHENTICATION REQUIRED:");
    console.log("To import your 14 tours and destinations into Sanity Studio, please run ONE of the following:");
    console.log("\n  Option A (Recommended): Log in via Sanity CLI:");
    console.log("    npx sanity login");
    console.log("    npm run seed:sanity\n");
    console.log("  Option B: Add API Token:");
    console.log("    Add SANITY_API_WRITE_TOKEN=your_token to your .env.local file and re-run npm run seed:sanity\n");
  }
}

seed().catch((err) => {
  console.error("Error seeding Sanity:", err);
  process.exit(1);
});
