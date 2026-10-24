import nodemailer from "nodemailer";

/**
 * Gmail SMTP transport. Credentials come from the environment only:
 *   SMTP_USER  – sending Gmail address (e.g. travelwithsonaliinfo@gmail.com)
 *   SMTP_PASS  – a Google App Password for that account (not the normal login password)
 */
function getTransport() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    throw new Error("SMTP_USER and SMTP_PASS must be set to send email.");
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export async function sendPasswordResetEmail(to: string, name: string, code: string, resetLink: string) {
  const from = `"Travel With Sonali" <${process.env.SMTP_USER}>`;
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
