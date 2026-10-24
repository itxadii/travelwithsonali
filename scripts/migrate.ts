import { createTablesIfNotExist } from "./initTables";

createTablesIfNotExist()
  .then(() => {
    console.log("✅ Database tables are up to date.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  });
