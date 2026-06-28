// Diagnostic: confirm the PayPal webhook is registered correctly and see whether
// PayPal has delivered any events yet. Uses sandbox keys from .env.
import "dotenv/config";

const base = (process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com").replace(/\/$/, "");
const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");

const tok = await (await fetch(`${base}/v1/oauth2/token`, {
  method: "POST",
  headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
  body: "grant_type=client_credentials",
})).json();
const bearer = { Authorization: `Bearer ${tok.access_token}` };

console.log("== Registered webhooks ==");
const hooks = await (await fetch(`${base}/v1/notifications/webhooks`, { headers: bearer })).json();
for (const h of hooks.webhooks ?? []) {
  console.log(`\n  id:  ${h.id}`);
  console.log(`  url: ${h.url}`);
  console.log(`  events: ${(h.event_types ?? []).map((e) => e.name).join(", ")}`);
}
if (!hooks.webhooks?.length) console.log("  (none registered)");

console.log("\n== Recent webhook events (last 10) ==");
const evs = await (await fetch(`${base}/v1/notifications/webhooks-events?page_size=10`, { headers: bearer })).json();
for (const e of evs.events ?? []) {
  console.log(`  ${e.create_time}  ${e.event_type}  status=${e.status}  id=${e.id}`);
}
if (!evs.events?.length) console.log("  (no events yet — do a sandbox checkout to generate one)");
