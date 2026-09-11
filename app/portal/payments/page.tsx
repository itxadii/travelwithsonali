"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, CheckCircle2, Clock } from "lucide-react";

interface PaymentSummary {
  total: number;
  paid: number;
  remaining: number;
  percentagePaid: number;
}

interface PaymentRecord {
  id: string;
  bookingCode: string;
  tourTitle: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  referenceNumber?: string;
}

export default function CustomerPaymentsPage() {
  const [summary, setSummary] = useState<PaymentSummary>({ total: 0, paid: 0, remaining: 0, percentagePaid: 0 });
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPayments() {
      try {
        const res = await fetch("/api/portal/payments");
        if (res.ok) {
          const json = await res.json();
          setSummary(json.summary);
          setPayments(json.payments);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#685752] font-serif-italic">
          Payment History & Status
        </h1>
        <p className="text-xs text-[#997C70] mt-1">
          Review your trip costs, recorded payment installments, and remaining balances.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-1">
          <span className="text-xs uppercase text-[#997C70] font-semibold">Total Trip Cost</span>
          <p className="text-2xl font-bold text-[#685752]">₹{summary.total.toLocaleString("en-IN")}</p>
        </div>
        <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-1">
          <span className="text-xs uppercase text-[#997C70] font-semibold">Paid Amount</span>
          <p className="text-2xl font-bold text-emerald-700">₹{summary.paid.toLocaleString("en-IN")}</p>
        </div>
        <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-1">
          <span className="text-xs uppercase text-[#997C70] font-semibold">Remaining Balance</span>
          <p className="text-2xl font-bold text-amber-700">₹{summary.remaining.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* Progress Bar & Important Note */}
      <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-[#685752]">Overall Payment Completion</span>
          <span className="text-[#8EB486]">{summary.percentagePaid}% Paid</span>
        </div>

        <div className="w-full h-2.5 rounded-full bg-[#FDF7F4] overflow-hidden border border-[#E8DCD5]">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${summary.percentagePaid}%` }}
          />
        </div>

        <p className="text-[11px] text-[#997C70] italic pt-1">
          ℹ️ Payment updates are recorded by our team upon receiving manual UPI, Cash, or Bank transfers. Online payment is not processed through this portal.
        </p>
      </div>

      {/* Payment History Table */}
      <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#685752] font-serif-italic">Payment Installment Ledger</h3>

        {loading ? (
          <div className="py-12 text-center text-xs text-[#997C70]">Loading payment records...</div>
        ) : payments.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#997C70]">No payment entries recorded yet.</div>
        ) : (
          <div className="space-y-3 text-xs">
            {payments.map((p) => (
              <div key={p.id} className="p-4 rounded-2xl bg-[#FDF7F4] border border-[#E8DCD5] flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-700 text-sm">₹{p.amount.toLocaleString("en-IN")}</span>
                  <span className="ml-2 text-[10px] uppercase font-bold text-[#685752] bg-white px-2 py-0.5 rounded-md border border-[#E8DCD5]">
                    {p.paymentMethod}
                  </span>
                  <p className="text-[#997C70] text-[11px] mt-1">Booking: {p.bookingCode} ({p.tourTitle})</p>
                  {p.referenceNumber && <p className="text-[#666059] text-[10px]">Ref: {p.referenceNumber}</p>}
                </div>

                <div className="text-right space-y-1">
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full block">
                    Confirmed
                  </span>
                  <span className="text-[10px] text-[#997C70] block">{p.paymentDate}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
