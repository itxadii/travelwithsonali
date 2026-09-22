"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Users,
  CreditCard,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Phone,
  MessageCircle,
  Clock,
  Sparkles,
} from "lucide-react";

interface DashboardData {
  customer: {
    id: string;
    name: string;
    phone: string;
    email?: string;
  };
  nextTrip: {
    booking: {
      id: string;
      bookingCode: string;
      tourTitle: string;
      departureDate: string;
      travellersCount: number;
      pricePerTraveller: number;
      totalAmount: number;
      paidAmount: number;
      outstandingAmount: number;
      paymentStatus: string;
      bookingStatus: string;
    };
    sanityTour?: {
      image: string;
      duration?: string;
      destination?: string;
    } | null;
    travellersCount: number;
    documentsVerifiedCount: number;
    totalDocumentsCount: number;
    readinessPercentage: number;
  } | null;
  totalUpcomingCount: number;
  totalPastCount: number;
  notifications: {
    id: string;
    title: string;
    message: string;
    type: string;
    createdAt: string;
  }[];
  featuredTours: {
    id: string;
    slug: string;
    title: string;
    price: string;
    image: string;
    duration: string;
  }[];
}

export default function CustomerDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Countdown State
  const [countdown, setCountdown] = useState({ days: 27, hours: 8, minutes: 42, seconds: 15 });

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/portal/dashboard");
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
    fetchDashboard();
  }, []);

  // Timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        return { ...prev, seconds: 59, minutes: prev.minutes > 0 ? prev.minutes - 1 : 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-64 rounded-3xl bg-white/60 border border-[#E8DCD5]" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-white/60 border border-[#E8DCD5]" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { customer, nextTrip, featuredTours, notifications } = data;

  return (
    <div className="space-y-8">
      {/* Welcome Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DCD5] pb-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#685752] font-serif-italic">
            Hello, {customer.name.split(" ")[0]} 👋
          </h1>
          <p className="text-xs text-[#997C70] mt-1">
            Your travel family is excited to explore with you. Here is your trip summary.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            Account Active
          </span>
        </div>
      </div>

      {/* 1. HERO NEXT TRIP CARD */}
      {nextTrip ? (
        <div className="relative rounded-3xl overflow-hidden bg-[#4C3E3A] text-white shadow-xl border border-[#E8DCD5] group">
          {/* Background Tour Cover */}
          <div className="absolute inset-0 opacity-40">
            <Image
              src={nextTrip.sanityTour?.image || "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80"}
              alt={nextTrip.booking.tourTitle}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

          {/* Card Content */}
          <div className="relative p-6 sm:p-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="px-3.5 py-1 rounded-full bg-[#8EB486] text-white text-[11px] font-bold uppercase tracking-wider">
                  Your Next Adventure
                </span>
                <h2 className="text-2xl sm:text-4xl font-serif-italic font-bold tracking-tight text-white mt-2">
                  {nextTrip.booking.tourTitle}
                </h2>
                <p className="text-stone-300 text-xs sm:text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#8EB486]" />
                  <span>{nextTrip.booking.departureDate}</span>
                  <span>•</span>
                  <span>Booking {nextTrip.booking.bookingCode}</span>
                </p>
              </div>

              <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold backdrop-blur-md">
                ✓ {nextTrip.booking.bookingStatus}
              </span>
            </div>

            {/* LIVE COUNTDOWN DISPLAY */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-6">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest block mb-2">
                  TRIP COUNTDOWN
                </span>
                <div className="flex items-center gap-3 text-center font-mono">
                  <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-2 min-w-[60px]">
                    <span className="text-2xl font-bold text-white block">{countdown.days}</span>
                    <span className="text-[9px] uppercase text-stone-400 font-sans">Days</span>
                  </div>
                  <span className="text-stone-500 font-bold">:</span>
                  <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-2 min-w-[60px]">
                    <span className="text-2xl font-bold text-white block">{String(countdown.hours).padStart(2, '0')}</span>
                    <span className="text-[9px] uppercase text-stone-400 font-sans">Hours</span>
                  </div>
                  <span className="text-stone-500 font-bold">:</span>
                  <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-2 min-w-[60px]">
                    <span className="text-2xl font-bold text-[#8EB486] block">{String(countdown.minutes).padStart(2, '0')}</span>
                    <span className="text-[9px] uppercase text-stone-400 font-sans">Mins</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/portal/trips/${nextTrip.booking.id}`}
                className="px-6 py-3 rounded-full bg-[#8EB486] hover:bg-[#7A9F73] text-white text-xs font-bold tracking-wider uppercase shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>View My Trip</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* NO UPCOMING TRIP STATE */
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#8EB486]/10 text-[#8EB486] flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#685752] font-serif-italic">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-xs sm:text-sm text-[#997C70] max-w-md mx-auto">
            You don&apos;t have an upcoming group trip booked right now. Explore our upcoming departures and join our next travel family!
          </p>
          <div className="pt-2">
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#8EB486] hover:bg-[#7A9F73] text-white text-xs font-bold uppercase tracking-wider shadow-md"
            >
              <span>Explore Tours</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* 2. QUICK TRIP SUMMARY CARDS */}
      {nextTrip && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-[#E8DCD5] shadow-2xs space-y-1">
            <span className="text-[10px] text-[#997C70] uppercase font-bold tracking-wider block">Departure</span>
            <p className="text-xs font-bold text-[#685752] truncate">{nextTrip.booking.departureDate}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#E8DCD5] shadow-2xs space-y-1">
            <span className="text-[10px] text-[#997C70] uppercase font-bold tracking-wider block">Duration</span>
            <p className="text-xs font-bold text-[#685752] truncate">{nextTrip.sanityTour?.duration || "Multiple Days"}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#E8DCD5] shadow-2xs space-y-1">
            <span className="text-[10px] text-[#997C70] uppercase font-bold tracking-wider block">Travellers</span>
            <p className="text-xs font-bold text-[#685752] truncate">{nextTrip.booking.travellersCount} Person(s)</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#E8DCD5] shadow-2xs space-y-1">
            <span className="text-[10px] text-[#997C70] uppercase font-bold tracking-wider block">Booking ID</span>
            <p className="text-xs font-bold text-[#8EB486] truncate">{nextTrip.booking.bookingCode}</p>
          </div>
        </div>
      )}

      {/* 3. TRIP READINESS CHECKLIST & ACTIONS */}
      {nextTrip && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Readiness & Quick Actions */}
          <div className="lg:col-span-8 space-y-6">
            {/* Readiness Card */}
            <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8DCD5] pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#685752]">You&apos;re Almost Ready</h3>
                  <p className="text-xs text-[#997C70]">Complete required traveller details before departure.</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-[#8EB486]">{nextTrip.readinessPercentage}%</span>
                  <span className="text-[10px] text-[#997C70] block font-semibold">Ready</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-[#FDF7F4] overflow-hidden border border-[#E8DCD5]">
                <div
                  className="h-full bg-gradient-to-r from-[#8EB486] to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${nextTrip.readinessPercentage}%` }}
                />
              </div>

              {/* Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Booking Confirmed</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-800 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Traveller Details Completed ({nextTrip.travellersCount})</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-800 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Payment Updated ({nextTrip.booking.paymentStatus})</span>
                </div>
                <div className="flex items-center gap-2 text-amber-800 font-semibold bg-amber-50 p-2.5 rounded-xl border border-amber-100">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>ID Documents Verified ({nextTrip.documentsVerifiedCount}/{nextTrip.totalDocumentsCount || 1})</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Link
                  href="/portal/documents"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#8EB486] hover:bg-[#7A9F73] text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-95 group"
                >
                  <span>Complete My Details</span>
                  <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link
                href={`/portal/trips/${nextTrip.booking.id}`}
                className="p-4 rounded-2xl bg-white border border-[#E8DCD5] hover:border-[#8EB486] hover:shadow-md transition-all text-center space-y-2 group"
              >
                <div className="w-10 h-10 rounded-full bg-[#FDF7F4] text-[#8EB486] flex items-center justify-center mx-auto group-hover:bg-[#8EB486] group-hover:text-white transition-colors">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#685752] block">View Itinerary</span>
              </Link>
              <Link
                href="/portal/travellers"
                className="p-4 rounded-2xl bg-white border border-[#E8DCD5] hover:border-[#8EB486] hover:shadow-md transition-all text-center space-y-2 group"
              >
                <div className="w-10 h-10 rounded-full bg-[#FDF7F4] text-[#8EB486] flex items-center justify-center mx-auto group-hover:bg-[#8EB486] group-hover:text-white transition-colors">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#685752] block">Manage Travellers</span>
              </Link>
              <Link
                href="/portal/documents"
                className="p-4 rounded-2xl bg-white border border-[#E8DCD5] hover:border-[#8EB486] hover:shadow-md transition-all text-center space-y-2 group"
              >
                <div className="w-10 h-10 rounded-full bg-[#FDF7F4] text-[#8EB486] flex items-center justify-center mx-auto group-hover:bg-[#8EB486] group-hover:text-white transition-colors">
                  <FileCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#685752] block">Documents</span>
              </Link>
              <Link
                href="/portal/payments"
                className="p-4 rounded-2xl bg-white border border-[#E8DCD5] hover:border-[#8EB486] hover:shadow-md transition-all text-center space-y-2 group"
              >
                <div className="w-10 h-10 rounded-full bg-[#FDF7F4] text-[#8EB486] flex items-center justify-center mx-auto group-hover:bg-[#8EB486] group-hover:text-white transition-colors">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#685752] block">Payments</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Payment Card & Trip Coordinator */}
          <div className="lg:col-span-4 space-y-6">
            {/* Payment Summary */}
            <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-4">
              <h3 className="text-xs uppercase font-bold text-[#997C70] border-b border-[#E8DCD5] pb-3">
                Payment Summary
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#997C70]">
                  <span>Total Trip Cost:</span>
                  <span className="text-[#685752] font-bold">₹{nextTrip.booking.totalAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Paid:</span>
                  <span>₹{nextTrip.booking.paidAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-amber-700 font-semibold">
                  <span>Remaining Balance:</span>
                  <span>₹{nextTrip.booking.outstandingAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E8DCD5] space-y-2">
                <p className="text-[10px] text-[#997C70] italic">
                  Payment updates are recorded by our team upon receiving manual UPI, Cash, or Bank transfers.
                </p>
                <Link
                  href="/portal/payments"
                  className="block text-center w-full py-2.5 rounded-full bg-[#FDF7F4] border border-[#E8DCD5] hover:bg-[#8EB486] hover:text-white text-[#685752] text-xs font-semibold transition-colors"
                >
                  View Payment History
                </Link>
              </div>
            </div>

            {/* Trip Coordinator Support Card */}
            <div className="p-6 rounded-3xl bg-[#FFFDF9] border border-[#E8DCD5] shadow-xs space-y-4">
              <span className="text-[10px] uppercase font-bold text-[#8EB486] tracking-widest block">
                YOUR TRIP COORDINATOR
              </span>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-[#E8DCD5] shrink-0">
                  <Image
                    src="/images/sonali.png"
                    alt="Sonali Palekar"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-[#685752] text-sm">Sonali Palekar</h4>
                  <p className="text-[11px] text-[#997C70]">Lead Group Explorer</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                <a
                  href="tel:+919876543210"
                  className="flex items-center justify-center gap-2 py-2 rounded-full bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] font-semibold hover:bg-[#685752] hover:text-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
                <a
                  href="https://wa.me/919876543210"
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

      {/* Featured Tours if No Upcoming Trip */}
      {featuredTours.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="text-xl font-bold text-[#685752] font-serif-italic">Upcoming Group Departures</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {featuredTours.map((tour) => (
              <div key={tour.id} className="bg-white rounded-3xl overflow-hidden border border-[#E8DCD5] p-4 shadow-xs space-y-3">
                <div className="relative h-44 rounded-2xl overflow-hidden">
                  <Image src={tour.image} alt={tour.title} fill className="object-cover" />
                </div>
                <h4 className="font-bold text-[#685752] text-sm">{tour.title}</h4>
                <p className="text-xs text-[#997C70]">{tour.duration} • {tour.price}</p>
                <Link
                  href={`/tours/${tour.slug}`}
                  className="block text-center py-2 rounded-full bg-[#8EB486] text-white text-xs font-semibold"
                >
                  View Package Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
