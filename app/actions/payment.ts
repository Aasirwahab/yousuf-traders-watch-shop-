"use server";

import { getViewableOrder, markOrderPaid } from "@/lib/orders";
import { createPayPalOrder, capturePayPalOrder } from "@/lib/paypal";
import { checkRateLimit } from "@/lib/rate-limit";

export type CreatePayPalResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export type CapturePayPalResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Start a PayPal payment for one of our orders. The amount is read from the DB
 * order (recomputed server-side at checkout), never from the client. Only the
 * session that owns / placed the order can pay it, and only while it's PENDING.
 */
export async function createPayPalOrderAction(orderId: string): Promise<CreatePayPalResult> {
  if (!(await checkRateLimit("checkout"))) {
    return { ok: false, error: "Too many attempts. Please wait a moment and try again." };
  }

  const order = await getViewableOrder(orderId);
  if (!order) return { ok: false, error: "Order not found." };
  if (order.status !== "PENDING") {
    return { ok: false, error: "This order has already been paid." };
  }
  if (order.total <= 0) {
    return { ok: false, error: "This order has no payable total." };
  }

  try {
    const id = await createPayPalOrder(order.total, order.orderNumber);
    return { ok: true, id };
  } catch (err) {
    console.error("createPayPalOrderAction failed", err);
    return { ok: false, error: "We couldn't start the payment. Please try again." };
  }
}

/**
 * Capture an approved PayPal order and mark our order PAID. The captured amount
 * is verified against the order total before anything is marked paid.
 */
export async function capturePayPalOrderAction(
  orderId: string,
  paypalOrderId: string,
): Promise<CapturePayPalResult> {
  const order = await getViewableOrder(orderId);
  if (!order) return { ok: false, error: "Order not found." };
  if (order.status !== "PENDING") {
    // Already paid (e.g. a duplicate onApprove) — treat as success.
    return { ok: true };
  }

  try {
    const capture = await capturePayPalOrder(paypalOrderId);
    if (!capture.completed || capture.captureId === null) {
      return { ok: false, error: "Payment was not completed. Please try again." };
    }
    if (capture.amountUsd !== order.total) {
      // Amount mismatch — do not mark paid; flag for manual review.
      console.error("PayPal capture amount mismatch", {
        orderId,
        expected: order.total,
        captured: capture.amountUsd,
      });
      return { ok: false, error: "Payment amount mismatch. Please contact support." };
    }

    await markOrderPaid(orderId, capture.captureId);
    return { ok: true };
  } catch (err) {
    console.error("capturePayPalOrderAction failed", err);
    return { ok: false, error: "We couldn't confirm the payment. Please contact support." };
  }
}
