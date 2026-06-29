---
name: uses-pnpm
description: "This repo is managed with pnpm — never run npm install, it corrupts the store"
metadata: 
  node_type: memory
  type: project
  originSessionId: ea65dff7-0c68-451c-ab6e-60537b83fc42
---

The `ovalen` repo uses **pnpm** (pnpm-lock.yaml, `node_modules/.pnpm` symlink store; pnpm 10.23 installed). Running `npm install` here crashes npm's arborist with `Cannot read properties of null (reading 'matches')` because it chokes on pnpm's symlinks.

**Why:** Mixing npm onto a pnpm-managed node_modules breaks dependency resolution and wasted two install attempts in one session.

**How to apply:** Always use `pnpm add` / `pnpm install` / `pnpm build` / `pnpm lint`. pnpm 10 blocks postinstall build scripts by default (sharp, @tailwindcss/oxide, etc.) — they were already compiled in the store, but if image optimization or Tailwind misbehaves, run `pnpm approve-builds`. Project is Next.js 16 + React 19 + Tailwind v4 + motion (Framer Motion). See [[next16-stack]].
