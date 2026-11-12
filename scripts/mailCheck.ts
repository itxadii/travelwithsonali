import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { getTeamEmail, sendEnquiryThanksEmail, verifySmtpConnection } from "../lib/mailer";

/**
 * Checks the SMTP login from the env files.
 *   npm run mail:check              – login only, sends nothing
 *   npm run mail:check -- --send    – also sends a sample "thanks for your enquiry" email to the team inbox
 */
async function main() {
  const user = process.env.SMTP_USER || "(not set)";
  const host = process.env.SMTP_HOST || "smtp.purelymail.com";
  console.log(`Checking SMTP login for ${user} at ${host}:${process.env.SMTP_PORT || 465} …`);
  await verifySmtpConnection();
  console.log("✅ SMTP login works.");

  if (process.argv.includes("--send")) {
    const to = getTeamEmail();
    await sendEnquiryThanksEmail({
      name: "Test Traveller",
      mobile: "+91 98765 43210",
      email: to,
      tour: "Kedarnath Dham Yatra",
      travellersCount: 2,
      message: "This is a sample of the automated enquiry email.",
    });
    console.log(`✅ Sample email sent to ${to}.`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Mail check failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  });
