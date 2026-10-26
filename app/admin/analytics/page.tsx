import React from "react";
import { redirect } from "next/navigation";
import { sql } from "drizzle-orm";
import { Eye, Users, MousePointerClick, ShieldCheck } from "lucide-react";
import { db } from "@/db";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { ANALYTICS_RETENTION_DAYS, CONSENT_VERSION } from "@/lib/consent/config";

const DAYS = 30;

type Row = Record<string, unknown>;

async function rows<T extends Row>(query: ReturnType<typeof sql>): Promise<T[]> {
  const result = await db.execute(query);
  return result.rows as T[];
}

function RankedList({ title, items, empty }: { title: string; items: { label: string; count: number }[]; empty: string }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-4">
      <h3 className="text-base font-bold text-[#685752]">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-[#7A6862]">{empty}</p>
      ) : (
        <ul className="space-y-2.5 text-sm">
          {items.map((item) => (
            <li key={item.label} className="space-y-1">
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-[#685752] truncate">{item.label}</span>
                <span className="tabular-nums text-[#7A6862]">{item.count.toLocaleString("en-IN")}</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#F7EFEA]">
                <div className="h-1.5 rounded-full bg-[#4A7244]" style={{ width: `${(item.count / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function AnalyticsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const since = sql`NOW() - ${`${DAYS} days`}::interval`;

  const [totals] = await rows<{ views: number; visitors: number; sessions: number }>(sql`
    SELECT COUNT(*)::int AS views,
           COUNT(DISTINCT visitor_id)::int AS visitors,
           COUNT(DISTINCT session_id)::int AS sessions
    FROM analytics_events WHERE created_at >= ${since}
  `);

  const topPages = await rows<{ label: string; count: number }>(sql`
    SELECT path AS label, COUNT(*)::int AS count FROM analytics_events
    WHERE created_at >= ${since} GROUP BY path ORDER BY count DESC LIMIT 10
  `);

  const referrers = await rows<{ label: string; count: number }>(sql`
    SELECT COALESCE(utm_source, referrer_host) AS label, COUNT(*)::int AS count FROM analytics_events
    WHERE created_at >= ${since} AND COALESCE(utm_source, referrer_host) IS NOT NULL
    GROUP BY label ORDER BY count DESC LIMIT 8
  `);

  const devices = await rows<{ label: string; count: number }>(sql`
    SELECT INITCAP(device_type) AS label, COUNT(DISTINCT visitor_id)::int AS count FROM analytics_events
    WHERE created_at >= ${since} GROUP BY device_type ORDER BY count DESC
  `);

  const browsers = await rows<{ label: string; count: number }>(sql`
    SELECT browser AS label, COUNT(DISTINCT visitor_id)::int AS count FROM analytics_events
    WHERE created_at >= ${since} GROUP BY browser ORDER BY count DESC LIMIT 6
  `);

  // Latest choice per browser, among choices made in the period
  const consentChoices = await rows<{ action: string; count: number }>(sql`
    SELECT action, COUNT(*)::int AS count FROM (
      SELECT DISTINCT ON (consent_id) action FROM consent_records
      WHERE created_at >= ${since} ORDER BY consent_id, created_at DESC
    ) latest GROUP BY action
  `);

  const recentConsents = await rows<{
    consent_id: string;
    action: string;
    analytics: boolean;
    marketing: boolean;
    language: string;
    notice_version: string;
    created_at: string;
  }>(sql`
    SELECT consent_id, action, analytics, marketing, language, notice_version, created_at
    FROM consent_records ORDER BY created_at DESC LIMIT 15
  `);

  const choiceCount = (action: string) => consentChoices.find((c) => c.action === action)?.count ?? 0;
  const totalChoices = consentChoices.reduce((sum, c) => sum + c.count, 0);
  const optInRate = totalChoices ? Math.round(((choiceCount("accept_all") + choiceCount("custom")) / totalChoices) * 100) : 0;

  const actionLabel: Record<string, string> = { accept_all: "Accepted all", reject_all: "Rejected all", custom: "Custom choice" };

  const stats = [
    { label: "Page views", value: totals?.views ?? 0, icon: Eye },
    { label: "Unique visitors", value: totals?.visitors ?? 0, icon: Users },
    { label: "Sessions", value: totals?.sessions ?? 0, icon: MousePointerClick },
    { label: "Consent choices", value: totalChoices, icon: ShieldCheck },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#685752] font-serif-italic">Website Analytics</h1>
        <p className="text-sm text-[#7A6862] mt-1">
          Last {DAYS} days. Only visitors who accepted analytics cookies are counted, so totals are lower than real traffic. Data older
          than {ANALYTICS_RETENTION_DAYS} days is deleted automatically.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs">
            <span className="flex items-center gap-2 text-xs uppercase text-[#7A6862] font-semibold">
              <Icon className="w-4 h-4 text-[#4A7244]" aria-hidden="true" />
              {label}
            </span>
            <p className="text-3xl font-bold text-[#685752] mt-2 tabular-nums">{value.toLocaleString("en-IN")}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RankedList title="Top pages" items={topPages} empty="No page views recorded yet." />
        <RankedList title="Traffic sources" items={referrers} empty="No external referrers or campaign links yet." />
        <RankedList title="Devices (visitors)" items={devices} empty="No data yet." />
        <RankedList title="Browsers (visitors)" items={browsers} empty="No data yet." />
      </div>

      <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-base font-bold text-[#685752]">Cookie consent log</h3>
          <p className="text-sm text-[#7A6862]">
            Opt-in rate (last {DAYS} days): <span className="font-bold text-[#4A7244]">{optInRate}%</span> · Current notice version{" "}
            {CONSENT_VERSION}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          {Object.entries(actionLabel).map(([action, label]) => (
            <span key={action} className="px-3 py-1 rounded-full bg-[#FDF7F4] border border-[#E8DCD5] text-[#685752]">
              {label}: {choiceCount(action)}
            </span>
          ))}
        </div>
        {recentConsents.length === 0 ? (
          <p className="text-sm text-[#7A6862]">No consent choices recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-[#7A6862]">
                <tr>
                  <th className="py-2 pr-4 font-semibold">When</th>
                  <th className="py-2 pr-4 font-semibold">Consent ID</th>
                  <th className="py-2 pr-4 font-semibold">Choice</th>
                  <th className="py-2 pr-4 font-semibold">Analytics</th>
                  <th className="py-2 pr-4 font-semibold">Marketing</th>
                  <th className="py-2 pr-4 font-semibold">Language</th>
                  <th className="py-2 font-semibold">Notice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DCD5] text-[#685752]">
                {recentConsents.map((c) => (
                  <tr key={`${c.consent_id}-${c.created_at}`}>
                    <td className="py-2 pr-4 whitespace-nowrap">
                      {new Date(c.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    </td>
                    <td className="py-2 pr-4 font-mono text-xs">{c.consent_id.slice(0, 8)}…</td>
                    <td className="py-2 pr-4">{actionLabel[c.action] ?? c.action}</td>
                    <td className="py-2 pr-4">{c.analytics ? "Yes" : "No"}</td>
                    <td className="py-2 pr-4">{c.marketing ? "Yes" : "No"}</td>
                    <td className="py-2 pr-4 uppercase">{c.language}</td>
                    <td className="py-2">{c.notice_version}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
