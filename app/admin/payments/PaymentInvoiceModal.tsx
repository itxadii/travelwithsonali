"use client";

import React, { useState } from "react";
import {
  Download,
  Mail,
  Check,
  X,
  FileText,
  Copy,
  Printer,
} from "lucide-react";

export interface ExtendedPaymentRecord {
  id: string;
  bookingId: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  referenceNumber?: string;
  notes?: string;
  recordedBy: string;
  createdAt: string;
  // Booking details
  bookingCode?: string | null;
  tourTitle?: string | null;
  departureDate?: string | null;
  travellersCount?: number | null;
  pricePerTraveller?: number | null;
  discount?: number | null;
  totalAmount?: number | null;
  paidAmount?: number | null;
  outstandingAmount?: number | null;
  paymentStatus?: string | null;
  // Customer details
  customerName?: string | null;
  customerPhone?: string | null;
  customerEmail?: string | null;
}

interface PaymentInvoiceModalProps {
  payment: ExtendedPaymentRecord | null;
  onClose: () => void;
}

export default function PaymentInvoiceModal({ payment, onClose }: PaymentInvoiceModalProps) {
  const [copied, setCopied] = useState(false);

  if (!payment) return null;

  const invoiceNumber = `INV-${payment.bookingCode ? payment.bookingCode.replace(/[^a-zA-Z0-9]/g, "") : payment.id.substring(4, 12).toUpperCase()}-${payment.id.slice(-4).toUpperCase()}`;
  const clientName = payment.customerName || "Valued Traveller";
  const clientPhone = payment.customerPhone || "";
  const clientEmail = payment.customerEmail || "";
  const cleanPhone = clientPhone.replace(/[^0-9]/g, "");
  const tourName = payment.tourTitle || "Himalayan Group Tour Experience";
  const displayBookingCode = payment.bookingCode || payment.bookingId;
  const packageTotal = payment.totalAmount || payment.amount;
  const totalPaid = payment.paidAmount || payment.amount;
  const balanceDue = payment.outstandingAmount !== undefined ? payment.outstandingAmount : 0;
  const displayDate = payment.paymentDate || new Date(payment.createdAt).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const receiptSummaryText = `*TRAVEL WITH SONALI - PAYMENT RECEIPT* ✈️
━━━━━━━━━━━━━━━━━━━━━━
Receipt No: ${invoiceNumber}
Date: ${displayDate}
Status: CONFIRMED & PAID ✅

*CLIENT DETAILS:*
• Name: ${clientName}
${clientPhone ? `• Phone: ${clientPhone}\n` : ""}${clientEmail ? `• Email: ${clientEmail}\n` : ""}
*TRIP & BOOKING DETAILS:*
• Tour Package: ${tourName}
• Booking Code: ${displayBookingCode}
• Batch / Departure: ${payment.departureDate || "Scheduled Batch"}
• Travellers: ${payment.travellersCount || 1} Pax

*PAYMENT SUMMARY:*
• Amount Received: ₹${payment.amount.toLocaleString("en-IN")}
• Payment Mode: ${payment.paymentMethod}
• Reference/UTR: ${payment.referenceNumber || "UPI/Direct"}
• Total Package Cost: ₹${packageTotal.toLocaleString("en-IN")}
• Total Paid So Far: ₹${totalPaid.toLocaleString("en-IN")}
• Remaining Balance: ₹${balanceDue.toLocaleString("en-IN")}

Thank you for travelling with Sonali!
Contact: +91 9152975552 | travelwithsonaliinfo@gmail.com
Mumbai / Delhi & Rishikesh, India`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(receiptSummaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Copy error:", err);
    }
  };

  const generatePrintableHtml = () => {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>Payment_Receipt_${displayBookingCode}_${payment.id}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 12mm;
            }
            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #473B37;
              background-color: #FFFFFF;
              margin: 0;
              padding: 0;
              -webkit-font-smoothing: antialiased;
            }
            .invoice-wrapper {
              max-width: 780px;
              margin: 0 auto;
              background-color: #FFFFFF;
              border: 1.5px solid #E8DCD5;
              border-radius: 20px;
              padding: 36px 40px;
            }
            .header-table {
              width: 100%;
              border-collapse: collapse;
            }
            .brand-name {
              font-size: 22px;
              font-weight: 800;
              color: #685752;
              letter-spacing: -0.3px;
              line-height: 1.2;
            }
            .brand-sub {
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #8EB486;
              font-weight: 800;
              margin-top: 2px;
            }
            .contact-line {
              font-size: 11px;
              color: #7A6862;
              margin-top: 8px;
              line-height: 1.5;
            }
            .receipt-col {
              text-align: right;
              vertical-align: top;
            }
            .receipt-label {
              font-size: 11px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.8px;
              color: #997C70;
            }
            .invoice-number {
              font-size: 17px;
              font-weight: 800;
              color: #685752;
              margin-top: 3px;
              font-family: monospace, sans-serif;
            }
            .invoice-date {
              font-size: 12px;
              color: #7A6862;
              margin-top: 3px;
            }
            .paid-badge {
              display: inline-block;
              padding: 4px 12px;
              border: 2px solid #16a34a;
              border-radius: 6px;
              color: #16a34a;
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 1.2px;
              background-color: #f0fdf4;
              margin-top: 8px;
            }
            .divider {
              height: 1px;
              background-color: #E8DCD5;
              margin: 20px 0;
            }
            .info-box-table {
              width: 100%;
              border-collapse: separate;
              border-spacing: 0;
              background-color: #FDF7F4;
              border: 1px solid #E8DCD5;
              border-radius: 12px;
              overflow: hidden;
              margin-bottom: 24px;
            }
            .info-box-cell {
              padding: 16px 20px;
              vertical-align: top;
            }
            .box-heading {
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.8px;
              color: #997C70;
            }
            .box-title {
              font-size: 14px;
              font-weight: 800;
              color: #685752;
              margin-top: 4px;
            }
            .box-sub {
              font-size: 11px;
              color: #7A6862;
              margin-top: 2px;
            }
            .line-items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 24px;
            }
            .line-items-table thead tr {
              background-color: #F7EFEA;
            }
            .line-items-table th {
              background-color: #F7EFEA !important;
              border-top: 1px solid #E8DCD5;
              border-bottom: 1px solid #E8DCD5;
              padding: 10px 14px;
              text-align: left;
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.8px;
              color: #685752;
            }
            .line-items-table td {
              padding: 14px;
              border-bottom: 1px solid #E8DCD5;
              font-size: 12px;
            }
            .method-pill {
              display: inline-block;
              padding: 2px 8px;
              border-radius: 4px;
              background-color: #F7EFEA;
              border: 1px solid #E8DCD5;
              font-size: 10px;
              font-weight: 700;
              color: #685752;
            }
            .summary-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 24px;
            }
            .received-highlight {
              background-color: #f0fdf4 !important;
              border: 1.5px solid #86efac;
              border-radius: 8px;
              padding: 10px 14px;
            }
            .footer-table {
              width: 100%;
              border-collapse: collapse;
            }
          </style>
        </head>
        <body>
          <div class="invoice-wrapper">
            <!-- Header Table -->
            <table class="header-table">
              <tr>
                <td style="vertical-align: top;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="width: 46px; vertical-align: middle; padding-right: 12px;">
                        <img
                          src="${window.location.origin}/travelwithsonalilogo.jpg"
                          alt="Travel With Sonali"
                          width="44"
                          height="44"
                          style="width: 44px; height: 44px; border-radius: 50%; border: 1px solid #E8DCD5; object-fit: cover; display: block;"
                        />
                      </td>
                      <td style="vertical-align: middle;">
                        <div class="brand-name">TRAVEL WITH SONALI</div>
                        <div class="brand-sub">Curated Group Tours & Soulful Journeys</div>
                      </td>
                    </tr>
                  </table>
                  <div class="contact-line">
                    Mumbai / Delhi & Rishikesh, India<br/>
                    Phone: +91 9152975552 • Email: travelwithsonaliinfo@gmail.com<br/>
                    Website: www.travelwithsonali.com
                  </div>
                </td>
                <td class="receipt-col">
                  <div class="receipt-label">PAYMENT RECEIPT</div>
                  <div class="invoice-number">${invoiceNumber}</div>
                  <div class="invoice-date">Date: ${displayDate}</div>
                  <div>
                    <span class="paid-badge">PAID / CONFIRMED</span>
                  </div>
                </td>
              </tr>
            </table>

            <div class="divider"></div>

            <!-- Billed To & Trip Information -->
            <table class="info-box-table">
              <tr>
                <td class="info-box-cell" style="width: 50%;">
                  <div class="box-heading">BILLED TO (TRAVELLER)</div>
                  <div class="box-title">${clientName}</div>
                  ${clientPhone ? `<div class="box-sub">Phone: ${clientPhone}</div>` : ""}
                  ${clientEmail ? `<div class="box-sub">Email: ${clientEmail}</div>` : ""}
                </td>
                <td class="info-box-cell" style="width: 50%; border-left: 1px solid #E8DCD5;">
                  <div class="box-heading">TRIP & BOOKING DETAILS</div>
                  <div class="box-title">${tourName}</div>
                  <div class="box-sub">Booking Code: <strong style="color: #8EB486;">${displayBookingCode}</strong></div>
                  <div class="box-sub">Departure: ${payment.departureDate || "Scheduled Batch"} • ${payment.travellersCount || 1} Traveller(s)</div>
                </td>
              </tr>
            </table>

            <!-- Line Items Table -->
            <table class="line-items-table">
              <thead>
                <tr>
                  <th style="width: 42%;">DESCRIPTION</th>
                  <th style="width: 18%;">PAYMENT MODE</th>
                  <th style="width: 20%;">REFERENCE / UTR</th>
                  <th style="width: 20%; text-align: right;">AMOUNT RECEIVED</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div style="font-size: 13px; font-weight: 800; color: #685752;">Tour Package Payment</div>
                    <div style="font-size: 11px; color: #997C70; margin-top: 2px;">
                      ${payment.notes || "Advance booking payment"}
                    </div>
                  </td>
                  <td>
                    <span class="method-pill">${payment.paymentMethod}</span>
                  </td>
                  <td style="font-family: monospace; font-size: 11px; color: #7A6862;">
                    ${payment.referenceNumber || "ADV-TWS-2026-257"}
                  </td>
                  <td style="text-align: right; font-size: 18px; font-weight: 800; color: #059669;">
                    ₹${payment.amount.toLocaleString("en-IN")}
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Financial Summary & Acknowledgement -->
            <table class="summary-table">
              <tr>
                <td style="width: 55%; vertical-align: top; padding-right: 20px;">
                  <div style="font-size: 12px; font-weight: 800; color: #685752;">Payment Acknowledgement</div>
                  <div style="font-size: 11px; color: #997C70; margin-top: 3px;">
                    Recorded by: <strong style="color: #685752;">${payment.recordedBy}</strong>
                  </div>
                  <div style="font-size: 11px; color: #997C70; margin-top: 2px; line-height: 1.4;">
                    Status: Electronic payment receipt verified and recorded in Travel With Sonali ledger.
                  </div>
                </td>
                <td style="width: 45%; vertical-align: top;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="padding: 4px 0; font-size: 11px; color: #7A6862;">Total Tour Cost:</td>
                      <td style="padding: 4px 0; font-size: 11px; font-weight: 700; color: #685752; text-align: right;">₹${packageTotal.toLocaleString("en-IN")}</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; font-size: 11px; color: #7A6862;">Total Paid to Date:</td>
                      <td style="padding: 4px 0; font-size: 11px; font-weight: 700; color: #685752; text-align: right;">₹${totalPaid.toLocaleString("en-IN")}</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; font-size: 11px; color: #7A6862;">Remaining Balance:</td>
                      <td style="padding: 4px 0; font-size: 11px; font-weight: 700; color: #685752; text-align: right;">₹${balanceDue.toLocaleString("en-IN")}</td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding-top: 8px;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" class="received-highlight">
                          <tr>
                            <td style="font-size: 13px; font-weight: 800; color: #166534;">Received This Receipt:</td>
                            <td style="font-size: 16px; font-weight: 900; color: #166534; text-align: right;">₹${payment.amount.toLocaleString("en-IN")}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <div class="divider"></div>

            <!-- Footer: Legal & Signature -->
            <table class="footer-table">
              <tr>
                <td style="font-size: 9.5px; color: #997C70; line-height: 1.5; vertical-align: middle;">
                  <div>• Payments are governed by Travel With Sonali booking and cancellation terms.</div>
                  <div>• This is a computer-generated tax invoice & receipt requiring no physical signature.</div>
                </td>
                <td style="text-align: right; vertical-align: middle; white-space: nowrap;">
                  <div style="font-family: Georgia, serif; font-style: italic; font-size: 16px; font-weight: 800; color: #685752;">Sonali Palekar</div>
                  <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: #997C70; margin-top: 2px;">FOUNDER & LEAD EXPLORER</div>
                </td>
              </tr>
            </table>
          </div>
        </body>
      </html>
    `;
  };

  const handlePrintPdf = () => {
    // Remove previous print iframe if existing
    const existingIframe = document.getElementById("invoice-print-frame");
    if (existingIframe) {
      existingIframe.remove();
    }

    // Create an invisible iframe to isolate print styles completely
    const iframe = document.createElement("iframe");
    iframe.id = "invoice-print-frame";
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) {
      window.print();
      return;
    }

    doc.open();
    doc.write(generatePrintableHtml());
    doc.close();

    const triggerPrint = () => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.error("Print error:", err);
      }
    };

    // Wait for images (like the logo) to fully load before invoking print
    const imgs = doc.images;
    if (imgs && imgs.length > 0) {
      let loaded = 0;
      const total = imgs.length;
      for (let i = 0; i < total; i++) {
        if (imgs[i].complete) {
          loaded++;
        } else {
          imgs[i].onload = imgs[i].onerror = () => {
            loaded++;
            if (loaded >= total) {
              setTimeout(triggerPrint, 150);
            }
          };
        }
      }
      if (loaded >= total) {
        setTimeout(triggerPrint, 200);
      }
    } else {
      setTimeout(triggerPrint, 200);
    }
  };

  const whatsappMessage = encodeURIComponent(receiptSummaryText);
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${whatsappMessage}`
    : `https://wa.me/?text=${whatsappMessage}`;

  const emailSubject = encodeURIComponent(`Payment Receipt & Invoice [${invoiceNumber}] - Travel With Sonali`);
  const emailBody = encodeURIComponent(receiptSummaryText.replace(/\*/g, ""));
  const mailtoUrl = clientEmail
    ? `mailto:${clientEmail}?subject=${emailSubject}&body=${emailBody}`
    : `mailto:?subject=${emailSubject}&body=${emailBody}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-3xl my-6 bg-[#FFFDF9] rounded-3xl border border-[#E8DCD5] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Control Bar with Export Actions */}
        <div className="p-4 sm:px-6 bg-[#F7EFEA] border-b border-[#E8DCD5] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#685752] text-white">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-[#685752]">Official Payment Invoice</h3>
              <p className="text-[11px] text-[#997C70]">{invoiceNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Copy Text Summary */}
            <button
              type="button"
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E8DCD5] bg-white text-xs font-bold text-[#685752] hover:bg-[#FDF7F4] active:scale-95 transition-all cursor-pointer"
              title="Copy receipt text summary"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy Summary"}</span>
            </button>

            {/* Send via WhatsApp Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
              title={cleanPhone ? `Send directly to ${clientPhone} on WhatsApp` : "Share on WhatsApp"}
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>WhatsApp Client</span>
            </a>

            {/* Send via Email Button */}
            <a
              href={mailtoUrl}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#685752] hover:bg-[#564743] text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
              title={clientEmail ? `Send email to ${clientEmail}` : "Compose receipt email"}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Client</span>
            </a>

            {/* Print / Export PDF */}
            <button
              type="button"
              onClick={handlePrintPdf}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#8EB486] hover:bg-[#7A9F73] text-white text-xs font-bold uppercase tracking-wider shadow-sm active:scale-95 transition-all cursor-pointer"
              title="Download or Print PDF Invoice"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-[#997C70] hover:text-[#685752] hover:bg-black/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Invoice Sheet Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#F4EDE8]/50">
          <div
            id="invoice-printable-area"
            className="max-w-2xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-[#E8DCD5] shadow-md space-y-6 text-[#473B37]"
          >
            {/* Header: Brand & Invoice Meta */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-[#E8DCD5] pb-6">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden border border-[#E8DCD5] shrink-0 bg-white">
                    <img
                      src="/travelwithsonalilogo.jpg"
                      alt="Travel With Sonali"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h1 className="text-xl font-extrabold text-[#685752] tracking-tight leading-tight">
                      TRAVEL WITH SONALI
                    </h1>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-[#8EB486]">
                      Curated Group Tours & Soulful Journeys
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-[#7A6862] mt-3 space-y-0.5">
                  <p>Mumbai / Delhi & Rishikesh, India</p>
                  <p>Phone: +91 9152975552 • Email: travelwithsonaliinfo@gmail.com</p>
                  <p>Website: www.travelwithsonali.com</p>
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#997C70] block">
                  PAYMENT RECEIPT
                </span>
                <span className="text-lg font-bold text-[#685752] block font-mono">
                  {invoiceNumber}
                </span>
                <p className="text-xs text-[#7A6862] mt-0.5">
                  Date: {displayDate}
                </p>
                <div className="mt-2">
                  <span className="inline-block px-3 py-1 rounded-md border-2 border-emerald-600 text-emerald-700 text-[10px] font-extrabold uppercase tracking-widest bg-emerald-50">
                    PAID / CONFIRMED
                  </span>
                </div>
              </div>
            </div>

            {/* Billed To & Trip Information Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5]">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#997C70] block">
                  Billed To (Traveller)
                </span>
                <h4 className="text-sm font-bold text-[#685752]">{clientName}</h4>
                {clientPhone && <p className="text-xs text-[#7A6862]">Phone: {clientPhone}</p>}
                {clientEmail && <p className="text-xs text-[#7A6862]">Email: {clientEmail}</p>}
              </div>

              <div className="space-y-1 sm:border-l sm:border-[#E8DCD5] sm:pl-4">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#997C70] block">
                  Trip & Booking Details
                </span>
                <h4 className="text-sm font-bold text-[#685752]">{tourName}</h4>
                <p className="text-xs text-[#7A6862]">
                  Booking Code: <span className="font-semibold text-[#8EB486]">{displayBookingCode}</span>
                </p>
                <p className="text-xs text-[#7A6862]">
                  Departure: {payment.departureDate || "Scheduled Batch"} • {payment.travellersCount || 1} Traveller(s)
                </p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#F7EFEA] border-y border-[#E8DCD5] text-[#685752] uppercase font-bold text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Payment Mode</th>
                    <th className="py-2.5 px-3">Reference / UTR</th>
                    <th className="py-2.5 px-3 text-right">Amount Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DCD5]/80">
                  <tr>
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-[#685752]">Tour Package Payment</p>
                      <p className="text-[11px] text-[#997C70]">
                        {payment.notes || "Advance booking payment"}
                      </p>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-[#F7EFEA] text-[#685752] font-semibold border border-[#E8DCD5] text-[10px]">
                        {payment.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[11px] text-[#7A6862]">
                      {payment.referenceNumber || "ADV-TWS-2026-257"}
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-base text-emerald-700">
                      ₹{payment.amount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
              <div className="text-xs text-[#7A6862] space-y-1 max-w-xs">
                <p className="font-bold text-[#685752]">Payment Acknowledgement</p>
                <p className="text-[11px] text-[#997C70]">
                  Recorded by: <span className="font-medium text-[#685752]">{payment.recordedBy}</span>
                </p>
                <p className="text-[11px] text-[#997C70]">
                  Status: Electronic payment receipt verified and recorded in Travel With Sonali ledger.
                </p>
              </div>

              <div className="w-full sm:w-64 space-y-2 border-t sm:border-t-0 pt-2 sm:pt-0">
                <div className="flex justify-between text-xs text-[#7A6862]">
                  <span>Total Tour Cost:</span>
                  <span className="font-semibold text-[#685752]">₹{packageTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-xs text-[#7A6862]">
                  <span>Total Paid to Date:</span>
                  <span className="font-semibold text-[#685752]">₹{totalPaid.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-xs text-[#7A6862]">
                  <span>Remaining Balance:</span>
                  <span className="font-semibold text-[#685752]">₹{balanceDue.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-emerald-800 bg-emerald-50/70 p-2 rounded-lg border border-emerald-200">
                  <span>Received This Receipt:</span>
                  <span>₹{payment.amount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* Terms & Signature Footer */}
            <div className="border-t border-[#E8DCD5] pt-4 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#997C70]">
              <div className="space-y-0.5 text-center sm:text-left">
                <p>• Payments are governed by Travel With Sonali booking and cancellation terms.</p>
                <p>• This is a computer-generated tax invoice & receipt requiring no physical signature.</p>
              </div>

              <div className="text-center sm:text-right shrink-0">
                <p className="font-serif-italic font-bold text-sm text-[#685752]">Sonali Palekar</p>
                <p className="text-[9px] uppercase tracking-wider text-[#997C70]">Founder & Lead Explorer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
