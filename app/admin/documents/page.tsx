"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Search } from "lucide-react";

interface DocumentItem {
  id: string;
  customerName?: string;
  travellerName?: string;
  documentType: string;
  documentName: string;
  status: string;
  verifiedBy?: string;
  notes?: string;
  createdAt: string;
}

export default function DocumentsPage() {
  const [docList, setDocList] = useState<DocumentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDocs = async () => {
    try {
      const res = await fetch("/api/admin/documents");
      if (res.ok) {
        const data = await res.json();
        setDocList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUpdateStatus = async (documentId: string, status: "Verified" | "Rejected") => {
    try {
      const res = await fetch("/api/admin/documents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, status }),
      });

      if (res.ok) {
        fetchDocs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = docList.filter(
    (d) =>
      d.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.customerName && d.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.travellerName && d.travellerName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1917] font-serif-italic">
          Identity Documents Verification Queue
        </h1>
        <p className="text-xs text-[#7A746E] mt-1">
          Review & verify sensitive customer/traveller identity documents (Aadhaar masked: XXXX XXXX 1234).
        </p>
      </div>

      <div className="p-4 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#9A938C]" />
          <input
            type="text"
            placeholder="Search document name or traveller..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-[#FAF6F0] border border-[#EBE5DF] text-xs text-[#1C1917] placeholder-[#9A938C] focus:outline-none focus:border-[#E05328]"
          />
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs">
        {loading ? (
          <div className="py-12 text-center text-xs text-[#7A746E]">Loading verification queue...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#7A746E]">No identity documents found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EBE5DF] text-[#7A746E] uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Document Name</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Traveller / Customer</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Verified By</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE5DF]">
                {filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-[#FAF6F0] transition-colors">
                    <td className="py-3.5 font-bold text-[#1C1917] flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{d.documentName}</span>
                    </td>
                    <td className="py-3.5 text-[#666059]">{d.documentType}</td>
                    <td className="py-3.5 text-[#1C1917] font-medium">{d.travellerName || d.customerName || "Customer"}</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                          d.status === "Verified"
                            ? "bg-emerald-100 text-emerald-800"
                            : d.status === "Rejected"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-[#7A746E]">{d.verifiedBy || "Pending"}</td>
                    <td className="py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleUpdateStatus(d.id, "Verified")}
                        className="px-3 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-semibold cursor-pointer"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(d.id, "Rejected")}
                        className="px-3 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 text-[11px] font-semibold cursor-pointer"
                      >
                        Reject
                      </button>
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
