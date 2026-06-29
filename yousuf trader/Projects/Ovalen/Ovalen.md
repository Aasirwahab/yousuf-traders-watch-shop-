---
tags: [project, nextjs, ecommerce]
stack: [Next.js, Prisma, Neon, PayPal, GSAP]
source: F:/Aasir/ovalen
status: active
---

# Ovalen

Luxury pre-owned **watch e-commerce** store. Next.js 16 + React 19 + Prisma 7/Neon + Clerk + PayPal. Phased production roadmap (DB → auth → cart → checkout → orders → hardening).

> [!tip] Re-read this first to recall the flow → **[[Ovalen — Architecture & Flow]]**

## Project docs
- [[Ovalen — Architecture & Flow]] — stack, data model, the full browse→cart→checkout→PayPal→order flow, route map
- [[ECOMMERCE-CHECKLIST]] — live build audit; what's done vs P0/P1/P2 to do
- [[Ovalen README]] — original landing-page README (partly stale)

## Memory notes
- [[ovalen-production-roadmap]] — phased build plan; current phase status
- [[security-hardening]] — stock guard, error boundaries, CSP, PayPal done; rate limiting needs UPSTASH env vars
- [[performance-audit]] — Turbopack dev, product-query caching, account parallel fetch fixed
- [[paypal-sri-lanka-payee-limit]] — SL can't *receive* via PayPal; prod needs a non-SL merchant account
- [[low-stock-timed-hold-v2]] — deferred: 5-min checkout hold for low stock
- [[reveal-clip-path-deadlock]] — scroll reveals must use opacity/transform, never clip-path-to-zero
- [[animations-play-regardless-of-reduced-motion]]
- [[uses-pnpm]] — never run npm install here; use pnpm for everything

> [!note] Active project — this is the repo the vault currently lives inside.
