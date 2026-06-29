---
name: reveal-clip-path-deadlock
description: "Scroll reveals must use opacity/transform, never clip-path-to-zero-area (deadlocks IntersectionObserver)"
metadata: 
  node_type: memory
  type: project
  originSessionId: ea65dff7-0c68-451c-ab6e-60537b83fc42
---

In `components/ui/Reveal.tsx` (the `Reveal` + `MaskReveal` scroll-in animation system used by every section), **never reveal an element by animating `clip-path` from a zero-area inset** (e.g. `inset(0% 100% 0% 0%)`).

**Why:** An element clipped to zero rendered area never registers as intersecting with IntersectionObserver — so Framer Motion's `whileInView`/`useInView` (and even a raw IntersectionObserver) never fire, so it never un-clips. A deadlock: it stays hidden forever. This silently broke all 5 `MaskReveal` usages (hero product card, mobile hero image, central "ovalen" wordmark, tech image, article lead) and cost a long debugging session. `Reveal` (opacity + transform) was unaffected because opacity 0 keeps full layout area.

**How to apply:** Reveal via opacity + transform (slide). `MaskReveal` now does opacity + directional slide inside an `overflow-hidden` container (reads as a masked wipe). If you ever reintroduce clip-path, observe a separate full-area wrapper, not the clipped element.

**Second gotcha — reduced-motion hydration mismatch:** never branch the `initial` (or any SSR-rendered) prop on `useReducedMotion()`. It returns `false` on the server but `true` on a reduced client, so `initial={reduceMotion ? false : {...}}` makes server HTML (`opacity:0; translateY(28px)`) differ from client → React hydration error. Keep `initial` unconditional and branch only `transition` (not rendered into SSR HTML). Reduced-motion users get opacity-only fades via `transition={{ opacity:{duration}, x:{duration:0}, y:{duration:0} }}`. Verified with Playwright `emulateMedia({ reducedMotion:'reduce' })`.

Related: `PrototypeCrop` uses Next `<Image fill>` and hardcodes `position: relative`, which wins over a passed `absolute` (CSS source order). A `<Image fill>` spot needs a **definite** parent height — `min-height` does not resolve `h-full`; use `h-[...]`. See [[uses-pnpm]].
