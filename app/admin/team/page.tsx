"use client";

import React, { useEffect, useState } from "react";
import { UserPlus, Mail, Trash2 } from "lucide-react";
import { CompassLoader } from "@/components/ui/compass-loader";
import { useEscapeKey } from "@/lib/useEscapeKey";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  invitePending: boolean;
  createdAt: string;
  activeDevices: number;
}

const OWNER = "SUPER_ADMIN";
const roleLabel = (role: string) => (role === OWNER ? "Owner" : "Admin");

const inputClass =
  "w-full min-h-11 px-3.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-sm text-[#685752] focus:outline-none focus:border-[#8EB486]";

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [me, setMe] = useState("");
  const [canManage, setCanManage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "ADMIN" });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState<Member | null>(null);
  useEscapeKey(addOpen || Boolean(removing), () => {
    if (!saving && !busy) {
      setAddOpen(false);
      setRemoving(null);
    }
  });

  const applyTeam = (data: { members: Member[]; me: string; canManage: boolean }) => {
    setMembers(data.members);
    setMe(data.me);
    setCanManage(data.canManage);
  };

  /** Reloads the list after a change. */
  const reload = async () => {
    const res = await fetch("/api/admin/team");
    if (res.ok) applyTeam(await res.json());
  };

  useEffect(() => {
    let ignore = false;
    fetch("/api/admin/team")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("failed"))))
      .then((data) => {
        if (!ignore) applyTeam(data);
      })
      .catch(() => {
        if (!ignore) setNotice({ type: "error", text: "Couldn't load the team." });
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const addMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFormError(data.error || "Couldn't add them.");
        return;
      }
      setAddOpen(false);
      setNotice({ type: "success", text: `Invite sent to ${form.email}. They'll appear as active once they set a password.` });
      setForm({ name: "", email: "", role: "ADMIN" });
      reload();
    } catch {
      setFormError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  const act = async (key: string, run: () => Promise<Response>, success: string) => {
    setBusy(key);
    setNotice(null);
    try {
      const res = await run();
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setNotice({ type: "error", text: data.error || "That didn't work. Try again." });
        return false;
      }
      setNotice({ type: "success", text: success });
      reload();
      return true;
    } catch {
      setNotice({ type: "error", text: "Couldn't reach the server. Check your connection and try again." });
      return false;
    } finally {
      setBusy(null);
    }
  };

  const resend = (m: Member) =>
    act(
      `resend-${m.id}`,
      () => fetch(`/api/admin/team/${m.id}/resend`, { method: "POST" }),
      m.invitePending ? `Invite sent again to ${m.email}.` : `Password reset link sent to ${m.email}.`
    );

  const changeRole = (m: Member, role: string) =>
    act(
      `role-${m.id}`,
      () => fetch(`/api/admin/team/${m.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role }) }),
      `${m.name} is now ${roleLabel(role) === "Owner" ? "an owner" : "an admin"}.`
    );

  const confirmRemove = async () => {
    if (!removing) return;
    const m = removing;
    const ok = await act(`remove-${m.id}`, () => fetch(`/api/admin/team/${m.id}`, { method: "DELETE" }), `${m.name} no longer has access.`);
    if (ok) setRemoving(null);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#685752] font-serif-italic">Team</h1>
          <p className="text-sm text-[#7A6862] mt-1 max-w-xl">
            People who can sign in to this admin panel. Each person signs in with their own email, password and an emailed code.
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            onClick={() => {
              setFormError("");
              setAddOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 min-h-11 px-5 rounded-full bg-[#4A7244] hover:bg-[#3F6339] text-white text-sm font-semibold shadow-md cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Add person
          </button>
        )}
      </div>

      {notice && (
        <div
          role={notice.type === "error" ? "alert" : "status"}
          className={`p-4 rounded-2xl text-sm ${
            notice.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-rose-50 border border-rose-200 text-rose-800"
          }`}
        >
          {notice.text}
        </div>
      )}

      {!loading && !canManage && (
        <p className="text-sm text-[#7A6862]">Only owners can add or remove people. Ask an owner if someone needs access.</p>
      )}

      {loading ? (
        <CompassLoader size={80} className="py-12" label="Loading team…" />
      ) : (
        <ul className="space-y-3">
          {members.map((m) => (
            <li key={m.id} className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-11 h-11 rounded-full bg-[#8EB486]/15 text-[#4A7244] flex items-center justify-center font-bold shrink-0">
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[#685752] flex flex-wrap items-center gap-2">
                      {m.name}
                      {m.id === me && <span className="text-xs font-semibold text-[#7A6862]">(you)</span>}
                    </p>
                    <p className="text-sm text-[#7A6862] break-all">{m.email}</p>
                    <p className="text-xs mt-1">
                      {m.invitePending ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">Invite sent, password not set yet</span>
                      ) : (
                        <span className="text-[#7A6862]">
                          {m.activeDevices > 0 ? `Signed in on ${m.activeDevices} device${m.activeDevices === 1 ? "" : "s"}` : "Not signed in anywhere"}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {canManage ? (
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <label className="sr-only" htmlFor={`role-${m.id}`}>
                      Role for {m.name}
                    </label>
                    <select
                      id={`role-${m.id}`}
                      value={m.role === OWNER ? OWNER : "ADMIN"}
                      disabled={busy !== null}
                      onChange={(e) => changeRole(m, e.target.value)}
                      className="min-h-10 px-3 rounded-full bg-[#FDF7F4] border border-[#E8DCD5] text-sm font-semibold text-[#685752] cursor-pointer disabled:opacity-60"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value={OWNER}>Owner</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => resend(m)}
                      disabled={busy !== null}
                      className="inline-flex items-center gap-1.5 min-h-10 px-3.5 rounded-full bg-white border border-[#E8DCD5] hover:border-[#685752] text-sm font-semibold text-[#685752] cursor-pointer disabled:opacity-60"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {busy === `resend-${m.id}` ? "Sending…" : m.invitePending ? "Resend invite" : "Send password reset"}
                    </button>
                    {m.id !== me && (
                      <button
                        type="button"
                        onClick={() => setRemoving(m)}
                        disabled={busy !== null}
                        aria-label={`Remove ${m.name}`}
                        title="Remove access"
                        className="w-10 h-10 inline-flex items-center justify-center rounded-full text-[#7A6862] hover:text-rose-700 hover:bg-rose-50 cursor-pointer disabled:opacity-60"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ) : (
                  <span className="self-start sm:self-center px-3 py-1 rounded-full bg-[#FDF7F4] border border-[#E8DCD5] text-sm font-semibold text-[#685752]">
                    {roleLabel(m.role)}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="text-sm text-[#7A6862] space-y-1">
        <p>
          <span className="font-semibold text-[#685752]">Owner</span> can do everything, including managing this team.
        </p>
        <p>
          <span className="font-semibold text-[#685752]">Admin</span> can do everything except add, remove or change people here.
        </p>
      </div>

      {/* Add person */}
      {addOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center sm:p-4 backdrop-blur-xs" onClick={() => !saving && setAddOpen(false)}>
          <form
            onSubmit={addMember}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-person-title"
            className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 border border-[#E8DCD5] shadow-2xl space-y-4 max-h-[92dvh] overflow-y-auto"
          >
            <h2 id="add-person-title" className="text-xl font-bold text-[#685752]">
              Add someone to the team
            </h2>
            <p className="text-sm text-[#7A6862]">We&apos;ll email them a link to choose their password. The link works for 3 days.</p>

            <div className="space-y-1.5">
              <label htmlFor="member-name" className="text-sm font-semibold text-[#685752]">
                Name
              </label>
              <input
                id="member-name"
                required
                autoComplete="off"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="member-email" className="text-sm font-semibold text-[#685752]">
                Email
              </label>
              <input
                id="member-email"
                type="email"
                required
                autoComplete="off"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="name@example.com"
                className={inputClass}
              />
            </div>
            <fieldset className="space-y-2">
              <legend className="text-sm font-semibold text-[#685752] mb-1">Role</legend>
              {[
                { value: "ADMIN", title: "Admin", hint: "Leads, bookings, payments, travellers, reviews and reports." },
                { value: OWNER, title: "Owner", hint: "All of that, plus adding and removing people." },
              ].map((r) => (
                <label
                  key={r.value}
                  className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer ${
                    form.role === r.value ? "border-[#4A7244] bg-[#EEF4EC]" : "border-[#E8DCD5] bg-[#FDF7F4]"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r.value}
                    checked={form.role === r.value}
                    onChange={() => setForm({ ...form, role: r.value })}
                    className="mt-1 accent-[#4A7244]"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-[#685752]">{r.title}</span>
                    <span className="block text-sm text-[#7A6862]">{r.hint}</span>
                  </span>
                </label>
              ))}
            </fieldset>

            {formError && (
              <p role="alert" className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-800">
                {formError}
              </p>
            )}

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                disabled={saving}
                className="min-h-11 px-5 rounded-full bg-[#FDF7F4] border border-[#E8DCD5] text-sm font-semibold text-[#685752] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="min-h-11 px-5 rounded-full bg-[#4A7244] hover:bg-[#3F6339] text-white text-sm font-semibold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? "Sending invite…" : "Send invite"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Remove person */}
      {removing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-4 backdrop-blur-xs" onClick={() => !busy && setRemoving(null)}>
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="remove-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#FFFDF9] rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 border border-[#E8DCD5] shadow-2xl space-y-4"
          >
            <h2 id="remove-title" className="text-lg font-bold text-[#685752]">
              Remove {removing.name}?
            </h2>
            <p className="text-sm text-[#7A6862]">
              They&apos;ll be signed out on every device and won&apos;t be able to sign in again. Records they created stay. You can invite them again later.
            </p>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <button
                type="button"
                onClick={() => setRemoving(null)}
                disabled={busy !== null}
                className="min-h-11 px-5 rounded-full bg-[#FDF7F4] border border-[#E8DCD5] text-sm font-semibold text-[#685752] cursor-pointer"
              >
                Keep access
              </button>
              <button
                type="button"
                onClick={confirmRemove}
                disabled={busy !== null}
                className="min-h-11 px-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold cursor-pointer disabled:opacity-60"
              >
                {busy ? "Removing…" : "Remove access"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
