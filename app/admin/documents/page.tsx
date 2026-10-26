"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, FileText } from "lucide-react";
import { GooeyInput } from "@/components/ui/gooey-input";

interface DocumentItem {
  id: string;
  customerName?: string;
  travellerName?: string;
  documentType: string;
  documentName: string;
  filePath?: string | null;
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
    let ignore = false;
    fetch("/api/admin/documents")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore && data) setDocList(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
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
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#685752] font-serif-italic">
          Identity Documents Verification Queue
        </h1>
        <p className="text-xs text-[#7A6862] mt-1">
          Review & verify sensitive customer/traveller identity documents (Aadhaar masked: XXXX XXXX 1234).
        </p>
      </div>

      <div className="p-4 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs flex items-center justify-between">
        <GooeyInput
          placeholder="Search document name or traveller..."
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
          <div className="py-12 text-center text-xs text-[#7A6862]">Loading verification queue...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#7A6862]">No identity documents found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8DCD5] text-[#7A6862] uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Document Name</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Traveller / Customer</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Verified By</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DCD5]">
                {filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-[#FDF7F4] transition-colors">
                    <td className="py-3.5 font-bold text-[#685752] flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{d.documentName}</span>
                    </td>
                    <td className="py-3.5 text-[#666059]">{d.documentType}</td>
                    <td className="py-3.5 text-[#685752] font-medium">{d.travellerName || d.customerName || "Customer"}</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
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
                    <td className="py-3.5 text-[#7A6862]">{d.verifiedBy || "Pending"}</td>
                    <td className="py-3.5 text-right space-x-2">
                      {d.filePath ? (
                        <a
                          href={`/api/admin/documents/${d.id}/file`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#F7EFEA] hover:bg-[#E8DCD5] text-[#685752] text-xs font-semibold"
                          title={d.filePath}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          View File
                        </a>
                      ) : (
                        <span className="text-xs text-[#7A6862]">No file</span>
                      )}
                      <button
                        onClick={() => handleUpdateStatus(d.id, "Verified")}
                        className="px-3 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-semibold cursor-pointer"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(d.id, "Rejected")}
                        className="px-3 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-semibold cursor-pointer"
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
