# Ovalen

A luxury watch e-commerce landing page — an animated, scroll-driven marketing site featuring a curved clip-path hero, a spotlight feature section with sequential connector-line reveals, and smooth scrolling throughout.

## Tech stack

- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS v4**
- **Motion** (Framer Motion) for entrance/scroll animations
- **Lenis** for smooth scrolling
- **TypeScript**

## Getting started

This project uses **pnpm** (do not use `npm install` — it corrupts the pnpm store).

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |
| `pnpm images:sync` | Upload every image in `public/` to ImageKit |

## ImageKit

Set these values in `.env`:

```dotenv
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_your_key
IMAGEKIT_PRIVATE_KEY=private_your_key
```

Add source images under `public/`, run `pnpm images:sync`, and reference their
stable `/ovalen/...` path through `data/images.ts`. The private key is only used
by server-side code and the sync script; never prefix it with `NEXT_PUBLIC_`.

## Project structure

```
app/                      App Router — layout, page, globals.css, icon
components/
  layout/                 Navbar, Footer
  providers/              SmoothScroll (Lenis)
  sections/               Hero, About, CentralFeature, Shop, Tech, Article
  ui/                     PrototypeCrop, Reveal (reusable animation primitives)
data/constants.ts         Static content (nav, categories, products, features)
data/images.ts            ImageKit delivery URLs
lib/imagekit.ts           Server-only ImageKit upload client
scripts/sync-imagekit.mjs ImageKit asset sync
types/                    Shared TypeScript types
public/prototype-assets/  Image assets
```

## Accessibility

All animations respect `prefers-reduced-motion`: smooth scroll is disabled and entrance
animations fall back to opacity-only fades (no spatial movement).
