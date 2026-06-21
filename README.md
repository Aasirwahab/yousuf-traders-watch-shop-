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

## Project structure

```
app/                      App Router — layout, page, globals.css, icon
components/
  layout/                 Navbar, Footer
  providers/              SmoothScroll (Lenis)
  sections/               Hero, About, CentralFeature, Shop, Tech, Article
  ui/                     PrototypeCrop, Reveal (reusable animation primitives)
data/constants.ts         Static content (nav, categories, products, features)
types/                    Shared TypeScript types
public/prototype-assets/  Image assets
```

## Accessibility

All animations respect `prefers-reduced-motion`: smooth scroll is disabled and entrance
animations fall back to opacity-only fades (no spatial movement).
