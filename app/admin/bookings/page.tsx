"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, ArrowUpRight } from "lucide-react";
import { GooeyInput } from "@/components/ui/gooey-input";
import { TOURS_DATA } from "@/app/data/toursData";

interface BookingListItem {
  id: string;
  bookingCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  sanityTourId?: string;
  tourTitle: string;
  departureDate: string;
  travellersCount: number;
  pricePerTraveller: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  paymentStatus: string;
  bookingStatus: string;
  createdAt: string;
}

export default function BookingsPage() {
  const [bookingsList, setBookingsList] = useState<BookingListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // New Booking Form
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    tourTitle: TOURS_DATA[0].title,
    sanityTourId: TOURS_DATA[0].id,
    departureDate: "15 September 2026",
    travellersCount: 2,
    pricePerTraveller: TOURS_DATA[0].numericPrice,
    discount: 0,
    advancePayment: 5000,
    paymentMethod: "UPI",
    notes: "",
  });

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/bookings");
      if (res.ok) {
        const data = await res.json();
        setBookingsList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleTourChange = (title: string) => {
    const selected = TOURS_DATA.find((t) => t.title === title);
    if (selected) {
      setFormData({
        ...formData,
        tourTitle: selected.title,
        sanityTourId: selected.id,
        pricePerTraveller: selected.numericPrice,
      });
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setCreateModalOpen(false);
        fetchBookings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBookings = bookingsList.filter((b) => {
    const matchesSearch =
      b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tourTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || b.bookingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#685752] font-serif-italic">
            Bookings Ledger
          </h1>
          <p className="text-xs text-[#997C70] mt-1">
            Confirmed group trip reservations, commercial price snapshots & payment statuses.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8EB486] hover:bg-[#7A9F73] text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Booking</span>
        </button>
      </div>

      {/* Search & Status Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs">
        {/* Animated Search */}
        <div className="flex items-center w-full md:w-auto">
          <GooeyInput
            placeholder="Search booking code, customer, tour..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            collapsedWidth={130}
            expandedWidth={280}
            expandedOffset={48}
            classNames={{
              surface: "bg-[#685752] text-white shadow-md ring-1 ring-[#685752]/20 hover:bg-[#5a4a45]",
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase text-[#997C70] font-bold">Booking Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-full bg-[#FDF7F4] border border-[#E8DCD5] text-xs text-[#685752] focus:outline-none"
          >
            {["All", "Booking Requested", "Pending Confirmation", "Confirmed", "Completed", "Cancelled"].map(
              (st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs">
        {loading ? (
          <div className="py-12 text-center text-xs text-[#997C70]">Loading bookings...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#997C70]">No bookings found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8DCD5] text-[#997C70] uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Booking Code</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Tour</th>
                  <th className="pb-3 font-semibold">Departure</th>
                  <th className="pb-3 font-semibold">Travellers</th>
                  <th className="pb-3 font-semibold">Total Amount</th>
                  <th className="pb-3 font-semibold">Paid</th>
                  <th className="pb-3 font-semibold">Payment Status</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DCD5]">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#FDF7F4] transition-colors">
                    <td className="py-3.5 font-bold text-[#8EB486]">{b.bookingCode}</td>
                    <td className="py-3.5 text-[#685752] font-semibold">{b.customerName}</td>
                    <td className="py-3.5 text-[#685752] max-w-[180px] truncate">{b.tourTitle}</td>
                    <td className="py-3.5 text-[#666059]">{b.departureDate}</td>
                    <td className="py-3.5 text-[#685752] font-medium">{b.travellersCount}</td>
                    <td className="py-3.5 font-bold text-[#685752]">₹{b.totalAmount.toLocaleString("en-IN")}</td>
                    <td className="py-3.5 font-semibold text-emerald-700">₹{b.paidAmount.toLocaleString("en-IN")}</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          b.paymentStatus === "Paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : b.paymentStatus === "Partially Paid"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#FDF7F4] text-[#685752] text-[10px] font-semibold border border-[#E8DCD5]">
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="px-3 py-1.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] hover:bg-[#8EB486] hover:text-white hover:border-[#8EB486] text-[#685752] text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                      >
                        <span>Manage</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Booking Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 border border-[#E8DCD5] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#685752]">Create New Booking</h2>

            <form onSubmit={handleCreateBooking} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#997C70] font-semibold">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Rahul Verma"
                    className="w-full p-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] focus:outline-none focus:border-[#8EB486]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#997C70] font-semibold">Customer Phone *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] focus:outline-none focus:border-[#8EB486]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#997C70] font-semibold">Select Tour (from Sanity published list)</label>
                <select
                  value={formData.tourTitle}
                  onChange={(e) => handleTourChange(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] focus:outline-none focus:border-[#8EB486]"
                >
                  {TOURS_DATA.map((t) => (
                    <option key={t.id} value={t.title}>
                      {t.title} ({t.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[#997C70] font-semibold">Travellers</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.travellersCount}
                    onChange={(e) => setFormData({ ...formData, travellersCount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] focus:outline-none focus:border-[#8EB486]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#997C70] font-semibold">Price / Person (₹)</label>
                  <input
                    type="number"
                    value={formData.pricePerTraveller}
                    onChange={(e) => setFormData({ ...formData, pricePerTraveller: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] focus:outline-none focus:border-[#8EB486]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#997C70] font-semibold">Discount (₹)</label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] focus:outline-none focus:border-[#8EB486]"
                  />
                </div>
              </div>

              {/* Price Calculation Summary Box */}
              <div className="p-4 rounded-2xl bg-[#FDF7F4] border border-[#E8DCD5] space-y-1 text-xs">
                <div className="flex justify-between text-[#997C70]">
                  <span>Subtotal ({formData.travellersCount} x ₹{formData.pricePerTraveller}):</span>
                  <span className="text-[#685752] font-bold">₹{(formData.travellersCount * formData.pricePerTraveller).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-[#997C70]">
                  <span>Discount:</span>
                  <span className="text-rose-600 font-bold">- ₹{formData.discount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-[#685752] font-bold text-sm pt-2 border-t border-[#E8DCD5]">
                  <span>Agreed Booking Total:</span>
                  <span className="text-[#8EB486]">₹{Math.max(0, formData.travellersCount * formData.pricePerTraveller - formData.discount).toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#997C70] font-semibold">Advance Payment Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.advancePayment}
                    onChange={(e) => setFormData({ ...formData, advancePayment: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] focus:outline-none focus:border-[#8EB486]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#997C70] font-semibold">Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] focus:outline-none focus:border-[#8EB486]"
                  >
                    {["UPI", "Cash", "Bank Transfer", "Other"].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#997C70] font-semibold">Departure Date</label>
                <input
                  type="text"
                  value={formData.departureDate}
                  onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                  placeholder="15 September 2026"
                  className="w-full p-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] focus:outline-none focus:border-[#8EB486]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#8EB486] text-white font-semibold cursor-pointer shadow-sm"
                >
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
