"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface PaymentRecord {
  id: string;
  bookingId: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  referenceNumber?: string;
  notes?: string;
  recordedBy: string;
  createdAt: string;
}

export default function PaymentsPage() {
  const [paymentsList, setPaymentsList] = useState<PaymentRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPayments() {
      try {
        const res = await fetch("/api/admin/payments");
        if (res.ok) {
          const data = await res.json();
          setPaymentsList(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, []);

  const filtered = paymentsList.filter(
    (p) =>
      p.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.referenceNumber && p.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCollected = paymentsList.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#685752] font-serif-italic">
            Payment Ledger
          </h1>
          <p className="text-xs text-[#997C70] mt-1">
            Manual payment transaction records (UPI, Cash, Bank Transfer).
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#E8DCD5] shadow-xs flex items-center gap-4 text-xs">
          <span className="text-[#997C70] uppercase font-semibold">Total Collected</span>
          <span className="text-xl font-bold text-emerald-700">₹{totalCollected.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="p-4 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#9A938C]" />
          <input
            type="text"
            placeholder="Search booking ID, reference number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-[#FDF7F4] border border-[#E8DCD5] text-xs text-[#685752] placeholder-[#9A938C] focus:outline-none focus:border-[#8EB486]"
          />
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs">
        {loading ? (
          <div className="py-12 text-center text-xs text-[#997C70]">Loading payment records...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#997C70]">No payment records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8DCD5] text-[#997C70] uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Payment ID</th>
                  <th className="pb-3 font-semibold">Booking ID</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Method</th>
                  <th className="pb-3 font-semibold">Reference</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Recorded By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DCD5]">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FDF7F4] transition-colors">
                    <td className="py-3.5 font-bold text-[#685752]">{p.id}</td>
                    <td className="py-3.5 text-[#8EB486] font-semibold">{p.bookingId}</td>
                    <td className="py-3.5 font-bold text-emerald-700">₹{p.amount.toLocaleString("en-IN")}</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#FDF7F4] text-[#685752] text-[10px] font-semibold border border-[#E8DCD5]">
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 text-[#666059]">{p.referenceNumber || "N/A"}</td>
                    <td className="py-3.5 text-[#997C70]">{p.paymentDate}</td>
                    <td className="py-3.5 text-[#666059]">{p.recordedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
