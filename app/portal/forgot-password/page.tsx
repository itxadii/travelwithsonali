"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AuthLayout, Field, FormMessage, SubmitButton, focusRing, textLink } from "../components/AuthLayout";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/portal/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Couldn't send the code. Please try again.");
        setLoading(false);
        return;
      }

      setSent(true);
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={sent ? "Check your email" : "Reset your password"}
      description={
        sent
          ? "If that matches an account with an email address, we've sent it a 6-digit code. It expires in 1 hour."
          : "Enter the email or mobile number on your account. We'll email you a 6-digit code."
      }
      footer={
        <>
          <p>
            <Link href="/portal/login" className={textLink}>
              Back to sign in
            </Link>
          </p>
          <p>
            No email on your account?{" "}
            <a href="https://wa.me/919152975552" target="_blank" rel="noopener noreferrer" className={textLink}>
              Message us on WhatsApp
            </a>
          </p>
        </>
      }
    >
      {sent ? (
        <div className="space-y-4">
          <p className="text-sm text-[#7A6862]">Not in your inbox after a minute? Check your spam folder.</p>
          <Link
            href={`/portal/reset-password?identifier=${encodeURIComponent(identifier)}`}
            className={`flex items-center justify-center w-full min-h-12 rounded-full bg-[#4A7244] hover:bg-[#3F6339] text-white text-base font-semibold transition-colors ${focusRing}`}
          >
            Enter code
          </Link>
          <button
            type="button"
            onClick={() => setSent(false)}
            className={`w-full min-h-11 rounded-full text-sm font-semibold text-[#685752] hover:bg-[#F7EFEA] cursor-pointer ${focusRing}`}
          >
            Use a different email or number
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <FormMessage>{error}</FormMessage>}
          <Field
            id="forgot-identifier"
            label="Email or mobile number"
            type="text"
            autoComplete="username"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <SubmitButton loading={loading} loadingText="Sending code…">
            Send code
          </SubmitButton>
        </form>
      )}
    </AuthLayout>
  );
}
