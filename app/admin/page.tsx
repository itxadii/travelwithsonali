import React, { use } from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  CalendarCheck,
  CreditCard,
  ArrowUpRight,
  Plus,
  TrendingUp,
} from "lucide-react";
import { db } from "@/db";
import { leads, customers, bookings, activityLogs } from "@/db/schema";
import { desc } from "drizzle-orm";

export default function AdminDashboardPage() {
  const allLeads = use(db.select().from(leads).orderBy(desc(leads.createdAt)));
  const allCustomers = use(db.select().from(customers));
  const allBookings = use(db.select().from(bookings).orderBy(desc(bookings.createdAt)));
  const recentLogs = use(db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(6));

  const totalLeadsCount = allLeads.length;
  const newLeadsCount = allLeads.filter((l) => l.status === "New").length;
  const totalCustomersCount = allCustomers.length;
  const activeBookingsCount = allBookings.filter((b) => b.bookingStatus === "Confirmed").length;

  const totalBookingValue = allBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalCollected = allBookings.reduce((sum, b) => sum + b.paidAmount, 0);
  const totalOutstanding = allBookings.reduce((sum, b) => sum + b.outstandingAmount, 0);

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1917] font-serif-italic">
            Operations Dashboard
          </h1>
          <p className="text-xs text-[#7A746E] mt-1">
            Real-time overview of leads, bookings, customer profiles, and manual payments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#E05328] hover:bg-[#C8451D] text-white text-xs font-semibold shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Lead</span>
          </Link>
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#EBE5DF] hover:border-[#1C1917] text-[#1C1917] text-xs font-semibold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Booking</span>
          </Link>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Leads */}
        <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7A746E]">
              Total Leads
            </span>
            <div className="w-9 h-9 rounded-2xl bg-[#E05328]/10 text-[#E05328] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-[#1C1917]">{totalLeadsCount}</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
              {newLeadsCount} New
            </span>
          </div>
          <p className="text-[11px] text-[#7A746E]">Enquiries across Instagram, Website & WhatsApp</p>
        </div>

        {/* Card 2: Registered Customers */}
        <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7A746E]">
              Customers
            </span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-[#1C1917]">{totalCustomersCount}</span>
            <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
              Active Profiles
            </span>
          </div>
          <p className="text-[11px] text-[#7A746E]">Verified customer profiles & travel history</p>
        </div>

        {/* Card 3: Active Bookings */}
        <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7A746E]">
              Active Bookings
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-[#1C1917]">{activeBookingsCount}</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
              Confirmed
            </span>
          </div>
          <p className="text-[11px] text-[#7A746E]">Upcoming group trip departures</p>
        </div>

        {/* Card 4: Outstanding Payments */}
        <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7A746E]">
              Outstanding
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-[#1C1917]">₹{totalOutstanding.toLocaleString("en-IN")}</span>
            <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
              Pending
            </span>
          </div>
          <p className="text-[11px] text-[#7A746E]">Total balance due from partial bookings</p>
        </div>
      </div>

      {/* Payment Summary Financial Bar */}
      <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EBE5DF] pb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#E05328]" />
            <h3 className="text-lg font-bold text-[#1C1917]">Commercial Payment Summary</h3>
          </div>
          <span className="text-xs text-[#7A746E]">Manually Recorded Financial Ledger</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div>
            <span className="text-xs text-[#7A746E] uppercase font-semibold">Total Booking Value</span>
            <p className="text-2xl font-bold text-[#1C1917] mt-1">₹{totalBookingValue.toLocaleString("en-IN")}</p>
          </div>
          <div>
            <span className="text-xs text-[#7A746E] uppercase font-semibold">Total Collected</span>
            <p className="text-2xl font-bold text-emerald-700 mt-1">₹{totalCollected.toLocaleString("en-IN")}</p>
          </div>
          <div>
            <span className="text-xs text-[#7A746E] uppercase font-semibold">Outstanding Balance</span>
            <p className="text-2xl font-bold text-amber-700 mt-1">₹{totalOutstanding.toLocaleString("en-IN")}</p>
          </div>
        </div>
      </div>

      {/* Grid of Tables: Recent Leads & Upcoming Trips */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Leads */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#1C1917]">Recent Leads</h3>
              <p className="text-xs text-[#7A746E]">Latest enquiries requiring follow-up</p>
            </div>
            <Link
              href="/admin/leads"
              className="text-xs font-semibold text-[#E05328] hover:underline flex items-center gap-1"
            >
              View All Leads →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EBE5DF] text-[#7A746E] uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Mobile</th>
                  <th className="pb-3 font-semibold">Interested Tour</th>
                  <th className="pb-3 font-semibold">Source</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE5DF]">
                {allLeads.slice(0, 5).map((l) => (
                  <tr key={l.id} className="hover:bg-[#FAF6F0] transition-colors">
                    <td className="py-3.5 font-bold text-[#1C1917]">{l.name}</td>
                    <td className="py-3.5 text-[#666059]">{l.mobile}</td>
                    <td className="py-3.5 text-[#1C1917] max-w-[160px] truncate">{l.interestedTourTitle}</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FAF6F0] border border-[#EBE5DF] text-[10px] text-[#666059]">
                        {l.source}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                          l.status === "New"
                            ? "bg-blue-100 text-blue-800"
                            : l.status === "Converted"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        href={`/admin/leads/${l.id}`}
                        className="p-1.5 rounded-lg bg-[#FAF6F0] text-[#666059] hover:text-[#1C1917] border border-[#EBE5DF] inline-block"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1C1917]">Recent Activity</h3>
            <span className="text-[10px] text-[#7A746E]">Audit Trail</span>
          </div>

          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EBE5DF] space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-[#E05328]">{log.action}</span>
                  <span className="text-[#7A746E]">{new Date(log.createdAt).toLocaleDateString("en-IN")}</span>
                </div>
                <p className="text-xs text-[#1C1917] font-medium">{log.actorEmail}</p>
                <p className="text-[11px] text-[#666059] truncate">{log.metadata || log.entityId}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
