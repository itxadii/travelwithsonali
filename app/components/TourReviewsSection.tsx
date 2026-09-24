"use client";

import React, { useState, useEffect } from "react";
import { Star, CheckCircle, MessageSquare, ThumbsUp, X, Plus, AlertTriangle } from "lucide-react";

export interface TourReview {
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

interface TourReviewsSectionProps {
  tourSlug: string;
  tourTitle: string;
}

export default function TourReviewsSection({ tourSlug, tourTitle }: TourReviewsSectionProps) {
  const [reviewsList, setReviewsList] = useState<TourReview[]>([]);
  const [stats, setStats] = useState({
    averageRating: 5.0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>,
  });
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<number | "all">("all");

  // Form states
  const [formOpen, setFormOpen] = useState(false);
  const [hoverRating, setHoverRating] = useState(5);
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    rating: 5,
    title: "",
    comment: "",
    location: "",
    tripDate: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const ratingDescriptions: Record<number, string> = {
    5: "Exceptional Experience (5/5)",
    4: "Great Journey (4/5)",
    3: "Average Trip (3/5)",
    2: "Needs Improvement (2/5)",
    1: "Disappointing (1/5)",
  };

  useEffect(() => {
    fetchReviews();
  }, [tourSlug]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reviews?tourSlug=${encodeURIComponent(tourSlug)}`);
      if (res.ok) {
        const data = await res.json();
        setReviewsList(data.reviews || []);
        setStats({
          averageRating: data.averageRating || 5.0,
          totalReviews: data.totalReviews || 0,
          ratingDistribution: data.ratingDistribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        });
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userName.trim() || !formData.comment.trim()) {
      setErrorMessage("Please enter your name and review experience.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage("");

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourSlug,
          tourTitle,
          userName: formData.userName,
          userEmail: formData.userEmail,
          rating: formData.rating,
          title: formData.title,
          comment: formData.comment,
          location: formData.location,
          tripDate: formData.tripDate,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to submit review");
      }

      setSubmitSuccess(true);
      if (result.review) {
        setReviewsList((prev) => [result.review, ...prev]);
        setStats((prev) => {
          const newTotal = prev.totalReviews + 1;
          const stars = result.review.rating || 5;
          const newDist = { ...prev.ratingDistribution, [stars]: (prev.ratingDistribution[stars] || 0) + 1 };
          return {
            ...prev,
            totalReviews: newTotal,
            ratingDistribution: newDist,
          };
        });
      }

      setTimeout(() => {
        setFormOpen(false);
        setSubmitSuccess(false);
        setFormData({
          userName: "",
          userEmail: "",
          rating: 5,
          title: "",
          comment: "",
          location: "",
          tripDate: "",
        });
      }, 2500);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReviews = reviewsList.filter((r) => {
    if (filterRating === "all") return true;
    return r.rating === filterRating;
  });

  return (
    <div id="reviews-section" className="space-y-8 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8DCD5] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#8EB486]/20 text-[#8EB486] text-xs font-bold uppercase tracking-wider">
              Traveller Feedback
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#685752] mt-2">
            Traveller Stories & Reviews
          </h2>
          <p className="text-sm text-[#7A6862] mt-1">
            Real feedback and genuine experiences from travellers who embarked on this journey.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setFormOpen((prev) => !prev)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#8EB486] hover:bg-[#7A9F73] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer shrink-0 w-full sm:w-auto"
        >
          {formOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{formOpen ? "Close Form" : "Write a Review"}</span>
        </button>
      </div>

      {/* Review Submission Form Card */}
      {formOpen && (
        <div className="p-5 sm:p-8 rounded-3xl bg-[#F7EFEA] border-2 border-[#8EB486]/40 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
          {submitSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#685752]">Thank You for Your Review!</h3>
              <p className="text-sm text-[#7A6862] max-w-md mx-auto">
                Your feedback has been successfully shared with fellow travellers. We truly appreciate you taking the time!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#E8DCD5] pb-3">
                <h3 className="text-lg font-bold text-[#685752] flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#8EB486]" />
                  <span>Share Your Experience on {tourTitle}</span>
                </h3>
                <span className="text-xs text-[#997C70] font-medium">* Required</span>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Star Rating Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#685752] block">
                  Your Overall Rating *
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormData((p) => ({ ...p, rating: star }))}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(formData.rating)}
                        className="p-1 rounded-lg hover:scale-115 transition-transform cursor-pointer focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= (hoverRating || formData.rating)
                              ? "fill-amber-400 text-amber-400 drop-shadow-xs"
                              : "text-stone-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#8EB486] bg-white px-3 py-1 rounded-full border border-[#E8DCD5]">
                    {ratingDescriptions[hoverRating || formData.rating]}
                  </span>
                </div>
              </div>

              {/* Two-Column Grid for Name and Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#685752] block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    placeholder="e.g. Pooja Sharma"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E8DCD5] text-sm text-[#685752] focus:border-[#8EB486] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#685752] block mb-1">
                    Your City / Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Mumbai, India"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E8DCD5] text-sm text-[#685752] focus:border-[#8EB486] focus:outline-none"
                  />
                </div>
              </div>

              {/* Two-Column Grid for Batch and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#685752] block mb-1">
                    Trip Month / Batch
                  </label>
                  <input
                    type="text"
                    value={formData.tripDate}
                    onChange={(e) => setFormData({ ...formData, tripDate: e.target.value })}
                    placeholder="e.g. May 2026 Batch"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E8DCD5] text-sm text-[#685752] focus:border-[#8EB486] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#685752] block mb-1">
                    Email Address <span className="text-[10px] text-[#997C70] lowercase">(kept private)</span>
                  </label>
                  <input
                    type="email"
                    value={formData.userEmail}
                    onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                    placeholder="e.g. pooja@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E8DCD5] text-sm text-[#685752] focus:border-[#8EB486] focus:outline-none"
                  />
                </div>
              </div>

              {/* Review Headline */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#685752] block mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. The most memorable Himalayan pilgrimage!"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E8DCD5] text-sm text-[#685752] focus:border-[#8EB486] focus:outline-none"
                />
              </div>

              {/* Review Comment */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#685752] block mb-1">
                  Detailed Experience & Tips for Travellers *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Tell other travellers about the vehicle, stays, food, coordinator, and your favorite moments..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E8DCD5] text-sm text-[#685752] focus:border-[#8EB486] focus:outline-none resize-y"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#E8DCD5] bg-white text-xs font-bold text-[#685752] hover:bg-[#FDF7F4] cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-7 py-2.5 rounded-full bg-[#8EB486] hover:bg-[#7A9F73] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50 text-center"
                >
                  {submitting ? "Publishing Review..." : "Publish Review"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Overview Breakdown Card */}
      <div className="p-5 sm:p-8 rounded-3xl bg-[#F7EFEA] border border-[#E8DCD5] grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
        {/* Left Rating Big Number */}
        <div className="md:col-span-4 text-center md:border-r md:border-[#E8DCD5] md:pr-6 space-y-2">
          <span className="text-4xl sm:text-6xl font-extrabold text-[#685752] tracking-tight">
            {stats.averageRating.toFixed(1)}
          </span>
          <div className="flex items-center justify-center gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  s <= Math.round(stats.averageRating) ? "fill-amber-400 text-amber-400" : "text-stone-300"
                }`}
              />
            ))}
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#997C70]">
            Based on {stats.totalReviews} verified traveller {stats.totalReviews === 1 ? "review" : "reviews"}
          </p>
        </div>

        {/* Right Rating Progress Bars */}
        <div className="md:col-span-8 space-y-2.5">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = stats.ratingDistribution[stars] || 0;
            const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-2 sm:gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setFilterRating(filterRating === stars ? "all" : stars)}
                  className={`flex items-center gap-1 w-12 sm:w-14 font-semibold text-left transition-colors cursor-pointer shrink-0 ${
                    filterRating === stars ? "text-[#8EB486] font-bold" : "text-[#7A6862] hover:text-[#685752]"
                  }`}
                >
                  <span>{stars}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </button>
                <div className="flex-1 h-2 rounded-full bg-[#E8DCD5] overflow-hidden">
                  <div
                    className="h-full bg-[#8EB486] rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 sm:w-10 text-right font-medium text-[#997C70] shrink-0">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 text-xs font-semibold scroll-smooth">
        <button
          type="button"
          onClick={() => setFilterRating("all")}
          className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-full transition-all cursor-pointer ${
            filterRating === "all"
              ? "bg-[#685752] text-white shadow-xs"
              : "bg-[#F7EFEA] text-[#7A6862] hover:bg-[#E8DCD5]"
          }`}
        >
          All Reviews ({reviewsList.length})
        </button>
        {[5, 4, 3, 2, 1].map((st) => (
          <button
            type="button"
            key={st}
            onClick={() => setFilterRating(st)}
            className={`shrink-0 whitespace-nowrap px-3.5 py-2 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
              filterRating === st
                ? "bg-[#8EB486] text-white shadow-xs"
                : "bg-[#F7EFEA] text-[#7A6862] hover:bg-[#E8DCD5]"
            }`}
          >
            <span>{st}</span>
            <Star className="w-3 h-3 fill-current" />
            <span>({stats.ratingDistribution[st] || 0})</span>
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="py-12 text-center text-sm text-[#997C70]">
          Loading reviews...
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="p-8 rounded-3xl bg-[#F7EFEA] border border-[#E8DCD5] text-center space-y-3">
          <MessageSquare className="w-8 h-8 text-[#997C70] mx-auto opacity-40" />
          <h4 className="text-base font-bold text-[#685752]">No reviews match this filter</h4>
          <p className="text-xs text-[#7A6862]">
            Be the first to share your experience on this trip!
          </p>
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="px-5 py-2 rounded-full bg-[#8EB486] text-white text-xs font-bold hover:bg-[#7A9F73]"
          >
            Write a Review
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 sm:p-6 rounded-2xl bg-[#F7EFEA] border border-[#E8DCD5] shadow-xs space-y-3 transition-all hover:border-[#8EB486]/50 relative overflow-hidden"
            >
              {/* Header: User avatar, name, verification badge, and rating stars */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#685752] text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-xs">
                    {rev.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="font-bold text-[#685752] text-sm break-words">{rev.userName}</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold shrink-0">
                        <CheckCircle className="w-2.5 h-2.5 text-emerald-600" />
                        Verified Traveller
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#997C70] mt-0.5">
                      {rev.location && <span>{rev.location}</span>}
                      {rev.location && rev.tripDate && <span>•</span>}
                      {rev.tripDate && <span>{rev.tripDate}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 sm:gap-1 text-amber-400 shrink-0">
                  {/* Rating Stars */}
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                        s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-stone-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Title & Comment */}
              {rev.title && (
                <h4 className="text-base font-bold text-[#685752] break-words">
                  {rev.title}
                </h4>
              )}

              <p className="text-sm text-[#7A6862] leading-relaxed whitespace-pre-line break-words">
                {rev.comment}
              </p>

              {/* Date footer */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#997C70] border-t border-[#E8DCD5]/60">
                <span>
                  Travelled with Travel With Sonali
                </span>
                <span>
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
    </div>
  );
}
