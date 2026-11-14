import nodemailer from "nodemailer";
import { SITE_URL } from "@/lib/seo";
import { escapeHtml, formatInr, renderEmail, type EmailContent } from "@/lib/email/template";

/**
 * Outgoing email. Credentials come from the environment only:
 *   SMTP_HOST   – defaults to smtp.purelymail.com
 *   SMTP_PORT   – defaults to 465 (SSL); 587 uses STARTTLS
 *   SMTP_USER   – mailbox login, e.g. noreply@travelwithsonali.com
 *   SMTP_PASS   – that mailbox's password
 *   MAIL_FROM   – sender address shown to recipients (defaults to SMTP_USER)
 *   ENQUIRY_NOTIFY_EMAIL – team inbox for new-enquiry alerts and customer replies
 *
 * A Gmail address in SMTP_USER with no SMTP_HOST still works with a Google App Password.
 */

const DEFAULT_TEAM_EMAIL = "travelwithsonaliinfo@gmail.com";
const PORTAL_LOGIN_URL = `${SITE_URL}/portal/login`;

/** Strips quotes and whitespace that often sneak in when pasting values into a hosting dashboard. */
function cleanEnv(value: string | undefined): string {
  return (value || "").trim().replace(/^["']|["']$/g, "").trim();
}

function getSmtpUser(): string {
  return cleanEnv(process.env.SMTP_USER);
}

/** Team inbox: gets enquiry alerts and receives replies to every automated email. */
export function getTeamEmail(): string {
  return cleanEnv(process.env.ENQUIRY_NOTIFY_EMAIL) || DEFAULT_TEAM_EMAIL;
}

function getFromHeader(): string {
  // Accept either "noreply@site.com" or "Name <noreply@site.com>"; only the address is used
  const raw = cleanEnv(process.env.MAIL_FROM) || getSmtpUser();
  const address = raw.match(/<([^>]+)>/)?.[1].trim() || raw;
  return `"Travel With Sonali" <${address}>`;
}

function getTransport() {
  const user = getSmtpUser();
  let pass = cleanEnv(process.env.SMTP_PASS);
  if (!user || !pass) {
    throw new Error("SMTP_USER and SMTP_PASS must be set to send email.");
  }

  const host = cleanEnv(process.env.SMTP_HOST);
  if (!host && /@gmail\.com$/i.test(user)) {
    // Google shows App Passwords as "abcd efgh ijkl mnop"; the spaces are not part of the password
    pass = pass.replace(/\s+/g, "");
    if (pass.length !== 16) {
      console.warn(`SMTP_PASS is ${pass.length} characters; a Google App Password is 16. Gmail will likely reject it.`);
    }
    return nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
  }

  const port = Number(cleanEnv(process.env.SMTP_PORT)) || 465;
  return nodemailer.createTransport({
    host: host || "smtp.purelymail.com",
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

/** Checks the SMTP login without sending anything (used by `npm run mail:check`). */
export async function verifySmtpConnection(): Promise<void> {
  await getTransport().verify();
}

async function send(to: string, subject: string, content: EmailContent, options: { replyTo?: string } = {}) {
  const { html, text } = renderEmail(content);
  await getTransport().sendMail({
    from: getFromHeader(),
    to,
    replyTo: options.replyTo || getTeamEmail(),
    subject,
    text,
    html,
  });
}

// ---------------------------------------------------------------------------
// Account emails
// ---------------------------------------------------------------------------

export async function sendEmailVerificationEmail(to: string, name: string, code: string) {
  await send(to, `${code} is your Travel With Sonali code`, {
    preheader: `Enter ${code} on the website to confirm your email.`,
    heading: `Hi ${name}, confirm your email`,
    intro: ["Enter this code on the website to finish setting up your account. It expires in 30 minutes."],
    code,
    footnote: "If you didn't create an account with Travel With Sonali, you can ignore this email.",
  });
}

export async function sendPasswordResetEmail(to: string, name: string, code: string, resetLink: string) {
  await send(to, `${code} is your password reset code`, {
    preheader: `Use ${code} or the button in this email to set a new password.`,
    heading: `Hi ${name}, reset your password`,
    intro: ["Enter this code on the website, or press the button below to set a new password straight away. It expires in 1 hour."],
    code,
    cta: { label: "Set a new password", url: resetLink },
    footnote: "If you didn't ask to reset your password, you can ignore this email. Your password stays the same.",
  });
}

/** Second step of admin sign-in. Says where the attempt came from so a stranger's attempt stands out. */
export async function sendAdminLoginCodeEmail(to: string, name: string, code: string, meta: { device: string; ip: string }) {
  await send(to, `${code} is your admin sign-in code`, {
    preheader: `Admin sign-in from ${meta.device}. Code ${code}.`,
    heading: `Hi ${name}, your admin sign-in code`,
    intro: [`Someone is signing in to the Travel With Sonali admin panel from ${meta.device} (IP ${meta.ip}). Enter this code to finish signing in. It expires in 10 minutes.`],
    code,
    footnote: "If this wasn't you, don't share the code: nobody can get in without it. Then change your admin password under Settings.",
  });
}

/** Invite to the admin panel, or a password reset sent by an owner. */
export async function sendAdminInviteEmail(to: string, name: string, inviter: string, link: string, kind: "invite" | "reset") {
  const invite = kind === "invite";
  await send(to, invite ? "You've been added to the Travel With Sonali admin panel" : "Reset your admin password", {
    preheader: invite ? `${inviter} added you to the admin panel. Set your password to get started.` : "Use the link to choose a new admin password.",
    heading: invite ? `Hi ${name}, welcome to the team` : `Hi ${name}, reset your password`,
    intro: invite
      ? [`${inviter} has given you access to the Travel With Sonali admin panel, where the team manages leads, bookings, payments and travellers.`, "Choose your password to finish setting up. After that you'll sign in with this email, your password and a code we email you each time."]
      : [`${inviter} sent you a link to choose a new password for the admin panel. Your devices will be signed out once you set it.`],
    cta: { label: invite ? "Set my password" : "Choose a new password", url: link },
    footnote: "This link works once and expires in 3 days. If you weren't expecting it, you can ignore this email.",
  });
}

// ---------------------------------------------------------------------------
// Enquiries
// ---------------------------------------------------------------------------

export interface EnquiryEmailData {
  name: string;
  mobile: string;
  email: string;
  tour: string;
  travellersCount: number;
  message: string;
}

/** Thanks the visitor for their enquiry (only when they gave an email address). */
export async function sendEnquiryThanksEmail(enquiry: EnquiryEmailData) {
  const firstName = enquiry.name.split(/\s+/)[0] || enquiry.name;
  await send(enquiry.email, "Thanks for your enquiry — we'll be in touch soon", {
    preheader: `We've received your enquiry about ${enquiry.tour}.`,
    heading: `Thank you, ${firstName}!`,
    hero: true,
    intro: [
      "Your enquiry has reached us and we're excited to plan this with you. Sonali or someone from the team will call or WhatsApp you within one working day.",
    ],
    details: [
      ["Enquiry", enquiry.tour],
      ["Travellers", String(enquiry.travellersCount)],
      ["Mobile", enquiry.mobile],
      ...(enquiry.message ? ([["Your message", enquiry.message]] as [string, string][]) : []),
    ],
    cta: { label: "Browse our tours", url: `${SITE_URL}/tours` },
    outro: ["In a hurry? Message us on WhatsApp and we'll reply as soon as we can."],
    footnote: "You're receiving this because you filled in the enquiry form on travelwithsonali.com.",
  });
}

/** Notifies the team inbox about a website enquiry. */
export async function sendNewEnquiryEmail(enquiry: EnquiryEmailData) {
  const to = getTeamEmail();
  const rows: [string, string][] = [
    ["Name", enquiry.name],
    ["Mobile", enquiry.mobile],
    ["Email", enquiry.email || "-"],
    ["Tour", enquiry.tour],
    ["Travellers", String(enquiry.travellersCount)],
    ["Message", enquiry.message || "-"],
  ];

  await send(
    to,
    `New enquiry: ${enquiry.tour} - ${enquiry.name}`,
    {
      preheader: `${enquiry.name} asked about ${enquiry.tour} (${enquiry.travellersCount} travellers).`,
      heading: "New website enquiry",
      intro: [`${enquiry.name} just filled in the enquiry form on the website.`],
      details: rows,
      cta: { label: "Open in admin panel", url: `${SITE_URL}/admin/leads` },
      outro: [`Reply to this email to answer ${enquiry.name} directly${enquiry.email ? "" : " (they didn't leave an email, so call or WhatsApp them)"}.`],
    },
    // Replying to the alert should go to the visitor, not back to the team inbox
    { replyTo: enquiry.email || undefined }
  );
}

// ---------------------------------------------------------------------------
// Booking lifecycle (sent to the customer)
// ---------------------------------------------------------------------------

export interface BookingEmailBase {
  to: string;
  name: string;
  bookingId: string;
  bookingCode: string;
  tourTitle: string;
}

function tripUrl(bookingId: string): string {
  // Through the login page so customers who aren't signed in land on the right trip afterwards
  return `${PORTAL_LOGIN_URL}?from=${encodeURIComponent(`/portal/trips/${bookingId}`)}`;
}

const PORTAL_HINT_NEW =
  "To see your trip online, open the link below and choose “Forgot password” with this email address to set your password. Your trip, payments and documents will all be there.";
const PORTAL_HINT_EXISTING = "Sign in to your account to see the full itinerary, upload ID documents and track payments.";

export async function sendBookingConfirmedEmail(
  booking: BookingEmailBase & {
    departureDate: string;
    travellersCount: number;
    totalAmount: number;
    paidAmount: number;
    outstandingAmount: number;
    hasPortalAccount: boolean;
  }
) {
  const firstName = booking.name.split(/\s+/)[0] || booking.name;
  await send(booking.to, `Booking confirmed: ${booking.tourTitle} (${booking.bookingCode})`, {
    preheader: `You're booked on ${booking.tourTitle}. Booking ${booking.bookingCode}.`,
    heading: `You're going, ${firstName}!`,
    hero: true,
    intro: [`Your spot on ${booking.tourTitle} is confirmed. Here's a summary of your booking.`],
    details: [
      ["Booking code", booking.bookingCode],
      ["Tour", booking.tourTitle],
      ["Departure", booking.departureDate],
      ["Travellers", String(booking.travellersCount)],
      ["Total", formatInr(booking.totalAmount)],
      ["Paid so far", formatInr(booking.paidAmount)],
      ["Balance due", formatInr(booking.outstandingAmount)],
    ],
    callout:
      booking.outstandingAmount > 0
        ? { tone: "sage", text: `Balance of ${formatInr(booking.outstandingAmount)} to be paid before departure.` }
        : { tone: "sage", text: "Fully paid. Nothing more to do right now." },
    cta: { label: "View your trip", url: tripUrl(booking.bookingId) },
    outro: [
      booking.hasPortalAccount ? PORTAL_HINT_EXISTING : PORTAL_HINT_NEW,
      "Please upload a photo ID for each traveller before the trip so we can arrange permits and stays.",
    ],
    footnote: `Keep your booking code ${booking.bookingCode} handy when you contact us.`,
  });
}

export async function sendPaymentReceivedEmail(
  payment: BookingEmailBase & {
    amount: number;
    paymentMethod: string;
    paymentDate: string;
    referenceNumber: string | null;
    paidAmount: number;
    outstandingAmount: number;
  }
) {
  await send(payment.to, `Payment received: ${formatInr(payment.amount)} for ${payment.bookingCode}`, {
    preheader: `We've recorded ${formatInr(payment.amount)} towards ${payment.tourTitle}.`,
    heading: "Payment received, thank you",
    intro: [`Hi ${payment.name}, we've recorded your payment towards ${payment.tourTitle}.`],
    details: [
      ["Amount", formatInr(payment.amount)],
      ["Method", payment.paymentMethod],
      ["Date", payment.paymentDate],
      ...(payment.referenceNumber ? ([["Reference", payment.referenceNumber]] as [string, string][]) : []),
      ["Booking code", payment.bookingCode],
      ["Total paid", formatInr(payment.paidAmount)],
      ["Balance due", formatInr(payment.outstandingAmount)],
    ],
    callout:
      payment.outstandingAmount > 0
        ? { tone: "sage", text: `${formatInr(payment.outstandingAmount)} still to pay before departure.` }
        : { tone: "sage", text: "Your trip is now fully paid." },
    cta: { label: "View payments", url: tripUrl(payment.bookingId) },
    footnote: "If this payment doesn't look right, reply to this email or message us on WhatsApp.",
  });
}

const STATUS_COPY: Record<string, { subject: string; heading: string; line: string; tone: "sage" | "rose" }> = {
  Confirmed: {
    subject: "is confirmed",
    heading: "Your booking is confirmed",
    line: "Your booking is confirmed. We'll share trip details closer to departure.",
    tone: "sage",
  },
  Completed: {
    subject: "is complete — thank you",
    heading: "Thank you for travelling with us",
    line: "Your trip is marked complete. We hope you had a wonderful time!",
    tone: "sage",
  },
  Cancelled: {
    subject: "has been cancelled",
    heading: "Your booking has been cancelled",
    line: "Your booking has been cancelled. If you weren't expecting this, please contact us right away.",
    tone: "rose",
  },
  "On Hold": {
    subject: "is on hold",
    heading: "Your booking is on hold",
    line: "Your booking is on hold for now. We'll let you know as soon as anything changes.",
    tone: "rose",
  },
};

export async function sendBookingStatusEmail(booking: BookingEmailBase & { departureDate: string; status: string }) {
  const copy = STATUS_COPY[booking.status] || {
    subject: `is now “${booking.status}”`,
    heading: "Your booking has been updated",
    line: `Your booking status is now “${booking.status}”.`,
    tone: "sage" as const,
  };
  await send(booking.to, `Your booking ${booking.bookingCode} ${copy.subject}`, {
    preheader: copy.line,
    heading: copy.heading,
    intro: [`Hi ${booking.name}, there's an update on your ${booking.tourTitle} booking.`],
    callout: { tone: copy.tone, text: copy.line },
    details: [
      ["Booking code", booking.bookingCode],
      ["Tour", booking.tourTitle],
      ["Departure", booking.departureDate],
      ["Status", booking.status],
    ],
    cta: { label: "View your trip", url: tripUrl(booking.bookingId) },
    outro: booking.status === "Completed" ? [`Loved the trip? Leave a review at ${SITE_URL}/tours — it helps other travellers.`] : [],
  });
}

export async function sendDocumentStatusEmail(doc: {
  to: string;
  name: string;
  documentName: string;
  status: "Verified" | "Rejected" | "Under Review";
  notes?: string | null;
}) {
  const verified = doc.status === "Verified";
  await send(doc.to, verified ? `Your ${doc.documentName} is verified` : `Action needed: ${doc.documentName}`, {
    preheader: verified ? "Your document has been verified." : "We couldn't accept your document. Please upload a new one.",
    heading: verified ? "Document verified" : "Please upload your document again",
    intro: [`Hi ${doc.name}, we've reviewed the ${doc.documentName} you uploaded.`],
    callout: verified
      ? { tone: "sage", text: `${doc.documentName}: Verified` }
      : { tone: "rose", text: `${doc.documentName}: Rejected${doc.notes ? ` — ${doc.notes}` : ""}` },
    cta: { label: verified ? "View your documents" : "Upload a new document", url: `${PORTAL_LOGIN_URL}?from=${encodeURIComponent("/portal/documents")}` },
    outro: verified ? [] : ["Make sure the photo is clear, not cropped, and the name matches the traveller."],
  });
}

// Kept for any code that still builds raw HTML snippets
export { escapeHtml };
