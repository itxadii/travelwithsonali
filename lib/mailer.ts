import nodemailer from "nodemailer";

/**
 * Gmail SMTP transport. Credentials come from the environment only:
 *   SMTP_USER  – sending Gmail address (e.g. travelwithsonaliinfo@gmail.com)
 *   SMTP_PASS  – a Google App Password for that account (not the normal login password)
 */
/** Strips quotes and whitespace that often sneak in when pasting values into a hosting dashboard. */
function cleanEnv(value: string | undefined): string {
  return (value || "").trim().replace(/^["']|["']$/g, "").trim();
}

function getSmtpUser(): string {
  return cleanEnv(process.env.SMTP_USER);
}

function getTransport() {
  const user = getSmtpUser();
  // Google shows App Passwords as "abcd efgh ijkl mnop"; the spaces are not part of the password
  const pass = cleanEnv(process.env.SMTP_PASS).replace(/\s+/g, "");
  if (!user || !pass) {
    throw new Error("SMTP_USER and SMTP_PASS must be set to send email.");
  }
  if (pass.length !== 16) {
    console.warn(`SMTP_PASS is ${pass.length} characters; a Google App Password is 16. Gmail will likely reject it.`);
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export async function sendEmailVerificationEmail(to: string, name: string, code: string) {
  await getTransport().sendMail({
    from: `"Travel With Sonali" <${getSmtpUser()}>`,
    to,
    subject: `${code} is your Travel With Sonali verification code`,
    text: [
      `Hi ${name},`,
      "",
      `Your verification code is: ${code}`,
      "",
      "Enter it on the website to finish creating your account. It expires in 30 minutes.",
      "If you didn't create an account, you can ignore this email.",
      "",
      "— Travel With Sonali",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #685752; max-width: 480px;">
        <p>Hi ${escapeHtml(name)},</p>
        <p>Your verification code is:</p>
        <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px; font-family: monospace;">${code}</p>
        <p>Enter it on the website to finish creating your account. It expires in 30 minutes.</p>
        <p style="font-size: 12px; color: #7A6862;">If you didn't create an account, you can ignore this email.</p>
        <p>— Travel With Sonali</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, name: string, code: string, resetLink: string) {
  const from = `"Travel With Sonali" <${getSmtpUser()}>`;
  await getTransport().sendMail({
    from,
    to,
    subject: "Your Travel With Sonali password reset code",
    text: [
      `Hi ${name},`,
      "",
      `Your password reset code is: ${code}`,
      "",
      `Or reset your password directly using this link: ${resetLink}`,
      "",
      "This code expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.",
      "",
      "— Travel With Sonali",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #685752; max-width: 480px;">
        <p>Hi ${escapeHtml(name)},</p>
        <p>Your password reset code is:</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px; font-family: monospace;">${code}</p>
        <p>Or <a href="${resetLink}" style="color: #8EB486;">click here to set a new password</a>.</p>
        <p style="font-size: 12px; color: #997C70;">This code expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
        <p>— Travel With Sonali</p>
      </div>
    `,
  });
}

/** Notifies the team inbox (ENQUIRY_NOTIFY_EMAIL, falling back to SMTP_USER) about a website enquiry. */
export async function sendNewEnquiryEmail(enquiry: {
  name: string;
  mobile: string;
  email: string;
  tour: string;
  travellersCount: number;
  message: string;
}) {
  const to = cleanEnv(process.env.ENQUIRY_NOTIFY_EMAIL) || getSmtpUser();
  if (!to) throw new Error("No ENQUIRY_NOTIFY_EMAIL or SMTP_USER configured.");

  const rows: [string, string][] = [
    ["Name", enquiry.name],
    ["Mobile", enquiry.mobile],
    ["Email", enquiry.email || "-"],
    ["Tour", enquiry.tour],
    ["Travellers", String(enquiry.travellersCount)],
    ["Message", enquiry.message || "-"],
  ];

  await getTransport().sendMail({
    from: `"Travel With Sonali Website" <${getSmtpUser()}>`,
    to,
    replyTo: enquiry.email || undefined,
    subject: `New enquiry: ${enquiry.tour} - ${enquiry.name}`,
    text: [...rows.map(([k, v]) => `${k}: ${v}`), "", "View it in the admin panel under Leads."].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #685752; max-width: 520px;">
        <p><strong>New website enquiry</strong></p>
        <table style="border-collapse: collapse;">
          ${rows
            .map(
              ([k, v]) =>
                `<tr><td style="padding: 4px 12px 4px 0; color: #7A6862;">${k}</td><td style="padding: 4px 0;">${escapeHtml(v)}</td></tr>`
            )
            .join("")}
        </table>
        <p style="font-size: 12px; color: #7A6862;">View it in the admin panel under Leads.</p>
      </div>
    `,
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
