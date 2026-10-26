"use client";

import React, { useEffect, useRef, useState } from "react";
import { Star, CheckCircle, X } from "lucide-react";
import { useEscapeKey } from "@/lib/useEscapeKey";

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

const INITIAL_VISIBLE = 5;
const RATING_LABELS: Record<number, string> = { 5: "Excellent", 4: "Great", 3: "Okay", 2: "Poor", 1: "Bad" };

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7244] focus-visible:ring-offset-2";
const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white border border-[#E8DCD5] text-base sm:text-sm text-[#685752] placeholder:text-[#7A6862]/70 focus:outline-none focus:border-[#4A7244] focus:ring-2 focus:ring-[#4A7244]/20";

function Stars({ rating, size = "w-4 h-4" }: { rating: number; size?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`${size} ${s <= rating ? "fill-amber-400 text-amber-400" : "text-stone-300"}`} aria-hidden="true" />
      ))}
    </span>
  );
}

function ReviewDialog({ tourSlug, tourTitle, onClose }: TourReviewsSectionProps & { onClose: () => void }) {
  const [form, setForm] = useState({ rating: 0, userName: "", location: "", tripDate: "", comment: "" });
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const firstFieldRef = useRef<HTMLButtonElement>(null);

  useEscapeKey(true, onClose);

  // Focus the dialog on open, lock page scroll, and return focus when closed
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    firstFieldRef.current?.focus();
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      lenis?.start();
      previouslyFocused?.focus?.();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.rating) return setError("Please choose a star rating.");
    if (!form.userName.trim() || !form.comment.trim()) return setError("Please add your name and your review.");

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tourSlug, tourTitle, ...form }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result.error || "Couldn't send your review. Please try again.");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const shownRating = hoverRating || form.rating;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-dialog-title"
        data-lenis-prevent
        className="relative w-full sm:max-w-lg max-h-[92dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[#FDF7F4] shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 px-5 sm:px-6 pt-5 pb-3 bg-[#FDF7F4]">
          <div>
            <h2 id="review-dialog-title" className="text-xl sm:text-2xl font-serif-italic font-bold text-[#685752]">
              Write a review
            </h2>
            <p className="text-sm text-[#7A6862] mt-0.5">{tourTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`p-2.5 -mr-2 rounded-full text-[#7A6862] hover:bg-[#F7EFEA] cursor-pointer ${focusRing}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="px-6 pb-8 pt-4 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-[#4A7244] mx-auto" aria-hidden="true" />
            <h3 className="text-lg font-bold text-[#685752]">Thank you for your review</h3>
            <p className="text-sm text-[#7A6862] max-w-sm mx-auto">
              It will appear on this page once our team has checked it.
            </p>
            <button
              type="button"
              onClick={onClose}
              className={`mt-2 px-6 py-3 rounded-full bg-[#4A7244] hover:bg-[#3F6339] text-white text-sm font-semibold cursor-pointer ${focusRing}`}
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="px-5 sm:px-6 pb-6 pt-2 space-y-5">
            <fieldset>
              <legend className="text-sm font-semibold text-[#685752] mb-2">
                Your rating <span className="text-rose-700">*</span>
              </legend>
              <div className="flex items-center gap-3">
                <div className="flex items-center" onMouseLeave={() => setHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      ref={star === 1 ? firstFieldRef : undefined}
                      type="button"
                      aria-label={`${star} star${star > 1 ? "s" : ""}, ${RATING_LABELS[star]}`}
                      aria-pressed={form.rating === star}
                      onClick={() => setForm((f) => ({ ...f, rating: star }))}
                      onMouseEnter={() => setHoverRating(star)}
                      className={`p-1.5 rounded-lg cursor-pointer ${focusRing}`}
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${star <= shownRating ? "fill-amber-400 text-amber-400" : "text-stone-300"}`}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
                {shownRating > 0 && <span className="text-sm font-semibold text-[#4A7244]">{RATING_LABELS[shownRating]}</span>}
              </div>
            </fieldset>

            <div>
              <label htmlFor="review-name" className="block text-sm font-semibold text-[#685752] mb-1.5">
                Your name <span className="text-rose-700">*</span>
              </label>
              <input
                id="review-name"
                type="text"
                autoComplete="name"
                required
                maxLength={80}
                value={form.userName}
                onChange={(e) => setForm({ ...form, userName: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="review-comment" className="block text-sm font-semibold text-[#685752] mb-1.5">
                Your review <span className="text-rose-700">*</span>
              </label>
              <textarea
                id="review-comment"
                required
                rows={5}
                maxLength={2000}
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                placeholder="What did you enjoy? How were the stays, food and group?"
                className={`${inputClass} resize-y`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="review-city" className="block text-sm font-semibold text-[#685752] mb-1.5">
                  City <span className="font-normal text-[#7A6862]">(optional)</span>
                </label>
                <input
                  id="review-city"
                  type="text"
                  autoComplete="address-level2"
                  maxLength={80}
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="review-trip" className="block text-sm font-semibold text-[#685752] mb-1.5">
                  Trip month <span className="font-normal text-[#7A6862]">(optional)</span>
                </label>
                <input
                  id="review-trip"
                  type="text"
                  maxLength={60}
                  placeholder="e.g. May 2026"
                  value={form.tripDate}
                  onChange={(e) => setForm({ ...form, tripDate: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="text-sm text-rose-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={`w-full min-h-12 rounded-full bg-[#4A7244] hover:bg-[#3F6339] text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${focusRing}`}
            >
              {submitting ? "Sending…" : "Submit review"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function TourReviewsSection({ tourSlug, tourTitle }: TourReviewsSectionProps) {
  const [reviews, setReviews] = useState<TourReview[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/reviews?tourSlug=${encodeURIComponent(tourSlug)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore && data) {
          setReviews(data.reviews || []);
          setAverageRating(data.averageRating || 0);
        }
      })
      .catch((err) => console.error("Failed to load reviews:", err))
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [tourSlug]);

  const visible = showAll ? reviews : reviews.slice(0, INITIAL_VISIBLE);

  return (
    <section id="reviews-section" aria-labelledby="reviews-heading" className="scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-4 pb-5 border-b border-[#E8DCD5]">
        <div>
          <h2 id="reviews-heading" className="text-2xl sm:text-3xl font-serif-italic font-bold text-[#685752]">
            Reviews
          </h2>
          {reviews.length > 0 && (
            <p className="mt-1.5 flex items-center gap-2 text-sm text-[#7A6862]">
              <span className="text-base font-bold text-[#685752] tabular-nums">{averageRating.toFixed(1)}</span>
              <Stars rating={Math.round(averageRating)} />
              <span>
                · {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              </span>
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className={`min-h-11 px-5 rounded-full border-2 border-[#4A7244] text-[#4A7244] hover:bg-[#4A7244] hover:text-white text-sm font-semibold transition-colors cursor-pointer ${focusRing}`}
        >
          Write a review
        </button>
      </div>

      {loading ? (
        <p className="py-10 text-sm text-[#7A6862]">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="py-10 text-sm text-[#7A6862]">
          No reviews yet. Been on this trip?{" "}
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className={`font-semibold text-[#4A7244] underline underline-offset-4 cursor-pointer rounded ${focusRing}`}
          >
            Be the first to share your experience.
          </button>
        </p>
      ) : (
        <>
          <ul className="divide-y divide-[#E8DCD5]">
            {visible.map((review) => (
              <li key={review.id} className="py-6 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                  <p className="text-sm">
                    <span className="font-semibold text-[#685752]">{review.userName}</span>
                    {(review.location || review.tripDate) && (
                      <span className="text-[#7A6862]"> · {[review.location, review.tripDate].filter(Boolean).join(" · ")}</span>
                    )}
                  </p>
                  <Stars rating={review.rating} size="w-3.5 h-3.5" />
                </div>
                {review.title && <h3 className="text-base font-semibold text-[#685752] break-words">{review.title}</h3>}
                <p className="text-sm text-[#7A6862] leading-relaxed whitespace-pre-line break-words">{review.comment}</p>
                <p className="text-xs text-[#7A6862]">
                  {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </li>
            ))}
          </ul>
          {reviews.length > INITIAL_VISIBLE && !showAll && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className={`mt-2 text-sm font-semibold text-[#4A7244] hover:underline underline-offset-4 cursor-pointer rounded ${focusRing}`}
            >
              Show all {reviews.length} reviews
            </button>
          )}
        </>
      )}

      {dialogOpen && <ReviewDialog tourSlug={tourSlug} tourTitle={tourTitle} onClose={() => setDialogOpen(false)} />}
    </section>
  );
}
