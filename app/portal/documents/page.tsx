"use client";

import React, { useState, useEffect } from "react";
import { FileCheck, Upload, ShieldCheck, AlertCircle, Plus } from "lucide-react";

interface DocItem {
  id: string;
  documentType: string;
  documentName: string;
  travellerName: string;
  status: string;
  notes?: string;
}

interface SummaryData {
  total: number;
  completed: number;
  pending: number;
}

export default function CustomerDocumentsPage() {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [summary, setSummary] = useState<SummaryData>({ total: 0, completed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Form State
  const [documentType, setDocumentType] = useState("Aadhaar");
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchDocs = async () => {
    try {
      const res = await fetch("/api/portal/documents");
      if (res.ok) {
        const json = await res.json();
        setDocs(json.documents);
        setSummary(json.summary);
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

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) return;

    setUploading(true);

    try {
      const res = await fetch("/api/portal/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentType,
          documentName: fileName,
        }),
      });

      if (res.ok) {
        setUploadModalOpen(false);
        setFileName("");
        fetchDocs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const progressPercent = summary.total > 0 ? Math.round((summary.completed / summary.total) * 100) : 100;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#685752] font-serif-italic">
            Identity & Trip Documents
          </h1>
          <p className="text-xs text-[#997C70] mt-1">
            Complete required traveller identity verification before departure.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8EB486] hover:bg-[#7A9F73] text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Document Completion Banner */}
      <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#685752]">Trip Document Status</h3>
            <p className="text-xs text-[#997C70]">{summary.completed} of {summary.total} Documents Uploaded & Verified</p>
          </div>
          <span className="text-2xl font-bold text-[#8EB486]">{progressPercent}%</span>
        </div>

        <div className="w-full h-2.5 rounded-full bg-[#FDF7F4] overflow-hidden border border-[#E8DCD5]">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Document List */}
      <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-[#997C70]">Loading documents...</div>
        ) : docs.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#997C70]">No documents uploaded yet.</div>
        ) : (
          <div className="space-y-3 text-xs">
            {docs.map((d) => (
              <div key={d.id} className="p-4 rounded-2xl bg-[#FDF7F4] border border-[#E8DCD5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-[#E8DCD5] text-[#8EB486] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#685752] text-sm">{d.documentName}</h4>
                    <p className="text-[#997C70]">Type: {d.documentType} • Traveller: {d.travellerName}</p>
                    {d.notes && <p className="text-rose-600 font-semibold mt-0.5">{d.notes}</p>}
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    d.status === "Verified"
                      ? "bg-emerald-100 text-emerald-800"
                      : d.status === "Rejected"
                      ? "bg-rose-100 text-rose-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-[#E8DCD5] shadow-2xl space-y-6">
            <h2 className="text-xl font-bold text-[#685752]">Upload Required Document</h2>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[#997C70] font-semibold">Document Type</label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] focus:outline-none focus:border-[#8EB486]"
                >
                  {["Aadhaar Card", "Passport", "Voter ID", "Driving License", "Medical Certificate"].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[#997C70] font-semibold">Document File Name / Reference</label>
                <input
                  type="text"
                  required
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g. Aadhaar_Rahul_Verma.pdf"
                  className="w-full p-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] focus:outline-none focus:border-[#8EB486]"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#FDF7F4] border border-[#E8DCD5] text-center space-y-1 text-xs">
                <Upload className="w-6 h-6 text-[#8EB486] mx-auto" />
                <p className="font-semibold text-[#685752]">Select document file (PDF, JPG, PNG)</p>
                <p className="text-[10px] text-[#997C70]">Your document will be encrypted and submitted for admin review.</p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2 rounded-full bg-[#8EB486] text-white font-semibold cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {uploading ? "Submitting..." : "Submit Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
