"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout, CodeField, Field, FormMessage, PasswordField, SubmitButton, textLink } from "../components/AuthLayout";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tokenParam = searchParams.get("token") || "";
  const identifierParam = searchParams.get("identifier") || "";

  const [token] = useState(tokenParam);
  const [code, setCode] = useState("");
  const [identifier, setIdentifier] = useState(identifierParam);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token && code.length !== 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Use at least 8 characters for your new password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/portal/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token || undefined,
          code: code || undefined,
          newPassword,
          identifier: token ? undefined : identifier || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Couldn't reset your password. Request a new code and try again.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/portal");
        router.refresh();
      }, 1500);
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={success ? "Password updated" : "Set a new password"}
      description={
        success
          ? "You're signed in. Taking you to your trips…"
          : token
            ? "Choose a new password for your account."
            : "Enter the code we emailed you, then choose a new password."
      }
      footer={
        !success && (
          <>
            <p>
              Didn&apos;t get a code?{" "}
              <Link href="/portal/forgot-password" className={textLink}>
                Send a new one
              </Link>
            </p>
            <p>
              <Link href="/portal/login" className={textLink}>
                Back to sign in
              </Link>
            </p>
          </>
        )
      }
    >
      {success ? (
        <FormMessage tone="success">Your new password is saved.</FormMessage>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {error && <FormMessage>{error}</FormMessage>}

          {!token && (
            <>
              <Field
                id="reset-identifier"
                label="Email or mobile number"
                type="text"
                autoComplete="username"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
              <CodeField value={code} onChange={setCode} />
            </>
          )}

          <PasswordField
            id="reset-password"
            label="New password"
            autoComplete="new-password"
            required
            minLength={8}
            hint="At least 8 characters."
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <SubmitButton loading={loading} loadingText="Saving…">
            Save password and sign in
          </SubmitButton>
        </form>
      )}
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
