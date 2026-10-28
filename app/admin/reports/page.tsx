import React from "react";
import { Users, CalendarCheck } from "lucide-react";
import { db } from "@/db";
import { requireAdmin } from "@/lib/admin/auth";
import { bookings, leads } from "@/db/schema";

export default async function ReportsPage() {
  await requireAdmin();

  const [allBookings, allLeads] = await Promise.all([db.select().from(bookings), db.select().from(leads)]);

  const totalBookingValue = allBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalCollected = allBookings.reduce((sum, b) => sum + b.paidAmount, 0);
  const totalOutstanding = allBookings.reduce((sum, b) => sum + b.outstandingAmount, 0);

  // Group leads by source
  const sourceCounts: Record<string, number> = {};
  allLeads.forEach((l) => {
    sourceCounts[l.source] = (sourceCounts[l.source] || 0) + 1;
  });

  // Demand per tour from real bookings and enquiries, most booked first
  const tourDemand = new Map<string, { bookings: number; leads: number }>();
  allBookings.forEach((b) => {
    const row = tourDemand.get(b.tourTitle) || { bookings: 0, leads: 0 };
    row.bookings += 1;
    tourDemand.set(b.tourTitle, row);
  });
  allLeads.forEach((l) => {
    const row = tourDemand.get(l.interestedTourTitle) || { bookings: 0, leads: 0 };
    row.leads += 1;
    tourDemand.set(l.interestedTourTitle, row);
  });
  const topTours = [...tourDemand.entries()]
    .sort((a, b) => b[1].bookings - a[1].bookings || b[1].leads - a[1].leads)
    .slice(0, 8);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#685752] font-serif-italic">
          Operational Reports & Analytics
        </h1>
        <p className="text-xs text-[#7A6862] mt-1">
          Revenue, lead conversion sources, and tour performance metrics.
        </p>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs">
          <span className="text-xs uppercase text-[#7A6862] font-semibold">Total Revenue Agreed</span>
          <p className="text-3xl font-bold text-[#685752] mt-2">₹{totalBookingValue.toLocaleString("en-IN")}</p>
        </div>
        <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs">
          <span className="text-xs uppercase text-[#7A6862] font-semibold">Total Cash Collected</span>
          <p className="text-3xl font-bold text-emerald-700 mt-2">₹{totalCollected.toLocaleString("en-IN")}</p>
        </div>
        <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs">
          <span className="text-xs uppercase text-[#7A6862] font-semibold">Outstanding Receivables</span>
          <p className="text-3xl font-bold text-amber-700 mt-2">₹{totalOutstanding.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* Lead Sources & Tour Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lead Sources */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#685752] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#4A7244]" />
            Leads by Acquisition Source
          </h3>

          <div className="space-y-3 text-xs">
            {Object.keys(sourceCounts).length === 0 && <p className="text-[#7A6862]">No leads yet.</p>}
            {Object.entries(sourceCounts).map(([source, count]) => (
              <div key={source} className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FDF7F4] border border-[#E8DCD5]">
                <span className="font-semibold text-[#685752]">{source}</span>
                <span className="px-3 py-1 rounded-full bg-[#8EB486]/10 text-[#4A7244] font-bold">{count} Lead(s)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sanity Tour Performance */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#685752] flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
            Tour Demand
          </h3>

          <div className="space-y-3 text-xs">
            {topTours.length === 0 && <p className="text-[#7A6862]">No bookings or enquiries yet.</p>}
            {topTours.map(([title, counts]) => (
              <div key={title} className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#FDF7F4] border border-[#E8DCD5]">
                <span className="font-semibold text-[#685752] truncate min-w-0">{title}</span>
                <span className="flex shrink-0 gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">{counts.bookings} Booking(s)</span>
                  <span className="px-3 py-1 rounded-full bg-[#8EB486]/10 text-[#4A7244] font-bold">{counts.leads} Lead(s)</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
