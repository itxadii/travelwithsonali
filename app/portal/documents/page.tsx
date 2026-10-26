"use client";

import React, { useState, useEffect } from "react";
import { Upload, ShieldCheck, Plus, FileText } from "lucide-react";
import { useEscapeKey } from "@/lib/useEscapeKey";

interface DocItem {
  id: string;
  documentType: string;
  documentName: string;
  travellerName: string;
  filePath?: string | null;
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
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
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
    let ignore = false;
    fetch("/api/portal/documents")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!ignore && json) {
          setDocs(json.documents);
          setSummary(json.summary);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setUploadError("Please choose a file to upload.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setUploadError("File is too large. The maximum size is 4 MB.");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const body = new FormData();
      body.append("documentType", documentType);
      body.append("file", file);

      const res = await fetch("/api/portal/documents", { method: "POST", body });

      if (res.ok) {
        closeUploadModal();
        fetchDocs();
      } else {
        const json = await res.json().catch(() => null);
        setUploadError(json?.error || "Upload failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setUploadError("Upload failed. Please check your connection and try again.");
    } finally {
      setUploading(false);
    }
  };

  const closeUploadModal = () => {
    setUploadModalOpen(false);
    setFile(null);
    setUploadError("");
  };

  useEscapeKey(uploadModalOpen, closeUploadModal);

  const progressPercent = summary.total > 0 ? Math.round((summary.completed / summary.total) * 100) : 100;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#685752] font-serif-italic">
            Identity & Trip Documents
          </h1>
          <p className="text-xs text-[#7A6862] mt-1">
            Complete required traveller identity verification before departure.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4A7244] hover:bg-[#3F6339] text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
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
            <p className="text-xs text-[#7A6862]">{summary.completed} of {summary.total} Documents Uploaded & Verified</p>
          </div>
          <span className="text-2xl font-bold text-[#4A7244]">{progressPercent}%</span>
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
          <div className="py-12 text-center text-xs text-[#7A6862]">Loading documents...</div>
        ) : docs.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#7A6862]">No documents uploaded yet.</div>
        ) : (
          <div className="space-y-3 text-xs">
            {docs.map((d) => (
              <div key={d.id} className="p-4 rounded-2xl bg-[#FDF7F4] border border-[#E8DCD5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-[#E8DCD5] text-[#4A7244] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#685752] text-sm">{d.documentName}</h4>
                    <p className="text-[#7A6862]">Type: {d.documentType} • Traveller: {d.travellerName}</p>
                    {d.notes && <p className="text-rose-600 font-semibold mt-0.5">{d.notes}</p>}
                    {d.filePath && (
                      <a
                        href={`/api/portal/documents/${d.id}/file`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-1 font-semibold text-[#4F7A49] hover:underline"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        View uploaded file
                      </a>
                    )}
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
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
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={closeUploadModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-doc-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl p-6 border border-[#E8DCD5] shadow-2xl space-y-6"
          >
            <h2 id="upload-doc-title" className="text-xl font-bold text-[#685752]">Upload Required Document</h2>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label htmlFor="upload-doc-type" className="text-[#7A6862] font-semibold">Document Type</label>
                <select
                  id="upload-doc-type"
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

              <label
                htmlFor="upload-doc-file"
                className="block p-4 rounded-2xl bg-[#FDF7F4] border border-dashed border-[#C9B8AE] text-center space-y-1 text-xs cursor-pointer hover:border-[#8EB486] focus-within:border-[#8EB486] focus-within:ring-2 focus-within:ring-[#8EB486]/40"
              >
                <Upload className="w-6 h-6 text-[#4F7A49] mx-auto" />
                <p className="font-semibold text-[#685752]">
                  {file ? file.name : "Choose document file (PDF, JPG, PNG, WEBP)"}
                </p>
                <p className="text-xs text-[#7A6862]">
                  {file
                    ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                    : "Maximum 4 MB. Only our team can view your document."}
                </p>
                <input
                  id="upload-doc-file"
                  type="file"
                  required
                  accept="application/pdf,image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    setFile(e.target.files?.[0] ?? null);
                    setUploadError("");
                  }}
                  className="sr-only"
                />
              </label>

              {uploadError && (
                <p role="alert" className="text-xs font-semibold text-rose-700">
                  {uploadError}
                </p>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeUploadModal}
                  className="px-4 py-2 rounded-full bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2 rounded-full bg-[#4A7244] text-white font-semibold cursor-pointer shadow-sm disabled:opacity-50"
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
