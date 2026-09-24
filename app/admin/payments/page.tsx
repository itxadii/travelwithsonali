"use client";

import React, { useState, useEffect } from "react";
import { Search, FileText, Download, Share2, Printer, CheckCircle } from "lucide-react";
import { GooeyInput } from "@/components/ui/gooey-input";
import PaymentInvoiceModal, { ExtendedPaymentRecord } from "./PaymentInvoiceModal";

export default function PaymentsPage() {
  const [paymentsList, setPaymentsList] = useState<ExtendedPaymentRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedPaymentForInvoice, setSelectedPaymentForInvoice] = useState<ExtendedPaymentRecord | null>(null);

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

  const filtered = paymentsList.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.bookingId.toLowerCase().includes(q) ||
      (p.bookingCode && p.bookingCode.toLowerCase().includes(q)) ||
      (p.customerName && p.customerName.toLowerCase().includes(q)) ||
      (p.tourTitle && p.tourTitle.toLowerCase().includes(q)) ||
      (p.referenceNumber && p.referenceNumber.toLowerCase().includes(q)) ||
      p.paymentMethod.toLowerCase().includes(q)
    );
  });

  const totalCollected = paymentsList.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#685752] font-serif-italic">
            Payment Ledger & Invoices
          </h1>
          <p className="text-xs text-[#997C70] mt-1">
            Track transaction records, generate printable PDF tax receipts, and dispatch invoices to clients.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#E8DCD5] shadow-xs flex items-center gap-4 text-xs">
          <span className="text-[#997C70] uppercase font-semibold">Total Collected</span>
          <span className="text-xl font-bold text-emerald-700">
            ₹{totalCollected.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs flex items-center justify-between">
        <GooeyInput
          placeholder="Search client, tour, booking code, reference..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          collapsedWidth={130}
          expandedWidth={320}
          expandedOffset={48}
          classNames={{
            surface: "bg-[#685752] text-white shadow-md ring-1 ring-[#685752]/20 hover:bg-[#5a4a45]",
          }}
        />
      </div>

      {/* Payments Table */}
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
                  <th className="pb-3 font-semibold">Receipt / ID</th>
                  <th className="pb-3 font-semibold">Client & Tour</th>
                  <th className="pb-3 font-semibold">Booking Code</th>
                  <th className="pb-3 font-semibold">Amount Received</th>
                  <th className="pb-3 font-semibold">Method & Ref</th>
                  <th className="pb-3 font-semibold">Payment Date</th>
                  <th className="pb-3 font-semibold text-right">Invoice Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DCD5]">
                {filtered.map((p) => {
                  const clientPhone = p.customerPhone?.replace(/[^0-9]/g, "");
                  const invoiceSummary = `Hi ${p.customerName || "there"}! Here is your payment receipt of ₹${p.amount.toLocaleString("en-IN")} for ${p.tourTitle || "your tour"} (Booking: ${p.bookingCode || p.bookingId}). Date: ${p.paymentDate}. Thank you for choosing Travel With Sonali!`;
                  const quickWhatsappUrl = clientPhone
                    ? `https://wa.me/${clientPhone}?text=${encodeURIComponent(invoiceSummary)}`
                    : `https://wa.me/?text=${encodeURIComponent(invoiceSummary)}`;

                  return (
                    <tr key={p.id} className="hover:bg-[#FDF7F4] transition-colors">
                      {/* Receipt ID */}
                      <td className="py-3.5 font-bold text-[#685752] font-mono">
                        {p.id.substring(0, 14)}
                      </td>

                      {/* Client & Tour */}
                      <td className="py-3.5 space-y-0.5">
                        <div className="font-bold text-[#685752]">
                          {p.customerName || "Direct Guest"}
                        </div>
                        <div className="text-[11px] text-[#997C70]">
                          {p.tourTitle || "Tour Package"}
                          {p.departureDate && ` • ${p.departureDate}`}
                        </div>
                      </td>

                      {/* Booking Code */}
                      <td className="py-3.5">
                        <span className="font-semibold text-[#8EB486] font-mono">
                          {p.bookingCode || p.bookingId}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 font-bold text-sm text-emerald-700">
                        ₹{p.amount.toLocaleString("en-IN")}
                      </td>

                      {/* Method & Ref */}
                      <td className="py-3.5 space-y-0.5">
                        <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#FDF7F4] text-[#685752] text-[10px] font-semibold border border-[#E8DCD5]">
                          {p.paymentMethod}
                        </span>
                        {p.referenceNumber && (
                          <div className="font-mono text-[10px] text-[#997C70]">
                            {p.referenceNumber}
                          </div>
                        )}
                      </td>

                      {/* Payment Date */}
                      <td className="py-3.5 text-[#7A6862] whitespace-nowrap">
                        {p.paymentDate}
                      </td>

                      {/* Invoice & Export Actions */}
                      <td className="py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Quick WhatsApp Send */}
                          <a
                            href={quickWhatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                            title={
                              p.customerPhone
                                ? `Send receipt to ${p.customerName} on WhatsApp (+${clientPhone})`
                                : "Share receipt on WhatsApp"
                            }
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                            </svg>
                          </a>

                          {/* Open Full Invoice Modal & Export PDF */}
                          <button
                            type="button"
                            onClick={() => setSelectedPaymentForInvoice(p)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8EB486] hover:bg-[#7A9F73] text-white font-semibold text-xs transition-all active:scale-95 shadow-2xs cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Invoice / PDF</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Invoice Preview, PDF Export & Send Modal */}
      {selectedPaymentForInvoice && (
        <PaymentInvoiceModal
          payment={selectedPaymentForInvoice}
          onClose={() => setSelectedPaymentForInvoice(null)}
        />
      )}
    </div>
  );
}
