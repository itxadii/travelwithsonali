"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, MonitorSmartphone, LogOut } from "lucide-react";
import { CompassLoader } from "@/components/ui/compass-loader";

interface AdminDevice {
  id: string;
  device: string;
  ip: string | null;
  signedInAt: string;
  lastActiveAt: string;
  expiresAt: string;
  current: boolean;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function SettingsPage() {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const [devices, setDevices] = useState<AdminDevice[]>([]);
  const [devicesLoading, setDevicesLoading] = useState(true);
  const [deviceMsg, setDeviceMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [busyDevice, setBusyDevice] = useState<string | null>(null);

  /** Refreshes the device list after a sign-out or password change. */
  const loadDevices = async () => {
    try {
      const res = await fetch("/api/admin/sessions");
      if (res.ok) setDevices(await res.json());
      else setDeviceMsg({ type: "error", text: "Couldn't load signed-in devices." });
    } catch {
      setDeviceMsg({ type: "error", text: "Couldn't load signed-in devices." });
    } finally {
      setDevicesLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    fetch("/api/admin/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!ignore && data.admin?.email) setAdminEmail(data.admin.email);
      })
      .catch(() => {});
    fetch("/api/admin/sessions")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("failed"))))
      .then((data) => {
        if (!ignore) setDevices(data);
      })
      .catch(() => {
        if (!ignore) setDeviceMsg({ type: "error", text: "Couldn't load signed-in devices." });
      })
      .finally(() => {
        if (!ignore) setDevicesLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

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
        return;
      }

      setMsg({ type: "success", text: "Password changed. Every other device has been signed out." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      loadDevices();
    } catch {
      setMsg({ type: "error", text: "An error occurred while updating password." });
    } finally {
      setLoading(false);
    }
  };

  const signOutDevice = async (device: AdminDevice) => {
    if (device.current && !window.confirm("Sign out this device? You'll need to sign in again.")) return;
    setBusyDevice(device.id);
    setDeviceMsg(null);
    try {
      const res = await fetch(`/api/admin/sessions/${device.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setDeviceMsg({ type: "error", text: data.error || "Couldn't sign out that device." });
        return;
      }
      if (device.current) {
        router.push("/admin/login");
        router.refresh();
        return;
      }
      setDeviceMsg({ type: "success", text: `Signed out ${device.device}.` });
      loadDevices();
    } catch {
      setDeviceMsg({ type: "error", text: "Couldn't sign out that device." });
    } finally {
      setBusyDevice(null);
    }
  };

  const signOutOthers = async () => {
    setBusyDevice("others");
    setDeviceMsg(null);
    try {
      const res = await fetch("/api/admin/sessions", { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setDeviceMsg({ type: "error", text: data.error || "Couldn't sign out other devices." });
        return;
      }
      setDeviceMsg({ type: "success", text: data.count ? `Signed out ${data.count} other device${data.count === 1 ? "" : "s"}.` : "No other devices were signed in." });
      loadDevices();
    } catch {
      setDeviceMsg({ type: "error", text: "Couldn't sign out other devices." });
    } finally {
      setBusyDevice(null);
    }
  };

  const otherDevices = devices.filter((d) => !d.current).length;

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#685752] font-serif-italic">Admin Settings & Security</h1>
        <p className="text-xs text-[#7A6862] mt-1">Manage administrator account credentials and signed-in devices.</p>
      </div>

      {/* Account Info Card */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#685752] flex items-center gap-2">
          <User className="w-4 h-4 text-[#4A7244]" />
          Business & Account Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#FDF7F4] border border-[#E8DCD5]">
            <span className="text-[#7A6862] block font-medium">Brand Name</span>
            <span className="text-[#685752] font-bold text-sm">Travel With Sonali</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#FDF7F4] border border-[#E8DCD5]">
            <span className="text-[#7A6862] block font-medium">Administrator Email (sign-in codes go here)</span>
            <span className="text-[#685752] font-bold text-sm break-all">{adminEmail || "…"}</span>
          </div>
        </div>
      </div>

      {/* Signed-in devices */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-[#685752] flex items-center gap-2">
            <MonitorSmartphone className="w-4 h-4 text-[#4A7244]" />
            Signed-in Devices
          </h3>
          {otherDevices > 0 && (
            <button
              type="button"
              onClick={signOutOthers}
              disabled={busyDevice !== null}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FDF7F4] border border-[#E8DCD5] hover:border-[#685752] text-[#685752] text-xs font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out all other devices
            </button>
          )}
        </div>
        <p className="text-xs text-[#7A6862]">
          Every browser or phone where this admin account is signed in. If you don&apos;t recognise one, sign it out and change your password.
        </p>

        {deviceMsg && (
          <div
            role={deviceMsg.type === "error" ? "alert" : "status"}
            className={`p-4 rounded-2xl text-xs font-medium ${
              deviceMsg.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-rose-50 border border-rose-200 text-rose-800"
            }`}
          >
            {deviceMsg.text}
          </div>
        )}

        {devicesLoading ? (
          <CompassLoader size={56} className="py-4" label="Loading devices…" />
        ) : devices.length === 0 ? (
          <p className="text-xs text-[#7A6862]">No active sessions found.</p>
        ) : (
          <ul className="space-y-3">
            {devices.map((d) => (
              <li key={d.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#FDF7F4] border border-[#E8DCD5]">
                <div className="text-xs space-y-1 min-w-0">
                  <p className="text-sm font-bold text-[#685752] flex items-center gap-2 flex-wrap">
                    {d.device}
                    {d.current && <span className="px-2 py-0.5 rounded-full bg-[#8EB486]/15 text-[#4A7244] text-[11px] font-semibold">This device</span>}
                  </p>
                  <p className="text-[#7A6862]">
                    IP {d.ip || "unknown"} · Signed in {timeAgo(d.signedInAt)} · Last active {timeAgo(d.lastActiveAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => signOutDevice(d)}
                  disabled={busyDevice !== null}
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#E8DCD5] hover:border-rose-300 hover:text-rose-700 text-[#685752] text-xs font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {busyDevice === d.id ? "Signing out…" : "Sign out"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Change Password Form */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-6">
        <h3 className="text-base font-bold text-[#685752] flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-600" />
          Change Password
        </h3>

        {msg && (
          <div
            role={msg.type === "error" ? "alert" : "status"}
            className={`p-4 rounded-2xl text-xs font-medium ${
              msg.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-rose-50 border border-rose-200 text-rose-800"
            }`}
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label htmlFor="current-password" className="text-[#7A6862] font-semibold">
              Current Password
            </label>
            <input
              id="current-password"
              type="password"
              required
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full p-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] focus:outline-none focus:border-[#8EB486]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="new-password" className="text-[#7A6862] font-semibold">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                required
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] focus:outline-none focus:border-[#8EB486]"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="confirm-password" className="text-[#7A6862] font-semibold">
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752] focus:outline-none focus:border-[#8EB486]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-full bg-[#4A7244] hover:bg-[#3F6339] text-white font-semibold text-xs cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
