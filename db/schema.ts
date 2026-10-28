import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const adminRoleEnum = pgEnum("admin_role", [
  "SUPER_ADMIN",
  "OPERATIONS",
  "ACCOUNTS",
  "STAFF",
]);

export const leadStatusEnum = pgEnum("lead_status", [
  "New",
  "Contacted",
  "Interested",
  "Follow-up",
  "Booking Pending",
  "Converted",
  "Lost",
]);

export const leadSourceEnum = pgEnum("lead_source", [
  "Instagram",
  "Facebook",
  "WhatsApp",
  "Website",
  "Referral",
  "Google",
  "Other",
]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "Booking Requested",
  "Pending Confirmation",
  "Confirmed",
  "Completed",
  "Cancelled",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "Unpaid",
  "Partially Paid",
  "Paid",
  "Refunded",
]);

export const documentStatusEnum = pgEnum("document_status", [
  "Pending",
  "Uploaded",
  "Under Review",
  "Verified",
  "Rejected",
]);

// 1. Admin Users
export const adminUsers = pgTable("admin_users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("SUPER_ADMIN"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. Admin Sessions
export const adminSessions = pgTable("admin_sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => adminUsers.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 3. Leads
export const leads = pgTable("leads", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  mobile: text("mobile").notNull(),
  email: text("email"),
  interestedTourSanityId: text("interested_tour_sanity_id"),
  interestedTourTitle: text("interested_tour_title").notNull(),
  source: text("source").notNull().default("Website"),
  travellersCount: integer("travellers_count").notNull().default(1),
  status: text("status").notNull().default("New"),
  assignedTo: text("assigned_to"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 4. Lead Followups
export const leadFollowups = pgTable("lead_followups", {
  id: text("id").primaryKey(),
  leadId: text("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  note: text("note").notNull(),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 5. Customers
export const customers = pgTable("customers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  passwordHash: text("password_hash"),
  // New sign-ups must confirm their email with a code before they can sign in
  emailVerified: boolean("email_verified").notNull().default(false),
  status: text("status").notNull().default("Active"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 6. Customer Sessions
export const customerSessions = pgTable("customer_sessions", {
  id: text("id").primaryKey(),
  customerId: text("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 6b. Customer Password Resets
export const customerPasswordResets = pgTable("customer_password_resets", {
  id: text("id").primaryKey(),
  customerId: text("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  code: text("code").notNull(),
  attempts: integer("attempts").notNull().default(0),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 7. Bookings
export const bookings = pgTable("bookings", {
  id: text("id").primaryKey(),
  bookingCode: text("booking_code").notNull().unique(),
  customerId: text("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
  sanityTourId: text("sanity_tour_id"),
  tourTitle: text("tour_title").notNull(),
  departureDate: text("departure_date").notNull(),
  travellersCount: integer("travellers_count").notNull().default(1),
  pricePerTraveller: integer("price_per_traveller").notNull(),
  discount: integer("discount").notNull().default(0),
  totalAmount: integer("total_amount").notNull(),
  paidAmount: integer("paid_amount").notNull().default(0),
  outstandingAmount: integer("outstanding_amount").notNull(),
  paymentStatus: text("payment_status").notNull().default("Unpaid"),
  bookingStatus: text("booking_status").notNull().default("Confirmed"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 8. Travellers
export const travellers = pgTable("travellers", {
  id: text("id").primaryKey(),
  bookingId: text("booking_id").notNull().references(() => bookings.id, { onDelete: "cascade" }),
  customerId: text("customer_id").references(() => customers.id),
  fullName: text("full_name").notNull(),
  dob: text("dob"),
  gender: text("gender"),
  mobile: text("mobile"),
  emergencyContact: text("emergency_contact"),
  idDocumentType: text("id_document_type"),
  idNumberMasked: text("id_number_masked"),
  idDocumentStatus: text("id_document_status").notNull().default("Pending"),
  idDocumentPath: text("id_document_path"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 9. Payments
export const payments = pgTable("payments", {
  id: text("id").primaryKey(),
  bookingId: text("booking_id").notNull().references(() => bookings.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  paymentMethod: text("payment_method").notNull().default("UPI"), // Cash, UPI, Bank Transfer, Other
  paymentDate: text("payment_date").notNull(),
  referenceNumber: text("reference_number"),
  notes: text("notes"),
  recordedBy: text("recorded_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 10. Documents
export const documents = pgTable("documents", {
  id: text("id").primaryKey(),
  customerId: text("customer_id").references(() => customers.id),
  bookingId: text("booking_id").references(() => bookings.id),
  travellerId: text("traveller_id").references(() => travellers.id),
  documentType: text("document_type").notNull(), // Aadhaar, Passport, Voter ID
  documentName: text("document_name").notNull(),
  filePath: text("file_path"),
  status: text("status").notNull().default("Pending"), // Pending, Uploaded, Under Review, Verified, Rejected
  verifiedBy: text("verified_by"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 10b. Uploaded document files (kept apart from documents so list queries stay light)
export const documentFiles = pgTable("document_files", {
  documentId: text("document_id")
    .primaryKey()
    .references(() => documents.id, { onDelete: "cascade" }),
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  dataBase64: text("data_base64").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 11. Notifications
export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("info"), // info, warning, success
  recipientId: text("recipient_id"),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 12. Activity Logs
export const activityLogs = pgTable("activity_logs", {
  id: text("id").primaryKey(),
  actorEmail: text("actor_email").notNull(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 13. Tour Reviews
export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  tourSlug: text("tour_slug").notNull(),
  tourTitle: text("tour_title").notNull(),
  userName: text("user_name").notNull(),
  userEmail: text("user_email"),
  rating: integer("rating").notNull().default(5),
  title: text("title"),
  comment: text("comment").notNull(),
  location: text("location"),
  tripDate: text("trip_date"),
  isApproved: boolean("is_approved").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Six-digit codes emailed to confirm a new account's email address. Codes are SHA-256 hashed.
export const customerEmailVerifications = pgTable("customer_email_verifications", {
  id: text("id").primaryKey(),
  customerId: text("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
  code: text("code").notNull(),
  attempts: integer("attempts").notNull().default(0),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Login / password-reset rate limiting (see lib/rateLimit.ts). Keys are SHA-256 hashes.
export const rateLimits = pgTable("rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull().default(0),
  windowStart: timestamp("window_start").defaultNow().notNull(),
});

// 14. Cookie consent log (DPDP proof of consent). Append-only: every choice is a new row.
export const consentRecords = pgTable("consent_records", {
  id: text("id").primaryKey(),
  consentId: text("consent_id").notNull(), // random ID kept in the visitor's consent cookie
  customerId: text("customer_id"), // set when the visitor was signed in to the portal
  noticeVersion: text("notice_version").notNull(),
  language: text("language").notNull(),
  action: text("action").notNull(), // accept_all, reject_all, custom
  analytics: boolean("analytics").notNull(),
  marketing: boolean("marketing").notNull(),
  ipHash: text("ip_hash"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 15. First-party analytics page views. Only recorded with analytics consent; erased on withdrawal.
export const analyticsEvents = pgTable("analytics_events", {
  id: text("id").primaryKey(),
  visitorId: text("visitor_id").notNull(),
  sessionId: text("session_id").notNull(),
  path: text("path").notNull(),
  referrerHost: text("referrer_host"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  deviceType: text("device_type"),
  browser: text("browser"),
  os: text("os"),
  country: text("country"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
