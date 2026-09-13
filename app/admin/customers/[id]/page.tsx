"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { ChevronLeft, Phone, Mail, CalendarCheck, ShieldCheck } from "lucide-react";

interface CustomerProfileData {
  customer: {
    id: string;
    name: string;
    phone: string;
    email?: string;
    status: string;
    notes?: string;
    createdAt: string;
  };
  bookings: {
    id: string;
    bookingCode: string;
    tourTitle: string;
    departureDate: string;
    totalAmount: number;
    paidAmount: number;
    outstandingAmount: number;
    bookingStatus: string;
    createdAt: string;
  }[];
  travellers: {
    id: string;
    fullName: string;
    mobile?: string;
    idDocumentType?: string;
    idNumberMasked?: string;
    idDocumentStatus: string;
  }[];
  documents: {
    id: string;
    documentType: string;
    documentName: string;
    status: string;
  }[];
}

export default function CustomerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [data, setData] = useState<CustomerProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const res = await fetch(`/api/admin/customers/${id}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomer();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-xs text-[#997C70]">Loading customer profile...</div>;
  }

  if (!data) {
    return <div className="p-8 text-center text-xs text-rose-600">Customer profile not found.</div>;
  }

  const { customer, bookings, travellers, documents } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/customers"
          className="p-2 rounded-xl bg-white border border-[#E8DCD5] text-[#997C70] hover:text-[#685752]"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#685752] font-serif-italic">{customer.name}</h1>
          <p className="text-xs text-[#997C70]">Customer ID: {customer.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Profile Card */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#E8DCD5] pb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#997C70]">
              Customer Profile
            </span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
              {customer.status}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[#997C70] block font-medium">Full Name</span>
              <span className="text-[#685752] font-bold text-sm">{customer.name}</span>
            </div>

            <div>
              <span className="text-[#997C70] block font-medium">Phone</span>
              <span className="text-[#685752] flex items-center gap-1.5 mt-0.5 font-semibold">
                <Phone className="w-3.5 h-3.5 text-[#8EB486]" />
                {customer.phone}
              </span>
            </div>

            {customer.email && (
              <div>
                <span className="text-[#997C70] block font-medium">Email</span>
                <span className="text-[#685752] flex items-center gap-1.5 mt-0.5 font-semibold">
                  <Mail className="w-3.5 h-3.5 text-[#8EB486]" />
                  {customer.email}
                </span>
              </div>
            )}

            {customer.notes && (
              <div className="pt-2 border-t border-[#E8DCD5]">
                <span className="text-[#997C70] block font-medium">Notes</span>
                <p className="text-[#4A4540] text-[11px] mt-1">{customer.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Customer History: Bookings & Documents */}
        <div className="lg:col-span-8 space-y-6">
          {/* Associated Bookings */}
          <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#685752] flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-[#8EB486]" />
              Bookings History ({bookings.length})
            </h3>

            {bookings.length === 0 ? (
              <p className="text-xs text-[#997C70] py-4 text-center">No bookings associated with this customer yet.</p>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b.id} className="p-4 rounded-2xl bg-[#FDF7F4] border border-[#E8DCD5] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#685752] text-sm">{b.bookingCode}</span>
                        <span className="px-2 py-0.5 rounded-md bg-[#8EB486]/10 text-[#8EB486] text-[10px] font-semibold">
                          {b.bookingStatus}
                        </span>
                      </div>
                      <p className="text-[#685752] font-semibold mt-1">{b.tourTitle}</p>
                      <p className="text-[#997C70] text-[11px]">Departure: {b.departureDate}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-[#685752]">₹{b.totalAmount.toLocaleString("en-IN")}</p>
                      <p className="text-[11px] text-emerald-700 font-semibold">Paid: ₹{b.paidAmount.toLocaleString("en-IN")}</p>
                      <Link href={`/admin/bookings/${b.id}`} className="text-[11px] font-semibold text-[#8EB486] hover:underline mt-1 inline-block">
                        View Booking Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Associated Identity Documents */}
          <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#685752] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified Identity Documents ({documents.length})
            </h3>

            {documents.length === 0 ? (
              <p className="text-xs text-[#997C70] py-4 text-center">No identity documents uploaded yet.</p>
            ) : (
              <div className="space-y-2 text-xs">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-3 rounded-2xl bg-[#FDF7F4] border border-[#E8DCD5] flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#685752]">{doc.documentName}</p>
                      <p className="text-[11px] text-[#997C70]">{doc.documentType}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
