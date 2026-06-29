---
name: ovalen-production-roadmap
description: "Ovalen luxury-watch ecommerce — phased plan to go from design-only to production, and decisions made"
metadata: 
  node_type: memory
  type: project
  originSessionId: ce8a897c-bf16-4737-ba66-96f3608fc40d
---

Ovalen is a premium watch storefront (Next 16, React 19, Tailwind 4, GSAP/Lenis). Started design-only; converting to real production ecommerce in phases.

**Decisions (2026-06-24):** ORM = **Prisma** (chosen over Drizzle by user). DB = **Neon Postgres**. Payments = **PayPal, sandbox-first** (user picked PayPal over Stripe/Razorpay; build flow first, wire PayPal sandbox after). Auth = Clerk. Images = ImageKit. **Hard constraint from user: do NOT change any existing design** — only add functionality; new pages must match existing design tokens.

**Phase order:** 1) DB/data layer → 2) Clerk auth → 3) real cart → 4) checkout+payments → 5) orders/account → 6) hardening (SEO, legal, monitoring, tax/shipping, security).

**Phase 1 — DONE & verified by build:** Prisma 7 + `@prisma/adapter-pg` over the Neon pooled `DATABASE_URL`. Schema = `Product` + `ProductImage` (roles PRIMARY/GALLERY/DETAIL) in [prisma/schema.prisma](prisma/schema.prisma). Seeded 12 products from [data/shop.ts](data/shop.ts) via [prisma/seed.ts](prisma/seed.ts). Data-access layer [lib/products.ts](lib/products.ts) maps DB rows back to the `ShopProduct` shape so UI was unchanged. `/watches` and `/watches/[slug]` now read from DB.

**Phase 2 — DONE & build-verified:** Clerk (`@clerk/nextjs@7.x`) wired. `ClerkProvider afterSignOutUrl="/"` in [app/layout.tsx](app/layout.tsx); [middleware.ts](middleware.ts) protects `/account(.*)` only (storefront public). Sign-in/up catch-all pages at `app/sign-in/[[...sign-in]]` and `app/sign-up`. Navbar uses Clerk `<Show when="signed-in|signed-out">` + `<UserButton>`. Protected [app/account/page.tsx](app/account/page.tsx) calls `getOrCreateUser()` ([lib/user.ts](lib/user.ts)) which upserts the Clerk user into the `User` table (clerkId-keyed) — chosen over webhooks (no extra secret/config). Verified: /account → 307 to Clerk handshake when signed out; storefront 200.

**Clerk 7.x gotchas (this project):** `SignedIn`/`SignedOut` are REMOVED — use `<Show when="signed-in">`/`"signed-out"`. `afterSignOutUrl` is a ClerkProvider prop, not a UserButton prop. Next 16 deprecates the `middleware` filename (warns, suggests `proxy.ts`) — kept `middleware.ts` since it's Clerk's documented convention. Interactive login flow still needs manual browser test with the user's Clerk instance.

**Phase 3 — DONE & browser-verified (guest flow):** Real cart. `Cart` + `CartItem` models (guest cart via httpOnly `ovalen_cart_id` cookie, merges into user cart on first authed mutation). Server logic [lib/cart.ts](lib/cart.ts) resolves products BY SLUG (homepage `PRODUCTS` constant slugs match DB slugs); server actions in [app/actions/cart.ts](app/actions/cart.ts). [CommerceProvider.tsx](components/providers/CommerceProvider.tsx) rewritten: real `items/cartCount/subtotal`, `addItem(slug)/updateQty/removeItem`, hydrates via `getCartAction` on mount. All add buttons (ShopSection, WatchesPage cards, ProductDetailPage) now call `addItem(slug)`. Cart drawer in [Navbar.tsx](components/layout/Navbar.tsx) renders real line items + qty stepper (capped at stock) + subtotal; "Checkout" button intentionally disabled ("coming soon") until Phase 4. Qty cap works (watches are stock=1). Design unchanged throughout (user requirement). Verified in browser: add → drawer shows item, price, subtotal; no console errors.

**Phase 4a — DONE & browser-verified (checkout flow, payment NOT wired yet):** `Order` + `OrderItem` models (OrderItem snapshots brand/name/price/image so history is stable). `OrderStatus` enum PENDING→PAID→FULFILLED→CANCELLED→REFUNDED. Shipping options in [lib/shipping.ts](lib/shipping.ts) (client-safe). Order logic [lib/orders.ts](lib/orders.ts) `createOrderFromCart` recomputes totals server-side from cart (zod-validated, `z.email()` in zod 4). Server action [app/actions/checkout.ts](app/actions/checkout.ts) uses `useActionState`. Pages: [app/checkout/page.tsx](app/checkout/page.tsx) (shell, prefills Clerk email, guest checkout allowed), [components/sections/CheckoutForm.tsx](components/sections/CheckoutForm.tsx) (address+shipping+live summary via useCommerce), confirmation [app/checkout/[id]/page.tsx](app/checkout/[id]/page.tsx). Cart drawer Checkout button now links to /checkout. Verified: filled form → order OVL-… created PENDING in DB with correct snapshots/totals → redirected to confirmation. Cart NOT cleared and stock NOT decremented yet (happens on payment capture).

**Phase 4b — TODO (PayPal sandbox):** Add `@paypal/react-paypal-js` + server PayPal Orders v2 (create+capture) using sandbox creds (need PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET / NEXT_PUBLIC_PAYPAL_CLIENT_ID in .env). On the confirmation/payment page render PayPal buttons; capture server-side, verify via webhook, then mark Order PAID + clear cart + decrement stock. Recompute amount from DB order (never trust client).

**Notes for next phases:** watch attributes stored as plain String columns (mirror union types) — convert to DB enums in hardening. `price` stored as whole USD units — migrate to integer cents before real checkout. `/watches` currently prerenders static at build (DB read cached) — add revalidation/dynamic when inventory goes live. Cart is still fake ([CommerceProvider.tsx](components/providers/CommerceProvider.tsx) is a counter) — Phase 3. See [[uses-pnpm]].
