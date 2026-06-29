---
name: load-test-findings
description: Capacity/load-test results for the ticket marketplace and the pending fan-out fix
metadata: 
  node_type: memory
  type: project
  originSessionId: f2e3921a-1b2d-4f61-9192-2e7668f07492
---

Load testing done 2026-06-11 against the live Convex deployment `frugal-sparrow-848` (the `.env` shows only ONE deployment, labeled `prod` — there is no separate dev). All on free tiers (Convex/Vercel/Clerk).

**Browsing (read) capacity:** ~100 concurrent visitors comfortable, ~200 strained (homepage ~5s to load), breaks ~350 (43% fail). Root cause = homepage fan-out: each visitor opens `1 + 5*(events)` live Convex subscriptions because every `EventCard` fires 5 queries.

**Flash-sale (write) capacity — the real launch-day cliff:** a single hot event's queue serializes at only **~2.7 `joinWaitingList`/sec** (Convex OCC contention on shared event/waitingList docs + O(n) `.collect()` of all tickets/offers per join). Effectively breaks at dozens of simultaneous joiners, NOT hundreds. This is the bottleneck that matters for ticket drops and is the highest-value thing left to fix (needs queue redesign: denormalized counters + append-only insert that avoids contending on shared docs).

**Fan-out fix (implemented, NOT deployed):** added `getHomepageData` query in [[convex/events.ts]]; refactored `EventCard.tsx` (props + skip per-user queries when logged out) and `EventList.tsx` (single query). Typechecks. Moves browsing ceiling from ~350-fail to 500+ clean. To ship: must run `npx convex deploy` AND deploy the Next.js frontend together, or the frontend will call a query that doesn't exist on prod.

**Threshold-based queue activation (implemented 2026-06-11, NOT deployed):** user wanted the queue/reservation flow to only kick in when tickets are scarce. Added `QUEUE_ACTIVATION_THRESHOLD = 10` in `convex/constants.ts`; `joinWaitingList` now returns `directCheckout` (true when `availableSpots > threshold`); `JoinQueue.tsx` sends the buyer straight to Stripe checkout when `directCheckout` (one click, no 5-min reservation timer), otherwise keeps the existing offer/queue UI. Payment path (createStripeCheckoutSession + webhook + purchaseTicket) deliberately UNCHANGED — above-threshold buys still create an OFFERED hold under the hood, just invisibly. A true backend bypass (skip the offer entirely) would require changing the Stripe action + webhook and was intentionally NOT done. Same deploy rule applies: deploy Convex + frontend together.

Reusable load-test scripts live in `loadtest/` (probe.mjs, browse-ws.mjs, flashsale.mjs, cleanup.mjs). Note: a single Windows machine caps at ~200-350 simultaneous connections (DNS/socket exhaustion) — true server ceilings are higher than one box can measure.
