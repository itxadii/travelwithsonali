import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, ne } from "drizzle-orm";
import { db } from "@/db";
import { activityLogs } from "@/db/schema";
import { getCurrentAdmin } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

const ACTION_LABELS: Record<string, string> = {
  CREATE_LEAD: "New enquiry",
  UPDATE_LEAD: "Enquiry updated",
  AUTO_CONVERT_CUSTOMER: "Enquiry converted to customer",
  CREATE_CUSTOMER: "Customer added",
  CREATE_BOOKING: "Booking created",
  UPDATE_BOOKING_STATUS: "Booking status changed",
  ADD_PAYMENT: "Payment recorded",
  ADD_TRAVELLER: "Traveller added",
  DELETE_REVIEW: "Review deleted",
  CHANGE_PASSWORD: "Admin password changed",
};

const ENTITY_LINKS: Record<string, string> = {
  LEAD: "/admin/leads",
  CUSTOMER: "/admin/customers",
  BOOKING: "/admin/bookings",
};

/** Real operational activity from the activity log, newest first. */
export default async function NotificationsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const events = await db
    .select()
    .from(activityLogs)
    .where(ne(activityLogs.action, "ADMIN_SEED"))
    .orderBy(desc(activityLogs.createdAt))
    .limit(100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#685752] font-serif-italic">Activity</h1>
        <p className="text-sm text-[#7A6862] mt-1">New enquiries, bookings, payments and other changes, newest first.</p>
      </div>

      <div className="rounded-3xl bg-white border border-[#E8DCD5] shadow-xs">
        {events.length === 0 ? (
          <p className="p-6 text-sm text-[#7A6862]">Nothing yet. New enquiries and bookings will show up here.</p>
        ) : (
          <ul className="divide-y divide-[#E8DCD5]">
            {events.map((event) => {
              const href = ENTITY_LINKS[event.entityType] && event.entityId ? `${ENTITY_LINKS[event.entityType]}/${event.entityId}` : null;
              const label = ACTION_LABELS[event.action] ?? event.action.replace(/_/g, " ").toLowerCase();
              return (
                <li key={event.id} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-5 py-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#685752]">
                      {href ? (
                        <Link href={href} className="hover:text-[#4A7244] hover:underline underline-offset-4">
                          {label}
                        </Link>
                      ) : (
                        label
                      )}
                    </p>
                    <p className="text-sm text-[#7A6862] break-words">By {event.actorEmail}</p>
                  </div>
                  <time dateTime={event.createdAt.toISOString()} className="text-sm text-[#7A6862] whitespace-nowrap">
                    {event.createdAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })}
                  </time>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
