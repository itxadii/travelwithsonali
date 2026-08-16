"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

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
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1917] font-serif-italic">
          Traveller Manifest
        </h1>
        <p className="text-xs text-[#7A746E] mt-1">
          Master passenger list across all booked trips & identity verification statuses.
        </p>
      </div>

      <div className="p-4 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#9A938C]" />
          <input
            type="text"
            placeholder="Search traveller, booking code, tour..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-[#FAF6F0] border border-[#EBE5DF] text-xs text-[#1C1917] placeholder-[#9A938C] focus:outline-none focus:border-[#E05328]"
          />
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs">
        {loading ? (
          <div className="py-12 text-center text-xs text-[#7A746E]">Loading traveller manifest...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#7A746E]">No travellers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EBE5DF] text-[#7A746E] uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Traveller Name</th>
                  <th className="pb-3 font-semibold">Booking Code</th>
                  <th className="pb-3 font-semibold">Tour Title</th>
                  <th className="pb-3 font-semibold">Departure</th>
                  <th className="pb-3 font-semibold">Masked ID Number</th>
                  <th className="pb-3 font-semibold">ID Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE5DF]">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-[#FAF6F0] transition-colors">
                    <td className="py-3.5 font-bold text-[#1C1917]">{t.fullName}</td>
                    <td className="py-3.5 font-semibold text-[#E05328]">{t.bookingCode}</td>
                    <td className="py-3.5 text-[#1C1917] max-w-[180px] truncate">{t.tourTitle}</td>
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
