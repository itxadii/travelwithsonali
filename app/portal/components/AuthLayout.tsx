"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7244] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDF7F4]";

const inputBase =
  "w-full min-h-12 px-4 rounded-xl bg-white border border-[#D9CBC3] text-base text-[#685752] placeholder:text-[#7A6862]/80 transition-colors focus:outline-none focus:border-[#4A7244] focus:ring-2 focus:ring-[#4A7244]/25";

/**
 * Shared frame for the sign-in, sign-up and password pages: a real trip photo beside
 * the form on desktop, a short photo strip above it on phones.
 */
export function AuthLayout({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] bg-[#FDF7F4] text-[#685752]">
      {/* Photo: full-height column on desktop, short strip on phones */}
      <div className="relative h-44 sm:h-56 lg:h-auto lg:min-h-dvh overflow-hidden bg-[#2B2321]">
        <Image
          src="/images/hero.jpg"
          alt="A trekker resting on a Himalayan ridge at sunrise"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-[50%_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
        <p className="absolute bottom-5 left-5 right-5 lg:bottom-12 lg:left-12 lg:right-12 max-w-md font-serif-italic text-white text-xl sm:text-2xl lg:text-4xl leading-snug">
          Your trips with Sonali, all in one place.
        </p>
      </div>

      {/* Form column */}
      <div className="flex flex-col px-5 sm:px-10 lg:px-16 py-6 lg:py-10">
        <Link
          href="/"
          className={`self-start inline-flex items-center gap-1.5 min-h-11 text-sm font-medium text-[#7A6862] hover:text-[#685752] rounded ${focusRing}`}
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Travel With Sonali
        </Link>

        <main className="flex-1 flex flex-col justify-center w-full max-w-sm mx-auto lg:mx-0 py-8">
          <h1 className="font-serif-italic font-bold text-3xl sm:text-4xl text-[#685752]">{title}</h1>
          {description && <p className="mt-2 text-base text-[#7A6862] leading-relaxed">{description}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-8 pt-6 border-t border-[#E8DCD5] text-sm text-[#7A6862] space-y-2">{footer}</div>}
        </main>
      </div>
    </div>
  );
}

export function Field({
  id,
  label,
  hint,
  optional,
  ...input
}: React.InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; hint?: string; optional?: boolean }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-[#685752] mb-1.5">
        {label}
        {optional && <span className="font-normal text-[#7A6862]"> (optional)</span>}
      </label>
      <input id={id} aria-describedby={hint ? `${id}-hint` : undefined} className={inputBase} {...input} />
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-[#7A6862]">
          {hint}
        </p>
      )}
    </div>
  );
}

export function PasswordField({
  id,
  label,
  hint,
  aside,
  ...input
}: React.InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; hint?: string; aside?: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-1.5">
        <label htmlFor={id} className="block text-sm font-semibold text-[#685752]">
          {label}
        </label>
        {aside}
      </div>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={`${inputBase} pr-14`}
          {...input}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className={`absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-lg text-[#7A6862] hover:text-[#685752] cursor-pointer ${focusRing}`}
        >
          {visible ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
        </button>
      </div>
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-[#7A6862]">
          {hint}
        </p>
      )}
    </div>
  );
}

/** Six-digit emailed code: one wide field with spaced digits and a number keypad on phones. */
export function CodeField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label htmlFor="reset-code" className="block text-sm font-semibold text-[#685752] mb-1.5">
        6-digit code
      </label>
      <input
        id="reset-code"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]{6}"
        maxLength={6}
        required
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
        className={`${inputBase} text-center text-2xl font-semibold tracking-[0.5em] tabular-nums`}
      />
    </div>
  );
}

export function FormMessage({ tone = "error", children }: { tone?: "error" | "info" | "success"; children: React.ReactNode }) {
  const styles = {
    error: "bg-rose-50 border-rose-200 text-rose-800",
    info: "bg-amber-50 border-amber-200 text-amber-900",
    success: "bg-[#EEF4EC] border-[#C9DCC4] text-[#2F4A2B]",
  }[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`p-4 rounded-xl border text-sm leading-relaxed ${styles}`}>
      {children}
    </div>
  );
}

export function SubmitButton({ loading, children, loadingText }: { loading: boolean; children: React.ReactNode; loadingText: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`w-full min-h-12 rounded-full bg-[#4A7244] hover:bg-[#3F6339] text-white text-base font-semibold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${focusRing}`}
    >
      {loading ? loadingText : children}
    </button>
  );
}

export const textLink = `font-semibold text-[#4A7244] underline-offset-4 hover:underline rounded ${focusRing}`;
