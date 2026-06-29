---
name: CRM Development Phases
description: 7 development phases from README roadmap — tracking completion status
type: project
originSessionId: cfd0a6dd-b9d5-40ca-a15f-6d62e89f0e13
---
From the README roadmap (status as of 2026-05-03):
- **Phase 1 (DONE)**: Foundation, schema, multi-tenancy, app shell, all module screens, REST API skeleton, demo seeder
- **Phase 2 (DONE)**: CRUD wiring through Server Actions, dialog/form UI, real DB pagination, search. All 8 module pages (`contacts/leads/deals/products/customers/orders/activities/campaigns`) are async Server Components reading via `src/server/queries.ts`. Server-side search via `?q=` URL param hits Prisma `contains: ...mode: "insensitive"`. Client-side pagination/filter operates on up-to-1000 loaded rows. Demo mode falls back to demo-data fixtures.
- **Phase 3 (DONE)**: CSV import dialog uploads to Supabase Storage and enqueues real BullMQ `csvImport` job via `src/server/imports/actions.ts` (`enqueueCsvImport` + `getImportStatus`); dialog polls every 1s for progress. Saved views now persist to a `SavedView` Prisma model via `src/server/saved-views/actions.ts` with localStorage fallback for demo mode + transient errors. Bulk delete wired for all modules.
- **Phase 4 (NEXT)**: Gmail/Outlook OAuth, calendar sync, file attachments to R2
- **Phase 5**: Workflow engine, public webhooks, AI lead scoring + summaries
- **Phase 6**: Stripe billing, plan gating, GDPR endpoints, audit log UI
- **Phase 7**: Load test, pen test, onboarding flow, marketing site, SOC 2 gap analysis

**Known Phase 2/3 follow-ups (deferred):**
- True cursor-based DB pagination (current: load-up-to-1000 + client paginate). Fine for orgs <1000 rows; needs offset/cursor for scale.
- In-view search box pushes to URL via `router.replace` so server WHERE filter is exercised on every keystroke (currently only when shared via `?q=` URL).
- Run `pnpm db:migrate` to apply the new `SavedView` table to the live database.

**Why:** Phases 2+3 unblock production data flow. Phase 4 (OAuth integrations) is the natural next step.
**How to apply:** When user resumes work, prioritize `pnpm db:migrate` for the SavedView model, then Phase 4.
