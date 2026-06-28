import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/paypal";
import { markOrderPaid, markOrderRefunded } from "@/lib/orders";

// PayPal posts events here (configure the URL + PAYPAL_WEBHOOK_ID in the PayPal
// dashboard). Every event is signature-verified against PayPal before we act.
// We map back to our order via custom_id, which createPayPalOrder stamps with
// our order id. Always returns 2xx on a verified event so PayPal stops retrying.
export async function POST(request: Request) {
  // Raw body is required for signature verification — read it before parsing.
  const rawBody = await request.text();

  if (!(await verifyWebhookSignature(rawBody, request.headers))) {
    console.warn("[paypal-webhook] signature verification failed");
    return new NextResponse("invalid signature", { status: 400 });
  }

  let event: {
    event_type?: string;
    resource?: { id?: string; custom_id?: string };
  };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new NextResponse("bad json", { status: 400 });
  }

  const type = event.event_type;
  const orderId = event.resource?.custom_id;

  if (!orderId) {
    console.log(`[paypal-webhook] ${type} had no custom_id — skipped`);
    return NextResponse.json({ ok: true });
  }

  if (type === "PAYMENT.CAPTURE.COMPLETED") {
    const flipped = await markOrderPaid(orderId, event.resource?.id ?? "paypal-webhook");
    console.log(`[paypal-webhook] capture completed order=${orderId} markedPaid=${flipped}`);
  } else if (type === "PAYMENT.CAPTURE.REFUNDED" || type === "PAYMENT.CAPTURE.REVERSED") {
    const flipped = await markOrderRefunded(orderId);
    console.log(`[paypal-webhook] refund order=${orderId} markedRefunded=${flipped}`);
  } else {
    console.log(`[paypal-webhook] ignored event ${type} order=${orderId}`);
  }

  return NextResponse.json({ ok: true });
}
