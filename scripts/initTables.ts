import { connectionString } from "../db";
import { neon } from "@neondatabase/serverless";

export async function createTablesIfNotExist() {
  if (!connectionString) {
    console.warn("⚠️ No DATABASE_URL found. Skipping DDL creation.");
    return;
  }

  const sql = neon(connectionString);

  console.log("🛠️ Creating Neon PostgreSQL tables if not exist...");

  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'SUPER_ADMIN',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS admin_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
      token TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      mobile TEXT NOT NULL,
      email TEXT,
      interested_tour_sanity_id TEXT,
      interested_tour_title TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'Website',
      travellers_count INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'New',
      assigned_to TEXT,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS lead_followups (
      id TEXT PRIMARY KEY,
      lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
      note TEXT NOT NULL,
      created_by TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      password_hash TEXT,
      status TEXT NOT NULL DEFAULT 'Active',
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `;

  await sql`
    ALTER TABLE customers ADD COLUMN IF NOT EXISTS password_hash TEXT;
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS customer_sessions (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      token TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      booking_code TEXT NOT NULL UNIQUE,
      customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      sanity_tour_id TEXT,
      tour_title TEXT NOT NULL,
      departure_date TEXT NOT NULL,
      travellers_count INTEGER NOT NULL DEFAULT 1,
      price_per_traveller INTEGER NOT NULL,
      discount INTEGER NOT NULL DEFAULT 0,
      total_amount INTEGER NOT NULL,
      paid_amount INTEGER NOT NULL DEFAULT 0,
      outstanding_amount INTEGER NOT NULL,
      payment_status TEXT NOT NULL DEFAULT 'Unpaid',
      booking_status TEXT NOT NULL DEFAULT 'Confirmed',
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS travellers (
      id TEXT PRIMARY KEY,
      booking_id TEXT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      customer_id TEXT REFERENCES customers(id),
      full_name TEXT NOT NULL,
      dob TEXT,
      gender TEXT,
      mobile TEXT,
      emergency_contact TEXT,
      id_document_type TEXT,
      id_number_masked TEXT,
      id_document_status TEXT NOT NULL DEFAULT 'Pending',
      id_document_path TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      booking_id TEXT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      amount INTEGER NOT NULL,
      payment_method TEXT NOT NULL DEFAULT 'UPI',
      payment_date TEXT NOT NULL,
      reference_number TEXT,
      notes TEXT,
      recorded_by TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      customer_id TEXT REFERENCES customers(id),
      booking_id TEXT REFERENCES bookings(id),
      traveller_id TEXT REFERENCES travellers(id),
      document_type TEXT NOT NULL,
      document_name TEXT NOT NULL,
      file_path TEXT,
      status TEXT NOT NULL DEFAULT 'Pending',
      verified_by TEXT,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'info',
      recipient_id TEXT,
      is_read BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY,
      actor_email TEXT NOT NULL,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      metadata TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `;

  console.log("✅ Neon PostgreSQL DDL migration complete!");
}
