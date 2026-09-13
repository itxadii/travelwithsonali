"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { ChevronLeft, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";

interface LeadDetailData {
  lead: {
    id: string;
    name: string;
    mobile: string;
    email?: string;
    interestedTourTitle: string;
    source: string;
    travellersCount: number;
    status: string;
    assignedTo?: string;
    notes?: string;
    createdAt: string;
  };
  followups: {
    id: string;
    note: string;
    createdBy: string;
    createdAt: string;
  }[];
}

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [data, setData] = useState<LeadDetailData | null>(null);
  const [newNote, setNewNote] = useState("");
  const [status, setStatus] = useState("New");
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    try {
      const res = await fetch(`/api/admin/leads/${id}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setStatus(json.lead.status);
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          followupNote: newNote ? newNote : undefined,
        }),
      });

      if (res.ok) {
        setNewNote("");
        fetchDetail();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-[#997C70]">Loading lead details...</div>;
  }

  if (!data) {
    return <div className="p-8 text-center text-xs text-rose-600">Lead not found.</div>;
  }

  const { lead, followups } = data;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/leads"
          className="p-2 rounded-xl bg-white border border-[#E8DCD5] text-[#997C70] hover:text-[#685752]"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#685752] font-serif-italic">{lead.name}</h1>
          <p className="text-xs text-[#997C70]">Lead ID: {lead.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Lead Profile Info */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#E8DCD5] pb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#997C70]">
              Lead Details
            </span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#8EB486]/10 text-[#8EB486]">
              {lead.status}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[#997C70] block font-medium">Customer Name</span>
              <span className="text-[#685752] font-bold text-sm">{lead.name}</span>
            </div>

            <div>
              <span className="text-[#997C70] block font-medium">Mobile Number</span>
              <span className="text-[#685752] flex items-center gap-1.5 mt-0.5 font-semibold">
                <Phone className="w-3.5 h-3.5 text-[#8EB486]" />
                {lead.mobile}
              </span>
            </div>

            {lead.email && (
              <div>
                <span className="text-[#997C70] block font-medium">Email Address</span>
                <span className="text-[#685752] flex items-center gap-1.5 mt-0.5 font-semibold">
                  <Mail className="w-3.5 h-3.5 text-[#8EB486]" />
                  {lead.email}
                </span>
              </div>
            )}

            <div>
              <span className="text-[#997C70] block font-medium">Interested Tour Package</span>
              <span className="text-[#8EB486] font-semibold">{lead.interestedTourTitle}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E8DCD5]">
              <div>
                <span className="text-[#997C70] block">Source</span>
                <span className="text-[#685752] font-semibold">{lead.source}</span>
              </div>
              <div>
                <span className="text-[#997C70] block">Travellers</span>
                <span className="text-[#685752] font-semibold">{lead.travellersCount} Person(s)</span>
              </div>
            </div>

            {lead.notes && (
              <div className="pt-2 border-t border-[#E8DCD5]">
                <span className="text-[#997C70] block font-medium">Initial Notes</span>
                <p className="text-[#4A4540] text-[11px] leading-relaxed mt-1">{lead.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Status Update & Activity Timeline */}
        <div className="lg:col-span-8 space-y-6">
          {/* Status Update Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#685752]">Update Lead Status & Add Log Note</h3>

            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[#997C70] font-semibold">Change Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] focus:outline-none focus:border-[#8EB486]"
                >
                  {["New", "Contacted", "Interested", "Follow-up", "Booking Pending", "Converted", "Lost"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {status === "Converted" && (
                  <p className="text-[11px] text-emerald-700 font-semibold pt-1">
                    ✨ Setting status to &quot;Converted&quot; will automatically add this customer into your Customers directory!
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[#997C70] font-semibold">Add Follow-up / Activity Note</label>
                <textarea
                  rows={3}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Record customer response, itinerary requested, call outcome..."
                  className="w-full p-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] focus:outline-none focus:border-[#8EB486]"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#8EB486] hover:bg-[#7A9F73] text-white font-semibold text-xs cursor-pointer shadow-sm"
              >
                Save Update
              </button>
            </form>
          </div>

          {/* Activity Timeline */}
          <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#685752] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8EB486]" />
              Follow-up History & Timeline
            </h3>

            {followups.length === 0 ? (
              <p className="text-xs text-[#997C70] py-4 text-center">No follow-up activity logged yet.</p>
            ) : (
              <div className="space-y-3">
                {followups.map((f) => (
                  <div key={f.id} className="p-4 rounded-2xl bg-[#FDF7F4] border border-[#E8DCD5] space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-[#997C70]">
                      <span className="font-semibold text-[#685752]">{f.createdBy}</span>
                      <span>{new Date(f.createdAt).toLocaleString("en-IN")}</span>
                    </div>
                    <p className="text-[#4A4540] leading-relaxed pt-1">{f.note}</p>
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
