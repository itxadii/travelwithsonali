"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Users, MapPin, ArrowRight } from "lucide-react";

interface CustomerTrip {
  id: string;
  bookingCode: string;
  tourTitle: string;
  departureDate: string;
  travellersCount: number;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  paymentStatus: string;
  bookingStatus: string;
  image: string;
  destination: string;
  duration: string;
}

export default function CustomerTripsPage() {
  const [activeTab, setActiveTab] = useState<"Upcoming" | "Past" | "Cancelled">("Upcoming");
  const [tripsData, setTripsData] = useState<{
    upcoming: CustomerTrip[];
    past: CustomerTrip[];
    cancelled: CustomerTrip[];
  }>({ upcoming: [], past: [], cancelled: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrips() {
      try {
        const res = await fetch("/api/portal/trips");
        if (res.ok) {
          const json = await res.json();
          setTripsData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTrips();
  }, []);

  const currentList =
    activeTab === "Upcoming"
      ? tripsData.upcoming
      : activeTab === "Past"
      ? tripsData.past
      : tripsData.cancelled;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#685752] font-serif-italic">
          My Journeys & Trips
        </h1>
        <p className="text-xs text-[#997C70] mt-1">
          View all your booked group expeditions, itineraries, and past travel memories.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8DCD5] pb-4">
        {(["Upcoming", "Past", "Cancelled"] as const).map((tab) => {
          const count =
            tab === "Upcoming"
              ? tripsData.upcoming.length
              : tab === "Past"
              ? tripsData.past.length
              : tripsData.cancelled.length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-[#8EB486] text-white shadow-sm"
                  : "bg-white text-[#997C70] hover:text-[#685752] border border-[#E8DCD5]"
              }`}
            >
              <span>{tab} Trips</span>
              <span className="ml-1.5 opacity-80">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Trips Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[#997C70]">Loading trips...</div>
      ) : currentList.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-[#E8DCD5] text-center space-y-3">
          <p className="text-sm font-semibold text-[#685752]">No {activeTab.toLowerCase()} trips found.</p>
          {activeTab === "Upcoming" && (
            <Link
              href="/tours"
              className="inline-block px-6 py-2.5 rounded-full bg-[#8EB486] text-white text-xs font-semibold"
            >
              Explore Group Departures →
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentList.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#E8DCD5] p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="relative h-52 rounded-2xl overflow-hidden">
                  <Image
                    src={trip.image}
                    alt={trip.tourTitle}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 text-white text-[11px] font-semibold backdrop-blur-xs">
                    {trip.duration}
                  </span>
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold shadow-md">
                    {trip.bookingStatus}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8EB486] tracking-widest">
                    BOOKING {trip.bookingCode}
                  </span>
                  <h3 className="text-xl font-bold text-[#685752] group-hover:text-[#8EB486] transition-colors mt-0.5">
                    {trip.tourTitle}
                  </h3>
                </div>

                <div className="space-y-1.5 text-xs text-[#997C70]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#8EB486]" />
                    <span>Departure: <strong className="text-[#685752]">{trip.departureDate}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#8EB486]" />
                    <span>Travellers: <strong className="text-[#685752]">{trip.travellersCount} Person(s)</strong></span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8DCD5] flex items-center justify-between mt-6">
                <div>
                  <span className="text-[10px] uppercase text-[#997C70] font-semibold block">Total Cost</span>
                  <span className="text-sm font-bold text-[#685752]">₹{trip.totalAmount.toLocaleString("en-IN")}</span>
                </div>

                <Link
                  href={`/portal/trips/${trip.id}`}
                  className="px-5 py-2 rounded-full bg-[#FDF7F4] border border-[#E8DCD5] hover:bg-[#8EB486] hover:text-white hover:border-[#8EB486] text-[#685752] text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                >
                  <span>View Trip</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
