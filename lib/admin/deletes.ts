import { db } from "@/db";
import {
  activityLogs,
  bookings,
  customers,
  documents,
  leads,
  payments,
  travellers,
} from "@/db/schema";
import { eq, inArray, or, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";

/**
 * Permanent deletes for admin records. Each runs as one batch (a single transaction), in the
 * order foreign keys need: documents (and their files) before travellers and bookings, and
 * travellers' links to a customer cleared before that customer goes.
 */

type DeleteResult = { success: true; summary: Record<string, number> } | { success: false; status: number; error: string };

function log(actorEmail: string, action: string, entityType: string, entityId: string, metadata: Record<string, unknown>) {
  return db.insert(activityLogs).values({
    id: `log-${randomUUID()}`,
    actorEmail,
    action,
    entityType,
    entityId,
    metadata: JSON.stringify(metadata),
  });
}

export async function deleteLead(id: string, actorEmail: string): Promise<DeleteResult> {
  const lead = (await db.select().from(leads).where(eq(leads.id, id)))[0];
  if (!lead) return { success: false, status: 404, error: "Lead not found." };

  // Follow-up notes go with it (ON DELETE CASCADE)
  await db.batch([
    db.delete(leads).where(eq(leads.id, id)),
    log(actorEmail, "DELETE_LEAD", "LEAD", id, { name: lead.name, mobile: lead.mobile, tour: lead.interestedTourTitle }),
  ]);
  return { success: true, summary: { leads: 1 } };
}

/** What deleting these bookings would also remove (shown in the confirmation). */
async function bookingChildren(bookingIds: string[]) {
  if (bookingIds.length === 0) return { travellerIds: [] as string[], travellers: 0, payments: 0, documents: 0 };
  const travellerRows = await db.select({ id: travellers.id }).from(travellers).where(inArray(travellers.bookingId, bookingIds));
  const travellerIds = travellerRows.map((t) => t.id);
  const [{ count: paymentCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(payments)
    .where(inArray(payments.bookingId, bookingIds));
  const docCondition = travellerIds.length
    ? or(inArray(documents.bookingId, bookingIds), inArray(documents.travellerId, travellerIds))
    : inArray(documents.bookingId, bookingIds);
  const [{ count: docCount }] = await db.select({ count: sql<number>`count(*)::int` }).from(documents).where(docCondition);
  return { travellerIds, travellers: travellerIds.length, payments: paymentCount, documents: docCount };
}

export async function deleteBooking(id: string, actorEmail: string): Promise<DeleteResult> {
  const booking = (await db.select().from(bookings).where(eq(bookings.id, id)))[0];
  if (!booking) return { success: false, status: 404, error: "Booking not found." };

  const children = await bookingChildren([id]);
  const docCondition = children.travellerIds.length
    ? or(eq(documents.bookingId, id), inArray(documents.travellerId, children.travellerIds))
    : eq(documents.bookingId, id);

  await db.batch([
    db.delete(documents).where(docCondition), // stored files cascade
    db.delete(travellers).where(eq(travellers.bookingId, id)),
    db.delete(payments).where(eq(payments.bookingId, id)),
    db.delete(bookings).where(eq(bookings.id, id)),
    log(actorEmail, "DELETE_BOOKING", "BOOKING", id, {
      bookingCode: booking.bookingCode,
      tourTitle: booking.tourTitle,
      travellers: children.travellers,
      payments: children.payments,
      documents: children.documents,
    }),
  ]);
  return { success: true, summary: { bookings: 1, travellers: children.travellers, payments: children.payments, documents: children.documents } };
}

export async function deleteCustomer(id: string, actorEmail: string): Promise<DeleteResult> {
  const customer = (await db.select().from(customers).where(eq(customers.id, id)))[0];
  if (!customer) return { success: false, status: 404, error: "Customer not found." };

  const bookingIds = (await db.select({ id: bookings.id }).from(bookings).where(eq(bookings.customerId, id))).map((b) => b.id);
  const children = await bookingChildren(bookingIds);

  const docConditions = [eq(documents.customerId, id)];
  if (bookingIds.length) docConditions.push(inArray(documents.bookingId, bookingIds));
  if (children.travellerIds.length) docConditions.push(inArray(documents.travellerId, children.travellerIds));

  await db.batch([
    db.delete(documents).where(or(...docConditions)),
    // Travellers on this customer's own bookings go; on other people's bookings they stay, unlinked
    ...(bookingIds.length ? [db.delete(travellers).where(inArray(travellers.bookingId, bookingIds))] : []),
    db.update(travellers).set({ customerId: null }).where(eq(travellers.customerId, id)),
    ...(bookingIds.length ? [db.delete(payments).where(inArray(payments.bookingId, bookingIds))] : []),
    // Bookings, sessions, reset and verification codes cascade from the customer
    db.delete(customers).where(eq(customers.id, id)),
    log(actorEmail, "DELETE_CUSTOMER", "CUSTOMER", id, {
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      bookings: bookingIds.length,
      payments: children.payments,
    }),
  ]);
  return {
    success: true,
    summary: { customers: 1, bookings: bookingIds.length, travellers: children.travellers, payments: children.payments },
  };
}

export async function deleteTraveller(id: string, actorEmail: string): Promise<DeleteResult> {
  const traveller = (await db.select().from(travellers).where(eq(travellers.id, id)))[0];
  if (!traveller) return { success: false, status: 404, error: "Traveller not found." };

  await db.batch([
    db.delete(documents).where(eq(documents.travellerId, id)),
    db.delete(travellers).where(eq(travellers.id, id)),
    log(actorEmail, "DELETE_TRAVELLER", "BOOKING", traveller.bookingId, { fullName: traveller.fullName, travellerId: id }),
  ]);
  return { success: true, summary: { travellers: 1 } };
}

/** Removes a payment and recalculates the booking's paid / balance / payment status. */
export async function deletePayment(id: string, actorEmail: string): Promise<DeleteResult> {
  const payment = (await db.select().from(payments).where(eq(payments.id, id)))[0];
  if (!payment) return { success: false, status: 404, error: "Payment not found." };
  const booking = (await db.select().from(bookings).where(eq(bookings.id, payment.bookingId)))[0];

  const logEntry = log(actorEmail, "DELETE_PAYMENT", "BOOKING", payment.bookingId, {
    amount: payment.amount,
    paymentMethod: payment.paymentMethod,
    referenceNumber: payment.referenceNumber,
  });

  if (!booking) {
    await db.batch([db.delete(payments).where(eq(payments.id, id)), logEntry]);
    return { success: true, summary: { payments: 1 } };
  }

  const paidAmount = Math.max(0, booking.paidAmount - payment.amount);
  const outstandingAmount = Math.max(0, booking.totalAmount - paidAmount);
  const paymentStatus =
    paidAmount >= booking.totalAmount && booking.totalAmount > 0 ? "Paid" : paidAmount > 0 ? "Partially Paid" : "Unpaid";

  await db.batch([
    db.delete(payments).where(eq(payments.id, id)),
    db.update(bookings).set({ paidAmount, outstandingAmount, paymentStatus, updatedAt: new Date() }).where(eq(bookings.id, booking.id)),
    logEntry,
  ]);
  return { success: true, summary: { payments: 1 } };
}

export async function deleteDocument(id: string, actorEmail: string): Promise<DeleteResult> {
  const doc = (await db.select().from(documents).where(eq(documents.id, id)))[0];
  if (!doc) return { success: false, status: 404, error: "Document not found." };

  await db.batch([
    db.delete(documents).where(eq(documents.id, id)),
    // If this was the traveller's ID, their status goes back to waiting for one
    ...(doc.travellerId
      ? [db.update(travellers).set({ idDocumentStatus: "Pending" }).where(eq(travellers.id, doc.travellerId))]
      : []),
    log(actorEmail, "DELETE_DOCUMENT", "DOCUMENT", id, { documentName: doc.documentName, customerId: doc.customerId }),
  ]);
  return { success: true, summary: { documents: 1 } };
}

/** Counts shown in the "are you sure" dialog before a customer or booking is deleted. */
export async function deletePreview(kind: "customer" | "booking", id: string) {
  if (kind === "booking") {
    const c = await bookingChildren([id]);
    return { travellers: c.travellers, payments: c.payments, documents: c.documents };
  }
  const bookingIds = (await db.select({ id: bookings.id }).from(bookings).where(eq(bookings.customerId, id))).map((b) => b.id);
  const c = await bookingChildren(bookingIds);
  const [{ count: ownDocs }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(documents)
    .where(eq(documents.customerId, id));
  return { bookings: bookingIds.length, travellers: c.travellers, payments: c.payments, documents: Math.max(ownDocs, c.documents) };
}
