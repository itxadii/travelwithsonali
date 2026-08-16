"use client";

import React, { useState, useEffect } from "react";
import { Users, ShieldCheck, FileCheck } from "lucide-react";

interface TravellerItem {
  id: string;
  bookingCode: string;
  tourTitle: string;
  fullName: string;
  dob?: string;
  gender?: string;
  mobile?: string;
  idDocumentType?: string;
  idNumberMasked?: string;
  idDocumentStatus: string;
}

export default function CustomerTravellersPage() {
  const [travellers, setTravellers] = useState<TravellerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTravellers() {
      try {
        const res = await fetch("/api/portal/travellers");
        if (res.ok) {
          const json = await res.json();
          setTravellers(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTravellers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1917] font-serif-italic">
          My Travellers Manifest
        </h1>
        <p className="text-xs text-[#7A746E] mt-1">
          Passports, identity document statuses, and traveller profiles for your group bookings.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-[#7A746E]">Loading traveller records...</div>
        ) : travellers.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#7A746E]">No travellers found in your bookings.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {travellers.map((t) => (
              <div key={t.id} className="p-5 rounded-2xl bg-[#FAF6F0] border border-[#EBE5DF] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#E05328] text-white font-bold flex items-center justify-center text-xs">
                      {t.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1C1917] text-sm">{t.fullName}</h3>
                      <p className="text-[11px] text-[#7A746E]">Booking {t.bookingCode} • {t.tourTitle}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {t.idDocumentStatus}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#EBE5DF] grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[#7A746E] block font-medium">Mobile Number</span>
                    <span className="text-[#1C1917] font-semibold">{t.mobile || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-[#7A746E] block font-medium">Identity Document</span>
                    <span className="text-[#1C1917] font-semibold">
                      {t.idNumberMasked ? `${t.idDocumentType} (${t.idNumberMasked})` : "Pending Upload"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
