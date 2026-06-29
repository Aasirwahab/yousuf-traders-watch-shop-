---
tags: [project, ovalen, architecture, flow, reference]
source: F:/Aasir/ovalen
updated: 2026-06-29
---

# Ovalen — Architecture & Flow

The single note to re-read before working on Ovalen, so the flow never has to be re-explained from scratch. Luxury pre-owned **watch e-commerce** store. Started as an animated landing page (see [[Ovalen README]]) and grew into a full storefront with auth, cart, checkout, and orders.

## Stack (current, from package.json)
- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Prisma 7** + `@prisma/adapter-pg` → **Postgres (Neon)**. Generated client at `generated/prisma`.
- **Clerk** (`@clerk/nextjs`) for auth
- **PayPal** for payments (no SDK dep — called via `lib/paypal.ts`)
- **Upstash** Redis + Ratelimit (rate limiting; needs env vars — see [[security-hardening]])
- **Zod** validation
- **GSAP / Motion / Lenis** for animation & smooth scroll
- **ImageKit** CDN for product images (`pnpm images:sync`)
- **pnpm only** — never `npm install` ([[uses-pnpm]])

## Data model (prisma/schema.prisma)
```
Product ──< ProductImage        (PRIMARY | GALLERY | DETAIL)
Product ──< CartItem >── Cart ── User (Clerk mirror)
Product ──< OrderItem >── Order ── User
```
- **Product** — slug + reference unique; `price` is **whole USD units** (TODO: migrate to integer cents before real payments); `stock` defaults 1 (luxury = single-unit); `categoryTags[]` drive shop filters.
- **User** — mirror of a Clerk user, created on first authenticated visit via `getOrCreateUser()` so carts/orders have a local row.
- **Cart / CartItem** — tied to User when signed in; otherwise a guest cart keyed by httpOnly `ovalen_cart_id` cookie. **Guest carts merge into the user cart on first authenticated mutation.** `@@unique([cartId, productId])`.
- **Order / OrderItem** — created **PENDING** at checkout, **PAID** once PayPal capture confirms. `OrderStatus`: PENDING → PAID → FULFILLED (or CANCELLED / REFUNDED). OrderItem is a **snapshot** (brand/name/ref/image/price copied) so history stays accurate if the catalog changes.

## The commerce flow
1. **Browse** — `/watches` (URL-driven `?category=` / `?brand=` / `?sort=`), `/watches/[slug]` PDP, `/brands`, `/search?q=`, `/wishlist` (localStorage `ovalen_wishlist`).
2. **Cart** — `app/actions/cart.ts` (server actions) mutate Cart/CartItem; guests use the cookie cart, which merges on sign-in.
3. **Checkout** — `app/actions/checkout.ts` creates a **PENDING** Order with shipping address + computed `subtotal/shippingCost/total`; user lands on `/checkout/[id]`.
4. **Payment** — `app/actions/payment.ts` + `lib/paypal.ts` create/capture a PayPal order; **`/api/paypal/webhook`** confirms capture and flips the Order to **PAID** (`paidAt`, `paymentRef`).
5. **Post-order** — `/account` shows order history. **`/api/cron/release-stale-orders`** (daily at midnight) releases stock held by unpaid PENDING orders.

## Route map (app/)
- **Storefront:** `/`, `/watches`, `/watches/[slug]`, `/brands`, `/search`, `/wishlist`, `/about`
- **Commerce:** `/checkout`, `/checkout/[id]`, `/account`
- **Auth (Clerk):** `/sign-in/[[...]]`, `/sign-up/[[...]]`
- **Info/legal:** `/authentication`, `/shipping`, `/returns`, `/warranty`, `/faq`, `/privacy`, `/terms`, `/cookies`
- **API:** `/api/paypal/webhook`, `/api/cron/release-stale-orders`

## lib/ modules
`prisma.ts` (client) · `products.ts` · `cart.ts` · `orders.ts` · `paypal.ts` · `shipping.ts` · `user.ts` (getOrCreateUser) · `rate-limit.ts` · `imagekit.ts` / `imagekit-url.ts` · `format.ts` · `site.ts` · `usePrefersReducedMotion.ts`

## Conventions & known follow-ups
- Money is **whole USD units** everywhere — migrate to cents before real payments (parked, see checklist §G).
- Animations respect `prefers-reduced-motion` (opacity-only fallback) — but note [[animations-play-regardless-of-reduced-motion]] for the exceptions.
- Scroll reveals must use opacity/transform, never clip-path-to-zero ([[reveal-clip-path-deadlock]]).
- PayPal can't *receive* into a Sri Lanka account ([[paypal-sri-lanka-payee-limit]]).

## Related notes
- [[ECOMMERCE-CHECKLIST]] — live build audit (what's done / P0–P2 to do)
- [[ovalen-production-roadmap]] · [[security-hardening]] · [[performance-audit]] · [[low-stock-timed-hold-v2]]
- [[Ovalen README]] — original (now partly stale) landing-page README
