---
name: field-theory-css-gotchas
description: Field Theory studio site (Next.js 16) — CSS source-order gotcha and the fixed hero video asset
metadata: 
  node_type: memory
  type: project
  originSessionId: 0bdd9759-a168-4e20-98e9-cbc508e333ed
---

Field Theory is a Next.js 16 (App Router) + React 19 + Tailwind 3 + Framer Motion studio site in `F:\Gasp animation website\New landing page`. Built with pnpm. All copy/assets live in `lib/content.ts`.

**CSS source-order gotcha:** the six signature utility classes (`.wordmark-split`, `.cta-pill`, `.monogram-badge`, `.social-stack`, `.sound-toggle`, `.hero-full`) are plain CSS *after* `@tailwind utilities` in `app/globals.css`. They each set `display`, so they OVERRIDE Tailwind display utilities (`hidden`, `md:block`, etc.) applied on the *same* element (equal specificity → later source wins).
**Why:** caused both hero social stacks to render at once (6 icons).
**How to apply:** toggle responsive `display` on a WRAPPER `<div>`, never on the element carrying a signature class. Or use `!`-important Tailwind. See the social-stack wrappers in `components/sections/Hero.tsx`.

**Fixed asset:** the hero video URL (`HERO_VIDEO_SRC` in `lib/content.ts`, a bravebrand.com R2 mp4) is a mandated asset — do NOT substitute it. Reused for the full-bleed interlude and the contact-section background.
