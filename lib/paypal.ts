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

/** Create a PayPal order for a whole-USD amount. Returns the PayPal order id. */
export async function createPayPalOrder(amountUsd: number, referenceId: string): Promise<string> {
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
          reference_id: referenceId,
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
