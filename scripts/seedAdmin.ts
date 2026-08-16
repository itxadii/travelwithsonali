import { createTablesIfNotExist } from "./initTables";
import { db } from "../db";
import {
  adminUsers,
  leads,
  customers,
  bookings,
  travellers,
  payments,
  documents,
  activityLogs,
  notifications,
} from "../db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function seedAdmin() {
  console.log("🌱 Seeding Neon PostgreSQL admin database...");

  // 1. DDL creation
  await createTablesIfNotExist();

  const email = process.env.ADMIN_EMAIL || "admin@travelwithsonali.com";
  const password = process.env.ADMIN_PASSWORD || "SonaliAdmin2026!";

  const passwordHash = await bcrypt.hash(password, 10);
  const customerPasswordHash = await bcrypt.hash("Customer123!", 10);

  // Check existing admin
  const existingAdmin = await db.select().from(adminUsers).where(eq(adminUsers.email, email));

  if (existingAdmin.length === 0) {
    await db.insert(adminUsers).values({
      id: "admin-1",
      email,
      passwordHash,
      name: "Sonali Sharma",
      role: "SUPER_ADMIN",
    });
    console.log(`✅ Admin user created: ${email}`);
  } else {
    // Update password hash if exists
    await db.update(adminUsers).set({ passwordHash }).where(eq(adminUsers.email, email));
    console.log(`✅ Admin user updated: ${email}`);
  }

  // Seed Initial Operational Sample Data if empty
  const existingLeads = await db.select().from(leads);
  if (existingLeads.length === 0) {
    console.log("📦 Populating initial operational sample data...");

    // Sample Lead
    const leadId = "lead-101";
    await db.insert(leads).values({
      id: leadId,
      name: "Rahul Verma",
      mobile: "+91 98765 43210",
      email: "rahul.verma@example.com",
      interestedTourSanityId: "manali-kasol",
      interestedTourTitle: "Manali & Kasol Group Trip",
      source: "Instagram",
      travellersCount: 2,
      status: "Converted",
      assignedTo: "Sonali Sharma",
      notes: "Interested in September batch, preferred sleeper Volvo.",
    });

    // Sample Customer
    const customerId = "cust-201";
    await db.insert(customers).values({
      id: customerId,
      name: "Rahul Verma",
      phone: "+91 98765 43210",
      email: "rahul.verma@example.com",
      passwordHash: customerPasswordHash,
      status: "Active",
      notes: "Frequent mountain traveler.",
    });

    // Sample Booking
    const bookingId = "book-301";
    await db.insert(bookings).values({
      id: bookingId,
      bookingCode: "TWS-2026-881",
      customerId,
      sanityTourId: "manali-kasol",
      tourTitle: "Manali & Kasol Group Trip",
      departureDate: "15 September 2026",
      travellersCount: 2,
      pricePerTraveller: 11999,
      discount: 1000,
      totalAmount: 22998,
      paidAmount: 10000,
      outstandingAmount: 12998,
      paymentStatus: "Partially Paid",
      bookingStatus: "Confirmed",
      notes: "Paid advance ₹10,000 via UPI.",
    });

    // Sample Travellers
    const trav1Id = "trav-401";
    await db.insert(travellers).values({
      id: trav1Id,
      bookingId,
      customerId,
      fullName: "Rahul Verma",
      dob: "1994-08-15",
      gender: "Male",
      mobile: "+91 98765 43210",
      emergencyContact: "+91 98765 00000",
      idDocumentType: "Aadhaar",
      idNumberMasked: "XXXX XXXX 8821",
      idDocumentStatus: "Verified",
    });

    const trav2Id = "trav-402";
    await db.insert(travellers).values({
      id: trav2Id,
      bookingId,
      customerId,
      fullName: "Priya Sharma",
      dob: "1996-03-22",
      gender: "Female",
      mobile: "+91 98765 43211",
      emergencyContact: "+91 98765 00000",
      idDocumentType: "Aadhaar",
      idNumberMasked: "XXXX XXXX 4190",
      idDocumentStatus: "Verified",
    });

    // Sample Payment
    await db.insert(payments).values({
      id: "pay-501",
      bookingId,
      amount: 10000,
      paymentMethod: "UPI",
      paymentDate: "2026-08-16",
      referenceNumber: "UPI/628190281/TWS",
      notes: "Advance booking payment received.",
      recordedBy: email,
    });

    // Sample Document Metadata
    await db.insert(documents).values({
      id: "doc-601",
      customerId,
      bookingId,
      travellerId: trav1Id,
      documentType: "Aadhaar",
      documentName: "Aadhaar_Rahul_Verma.pdf",
      filePath: "/uploads/private/aadhaar_rahul.pdf",
      status: "Verified",
      verifiedBy: email,
      notes: "Aadhaar card verified.",
    });

    // Sample Notification
    await db.insert(notifications).values({
      id: "notif-101",
      title: "Booking Confirmed 🎉",
      message: "Your Manali & Kasol Group Trip (TWS-2026-881) starting 15 September 2026 is confirmed!",
      type: "success",
      recipientId: customerId,
      isRead: false,
    });

    // Activity Log
    await db.insert(activityLogs).values({
      id: "log-701",
      actorEmail: email,
      action: "ADMIN_SEED",
      entityType: "SYSTEM",
      entityId: "system-init",
      metadata: JSON.stringify({ message: "Initial database seed completed." }),
    });

    console.log("✅ Initial operational database populated successfully!");
  } else {
    // Update existing customer password hash if empty
    const custs = await db.select().from(customers);
    for (const c of custs) {
      if (!c.passwordHash) {
        await db.update(customers).set({ passwordHash: customerPasswordHash }).where(eq(customers.id, c.id));
      }
    }
  }

  console.log("\n🎉 Database setup complete!");
}

seedAdmin().catch((err) => {
  console.error("❌ Seed error:", err);
  process.exit(1);
});
