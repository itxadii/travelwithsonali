"use client";

import React, { useState } from "react";
import { Lock, User } from "lucide-react";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (newPassword !== confirmPassword) {
      setMsg({ type: "error", text: "New passwords do not match." });
      return;
    }

    if (newPassword.length < 8) {
      setMsg({ type: "error", text: "New password must be at least 8 characters long." });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg({ type: "error", text: data.error || "Failed to update password." });
        setLoading(false);
        return;
      }

      setMsg({ type: "success", text: "Password changed successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setMsg({ type: "error", text: "An error occurred while updating password." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1917] font-serif-italic">
          Admin Settings & Security
        </h1>
        <p className="text-xs text-[#7A746E] mt-1">
          Manage administrator account credentials and operational settings.
        </p>
      </div>

      {/* Account Info Card */}
      <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#1C1917] flex items-center gap-2">
          <User className="w-4 h-4 text-[#E05328]" />
          Business & Account Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EBE5DF]">
            <span className="text-[#7A746E] block font-medium">Brand Name</span>
            <span className="text-[#1C1917] font-bold text-sm">Travel With Sonali</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EBE5DF]">
            <span className="text-[#7A746E] block font-medium">Administrator Email</span>
            <span className="text-[#1C1917] font-bold text-sm">admin@travelwithsonali.com</span>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-6">
        <h3 className="text-base font-bold text-[#1C1917] flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-600" />
          Change Password
        </h3>

        {msg && (
          <div
            className={`p-4 rounded-2xl text-xs font-medium ${
              msg.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                : "bg-rose-50 border border-rose-200 text-rose-800"
            }`}
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-[#7A746E] font-semibold">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EBE5DF] text-[#1C1917] focus:outline-none focus:border-[#E05328]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[#7A746E] font-semibold">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EBE5DF] text-[#1C1917] focus:outline-none focus:border-[#E05328]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#7A746E] font-semibold">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EBE5DF] text-[#1C1917] focus:outline-none focus:border-[#E05328]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-full bg-[#E05328] hover:bg-[#C8451D] text-white font-semibold text-xs cursor-pointer shadow-md disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
