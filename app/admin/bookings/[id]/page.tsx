"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { ChevronLeft, Plus, CreditCard, Users } from "lucide-react";

interface BookingDetailData {
  booking: {
    id: string;
    bookingCode: string;
    customerId: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
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
    notes?: string;
    createdAt: string;
  };
  travellers: {
    id: string;
    fullName: string;
    mobile?: string;
    idDocumentType?: string;
    idNumberMasked?: string;
    idDocumentStatus: string;
  }[];
  payments: {
    id: string;
    amount: number;
    paymentMethod: string;
    paymentDate: string;
    referenceNumber?: string;
    notes?: string;
    recordedBy: string;
  }[];
  documents: {
    id: string;
    documentType: string;
    documentName: string;
    status: string;
  }[];
}

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [data, setData] = useState<BookingDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [travellerModalOpen, setTravellerModalOpen] = useState(false);

  // Payment Form
  const [payAmount, setPayAmount] = useState(5000);
  const [payMethod, setPayMethod] = useState("UPI");
  const [payRef, setPayRef] = useState("");
  const [payNotes, setPayNotes] = useState("");

  // Traveller Form
  const [travName, setTravName] = useState("");
  const [travMobile, setTravMobile] = useState("");
  const [travIdType, setTravIdType] = useState("Aadhaar");
  const [travIdNumber, setTravIdNumber] = useState("");

  const fetchDetail = async () => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) return;

    try {
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: id,
          amount: payAmount,
          paymentMethod: payMethod,
          referenceNumber: payRef,
          notes: payNotes,
        }),
      });

      if (res.ok) {
        setPaymentModalOpen(false);
        setPayAmount(5000);
        setPayRef("");
        setPayNotes("");
        fetchDetail();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTraveller = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!travName) return;

    try {
      const res = await fetch("/api/admin/travellers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: id,
          fullName: travName,
          mobile: travMobile,
          idDocumentType: travIdType,
          idNumber: travIdNumber,
        }),
      });

      if (res.ok) {
        setTravellerModalOpen(false);
        setTravName("");
        setTravMobile("");
        setTravIdNumber("");
        fetchDetail();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingStatus: newStatus }),
      });
      if (res.ok) {
        fetchDetail();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-[#997C70]">Loading booking details...</div>;
  }

  if (!data) {
    return <div className="p-8 text-center text-xs text-rose-600">Booking record not found.</div>;
  }

  const { booking, travellers, payments } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/bookings"
            className="p-2 rounded-xl bg-white border border-[#E8DCD5] text-[#997C70] hover:text-[#685752]"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#685752] font-serif-italic">{booking.bookingCode}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#8EB486]/10 text-[#8EB486] text-[10px] font-bold">
                {booking.bookingStatus}
              </span>
            </div>
            <p className="text-xs text-[#997C70] mt-0.5">Tour: {booking.tourTitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleStatusChange("Confirmed")}
            className="px-3.5 py-2 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold hover:bg-emerald-200 cursor-pointer"
          >
            Confirm
          </button>
          <button
            onClick={() => handleStatusChange("Completed")}
            className="px-3.5 py-2 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold hover:bg-blue-200 cursor-pointer"
          >
            Complete
          </button>
          <button
            onClick={() => handleStatusChange("Cancelled")}
            className="px-3.5 py-2 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold hover:bg-rose-200 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Booking & Financial Info */}
        <div className="lg:col-span-4 space-y-6">
          {/* Price Snapshot Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-4">
            <h3 className="text-xs uppercase font-bold text-[#997C70] border-b border-[#E8DCD5] pb-3">
              Commercial Price Snapshot
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#997C70]">
                <span>Customer:</span>
                <span className="text-[#685752] font-bold">{booking.customerName}</span>
              </div>
              <div className="flex justify-between text-[#997C70]">
                <span>Phone:</span>
                <span className="text-[#685752] font-semibold">{booking.customerPhone}</span>
              </div>
              <div className="flex justify-between text-[#997C70]">
                <span>Departure Date:</span>
                <span className="text-[#685752] font-semibold">{booking.departureDate}</span>
              </div>
              <div className="flex justify-between text-[#997C70]">
                <span>Travellers:</span>
                <span className="text-[#685752] font-semibold">{booking.travellersCount} Person(s)</span>
              </div>
              <div className="flex justify-between text-[#997C70]">
                <span>Agreed Rate / Person:</span>
                <span className="text-[#685752] font-semibold">₹{booking.pricePerTraveller.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-[#997C70]">
                <span>Applied Discount:</span>
                <span className="text-rose-600 font-semibold">- ₹{booking.discount.toLocaleString("en-IN")}</span>
              </div>

              <div className="pt-3 border-t border-[#E8DCD5] space-y-1">
                <div className="flex justify-between text-sm font-bold text-[#685752]">
                  <span>Total Booking Amount:</span>
                  <span className="text-[#8EB486]">₹{booking.totalAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-700 font-semibold">
                  <span>Total Paid:</span>
                  <span>₹{booking.paidAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-xs text-amber-700 font-semibold">
                  <span>Outstanding Balance:</span>
                  <span>₹{booking.outstandingAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setPaymentModalOpen(true)}
              className="w-full py-3 rounded-full bg-[#8EB486] hover:bg-[#7A9F73] text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>+ Record Manual Payment</span>
            </button>
          </div>
        </div>

        {/* Right Column: Payments Ledger & Travellers */}
        <div className="lg:col-span-8 space-y-6">
          {/* Payment History */}
          <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#685752] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#8EB486]" />
                Payment Ledger History ({payments.length})
              </h3>
              <button
                onClick={() => setPaymentModalOpen(true)}
                className="text-xs text-[#8EB486] hover:underline font-semibold cursor-pointer"
              >
                + Add Payment
              </button>
            </div>

            {payments.length === 0 ? (
              <p className="text-xs text-[#997C70] py-4 text-center">No payment entries recorded yet.</p>
            ) : (
              <div className="space-y-3 text-xs">
                {payments.map((p) => (
                  <div key={p.id} className="p-4 rounded-2xl bg-[#FDF7F4] border border-[#E8DCD5] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-emerald-700 text-sm">₹{p.amount.toLocaleString("en-IN")}</span>
                      <span className="ml-2 text-[10px] uppercase font-bold text-[#685752] bg-white px-2 py-0.5 rounded-md border border-[#E8DCD5]">
                        {p.paymentMethod}
                      </span>
                      {p.referenceNumber && <p className="text-[11px] text-[#666059] mt-1">Ref: {p.referenceNumber}</p>}
                      <p className="text-[10px] text-[#997C70]">Recorded by: {p.recordedBy}</p>
                    </div>
                    <span className="text-[11px] text-[#997C70]">{p.paymentDate}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Travellers List */}
          <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#685752] flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Traveller Manifest ({travellers.length})
              </h3>
              <button
                onClick={() => setTravellerModalOpen(true)}
                className="text-xs text-[#8EB486] hover:underline font-semibold cursor-pointer"
              >
                + Add Traveller
              </button>
            </div>

            {travellers.length === 0 ? (
              <p className="text-xs text-[#997C70] py-4 text-center">No travellers added to manifest yet.</p>
            ) : (
              <div className="space-y-3 text-xs">
                {travellers.map((t) => (
                  <div key={t.id} className="p-4 rounded-2xl bg-[#FDF7F4] border border-[#E8DCD5] flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#685752] text-sm">{t.fullName}</p>
                      <p className="text-[11px] text-[#997C70]">Mobile: {t.mobile || "N/A"}</p>
                      {t.idNumberMasked && (
                        <p className="text-[10px] text-emerald-700 font-mono mt-0.5 font-bold">
                          ID: {t.idDocumentType} ({t.idNumberMasked})
                        </p>
                      )}
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      {t.idDocumentStatus}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Payment Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-[#E8DCD5] shadow-2xl space-y-6">
            <h2 className="text-xl font-bold text-[#685752]">Record Manual Payment</h2>

            <form onSubmit={handleAddPayment} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[#997C70] font-semibold">Payment Amount (₹) *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] focus:outline-none focus:border-[#8EB486]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#997C70] font-semibold">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] focus:outline-none focus:border-[#8EB486]"
                >
                  {["UPI", "Cash", "Bank Transfer", "Other"].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[#997C70] font-semibold">Reference Number / Transaction ID</label>
                <input
                  type="text"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  placeholder="UPI/192081/TWS"
                  className="w-full p-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] focus:outline-none focus:border-[#8EB486]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#997C70] font-semibold">Notes</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  placeholder="Second installment..."
                  className="w-full p-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] focus:outline-none focus:border-[#8EB486]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#8EB486] text-white font-semibold cursor-pointer shadow-sm"
                >
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Traveller Modal */}
      {travellerModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-[#E8DCD5] shadow-2xl space-y-6">
            <h2 className="text-xl font-bold text-[#685752]">Add Traveller to Manifest</h2>

            <form onSubmit={handleAddTraveller} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[#997C70] font-semibold">Full Name *</label>
                <input
                  type="text"
                  required
                  value={travName}
                  onChange={(e) => setTravName(e.target.value)}
                  placeholder="Priya Sharma"
                  className="w-full p-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] focus:outline-none focus:border-[#8EB486]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#997C70] font-semibold">Mobile Number</label>
                <input
                  type="text"
                  value={travMobile}
                  onChange={(e) => setTravMobile(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] focus:outline-none focus:border-[#8EB486]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#997C70] font-semibold">ID Type</label>
                  <select
                    value={travIdType}
                    onChange={(e) => setTravIdType(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] focus:outline-none focus:border-[#8EB486]"
                  >
                    {["Aadhaar", "Passport", "Voter ID"].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[#997C70] font-semibold">ID Number</label>
                  <input
                    type="text"
                    value={travIdNumber}
                    onChange={(e) => setTravIdNumber(e.target.value)}
                    placeholder="1234 5678 9101"
                    className="w-full p-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] focus:outline-none focus:border-[#8EB486]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setTravellerModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#8EB486] text-white font-semibold cursor-pointer shadow-sm"
                >
                  Save Traveller
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
