import "server-only";

// Minimal PayPal Orders v2 REST client. We talk to the REST API directly with
// fetch rather than pulling in the Server SDK — three calls (token, create,
// capture) don't justify the dependency. Credentials come from the environment:
//   PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET   (server, secret)
//   PAYPAL_API_BASE                          (optional; defaults to sandbox)
// The browser separately needs NEXT_PUBLIC_PAYPAL_CLIENT_ID for the JS SDK.

const API_BASE = process.env.PAYPAL_API_BASE?.replace(/\/$/, "") || "https://api-m.sandbox.paypal.com";

export function isPayPalConfigured(): boolean {
  return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) {
    throw new Error("PayPal credentials are not configured.");
  }

  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");
  const res = await fetch(`${API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`PayPal token request failed: ${res.status}`);
  }
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

/**
 * Create a PayPal order for a whole-USD amount. `orderId` is our internal order
 * id, stamped as both reference_id and custom_id so the capture webhook carries
 * it back to us. Returns the PayPal order id.
 */
export async function createPayPalOrder(amountUsd: number, orderId: string): Promise<string> {
  const token = await getAccessToken();
  const res = await fetch(`${API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: orderId,
          custom_id: orderId,
          amount: { currency_code: "USD", value: amountUsd.toFixed(2) },
        },
      ],
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`PayPal create order failed: ${res.status}`);
  }
  const data = (await res.json()) as { id: string };
  return data.id;
}

export type CaptureResult = {
  completed: boolean;
  captureId: string | null;
  amountUsd: number | null;
};

/** Capture an approved PayPal order. Surfaces the captured amount so the caller
 *  can verify it matches the order total before marking it paid. */
export async function capturePayPalOrder(paypalOrderId: string): Promise<CaptureResult> {
  const token = await getAccessToken();
  const res = await fetch(`${API_BASE}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`PayPal capture failed: ${res.status}`);
  }

  const data = (await res.json()) as {
    status?: string;
    purchase_units?: Array<{
      payments?: { captures?: Array<{ id: string; amount?: { value: string } }> };
    }>;
  };

  const capture = data.purchase_units?.[0]?.payments?.captures?.[0];
  return {
    completed: data.status === "COMPLETED",
    captureId: capture?.id ?? null,
    amountUsd: capture?.amount?.value ? Number(capture.amount.value) : null,
  };
}

/**
 * Verify a webhook came from PayPal (postback method): send the raw event plus
 * its transmission headers and our stored webhook id back to PayPal. The raw
 * body must be passed through untouched — re-serializing JSON can fail the
 * check. Returns false when PAYPAL_WEBHOOK_ID isn't configured (can't verify).
 */
export async function verifyWebhookSignature(rawBody: string, headers: Headers): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) return false;

  const body =
    `{"auth_algo":${JSON.stringify(headers.get("paypal-auth-algo"))},` +
    `"cert_url":${JSON.stringify(headers.get("paypal-cert-url"))},` +
    `"transmission_id":${JSON.stringify(headers.get("paypal-transmission-id"))},` +
    `"transmission_sig":${JSON.stringify(headers.get("paypal-transmission-sig"))},` +
    `"transmission_time":${JSON.stringify(headers.get("paypal-transmission-time"))},` +
    `"webhook_id":${JSON.stringify(webhookId)},` +
    `"webhook_event":${rawBody}}`;

  try {
    const token = await getAccessToken();
    const res = await fetch(`${API_BASE}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body,
      cache: "no-store",
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { verification_status?: string };
    return data.verification_status === "SUCCESS";
  } catch (err) {
    console.error("verifyWebhookSignature failed", err);
    return false;
  }
}
