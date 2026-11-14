"use client";

import React, { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";

const MIN_LENGTH = 10;

export default function SetAdminPasswordPage() {
  return (
    <Suspense>
      <SetPasswordForm />
    </Suspense>
  );
}

/** Reached from the invite or reset email: the person chooses their admin password. */
function SetPasswordForm() {
  const token = useSearchParams().get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [doneFor, setDoneFor] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < MIN_LENGTH) {
      setError(`Use at least ${MIN_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      setError("The two passwords don't match.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Couldn't set your password.");
        return;
      }
      setDoneFor(data.email || "your email");
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full pl-10 pr-11 min-h-12 rounded-2xl bg-[#FDF7F4] border border-[#E8DCD5] text-sm text-[#685752] focus:outline-none focus:border-[#8EB486] focus:bg-white";

  return (
    <div className="min-h-dvh bg-[#FDF7F4] text-[#685752] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DCD5] shadow-xl space-y-6">
        <div className="flex flex-col items-center text-center gap-3">
          <Image src="/travelwithsonalilogo.jpg" alt="" width={56} height={56} className="w-14 h-14 rounded-full border border-[#E8DCD5]" priority />
          <h1 className="text-2xl font-bold font-serif-italic">{doneFor ? "You're all set" : "Choose your admin password"}</h1>
          <p className="text-sm text-[#7A6862]">
            {doneFor ? (
              <>
                Sign in with <span className="font-semibold text-[#685752] break-all">{doneFor}</span> and your new password. We&apos;ll email you a code
                each time.
              </>
            ) : (
              "You'll use it with your email to sign in to the Travel With Sonali admin panel."
            )}
          </p>
        </div>

        {doneFor ? (
          <Link
            href="/admin/login"
            className="flex items-center justify-center w-full min-h-12 rounded-full bg-[#4A7244] hover:bg-[#3F6339] text-white text-sm font-semibold"
          >
            Go to sign in
          </Link>
        ) : !token ? (
          <p role="alert" className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-sm text-rose-800">
            This page needs the link from your invite email. Open the email and press the button again, or ask an owner to send a new link.
          </p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            {error && (
              <p role="alert" className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-sm text-rose-800">
                {error}
              </p>
            )}
            {[
              { id: "new-password", label: "New password", value: password, set: setPassword, hint: `At least ${MIN_LENGTH} characters.` },
              { id: "confirm-password", label: "Type it again", value: confirm, set: setConfirm, hint: "" },
            ].map((f) => (
              <div key={f.id} className="space-y-1.5">
                <label htmlFor={f.id} className="text-sm font-semibold">
                  {f.label}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-4 text-[#9A938C]" aria-hidden="true" />
                  <input
                    id={f.id}
                    type={show ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={f.value}
                    onChange={(e) => f.set(e.target.value)}
                    aria-describedby={f.hint ? `${f.id}-hint` : undefined}
                    className={inputClass}
                  />
                  {f.id === "new-password" && (
                    <button
                      type="button"
                      onClick={() => setShow((v) => !v)}
                      aria-label={show ? "Hide passwords" : "Show passwords"}
                      className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-[#9A938C] hover:text-[#685752] cursor-pointer"
                    >
                      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
                {f.hint && (
                  <p id={`${f.id}-hint`} className="text-xs text-[#7A6862]">
                    {f.hint}
                  </p>
                )}
              </div>
            ))}
            <button
              type="submit"
              disabled={saving}
              className="w-full min-h-12 rounded-full bg-[#4A7244] hover:bg-[#3F6339] text-white text-sm font-semibold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving…" : "Save password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
