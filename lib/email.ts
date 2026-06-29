import "server-only";

import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

// Brevo (transactional) HTTP API. No SDK needed — uses built-in fetch. Set
// BREVO_API_KEY and SENDER_EMAIL in the environment. SENDER_EMAIL must be a
// verified sender in the Brevo dashboard or sends are rejected.
const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

function orderConfirmationHtml(order: {
  orderNumber: string;
  shipName: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingMethod: string;
  items: { brand: string; name: string; reference: string; quantity: number; lineTotal: number }[];
}) {
  const rows = order.items
    .map(
      (i) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #eee;">
          <strong>${i.brand}</strong> ${i.name}<br>
          <span style="color:#8a8a86;font-size:12px;">Ref. ${i.reference} · Qty ${i.quantity}</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right;white-space:nowrap;">${formatPrice(i.lineTotal)}</td>
      </tr>`,
    )
    .join("");

  return `
  <div style="font-family:Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#111;">
    <h1 style="font-weight:400;letter-spacing:-1px;">Thank you, ${order.shipName.split(" ")[0]}.</h1>
    <p style="color:#6e6e6b;font-size:14px;">Your order <strong style="color:#111;">${order.orderNumber}</strong> is confirmed.</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:20px;">
      ${rows}
      <tr><td style="padding:10px 0;color:#6e6e6b;">Subtotal</td><td style="padding:10px 0;text-align:right;">${formatPrice(order.subtotal)}</td></tr>
      <tr><td style="padding:4px 0;color:#6e6e6b;">Shipping (${order.shippingMethod})</td><td style="padding:4px 0;text-align:right;">${order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}</td></tr>
      <tr><td style="padding:10px 0;border-top:1px solid #ddd;font-weight:600;">Total</td><td style="padding:10px 0;border-top:1px solid #ddd;text-align:right;font-weight:600;">${formatPrice(order.total)}</td></tr>
    </table>
    <p style="color:#8a8a86;font-size:12px;margin-top:28px;">Yusuf Traders — fine timepieces.</p>
  </div>`;
}

/**
 * Send the order-confirmation email for a paid order. Safe to call from the
 * payment capture action and the PayPal webhook — guard the call with the
 * boolean markOrderPaid() returns so it only fires once. Never throws: an email
 * failure must not fail an already-paid order; it's logged for follow-up.
 */
export async function sendOrderConfirmationEmail(orderId: string): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const sender = process.env.SENDER_EMAIL;
  if (!apiKey || !sender) {
    console.warn("[email] BREVO_API_KEY or SENDER_EMAIL not set — skipping order confirmation");
    return;
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) {
    console.error("[email] order not found for confirmation", orderId);
    return;
  }

  try {
    const res = await fetch(BREVO_ENDPOINT, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: sender, name: "Yusuf Traders" },
        to: [{ email: order.email, name: order.shipName }],
        subject: `Your Yusuf Traders order ${order.orderNumber} is confirmed`,
        htmlContent: orderConfirmationHtml(order),
      }),
    });
    if (!res.ok) {
      console.error("[email] Brevo send failed", res.status, await res.text());
    }
  } catch (err) {
    console.error("[email] Brevo send threw", err);
  }
}

const BREVO_CONTACTS_ENDPOINT = "https://api.brevo.com/v3/contacts";

// Where contact-form enquiries are delivered. Defaults to the address shown
// across the site; override with CONTACT_EMAIL if the business inbox differs.
const CONTACT_RECIPIENT = process.env.CONTACT_EMAIL || "concierge@yusuftraders.com";

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!,
  );
}

export type ContactMessage = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

/**
 * Deliver a contact-form enquiry to the Yusuf Traders inbox via Brevo, with the
 * sender's address as reply-to. Input is HTML-escaped (it's untrusted). Returns
 * false on any failure so the action can show an error; never throws.
 */
export async function sendContactEmail(input: ContactMessage): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;
  const sender = process.env.SENDER_EMAIL;
  if (!apiKey || !sender) {
    console.warn("[email] BREVO_API_KEY or SENDER_EMAIL not set — contact email skipped");
    return false;
  }

  const subject = input.subject?.trim() || "New enquiry";
  const html = `
  <div style="font-family:Helvetica,Arial,sans-serif;font-size:14px;color:#111;">
    <h2 style="font-weight:400;">Enquiry from ${escapeHtml(input.name)}</h2>
    <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
    <p style="white-space:pre-wrap;border-top:1px solid #eee;padding-top:12px;">${escapeHtml(input.message)}</p>
  </div>`;

  try {
    const res = await fetch(BREVO_ENDPOINT, {
      method: "POST",
      headers: { "api-key": apiKey, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: { email: sender, name: "Yusuf Traders Website" },
        to: [{ email: CONTACT_RECIPIENT }],
        replyTo: { email: input.email, name: input.name },
        subject: `Contact form: ${subject}`,
        htmlContent: html,
      }),
    });
    if (!res.ok) {
      console.error("[email] contact send failed", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] contact send threw", err);
    return false;
  }
}

/**
 * Add (or update) a newsletter subscriber in Brevo. Optionally files them under
 * BREVO_NEWSLETTER_LIST_ID when set. Returns false on failure; never throws.
 */
export async function addNewsletterContact(email: string): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("[email] BREVO_API_KEY not set — newsletter signup skipped");
    return false;
  }

  const listId = process.env.BREVO_NEWSLETTER_LIST_ID;
  try {
    const res = await fetch(BREVO_CONTACTS_ENDPOINT, {
      method: "POST",
      headers: { "api-key": apiKey, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        email,
        updateEnabled: true,
        ...(listId ? { listIds: [Number(listId)] } : {}),
      }),
    });
    if (!res.ok) {
      console.error("[email] newsletter add failed", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] newsletter add threw", err);
    return false;
  }
}
