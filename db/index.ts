import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import fs from "fs";
import path from "path";

function getDatabaseUrl(): string | undefined {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  try {
    const envLocalPath = path.join(process.cwd(), ".env.local");
    if (fs.existsSync(envLocalPath)) {
      const content = fs.readFileSync(envLocalPath, "utf-8");
      const match = content.match(/^DATABASE_URL=(.+)$/m);
      if (match && match[1]) {
        let url = match[1].trim();
        if ((url.startsWith('"') && url.endsWith('"')) || (url.startsWith("'") && url.endsWith("'"))) {
          url = url.slice(1, -1);
        }
        return url;
      }
    }
  } catch (err) {
    console.warn("Could not read .env.local for DATABASE_URL", err);
  }
  return undefined;
}

const connectionString = getDatabaseUrl();

if (!connectionString) {
  console.warn("⚠️ DATABASE_URL is not set. Database operations will use fallback mode.");
}

const sql = neon(connectionString || "postgresql://fallback:fallback@localhost/fallback");
export const db = drizzle(sql, { schema });
export { connectionString };
