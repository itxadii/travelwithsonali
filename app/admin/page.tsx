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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#685752] font-serif-italic">
            Operations Dashboard
          </h1>
          <p className="text-xs text-[#997C70] mt-1">
            Real-time overview of leads, bookings, customer profiles, and manual payments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#8EB486] hover:bg-[#7A9F73] text-white text-xs font-semibold shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Lead</span>
          </Link>
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#E8DCD5] hover:border-[#685752] text-[#685752] text-xs font-semibold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Booking</span>
          </Link>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Leads */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#997C70]">
              Total Leads
            </span>
            <div className="w-9 h-9 rounded-2xl bg-[#8EB486]/10 text-[#8EB486] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-[#685752]">{totalLeadsCount}</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
              {newLeadsCount} New
            </span>
          </div>
          <p className="text-[11px] text-[#997C70]">Enquiries across Instagram, Website & WhatsApp</p>
        </div>

        {/* Card 2: Registered Customers */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#997C70]">
              Customers
            </span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-[#685752]">{totalCustomersCount}</span>
            <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
              Active Profiles
            </span>
          </div>
          <p className="text-[11px] text-[#997C70]">Verified customer profiles & travel history</p>
        </div>

        {/* Card 3: Active Bookings */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#997C70]">
              Active Bookings
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-[#685752]">{activeBookingsCount}</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
              Confirmed
            </span>
          </div>
          <p className="text-[11px] text-[#997C70]">Upcoming group trip departures</p>
        </div>

        {/* Card 4: Outstanding Payments */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#997C70]">
              Outstanding
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-[#685752]">₹{totalOutstanding.toLocaleString("en-IN")}</span>
            <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
              Pending
            </span>
          </div>
          <p className="text-[11px] text-[#997C70]">Total balance due from partial bookings</p>
        </div>
      </div>

      {/* Payment Summary Financial Bar */}
      <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DCD5] pb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#8EB486]" />
            <h3 className="text-lg font-bold text-[#685752]">Commercial Payment Summary</h3>
          </div>
          <span className="text-xs text-[#997C70]">Manually Recorded Financial Ledger</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div>
            <span className="text-xs text-[#997C70] uppercase font-semibold">Total Booking Value</span>
            <p className="text-2xl font-bold text-[#685752] mt-1">₹{totalBookingValue.toLocaleString("en-IN")}</p>
          </div>
          <div>
            <span className="text-xs text-[#997C70] uppercase font-semibold">Total Collected</span>
            <p className="text-2xl font-bold text-emerald-700 mt-1">₹{totalCollected.toLocaleString("en-IN")}</p>
          </div>
          <div>
            <span className="text-xs text-[#997C70] uppercase font-semibold">Outstanding Balance</span>
            <p className="text-2xl font-bold text-amber-700 mt-1">₹{totalOutstanding.toLocaleString("en-IN")}</p>
          </div>
        </div>
      </div>

      {/* Grid of Tables: Recent Leads & Upcoming Trips */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Leads */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#685752]">Recent Leads</h3>
              <p className="text-xs text-[#997C70]">Latest enquiries requiring follow-up</p>
            </div>
            <Link
              href="/admin/leads"
              className="text-xs font-semibold text-[#8EB486] hover:underline flex items-center gap-1"
            >
              View All Leads →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8DCD5] text-[#997C70] uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Mobile</th>
                  <th className="pb-3 font-semibold">Interested Tour</th>
                  <th className="pb-3 font-semibold">Source</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DCD5]">
                {allLeads.slice(0, 5).map((l) => (
                  <tr key={l.id} className="hover:bg-[#FDF7F4] transition-colors">
                    <td className="py-3.5 font-bold text-[#685752]">{l.name}</td>
                    <td className="py-3.5 text-[#666059]">{l.mobile}</td>
                    <td className="py-3.5 text-[#685752] max-w-[160px] truncate">{l.interestedTourTitle}</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FDF7F4] border border-[#E8DCD5] text-[10px] text-[#666059]">
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
                        className="p-1.5 rounded-lg bg-[#FDF7F4] text-[#666059] hover:text-[#685752] border border-[#E8DCD5] inline-block"
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
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#685752]">Recent Activity</h3>
            <span className="text-[10px] text-[#997C70]">Audit Trail</span>
          </div>

          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-2xl bg-[#FDF7F4] border border-[#E8DCD5] space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-[#8EB486]">{log.action}</span>
                  <span className="text-[#997C70]">{new Date(log.createdAt).toLocaleDateString("en-IN")}</span>
                </div>
                <p className="text-xs text-[#685752] font-medium">{log.actorEmail}</p>
                <p className="text-[11px] text-[#666059] truncate">{log.metadata || log.entityId}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
