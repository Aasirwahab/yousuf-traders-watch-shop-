# Ovalen — E-commerce Build Checklist

A grounded audit of the current site and what's needed to make it a complete,
professional luxury-watch store. Check items off as you complete them. Items
are ordered by priority within each section.

Legend: `[x]` done · `[ ]` to do · **(P0)** do first · **(P1)** important · **(P2)** nice-to-have

---

## Verified audit — 2026-06-27

Code-checked, section by section. This batch fixed (all typecheck-clean):
- [x] Footer **Shop** group repointed to real routes (`/watches`, category links, `/brands`) — was dead `#shop`/`#journal` anchors.
- [x] Listing **empty-state** added (message + reset when filters match nothing).
- [x] PDP **description tabs** made functional (Description / Specifications / Condition / Shipping) — were decorative spans showing only the description.
- [x] Order page: removed the false **"a copy has been sent"** line (no email is actually sent yet) — now says a confirmation will follow once the order is complete.

Still open and worth knowing (details in sections below):
- Footer **Customer-care** + **About** groups still point to dead anchors — they need the info/legal pages built first.
- Header **search** still does nothing (`action="#shop"`); needs a real `/search?q=` page.
- **Wishlist** hearts (listing + PDP) still don't persist; PDP heart has no handler at all.
- **Newsletter** submit is fake (local state only, no provider).

---

## A. Navigation & Information Architecture  ← your current pain point

### Recommended primary nav (research-backed)

Based on how pre-owned/luxury watch retailers structure their menus
(Watchfinder = Buy · Brands · Categories · By Price · Services · Help; also
Watches of Switzerland, Chrono24) and Baymard e-commerce UX guidance
(shallow & broad, 4–7 intent-based labels, mega-menu for rich catalogs):

> **New Arrivals · Watches ▾ · Pre-Owned · Brands · Sale**

- **Watches ▾** mega-menu: Men · Ladies · By collection (Classic/Chronograph/Dress/Sport/Limited) · Shop by price
- **Pre-Owned** as its own item — you carry many; strong selling point + SEO (mirrors Watchfinder)
- **Brands** — keep; universal and essential in watch retail
- **Sale** — include only if you run promotions/vouchers; otherwise omit
- **Utility (right side):** Search · Account · Cart. Help/Contact/FAQ live in the footer, not the primary bar.

### Decisions from research
- [x] **(P0)** Remove **Journal** from primary nav → now only in the footer ("About Ovalen"). (Pure watch *retailers* keep editorial out of the shopping nav; revisit only if you publish content regularly.)
- [ ] **(P1)** Consider a **Sale / Offers** nav item + a thin promo bar for vouchers/discount codes (Watchfinder surfaces "Promotions").
- [ ] **(P2)** Add **Shop by Price** bands inside the Watches mega-menu (watch buyers shop by budget).

### Implementation
- [x] **(P0)** Fix nav links to real destinations (was `Brands → /#story`, `Journal → /#journal`, `New arrivals → /#shop`):
  - New arrivals → `/watches?category=New%20arrivals` ✅
  - Watches → `/watches` ✅
  - Pre-owned → `/watches?category=Pre-owned` ✅
  - Brands → `/brands` ✅
- [x] **(P0)** Make `/watches` filtering **URL-driven** — `?category=` and `?brand=` now seed from the URL (server-read + remount key, so nav deep-links work). *(`?sort=` and full filter sync still client-only — minor follow-up.)*
- [ ] **(P1)** Re-center / stabilise the desktop nav position. It's pinned with a magic `left-[19.5%]` in `Navbar.tsx` — fragile across screen sizes. Use a centered flex/grid layout instead.
- [x] Breadcrumbs on product, checkout, account pages (already present)
- [ ] **(P2)** Mega-menu or dropdown under "Watches" (Men / Ladies / New / Pre-owned / by collection)

## B. Missing pages to add

- [x] **(P0) B1. Brands** — `/brands` directory built (DB-driven, with per-brand counts), each card links to `/watches?brand=…`. *(Optional later: dedicated `/brands/[brand]` landing pages instead of the filtered view.)*
- [ ] **(P1) B2. Journal** — `/journal` (article index) + `/journal/[slug]` (article). Nav promises it; great for SEO and storytelling. (Your homepage `ArticleSection` can become the teaser that links here.)
- [x] **(P0) B3. Search results** — `/search?q=` built (matches brand/model/reference/collection, with no-query + no-results states). Header search form + on-page form both wired.
- [x] **(P1) B4. Wishlist** — `/wishlist` built. Hearts (listing + PDP) now persist via `localStorage` (`ovalen_wishlist`) in shared `CommerceProvider`, with a header badge + mobile-menu link. *(MVP: per-browser. DB-backed cross-device sync for signed-in users is a later enhancement.)*
- [ ] **(P2) B5. Full cart page** — `/cart`. You have the slide-over bag; a dedicated cart page is standard fallback and better on mobile.
- [ ] **(P1) B6. Contact** — `/contact` real page with a form (currently only a `mailto:` link).
- [x] **(P2) B7. About / Our story** — `/about` built; footer "Our story" repointed to it (no dead footer links remain).

## C. Customer-service / info pages (trust = conversions for luxury)

- [x] **(P1)** Shipping & Delivery — `/shipping`
- [x] **(P1)** Returns & Exchanges — `/returns`
- [x] **(P1)** Warranty — `/warranty`
- [x] **(P1)** Authentication process — `/authentication` (how you verify watches — major trust driver for pre-owned luxury)
- [x] **(P1)** FAQ — `/faq` (native `<details>` accordion)
- [x] Footer Customer-care + About groups repointed to the real pages. **One dead link remains:** "Our story" → `#story` (no such section) — needs an `/about` page (B7).

## D. Legal & compliance (REQUIRED before real payments)

- [x] **(P0)** Privacy Policy — `/privacy` built (template copy, bracketed entity/jurisdiction to complete)
- [x] **(P0)** Terms of Service — `/terms` built (template copy, bracketed entity/jurisdiction to complete)
- [x] **(P1)** Cookie Policy — `/cookies` built.
- [x] **(P1)** Cookie consent banner — site-wide, dismiss persists in `localStorage` (`ovalen_cookie_consent`).
- [ ] Payment processors (PayPal/Stripe) and most regions legally require the above before going live.

## E. Improve existing sections / features

### Product detail page (`/watches/[slug]`)
- [x] Related products (now a scoped query)
- [x] **(P1)** Make the **description tabs** functional (Description / Specifications / Condition / Shipping) — were decorative
- [x] **(P1)** Make the **"Add to wishlist"** button work — now toggles the persisted wishlist (B4)
- [ ] **(P1)** Make the **image "Expand" / zoom** button work (it's currently decorative)
- [ ] **(P1)** Real **stock / availability** indicator ("1 available — single piece")
- [ ] **(P1)** "Book a private viewing" → real form/modal (currently a `mailto:`)
- [ ] **(P2)** Customer reviews / ratings
- [ ] **(P2)** Share button; recently-viewed strip
- [ ] **(P2)** Structured spec table from real DB fields (some specs are hardcoded fallbacks like "2025", "50 m")

### Listing page (`/watches`)
- [x] **(P1)** Show result count ("12 watches"), working sort, "reset filters" — all present
- [x] **(P1)** Empty-state when filters match nothing
- [ ] **(P2)** Pagination or infinite scroll (fine now with ~12, needed as catalog grows)

### Home page
- [ ] **(P2)** Wire the Newsletter section to a real provider (Resend/Mailchimp) — currently non-functional
- [ ] **(P2)** Make Testimonials real / per-product where possible

### Account (`/account`)
- [x] Order history list (just added)
- [ ] **(P1)** Order detail view from history
- [ ] **(P1)** Saved shipping addresses
- [ ] **(P2)** Profile edit, wishlist tab

### Transactional email
- [x] Removed the misleading "a copy has been sent" line on the order page (no email was being sent).
- [ ] **(P1)** Actually send the order-confirmation email. Use Resend or similar, then restore confirmation wording.

## F. SEO & growth

- [x] **(P1)** `sitemap.ts` + `robots.ts` (driven by `lib/site.ts` / `NEXT_PUBLIC_SITE_URL`)
- [x] **(P1)** Product structured data (JSON-LD `Product`/`Offer`) on detail pages
- [x] `metadataBase` set on root layout (fixes OG/canonical URL resolution)
- [ ] **(P2)** Per-product Open Graph images
- [ ] **(P2)** Analytics (Vercel Analytics / GA)

## G. Parked (per your call — do with payment later)

- [ ] Payment integration (PayPal/Stripe)
- [ ] Stock decrement + oversell guard (transaction at payment capture)
- [ ] Money stored as integer cents (migrate before real payments)
- [ ] Tax calculation at payment step

---

### Suggested first batch (highest impact, lowest effort)
1. **A** — fix nav links + URL-driven categories (makes the site *feel* like real e-commerce immediately)
2. **B1 Brands** page (nav already promises it)
3. **B3 Search** results (header search is currently dead)
4. **D** legal pages (needed before launch anyway)
