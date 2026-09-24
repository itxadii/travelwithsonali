"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  Trash2,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  MessageSquare,
  ShieldAlert,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

interface AdminReview {
  id: string;
  tourSlug: string;
  tourTitle: string;
  userName: string;
  userEmail?: string | null;
  rating: number;
  title?: string | null;
  comment: string;
  location?: string | null;
  tripDate?: string | null;
  isApproved: boolean;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviewsList, setReviewsList] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [tourFilter, setTourFilter] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteReview, setConfirmDeleteReview] = useState<AdminReview | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchAdminReviews();
  }, []);

  const fetchAdminReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviewsList(data || []);
      } else {
        // Fallback to public reviews if admin reviews empty
        const fallbackRes = await fetch("/api/reviews");
        if (fallbackRes.ok) {
          const fb = await fallbackRes.json();
          setReviewsList(fb.reviews || []);
        }
      }
    } catch (err) {
      console.error("Failed to fetch admin reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const confirmAndExecuteDelete = async () => {
    if (!confirmDeleteReview) return;

    try {
      setDeletingId(confirmDeleteReview.id);
      const res = await fetch(`/api/admin/reviews/${confirmDeleteReview.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setReviewsList((prev) => prev.filter((r) => r.id !== confirmDeleteReview.id));
        showToast("success", `Review by ${confirmDeleteReview.userName} deleted successfully.`);
        setConfirmDeleteReview(null);
      } else {
        const err = await res.json();
        showToast("error", err.error || "Failed to delete review.");
      }
    } catch (err) {
      console.error("Delete review error:", err);
      showToast("error", "An error occurred while deleting the review.");
    } finally {
      setDeletingId(null);
    }
  };

  // Unique list of tour titles for the filter
  const uniqueTours = Array.from(new Set(reviewsList.map((r) => r.tourTitle))).filter(Boolean);

  const filtered = reviewsList.filter((r) => {
    const matchesSearch =
      r.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.tourTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.location && r.location.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRating = ratingFilter === "all" || r.rating === ratingFilter;
    const matchesTour = tourFilter === "all" || r.tourTitle === tourFilter;

    return matchesSearch && matchesRating && matchesTour;
  });

  const totalReviews = reviewsList.length;
  const avgRating =
    totalReviews > 0
      ? (reviewsList.reduce((acc, curr) => acc + (curr.rating || 5), 0) / totalReviews).toFixed(1)
      : "5.0";
  const fiveStarsCount = reviewsList.filter((r) => r.rating === 5).length;
  const fiveStarPercent = totalReviews > 0 ? Math.round((fiveStarsCount / totalReviews) * 100) : 100;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl shadow-xl border text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${
            toastMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DCD5] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#8EB486]/20 text-[#8EB486] text-xs font-bold uppercase tracking-wider">
              Moderation & Trust
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#685752] mt-1">
            Tour Reviews & Testimonials
          </h1>
          <p className="text-sm text-[#7A6862] mt-0.5">
            Monitor public traveller reviews, verify feedback authenticity, and delete inappropriate content.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAdminReviews}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E8DCD5] bg-white text-xs font-bold text-[#685752] hover:bg-[#FDF7F4] active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#8EB486]" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E8DCD5] shadow-xs">
          <span className="text-xs font-semibold text-[#997C70] uppercase tracking-wider block">
            Total Reviews
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-[#685752]">{totalReviews}</span>
            <span className="text-xs text-emerald-600 font-medium">Published</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E8DCD5] shadow-xs">
          <span className="text-xs font-semibold text-[#997C70] uppercase tracking-wider block">
            Average Rating
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-[#685752]">{avgRating}</span>
            <span className="text-xs text-amber-500 font-bold flex items-center">
              <Star className="w-3.5 h-3.5 fill-current inline" /> / 5.0
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E8DCD5] shadow-xs">
          <span className="text-xs font-semibold text-[#997C70] uppercase tracking-wider block">
            5-Star Share
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-[#685752]">{fiveStarPercent}%</span>
            <span className="text-xs text-[#997C70]">({fiveStarsCount} reviews)</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E8DCD5] shadow-xs">
          <span className="text-xs font-semibold text-[#997C70] uppercase tracking-wider block">
            Moderation Controls
          </span>
          <div className="mt-2 text-xs text-[#7A6862] flex items-center gap-1.5 font-medium">
            <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Live moderation enabled</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E8DCD5] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#997C70] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by traveller, tour, or text..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F7EFEA] border border-[#E8DCD5] text-xs text-[#685752] focus:border-[#8EB486] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Tour Filter */}
          <select
            value={tourFilter}
            onChange={(e) => setTourFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-[#F7EFEA] border border-[#E8DCD5] text-xs text-[#685752] focus:border-[#8EB486] focus:outline-none"
          >
            <option value="all">All Tours ({reviewsList.length})</option>
            {uniqueTours.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Rating Filter */}
          <select
            value={ratingFilter}
            onChange={(e) =>
              setRatingFilter(e.target.value === "all" ? "all" : parseInt(e.target.value, 10))
            }
            className="px-3.5 py-2 rounded-xl bg-[#F7EFEA] border border-[#E8DCD5] text-xs text-[#685752] focus:border-[#8EB486] focus:outline-none"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars only</option>
            <option value="4">4 Stars only</option>
            <option value="3">3 Stars only</option>
            <option value="2">2 Stars only</option>
            <option value="1">1 Star only</option>
          </select>
        </div>
      </div>

      {/* Reviews Table / Cards */}
      {loading ? (
        <div className="py-16 text-center text-sm text-[#997C70]">
          Loading reviews...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#FFFDF9] border border-[#E8DCD5] text-center space-y-3">
          <MessageSquare className="w-10 h-10 text-[#997C70] mx-auto opacity-40" />
          <h3 className="text-base font-bold text-[#685752]">No reviews found</h3>
          <p className="text-xs text-[#7A6862]">
            Try clearing your search query or adjusting the filters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((rev) => (
            <div
              key={rev.id}
              className="p-5 sm:p-6 rounded-2xl bg-[#FFFDF9] border border-[#E8DCD5] shadow-xs space-y-3 hover:border-[#8EB486]/50 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Left: Reviewer & Tour Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[#685752] text-sm sm:text-base">
                      {rev.userName}
                    </span>
                    {rev.location && (
                      <span className="text-xs text-[#997C70]">
                        ({rev.location})
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full bg-[#8EB486]/15 text-[#8EB486] text-[11px] font-bold">
                      {rev.tourTitle}
                    </span>
                    {rev.tripDate && (
                      <span className="text-xs text-[#997C70]">
                        • {rev.tripDate}
                      </span>
                    )}
                  </div>
                  {rev.userEmail && (
                    <p className="text-xs text-[#997C70]">Email: {rev.userEmail}</p>
                  )}
                </div>

                {/* Right: Stars, Tour Link & Delete Button */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-stone-300"
                        }`}
                      />
                    ))}
                  </div>

                  <Link
                    href={`/tours/${rev.tourSlug}`}
                    target="_blank"
                    className="p-2 rounded-lg text-[#997C70] hover:text-[#685752] hover:bg-[#F7EFEA] transition-colors"
                    title="View Tour Page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    disabled={deletingId === rev.id}
                    onClick={() => setConfirmDeleteReview(rev)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                    title="Delete inappropriate or spam review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {/* Title & Review Content */}
              {rev.title && (
                <h4 className="font-bold text-[#685752] text-sm">
                  {rev.title}
                </h4>
              )}

              <p className="text-sm text-[#7A6862] leading-relaxed whitespace-pre-line bg-[#F7EFEA]/40 p-3 rounded-xl border border-[#E8DCD5]/60">
                {rev.comment}
              </p>

              {/* Metadata Footer */}
              <div className="flex items-center justify-between text-[11px] text-[#997C70] pt-1">
                <span>ID: {rev.id}</span>
                <span>
                  Submitted on{" "}
                  {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* In-App Confirmation Modal for Deleting Inappropriate Reviews */}
      {confirmDeleteReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#FFFDF9] border border-[#E8DCD5] shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-[#685752]">Delete Inappropriate Review?</h3>
              <p className="text-xs text-[#7A6862]">
                Are you sure you want to permanently delete this review? It will be immediately removed from the live website.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7EFEA] border border-[#E8DCD5] text-xs space-y-1 text-[#685752]">
              <p className="font-bold">{confirmDeleteReview.userName} ({confirmDeleteReview.tourTitle})</p>
              <p className="line-clamp-2 text-[#7A6862] italic">&ldquo;{confirmDeleteReview.comment}&rdquo;</p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteReview(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#E8DCD5] bg-white text-xs font-bold text-[#685752] hover:bg-[#FDF7F4] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={Boolean(deletingId)}
                onClick={confirmAndExecuteDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {deletingId ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
