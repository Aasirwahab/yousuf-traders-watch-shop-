---
tags: [prompt, template, reference, reusable]
use-for: any new or existing project
---

# Master Prompt — Guide

How to use [[Master Startup Engineering Prompt]] for any future project. It turns a coding model (Claude, Cursor, Codex, etc.) into a **full senior engineering team** instead of a code generator — it forces it to understand, challenge, design, then build the minimal scalable version.

## What it is
A reusable mega-prompt with four moving parts:
1. **Project Context block** (the only part you fill in) — product, users, problem, features, stack, codebase, objective, scale, deployment target, constraints.
2. **Operating rules** — understand before implementing · don't guess/inspect first · build the minimal scalable version (modular monolith by default).
3. **15 phases** — diagnosis → architecture → repo → DB → API → backend → frontend → audit → debug → performance → security → DevOps → testing → implementation plan → code delivery.
4. **Mode selector** — run only the phases you need (see below).

## How to use it (3 steps)
1. Copy the whole [[Master Startup Engineering Prompt]].
2. Fill the **Project Context** block — this is your source of truth. For an existing repo, point it at the code.
3. Set **`Selected mode`** at the bottom to the job at hand, then send.

> Tip: you rarely need all 15 phases. The mode tells the model which to run.

## Modes — pick by intent
| Mode | Use when you want to… |
|---|---|
| `BUILD_MODE` | Design + build a production-ready MVP from scratch |
| `AUDIT_MODE` | Reverse-engineer & audit an existing codebase |
| `DEBUG_MODE` | Trace + root-cause a specific failure |
| `REFACTOR_MODE` | Improve architecture without changing behaviour |
| `PERFORMANCE_MODE` | Measure + fix bottlenecks (evidence first) |
| `SECURITY_MODE` | Full production security audit (vuln report) |
| `BACKEND_MODE` / `FRONTEND_MODE` | Focus one layer |
| `DEVOPS_MODE` | Prep for production deploy (CI/CD, monitoring, rollback) |
| `FULL_TECH_LEAD_MODE` | Coordinate everything → complete plan + implementation |

## Why it's good (strengths)
- **Anti-hallucination rules** ("Do not guess", inspect before changing, distinguish facts from assumptions) — matches the [[Brain Index|brain's]] whole purpose.
- **Forces a Risk Register + trade-off tables** before code, so decisions are explicit.
- **Output structure is fixed** (18 sections) → predictable, comparable answers across projects.
- **MVP-first** ("smallest production-ready version that can scale") guards against over-engineering.

## Watch-outs
- It's **heavy** — for a one-line fix, just use `DEBUG_MODE` or skip it; running all phases on a tiny task wastes effort.
- The output template assumes a greenfield-ish scope; for small changes, tell it to **only return the relevant sections**.
- Garbage in, garbage out — the **Project Context block is the leverage point**. Vague context → generic answer.

## Worked example — pointing it at an existing project
For an existing repo like [[Ovalen — Architecture & Flow|Ovalen]], fill the context from the brain:
```text
Product: Luxury pre-owned watch e-commerce store
Existing stack: Next.js 16, React 19, Prisma 7 + Neon, Clerk, PayPal, Upstash
Existing codebase: F:/Aasir/ovalen (see Ovalen — Architecture & Flow)
Current objective: [e.g. add Stripe alongside PayPal / migrate price to integer cents]
Expected scale: [fill]
Deployment target: Vercel
Constraints: pnpm only; money currently stored as whole USD units
```
Then set `Selected mode: AUDIT_MODE` (to review) or `BUILD_MODE` (to extend).

## Related
- [[Master Startup Engineering Prompt]] — the full copy-paste prompt
- [[Brain Index]] — project memory this prompt's context block can draw from
