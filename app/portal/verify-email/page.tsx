"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout, CodeField, FormMessage, SubmitButton, focusRing, textLink } from "../components/AuthLayout";

const RESEND_COOLDOWN_SECONDS = 60;

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(searchParams.get("resent") === "1" ? "We've sent a new code to your email." : "");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (code.length !== 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/portal/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "That code didn't work. Try again.");
        setLoading(false);
        return;
      }
      router.push("/portal");
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setNotice("");
    setResending(true);
    try {
      const res = await fetch("/api/portal/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Couldn't send a new code. Try again shortly.");
      } else {
        setNotice("We've sent a new code. Only the latest code works.");
        setCode("");
        setCooldown(RESEND_COOLDOWN_SECONDS);
      }
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setResending(false);
    }
  };

  if (!email) {
    return (
      <AuthLayout title="Confirm your email" description="Open the link from your sign-up, or create an account to get a code.">
        <Link href="/portal/signup" className={textLink}>
          Create an account
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Confirm your email"
      description={
        <>
          We sent a 6-digit code to <span className="font-semibold text-[#685752] break-all">{email}</span>. It expires in 30 minutes.
        </>
      }
      footer={
        <>
          <p>Not in your inbox after a minute? Check your spam folder.</p>
          <p>
            Wrong email?{" "}
            <Link href="/portal/signup" className={textLink}>
              Sign up again
            </Link>
          </p>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {error && <FormMessage>{error}</FormMessage>}
        {notice && !error && <FormMessage tone="success">{notice}</FormMessage>}

        <CodeField id="verify-code" value={code} onChange={setCode} />

        <SubmitButton loading={loading} loadingText="Confirming…">
          Confirm email
        </SubmitButton>

        <button
          type="button"
          onClick={handleResend}
          disabled={resending || cooldown > 0}
          className={`w-full min-h-11 rounded-full text-sm font-semibold text-[#685752] hover:bg-[#F7EFEA] disabled:text-[#7A6862] disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer ${focusRing}`}
        >
          {resending ? "Sending…" : cooldown > 0 ? `Send a new code in ${cooldown}s` : "Send a new code"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailForm />
    </Suspense>
  );
}
