---
name: Use pnpm only
description: Project uses pnpm as package manager — never use npm for installs
type: feedback
originSessionId: dc694dc5-5f04-4050-89a8-4a70f0acc70f
---
Always use pnpm, never npm, for package management in this project.

**Why:** The project has a pnpm-lock.yaml and uses pnpm's node_modules/.pnpm structure. Using npm breaks the dependency tree and causes type errors. Mixing package managers caused a major breakage when .pnpm directory was deleted.

**How to apply:** Use `pnpm install`, `pnpm add <pkg>`, `pnpm remove <pkg>` for all dependency operations. Never run `npm install` or `npm add`.
