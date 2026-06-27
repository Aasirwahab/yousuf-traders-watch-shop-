// Throwaway PayPal credential check. Loads .env, requests an OAuth token, then
// creates+voids a tiny test order to confirm the keys can actually transact.
// Run: pnpm exec tsx scripts/check-paypal.mjs   (or: node --env-file=.env ...)
import "dotenv/config";

const base = (process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com").replace(/\/$/, "");
const id = process.env.PAYPAL_CLIENT_ID;
const secret = process.env.PAYPAL_CLIENT_SECRET;
const publicId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

const mask = (v) => (v ? `${v.slice(0, 6)}…${v.slice(-4)} (len ${v.length})` : "MISSING");

console.log("API base:                    ", base);
console.log("PAYPAL_CLIENT_ID:            ", mask(id));
console.log("PAYPAL_CLIENT_SECRET:        ", secret ? `set (len ${secret.length})` : "MISSING");
console.log("NEXT_PUBLIC_PAYPAL_CLIENT_ID:", mask(publicId));
console.log("");

if (!id || !secret) {
  console.error("✗ Server keys missing. Add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to .env.");
  process.exit(1);
}
if (publicId && publicId !== id) {
  console.warn("⚠ NEXT_PUBLIC_PAYPAL_CLIENT_ID differs from PAYPAL_CLIENT_ID — usually they should match.\n");
}

const auth = Buffer.from(`${id}:${secret}`).toString("base64");

// 1) OAuth token
const tokenRes = await fetch(`${base}/v1/oauth2/token`, {
  method: "POST",
  headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
  body: "grant_type=client_credentials",
});
const tokenBody = await tokenRes.json();
if (!tokenRes.ok) {
  console.error("✗ Token request FAILED:", tokenRes.status, tokenBody.error, "-", tokenBody.error_description);
  console.error("  → Wrong keys, or keys are for the other environment (sandbox vs live).");
  process.exit(1);
}
console.log("✓ OAuth token OK — credentials are valid. App:", tokenBody.app_id || "(n/a)");

// 2) Create a $1 test order (not captured, just proves order creation works)
const orderRes = await fetch(`${base}/v2/checkout/orders`, {
  method: "POST",
  headers: { Authorization: `Bearer ${tokenBody.access_token}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    intent: "CAPTURE",
    purchase_units: [{ amount: { currency_code: "USD", value: "1.00" } }],
  }),
});
const orderBody = await orderRes.json();
if (!orderRes.ok) {
  console.error("✗ Create order FAILED:", orderRes.status, JSON.stringify(orderBody));
  process.exit(1);
}
console.log("✓ Create order OK — order id:", orderBody.id, "status:", orderBody.status);
console.log("\nAll checks passed. Your PayPal keys are working.");
