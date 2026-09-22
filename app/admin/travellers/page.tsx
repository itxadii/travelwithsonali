"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { GooeyInput } from "@/components/ui/gooey-input";

interface TravellerItem {
  id: string;
  bookingId: string;
  bookingCode: string;
  tourTitle: string;
  departureDate: string;
  customerName?: string;
  fullName: string;
  dob?: string;
  gender?: string;
  mobile?: string;
  emergencyContact?: string;
  idDocumentType?: string;
  idNumberMasked?: string;
  idDocumentStatus: string;
  createdAt: string;
}

export default function TravellersPage() {
  const [travellersList, setTravellersList] = useState<TravellerItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTravellers() {
      try {
        const res = await fetch("/api/admin/travellers");
        if (res.ok) {
          const data = await res.json();
          setTravellersList(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTravellers();
  }, []);

  const filtered = travellersList.filter(
    (t) =>
      t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tourTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#685752] font-serif-italic">
          Traveller Manifest
        </h1>
        <p className="text-xs text-[#997C70] mt-1">
          Master passenger list across all booked trips & identity verification statuses.
        </p>
      </div>

      <div className="p-4 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs flex items-center justify-between">
        <GooeyInput
          placeholder="Search traveller, booking code, tour..."
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

      <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs">
        {loading ? (
          <div className="py-12 text-center text-xs text-[#997C70]">Loading traveller manifest...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#997C70]">No travellers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8DCD5] text-[#997C70] uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Traveller Name</th>
                  <th className="pb-3 font-semibold">Booking Code</th>
                  <th className="pb-3 font-semibold">Tour Title</th>
                  <th className="pb-3 font-semibold">Departure</th>
                  <th className="pb-3 font-semibold">Masked ID Number</th>
                  <th className="pb-3 font-semibold">ID Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DCD5]">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-[#FDF7F4] transition-colors">
                    <td className="py-3.5 font-bold text-[#685752]">{t.fullName}</td>
                    <td className="py-3.5 font-semibold text-[#8EB486]">{t.bookingCode}</td>
                    <td className="py-3.5 text-[#685752] max-w-[180px] truncate">{t.tourTitle}</td>
                    <td className="py-3.5 text-[#666059]">{t.departureDate}</td>
                    <td className="py-3.5 text-[#666059] font-mono">
                      {t.idNumberMasked ? `${t.idDocumentType}: ${t.idNumberMasked}` : "N/A"}
                    </td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        {t.idDocumentStatus}
                      </span>
                    </td>
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
