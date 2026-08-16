import React, { use } from "react";
import { Users, CalendarCheck } from "lucide-react";
import { db } from "@/db";
import { bookings, leads } from "@/db/schema";
import { TOURS_DATA } from "@/app/data/toursData";

export default function ReportsPage() {
  const allBookings = use(db.select().from(bookings));
  const allLeads = use(db.select().from(leads));

  const totalBookingValue = allBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalCollected = allBookings.reduce((sum, b) => sum + b.paidAmount, 0);
  const totalOutstanding = allBookings.reduce((sum, b) => sum + b.outstandingAmount, 0);

  // Group leads by source
  const sourceCounts: Record<string, number> = {};
  allLeads.forEach((l) => {
    sourceCounts[l.source] = (sourceCounts[l.source] || 0) + 1;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1917] font-serif-italic">
          Operational Reports & Analytics
        </h1>
        <p className="text-xs text-[#7A746E] mt-1">
          Revenue, lead conversion sources, and tour performance metrics.
        </p>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs">
          <span className="text-xs uppercase text-[#7A746E] font-semibold">Total Revenue Agreed</span>
          <p className="text-3xl font-bold text-[#1C1917] mt-2">₹{totalBookingValue.toLocaleString("en-IN")}</p>
        </div>
        <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs">
          <span className="text-xs uppercase text-[#7A746E] font-semibold">Total Cash Collected</span>
          <p className="text-3xl font-bold text-emerald-700 mt-2">₹{totalCollected.toLocaleString("en-IN")}</p>
        </div>
        <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs">
          <span className="text-xs uppercase text-[#7A746E] font-semibold">Outstanding Receivables</span>
          <p className="text-3xl font-bold text-amber-700 mt-2">₹{totalOutstanding.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* Lead Sources & Tour Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lead Sources */}
        <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#1C1917] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#E05328]" />
            Leads by Acquisition Source
          </h3>

          <div className="space-y-3 text-xs">
            {Object.entries(sourceCounts).map(([source, count]) => (
              <div key={source} className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EBE5DF]">
                <span className="font-semibold text-[#1C1917]">{source}</span>
                <span className="px-3 py-1 rounded-full bg-[#E05328]/10 text-[#E05328] font-bold">{count} Lead(s)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sanity Tour Performance */}
        <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#1C1917] flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
            Popular Tour Package Demand
          </h3>

          <div className="space-y-3 text-xs">
            {TOURS_DATA.slice(0, 5).map((t) => {
              const bCount = allBookings.filter((b) => b.tourTitle === t.title).length;
              return (
                <div key={t.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EBE5DF]">
                  <span className="font-semibold text-[#1C1917] truncate max-w-[220px]">{t.title}</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    {bCount} Booking(s)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
