import { SITE_URL } from "@/lib/seo";

/**
 * Branded, table-based HTML email layout (works in Gmail, Outlook and Apple Mail) plus a
 * plain-text twin generated from the same content. Images are loaded from the live site.
 */

const COLORS = {
  page: "#FDF7F4",
  card: "#FFFFFF",
  border: "#E8DCD5",
  text: "#685752",
  muted: "#7A6862",
  sage: "#4A7244",
  sageSoft: "#EEF4EC",
  rose: "#9F3C4E",
  roseSoft: "#FBEDEF",
};

const LOGO_URL = `${SITE_URL}/travelwithsonalilogo.jpg`;
const HERO_URL = `${SITE_URL}/images/og-default.jpg`;
const WHATSAPP_URL = "https://wa.me/919152975552";
const INSTAGRAM_URL = "https://www.instagram.com/travelwithsonali";

export interface EmailContent {
  /** Short line shown next to the subject in inbox previews */
  preheader: string;
  /** Large serif heading */
  heading: string;
  /** Paragraphs under the heading (plain text; line breaks allowed) */
  intro: string[];
  /** Show the trip photo banner under the header */
  hero?: boolean;
  /** Large 6-digit code box */
  code?: string;
  /** Label/value rows rendered as a receipt-style table */
  details?: [string, string][];
  /** Coloured note (e.g. a status) */
  callout?: { tone: "sage" | "rose"; text: string };
  /** Main button */
  cta?: { label: string; url: string };
  /** Paragraphs after the button */
  outro?: string[];
  /** Small grey text at the end of the card */
  footnote?: string;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const p = (text: string, color = COLORS.text) =>
  `<p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:25px;color:${color};">${escapeHtml(text).replace(/\n/g, "<br>")}</p>`;

export function renderEmail(c: EmailContent): { html: string; text: string } {
  const sections: string[] = [];

  sections.push(
    `<h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-weight:700;font-size:28px;line-height:36px;color:${COLORS.text};">${escapeHtml(c.heading)}</h1>`
  );
  c.intro.forEach((t) => sections.push(p(t)));

  if (c.code) {
    sections.push(`
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:8px 0 20px;">
        <tr><td align="center" style="background:${COLORS.sageSoft};border:1px solid #C9DCC4;border-radius:14px;padding:20px;">
          <div style="font-family:'Courier New',Courier,monospace;font-size:34px;font-weight:700;letter-spacing:10px;color:${COLORS.sage};">${escapeHtml(c.code)}</div>
        </td></tr>
      </table>`);
  }

  if (c.details && c.details.length > 0) {
    const rows = c.details
      .map(
        ([k, v], i) => `
        <tr>
          <td style="padding:10px 14px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${COLORS.muted};border-top:${i === 0 ? "0" : `1px solid ${COLORS.border}`};width:42%;">${escapeHtml(k)}</td>
          <td style="padding:10px 14px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:${COLORS.text};border-top:${i === 0 ? "0" : `1px solid ${COLORS.border}`};">${escapeHtml(v)}</td>
        </tr>`
      )
      .join("");
    sections.push(`
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:4px 0 20px;background:${COLORS.page};border:1px solid ${COLORS.border};border-radius:14px;">
        ${rows}
      </table>`);
  }

  if (c.callout) {
    const bg = c.callout.tone === "rose" ? COLORS.roseSoft : COLORS.sageSoft;
    const fg = c.callout.tone === "rose" ? COLORS.rose : COLORS.sage;
    sections.push(
      `<p style="margin:0 0 20px;padding:14px 16px;border-radius:12px;background:${bg};font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:23px;font-weight:700;color:${fg};">${escapeHtml(c.callout.text)}</p>`
    );
  }

  if (c.cta) {
    sections.push(`
      <table role="presentation" cellspacing="0" cellpadding="0" style="margin:4px 0 22px;">
        <tr><td align="center" style="background:${COLORS.sage};border-radius:999px;">
          <a href="${escapeHtml(c.cta.url)}" style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;color:#FFFFFF;text-decoration:none;border-radius:999px;">${escapeHtml(c.cta.label)}</a>
        </td></tr>
      </table>`);
  }

  (c.outro || []).forEach((t) => sections.push(p(t)));

  if (c.footnote) {
    sections.push(
      `<p style="margin:18px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:${COLORS.muted};">${escapeHtml(c.footnote)}</p>`
    );
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(c.heading)}</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(c.preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${COLORS.page};">
  <tr><td align="center" style="padding:28px 12px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;">
      <tr><td style="padding:0 8px 18px;">
        <table role="presentation" cellspacing="0" cellpadding="0"><tr>
          <td style="padding-right:12px;"><img src="${LOGO_URL}" width="44" height="44" alt="" style="display:block;width:44px;height:44px;border-radius:22px;"></td>
          <td style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:20px;color:${COLORS.text};">Travel With Sonali</td>
        </tr></table>
      </td></tr>
      <tr><td style="background:${COLORS.card};border:1px solid ${COLORS.border};border-radius:24px;overflow:hidden;">
        ${c.hero ? `<img src="${HERO_URL}" width="600" alt="" style="display:block;width:100%;max-width:600px;height:auto;border-radius:24px 24px 0 0;">` : ""}
        <div style="padding:${c.hero ? "28px" : "32px"} 28px 28px;">
          ${sections.join("\n")}
        </div>
      </td></tr>
      <tr><td style="padding:22px 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:19px;color:${COLORS.muted};">
        Questions? <a href="${WHATSAPP_URL}" style="color:${COLORS.sage};font-weight:700;text-decoration:none;">WhatsApp us</a>
        &nbsp;·&nbsp; <a href="${INSTAGRAM_URL}" style="color:${COLORS.sage};text-decoration:none;">Instagram</a>
        &nbsp;·&nbsp; <a href="${SITE_URL}" style="color:${COLORS.sage};text-decoration:none;">travelwithsonali.com</a><br>
        This is an automated email from Travel With Sonali. Replies go to our team inbox.
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

  const textLines: string[] = [c.heading, "", ...c.intro, ""];
  if (c.code) textLines.push(`Your code: ${c.code}`, "");
  if (c.details?.length) {
    c.details.forEach(([k, v]) => textLines.push(`${k}: ${v}`));
    textLines.push("");
  }
  if (c.callout) textLines.push(c.callout.text, "");
  if (c.cta) textLines.push(`${c.cta.label}: ${c.cta.url}`, "");
  (c.outro || []).forEach((t) => textLines.push(t, ""));
  if (c.footnote) textLines.push(c.footnote, "");
  textLines.push("— Travel With Sonali", `WhatsApp: ${WHATSAPP_URL}`, SITE_URL);

  return { html, text: textLines.join("\n") };
}

export function formatInr(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}
