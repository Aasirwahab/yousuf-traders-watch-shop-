---
name: security-hardening
description: "Ovalen security posture — rate limiting setup, env requirements, and remaining hardening tasks"
metadata: 
  node_type: memory
  type: project
  originSessionId: de999330-29e9-4b9e-b81d-1f9b2497788e
---

Abuse/DoS hardening for Ovalen (part of [[ovalen-production-roadmap]]).

**Done:** Order IDOR fixed (`getViewableOrder` + `ovalen_orders` cookie). Rate limiting via Upstash (`lib/rate-limit.ts`, fail-open) on cart + checkout server actions. Input caps on checkout Zod schema and cart action ids/quantities. Stock oversell guard: `createOrderFromCart` reserves stock with a conditional decrement *inside the same `$transaction` as the order create* (rolls back if any line can't be reserved), then `clearCart()`. Error boundaries added (`app/error.tsx`, `global-error.tsx`, `not-found.tsx`). Security headers + conservative CSP in `next.config.ts` `headers()` (HSTS, nosniff, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy, CSP `base-uri/object-src/frame-ancestors/upgrade-insecure-requests`).

**Operational — rate limiting is OFF until these env vars are set** (both, REST not the connection string), in local `.env` AND Vercel Production/Preview:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Data-theft surface is already solid: Prisma only (no raw SQL → no SQLi), Clerk for auth, server-side total recompute, no `dangerouslySetInnerHTML`, secrets gitignored.

**Payment (PayPal) — integrated, needs creds + testing:** Orders v2 REST via `lib/paypal.ts` (raw fetch, no SDK dep). Server actions in `app/actions/payment.ts` (`createPayPalOrderAction`/`capturePayPalOrderAction`): amount read from DB order, capture amount verified == order.total, `markOrderPaid` is PENDING-guarded (idempotent). Client buttons in `components/checkout/PayPalButtons.tsx` (loads JS SDK, refreshes on approve), wired into `app/checkout/[id]/page.tsx`. Degrades gracefully if `NEXT_PUBLIC_PAYPAL_CLIENT_ID` unset. **Env vars to set:** `NEXT_PUBLIC_PAYPAL_CLIENT_ID` (browser), `PAYPAL_CLIENT_ID` + `PAYPAL_CLIENT_SECRET` (server), optional `PAYPAL_API_BASE` (defaults sandbox). VERIFIED end-to-end in sandbox 2026-06-27 (order OVL-MQWPUJGY-LFRW → PAID with real capture ref). Required a US sandbox business account — see [[paypal-sri-lanka-payee-limit]]. Not yet done: PayPal webhook (capture is synchronous on onApprove — webhook only needed for async/dispute robustness); swap to live creds + `PAYPAL_API_BASE=https://api-m.paypal.com` for production.

Also fixed during testing: out-of-stock add created qty-0 cart lines → $0 orders → PayPal 422. Guards added in `addToCartBySlug` (stock<1), `createOrderFromCart` (filters 0-qty, recomputes subtotal), and `createPayPalOrderAction` (total<=0). Dev helper scripts in `scripts/` (check-paypal.mjs, restore-stock.mjs) — remove before prod.

**Stale-order stock release — DONE** (commit 4fd1b8b): `releaseStaleOrders()` in `lib/orders.ts` cancels PENDING orders >60min and restores reserved stock; `app/api/cron/release-stale-orders/route.ts` (CRON_SECRET bearer-protected, fail-open if unset); `vercel.json` cron every 30m. Needs `CRON_SECRET` env in Vercel; only runs once deployed (Hobby plan caps cron to ~daily).

**Still open (not done):** PayPal webhook; order-confirmation email; monitoring/error tracking (Sentry) + structured logging; full CSP script-src/connect-src lock-down with Clerk domain; rate-limit UPSTASH env vars in prod; go-live (live PayPal creds + non-SL merchant account per [[paypal-sri-lanka-payee-limit]]); remove dev scripts (check-paypal.mjs, restore-stock.mjs) before prod. CSP is conservative: no `script-src`/`connect-src` lock-down yet (needs Clerk frontend-API domain allow-listed + verified against sign-in, ideally Report-Only first). Also open: order-confirmation email; monitoring/error tracking (Sentry); Vercel BotID/WAF; cron cleanup of stale guest carts + expired PENDING orders. Never add raw `$queryRaw` with string interpolation.
