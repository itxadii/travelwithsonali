"use client";

import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { useEscapeKey } from "@/lib/useEscapeKey";

type Counts = Partial<Record<"bookings" | "travellers" | "payments" | "documents", number>>;

const COUNT_LABELS: Record<keyof Counts, [string, string]> = {
  bookings: ["booking", "bookings"],
  travellers: ["traveller", "travellers"],
  payments: ["payment record", "payment records"],
  documents: ["uploaded document", "uploaded documents"],
};

/**
 * Delete action with a confirmation dialog. For customers and bookings the dialog lists the
 * linked records that will be removed with it (fetched when it opens).
 */
export function DeleteButton({
  endpoint,
  itemLabel,
  noun,
  preview,
  note,
  onDeleted,
  variant = "pill",
}: {
  /** e.g. /api/admin/leads/lead-123 */
  endpoint: string;
  /** What is being deleted, shown in bold: a name or booking code */
  itemLabel: string;
  /** "lead", "customer", "booking"… used in the dialog copy */
  noun: string;
  /** Ask the server what else goes with it */
  preview?: { kind: "customer" | "booking"; id: string };
  /** Extra line under the warning, e.g. how paid amounts change */
  note?: string;
  onDeleted: () => void;
  variant?: "pill" | "icon" | "full";
}) {
  const [open, setOpen] = useState(false);
  const [counts, setCounts] = useState<Counts | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  useEscapeKey(open && !deleting, () => setOpen(false));

  const previewKind = preview?.kind;
  const previewId = preview?.id;
  useEffect(() => {
    if (!open || !previewKind || !previewId) return;
    let ignore = false;
    fetch(`/api/admin/delete-preview?kind=${previewKind}&id=${encodeURIComponent(previewId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore && data) setCounts(data);
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, [open, previewKind, previewId]);

  const openDialog = () => {
    setError("");
    setCounts(null);
    setOpen(true);
  };

  const confirm = async () => {
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || `Couldn't delete this ${noun}.`);
        return;
      }
      setOpen(false);
      onDeleted();
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setDeleting(false);
    }
  };

  const linked = counts
    ? (Object.keys(COUNT_LABELS) as (keyof Counts)[])
        .filter((k) => (counts[k] || 0) > 0)
        .map((k) => `${counts[k]} ${COUNT_LABELS[k][counts[k] === 1 ? 0 : 1]}`)
    : [];

  const trigger =
    variant === "icon" ? (
      <button
        type="button"
        onClick={openDialog}
        aria-label={`Delete ${noun} ${itemLabel}`}
        title={`Delete ${noun}`}
        className="w-9 h-9 inline-flex items-center justify-center rounded-full text-[#7A6862] hover:text-rose-700 hover:bg-rose-50 cursor-pointer transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    ) : (
      <button
        type="button"
        onClick={openDialog}
        className={`inline-flex items-center justify-center gap-1.5 rounded-full border border-rose-200 bg-white text-rose-700 hover:bg-rose-50 text-xs font-semibold cursor-pointer transition-colors ${
          variant === "full" ? "w-full min-h-11 px-4" : "px-3.5 py-2"
        }`}
      >
        <Trash2 className="w-3.5 h-3.5" />
        Delete {noun}
      </button>
    );

  return (
    <>
      {trigger}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-xs"
          onClick={() => !deleting && setOpen(false)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md p-5 sm:p-6 rounded-t-3xl sm:rounded-3xl bg-[#FFFDF9] border border-[#E8DCD5] shadow-2xl space-y-4 text-left max-h-[92dvh] overflow-y-auto"
          >
            <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <h2 id="delete-title" className="text-lg font-bold text-[#685752]">
              Delete this {noun}?
            </h2>
            <p className="text-sm text-[#7A6862] leading-relaxed">
              <span className="font-semibold text-[#685752] break-words">{itemLabel}</span> will be permanently deleted. This can&apos;t be undone.
            </p>

            {preview && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-sm text-rose-800">
                {!counts ? (
                  "Checking linked records…"
                ) : linked.length === 0 ? (
                  "Nothing else is linked to it."
                ) : (
                  <>
                    Also deleted with it: <span className="font-semibold">{linked.join(", ")}</span>.
                  </>
                )}
              </div>
            )}
            {note && <p className="text-sm text-[#7A6862]">{note}</p>}

            {error && (
              <p role="alert" className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-800">
                {error}
              </p>
            )}

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={deleting}
                className="min-h-11 px-5 rounded-full bg-[#FDF7F4] border border-[#E8DCD5] text-sm font-semibold text-[#685752] cursor-pointer disabled:opacity-50"
              >
                Keep it
              </button>
              <button
                type="button"
                onClick={confirm}
                disabled={deleting || (Boolean(preview) && !counts)}
                className="min-h-11 px-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {deleting ? "Deleting…" : `Delete ${noun}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
