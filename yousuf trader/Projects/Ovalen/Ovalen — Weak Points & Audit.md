---
tags: [project, ovalen, audit, todo, security]
source: F:/Aasir/ovalen
audited: 2026-06-29
---

# Ovalen — Weak Points & Audit

Code-grounded audit of what's missing / weak, ordered by priority. Companion to the [[ECOMMERCE-CHECKLIST]] (which tracks UI/pages); this focuses on backend/correctness/launch-readiness.

## ✅ Strong — leave alone
The payment + order core is production-grade: server-side total recompute, atomic oversell-proof stock reservation, IDOR-guarded order viewing (`getViewableOrder`), idempotent paid/refund flips, signature-verified PayPal webhook, capture amount-mismatch check, stale-order release cron, Zod validation, rate limiting on checkout.

## 🔴 Critical

- ✅ **Currency — RESOLVED (2026-06-29).** Investigation showed `Product.price` holds **USD** (seed 5450/17850/47340), so PayPal was already charging correctly — no overcharge bug. Implemented **store/charge USD, display LKR**: `formatPrice` converts via `NEXT_PUBLIC_LKR_PER_USD` (default 300, build-time), money flow stays USD, "payment processed in USD" note added at checkout. See [[currency-lkr-vs-usd-mismatch]]. (PayPal still can't settle into a SL account — separate merchant issue, [[paypal-sri-lanka-payee-limit]].)
- **No automated tests.** Zero framework, zero coverage on the highest-risk code (order creation, oversell, IDOR, idempotency, capture). One refactor can silently break payment capture. Add Vitest + a few tests on `lib/orders.ts` and the capture path.

## 🟠 High (before real launch)

- **Email — now WIRED (2026-06-29).** Brevo HTTP API in `lib/email.ts`, sent on the `markOrderPaid()===true` path from both the capture action and the webhook (fires once). **Action needed:** add `BREVO_API_KEY` to `.env` (only `SMTP_USER/PASS/SENDER_EMAIL` were present) and verify `SENDER_EMAIL` as a Brevo sender. Only order-confirmation is covered — no shipping/refund emails yet.
- **No error monitoring.** Failures (amount mismatch, capture errors, webhook rejects) go to `console.error` only — invisible in production. Add Sentry. (Webhook route also flagged by tooling for missing observability.)
- **Money stored as whole units + no tax.** `total = subtotal + shipping`; no tax line. Amount check `capture.amountUsd !== order.total` is a float `!==` — fine for whole numbers, fragile once tax/cents appear. Migrate to integer minor units + add tax.
- **Legal pages are template placeholders** — `/privacy`, `/terms` have bracketed entity/jurisdiction. Required before live payments.
- **Rate limiting fails OPEN.** Reasonable, but means abuse protection silently vanishes if Upstash is unset/unreachable. **Confirm `UPSTASH_*` are set in production.**

## 🟡 Known fakes / polish (from checklist)
- ✅ **Newsletter — wired (2026-06-29)** to Brevo contacts (`addNewsletterContact`). Optional `BREVO_NEWSLETTER_LIST_ID` to file under a list.
- ✅ **Contact page + form — built (2026-06-29)** at `/contact`, sends via Brevo (`sendContactEmail`, HTML-escaped). Repointed the "Contact" mailto links (footer, account, watches empty-state) to it. Still intentionally `mailto:`: footer email display, navbar mobile email, concierge consultation CTA, PDP "Book a private viewing".
- ✅ **Account order-detail — built (2026-06-29)** at `/account/orders/[id]` (ownership-guarded via `getViewableOrder`); order rows now link here instead of `/checkout/[id]`.
- Still open: PDP image zoom decorative; PDP fake spec fallbacks (`2025`/`50 m`); Journal pages + full `/cart` page don't exist; wishlist localStorage-only; account saved-addresses & profile-edit still placeholder.

## Related
- [[Ovalen — Architecture & Flow]] · [[ECOMMERCE-CHECKLIST]] · [[security-hardening]] · [[performance-audit]] · [[paypal-sri-lanka-payee-limit]]
