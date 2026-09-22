"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, ArrowUpRight } from "lucide-react";
import { GooeyInput } from "@/components/ui/gooey-input";
import { TOURS_DATA } from "@/app/data/toursData";

interface LeadItem {
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
}

export default function LeadsPage() {
  const [leadsList, setLeadsList] = useState<LeadItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    interestedTourTitle: "Manali & Kasol Group Trip",
    source: "Website",
    travellersCount: 2,
    notes: "",
  });

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/admin/leads");
      if (res.ok) {
        const data = await res.json();
        setLeadsList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setCreateModalOpen(false);
        setFormData({
          name: "",
          mobile: "",
          email: "",
          interestedTourTitle: "Manali & Kasol Group Trip",
          source: "Website",
          travellersCount: 2,
          notes: "",
        });
        fetchLeads();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLeads = leadsList.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.mobile.includes(searchQuery) ||
      lead.interestedTourTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
    const matchesSource = sourceFilter === "All" || lead.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#685752] font-serif-italic">
            Leads Directory
          </h1>
          <p className="text-xs text-[#997C70] mt-1">
            Manage incoming customer enquiries across Instagram, WhatsApp & Website.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8EB486] hover:bg-[#7A9F73] text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs">
        {/* Animated Search */}
        <div className="flex items-center w-full md:w-auto">
          <GooeyInput
            placeholder="Search name, phone, tour..."
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

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase text-[#997C70] font-bold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-full bg-[#FDF7F4] border border-[#E8DCD5] text-xs text-[#685752] focus:outline-none"
            >
              {["All", "New", "Contacted", "Interested", "Follow-up", "Booking Pending", "Converted", "Lost"].map(
                (s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase text-[#997C70] font-bold">Source:</span>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-3 py-1.5 rounded-full bg-[#FDF7F4] border border-[#E8DCD5] text-xs text-[#685752] focus:outline-none"
            >
              {["All", "Instagram", "Facebook", "WhatsApp", "Website", "Referral", "Google", "Other"].map(
                (src) => (
                  <option key={src} value={src}>
                    {src}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs">
        {loading ? (
          <div className="py-12 text-center text-xs text-[#997C70]">Loading leads...</div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <p className="text-sm text-[#997C70]">No leads found matching your filters.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("All");
                setSourceFilter("All");
              }}
              className="px-4 py-2 rounded-full bg-[#FDF7F4] border border-[#E8DCD5] text-xs text-[#685752]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8DCD5] text-[#997C70] uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Lead Name</th>
                  <th className="pb-3 font-semibold">Mobile</th>
                  <th className="pb-3 font-semibold">Interested Tour</th>
                  <th className="pb-3 font-semibold">Source</th>
                  <th className="pb-3 font-semibold">Travellers</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Created</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DCD5]">
                {filteredLeads.map((l) => (
                  <tr key={l.id} className="hover:bg-[#FDF7F4] transition-colors">
                    <td className="py-3.5 font-bold text-[#685752]">{l.name}</td>
                    <td className="py-3.5 text-[#666059]">{l.mobile}</td>
                    <td className="py-3.5 text-[#685752] max-w-[200px] truncate">{l.interestedTourTitle}</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FDF7F4] border border-[#E8DCD5] text-[10px] text-[#666059]">
                        {l.source}
                      </span>
                    </td>
                    <td className="py-3.5 text-[#685752] font-medium">{l.travellersCount}</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                          l.status === "New"
                            ? "bg-blue-100 text-blue-800"
                            : l.status === "Converted"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-[#997C70]">
                      {new Date(l.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        href={`/admin/leads/${l.id}`}
                        className="px-3 py-1.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] hover:bg-[#8EB486] hover:text-white hover:border-[#8EB486] text-[#685752] text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                      >
                        <span>View</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Lead Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 border border-[#E8DCD5] shadow-2xl space-y-6">
            <h2 className="text-xl font-bold text-[#685752]">Add New Lead</h2>

            <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#997C70] font-semibold">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Rahul Verma"
                    className="w-full p-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] focus:outline-none focus:border-[#8EB486]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#997C70] font-semibold">Mobile Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] focus:outline-none focus:border-[#8EB486]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#997C70] font-semibold">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="rahul@example.com"
                    className="w-full p-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] focus:outline-none focus:border-[#8EB486]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#997C70] font-semibold">Travellers</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.travellersCount}
                    onChange={(e) => setFormData({ ...formData, travellersCount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] focus:outline-none focus:border-[#8EB486]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#997C70] font-semibold">Interested Tour *</label>
                <select
                  value={formData.interestedTourTitle}
                  onChange={(e) => setFormData({ ...formData, interestedTourTitle: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] focus:outline-none focus:border-[#8EB486]"
                >
                  {TOURS_DATA.map((t) => (
                    <option key={t.id} value={t.title}>
                      {t.title} ({t.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[#997C70] font-semibold">Lead Source</label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] focus:outline-none focus:border-[#8EB486]"
                >
                  {["Website", "Instagram", "Facebook", "WhatsApp", "Referral", "Google", "Other"].map((src) => (
                    <option key={src} value={src}>
                      {src}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[#997C70] font-semibold">Initial Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Preferences, requested dates, group details..."
                  className="w-full p-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] focus:outline-none focus:border-[#8EB486]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#8EB486] text-white font-semibold cursor-pointer shadow-sm"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
