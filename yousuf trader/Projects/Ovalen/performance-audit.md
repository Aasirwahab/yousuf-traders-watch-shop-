---
name: performance-audit
description: "Ovalen perf audit — dev nav slowness fixed (Turbopack); remaining prod wins (query caching, image compression)."
metadata: 
  node_type: memory
  type: project
  originSessionId: 2b2e5441-b614-4ced-95c0-245528e6260b
---

Performance audit done 2026-06-28. Symptom: pages slow to load when clicked.

**Root cause of the user's symptom (FIXED):** `dev` script was `next dev --webpack`, opting out of Turbopack (the Next 16 default). Webpack recompiled each route on-demand in dev. Changed to `next dev --turbopack`; verified Turbopack boots clean (Ready in 4.3s, no config incompatibility). User must restart their dev server to get it.

**DONE (2026-06-28):**
1. Query caching — wrapped all reads in [lib/products.ts] (getAllProducts/getProductBySlug/getRelatedProducts/getAllProductSlugs) in `unstable_cache`, tag "products", revalidate 3600. Bust with `revalidateTag("products")` after a seed/edit. (`use cache` was avoided — would require enabling cacheComponents, too big a blast radius.)
2. account/page.tsx serial awaits → `Promise.all([getOrCreateUser(), getUserOrders()])`.

**Investigated and NOT problems (don't redo):**
- Images: storefront images are served via **ImageKit CDN** (`imageKitUrl` in [data/images.ts]), not the local 35MB `public/prototype-assets` (those are source files, not shipped). next/image handles the rest. No bulk compression needed.
- Cart fetch: `CommerceProvider` is in the root layout, which persists across soft navigations → `getCartAction()` runs once per full load, NOT per click.
- GSAP + motion: both are genuinely used (GSAP SplitText/ScrollTrigger powers [components/ui/Copy.tsx] line reveals; motion does the rest). Not removable without rewriting animations.

To judge *production* speed, test `pnpm build && pnpm start` + Lighthouse, not the dev server. Relates to [[ovalen-production-roadmap]] and [[security-hardening]].
