---
name: low-stock-timed-hold-v2
description: "Ovalen v2 idea (deferred) — short timed checkout hold for low-stock items, replacing reserve-at-placement + cron"
metadata: 
  node_type: memory
  type: project
  originSessionId: 05f1c67e-7d48-49bd-9668-d5b751743d09
---

User's idea (2026-06-28), deferred until real contention appears. Don't build speculatively.

**Concept:** when a product is low (e.g. ≤2–3), the first person to start checkout gets a short hold (~5 min) on the unit; others see "being purchased, try again shortly." If the first pays in time → sold; if the 5-min timer lapses → hold releases and the next buyer can take it. Industry pattern: Ticketmaster / sneaker-drop countdown / airline seat hold.

**Simplification agreed:** implement as a **timed hold, NOT a formal ordered queue** (no waitlist/notifications — overkill for luxury low-traffic). Others just retry once the hold expires.

**Why it's nice:** store the hold as a `heldUntil` timestamp (or Upstash Redis key with TTL — Upstash already planned for rate limiting). Availability = physical stock − active (non-expired) holds. Expired holds are ignored, so **this can REPLACE the abandoned-order cron** (no background cleanup needed for correctness). Tighter 5-min window beats the current 60-min cron UX.

**Cost:** bigger build — a reservation concept + every availability check (product page, add-to-cart, checkout) must subtract active holds.

**Trigger to build:** when two buyers realistically race for the same low-stock item often enough to matter. Until then, current model stands: reserve stock at order placement + `releaseStaleOrders()` cron (see [[security-hardening]]). Part of [[ovalen-production-roadmap]].
