"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  Clock,
  CreditCard,
  FileCheck,
  Phone,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Building,
  Bus,
} from "lucide-react";

interface TripDetailData {
  booking: {
    id: string;
    bookingCode: string;
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
  };
  sanityTour?: {
    image: string;
    duration?: string;
    destination?: string;
    overview?: string;
    description?: string;
    startingPoint?: string;
    transport?: string;
    accommodation?: string;
    meals?: string;
    groupSize?: string;
    inclusions?: string[];
    exclusions?: string[];
    gallery?: string[];
    itinerary?: {
      day: string;
      title: string;
      description: string;
      meals?: string;
      stay?: string;
    }[];
    importantInfo?: {
      title: string;
      details: string[];
    }[];
  } | null;
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
  }[];
  documents: {
    id: string;
    documentType: string;
    documentName: string;
    status: string;
  }[];
  operationalInfo: {
    stay?: { name: string; location: string; dates: string } | null;
    transport?: { vehicle: string; number: string; driver: string; contact: string } | null;
    coordinator: { name: string; role: string; phone: string; whatsapp: string };
  };
}

export default function CustomerTripDetailPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const resolvedParams = use(params);
  const { bookingId } = resolvedParams;

  const [data, setData] = useState<TripDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "Overview" | "Itinerary" | "Travellers" | "Stay & Transport" | "Documents" | "Payments" | "Important Info"
  >("Overview");

  useEffect(() => {
    async function fetchTripDetail() {
      try {
        const res = await fetch(`/api/portal/trips/${bookingId}`);
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
    fetchTripDetail();
  }, [bookingId]);

  if (loading) {
    return <div className="p-12 text-center text-xs text-[#7A746E]">Loading trip details...</div>;
  }

  if (!data) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#1C1917]">Trip Not Found</h2>
        <p className="text-xs text-[#7A746E]">This booking does not exist or you do not have permission to view it.</p>
        <Link href="/portal/trips" className="inline-block px-6 py-2 rounded-full bg-[#E05328] text-white text-xs font-semibold">
          Return to My Trips
        </Link>
      </div>
    );
  }

  const { booking, sanityTour, travellers, payments, documents, operationalInfo } = data;

  const tabs = ["Overview", "Itinerary", "Travellers", "Stay & Transport", "Documents", "Payments", "Important Info"] as const;

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#7A746E]">
        <Link href="/portal/trips" className="hover:text-[#E05328] flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>My Trips</span>
        </Link>
        <span>/</span>
        <span className="text-[#1C1917] font-semibold">{booking.bookingCode}</span>
      </div>

      {/* Hero Header Card */}
      <div className="relative rounded-3xl overflow-hidden bg-[#181614] text-white border border-[#EBE5DF] shadow-xl">
        <div className="absolute inset-0 opacity-40">
          <Image
            src={sanityTour?.image || "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80"}
            alt={booking.tourTitle}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        <div className="relative p-6 sm:p-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="px-3.5 py-1 rounded-full bg-[#E05328] text-white text-[11px] font-bold uppercase tracking-wider">
              BOOKING {booking.bookingCode}
            </span>
            <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              ✓ {booking.bookingStatus}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif-italic font-bold tracking-tight text-white">
            {booking.tourTitle}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs text-stone-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#E05328]" />
              <span>Departure: <strong className="text-white">{booking.departureDate}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#E05328]" />
              <span>Duration: <strong className="text-white">{sanityTour?.duration || "Multiple Days"}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#E05328]" />
              <span>Travellers: <strong className="text-white">{booking.travellersCount} Person(s)</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* CUSTOMER-FACING BOOKING TIMELINE */}
      <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-3">
        <h3 className="text-xs uppercase font-bold text-[#7A746E] tracking-wider">Your Booking Journey</h3>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100 font-semibold">
            ✓ Request
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100 font-semibold">
            ✓ Confirmed
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100 font-semibold">
            ✓ Travellers
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-800 border border-amber-100 font-semibold">
            ● Documents
          </div>
          <div className="p-3 rounded-2xl bg-[#FAF6F0] text-[#7A746E] border border-[#EBE5DF]">
            ○ Trip Starts
          </div>
          <div className="p-3 rounded-2xl bg-[#FAF6F0] text-[#7A746E] border border-[#EBE5DF]">
            ○ Completed
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#EBE5DF] scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab
                ? "bg-[#E05328] text-white shadow-sm"
                : "bg-white text-[#7A746E] hover:text-[#1C1917] border border-[#EBE5DF]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT SECTIONS */}
      <div className="space-y-6">
        {/* OVERVIEW TAB */}
        {activeTab === "Overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-4">
                <h3 className="text-base font-bold text-[#1C1917] font-serif-italic">Trip Overview</h3>
                <p className="text-xs sm:text-sm text-[#57524C] leading-relaxed">
                  {sanityTour?.overview || sanityTour?.description || "Get ready for an extraordinary group travel experience."}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EBE5DF]">
                    <span className="text-[#7A746E] block font-medium">Starting Point</span>
                    <span className="font-bold text-[#1C1917]">{sanityTour?.startingPoint || "Mumbai / Delhi"}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EBE5DF]">
                    <span className="text-[#7A746E] block font-medium">Transport</span>
                    <span className="font-bold text-[#1C1917]">{sanityTour?.transport || "AC Bus / Vehicle"}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EBE5DF]">
                    <span className="text-[#7A746E] block font-medium">Group Size</span>
                    <span className="font-bold text-[#1C1917]">{sanityTour?.groupSize || "10 - 15 Travellers"}</span>
                  </div>
                </div>
              </div>

              {/* Inclusions & Exclusions */}
              {sanityTour?.inclusions && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-3">
                    <h4 className="text-xs uppercase font-bold text-emerald-800 tracking-wider">What&apos;s Included</h4>
                    <ul className="space-y-2 text-xs text-[#57524C]">
                      {sanityTour.inclusions.map((inc, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-3">
                    <h4 className="text-xs uppercase font-bold text-rose-800 tracking-wider">What&apos;s Excluded</h4>
                    <ul className="space-y-2 text-xs text-[#57524C]">
                      {sanityTour.exclusions?.map((exc, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-rose-600 font-bold">✕</span>
                          <span>{exc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Coordinator Support Box */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-4">
                <span className="text-[10px] uppercase font-bold text-[#E05328] tracking-widest block">
                  YOUR TRIP COORDINATOR
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-[#EBE5DF] shrink-0">
                    <Image
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                      alt="Sonali Sharma"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1C1917] text-sm">{operationalInfo.coordinator.name}</h4>
                    <p className="text-[11px] text-[#7A746E]">{operationalInfo.coordinator.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <a
                    href={`tel:${operationalInfo.coordinator.phone}`}
                    className="flex items-center justify-center gap-2 py-2 rounded-full bg-[#FAF6F0] border border-[#EBE5DF] text-[#1C1917] font-semibold hover:bg-[#1C1917] hover:text-white transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`https://wa.me/${operationalInfo.coordinator.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2 rounded-full bg-emerald-100 text-emerald-800 font-semibold hover:bg-emerald-200 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ITINERARY TAB */}
        {activeTab === "Itinerary" && (
          <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-[#1C1917] font-serif-italic">Day-by-Day Itinerary</h3>

            {sanityTour?.itinerary && sanityTour.itinerary.length > 0 ? (
              <div className="relative border-l-2 border-[#E05328]/30 pl-6 space-y-8 ml-3">
                {sanityTour.itinerary.map((day, idx) => (
                  <div key={idx} className="relative space-y-2">
                    <span className="absolute -left-[33px] top-0 w-4 h-4 rounded-full bg-[#E05328] ring-4 ring-white" />
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E05328]/10 text-[#E05328] text-[10px] font-bold">
                      {day.day}
                    </span>
                    <h4 className="text-base font-bold text-[#1C1917]">{day.title}</h4>
                    <p className="text-xs sm:text-sm text-[#57524C] leading-relaxed">{day.description}</p>
                    <div className="flex items-center gap-4 text-xs text-[#7A746E] pt-1">
                      {day.meals && <span>🍽️ Meals: <strong>{day.meals}</strong></span>}
                      {day.stay && <span>🏨 Stay: <strong>{day.stay}</strong></span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#7A746E] py-4">Itinerary details will appear here shortly.</p>
            )}
          </div>
        )}

        {/* TRAVELLERS TAB */}
        {activeTab === "Travellers" && (
          <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-[#1C1917] font-serif-italic">Travellers Manifest ({travellers.length})</h3>

            <div className="space-y-3 text-xs">
              {travellers.map((t) => (
                <div key={t.id} className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EBE5DF] flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[#1C1917] text-sm">{t.fullName}</h4>
                    <p className="text-[#7A746E]">Mobile: {t.mobile || "N/A"}</p>
                    {t.idNumberMasked && <p className="text-emerald-700 font-mono font-bold">ID: {t.idDocumentType} ({t.idNumberMasked})</p>}
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {t.idDocumentStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STAY & TRANSPORT TAB */}
        {activeTab === "Stay & Transport" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#1C1917] flex items-center gap-2">
                <Building className="w-4 h-4 text-[#E05328]" />
                Hotel & Accommodation
              </h3>
              {operationalInfo.stay ? (
                <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EBE5DF] text-xs space-y-1">
                  <p className="font-bold text-[#1C1917] text-sm">{operationalInfo.stay.name}</p>
                  <p className="text-[#7A746E]">{operationalInfo.stay.location}</p>
                  <p className="text-emerald-700 font-semibold">{operationalInfo.stay.dates}</p>
                </div>
              ) : (
                <p className="text-xs text-[#7A746E] py-4 italic">
                  Stay details will appear here once confirmed by your trip coordinator.
                </p>
              )}
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#1C1917] flex items-center gap-2">
                <Bus className="w-4 h-4 text-[#E05328]" />
                Transport Details
              </h3>
              {operationalInfo.transport ? (
                <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EBE5DF] text-xs space-y-1">
                  <p className="font-bold text-[#1C1917] text-sm">{operationalInfo.transport.vehicle}</p>
                  <p className="text-[#7A746E]">Number: {operationalInfo.transport.number}</p>
                  <p className="text-[#7A746E]">Driver: {operationalInfo.transport.driver} ({operationalInfo.transport.contact})</p>
                </div>
              ) : (
                <p className="text-xs text-[#7A746E] py-4 italic">
                  Transport details will appear here once finalized before departure.
                </p>
              )}
            </div>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === "Documents" && (
          <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#1C1917] font-serif-italic">Identity Documents</h3>
              <Link href="/portal/documents" className="text-xs font-semibold text-[#E05328] hover:underline">
                Upload New Document →
              </Link>
            </div>

            {documents.length === 0 ? (
              <p className="text-xs text-[#7A746E] py-4">No document files uploaded yet.</p>
            ) : (
              <div className="space-y-3 text-xs">
                {documents.map((d) => (
                  <div key={d.id} className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EBE5DF] flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-[#1C1917]">{d.documentName}</h4>
                      <p className="text-[#7A746E]">{d.documentType}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === "Payments" && (
          <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-[#1C1917] font-serif-italic">Commercial Payment Ledger</h3>

            <div className="grid grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EBE5DF]">
                <span className="text-[#7A746E] block font-medium">Total Cost</span>
                <span className="text-base font-bold text-[#1C1917]">₹{booking.totalAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                <span className="text-emerald-800 block font-medium">Total Paid</span>
                <span className="text-base font-bold text-emerald-700">₹{booking.paidAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                <span className="text-amber-800 block font-medium">Remaining Balance</span>
                <span className="text-base font-bold text-amber-700">₹{booking.outstandingAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-[#1C1917]">Payment History ({payments.length})</h4>
              {payments.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EBE5DF] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-emerald-700 text-sm">₹{p.amount.toLocaleString("en-IN")}</span>
                    <span className="ml-2 text-[10px] uppercase font-bold text-[#1C1917] bg-white px-2 py-0.5 rounded-md border border-[#EBE5DF]">
                      {p.paymentMethod}
                    </span>
                    {p.referenceNumber && <p className="text-[#666059] text-[11px] mt-0.5">Ref: {p.referenceNumber}</p>}
                  </div>
                  <span className="text-[#7A746E]">{p.paymentDate}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* IMPORTANT INFO TAB */}
        {activeTab === "Important Info" && (
          <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-[#1C1917] font-serif-italic">Important Travel Guidelines</h3>

            {sanityTour?.importantInfo && sanityTour.importantInfo.length > 0 ? (
              <div className="space-y-4 text-xs">
                {sanityTour.importantInfo.map((info, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EBE5DF] space-y-2">
                    <h4 className="font-bold text-[#1C1917] text-sm">{info.title}</h4>
                    <ul className="space-y-1 text-[#57524C] list-disc list-inside">
                      {info.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EBE5DF] text-xs text-[#57524C] space-y-1">
                <h4 className="font-bold text-[#1C1917]">General Guidelines</h4>
                <p>• Carry valid photo identity proof (Aadhaar Card / Passport).</p>
                <p>• Respect group timelines and coordinator instructions during transfers.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
