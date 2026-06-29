---
tags: [project, crm, saas, nextjs]
stack: [Next.js, Prisma, Supabase, Clerk, OpenAI, Stripe, BullMQ]
source: D:/Work-new/CRM-full-System
status: active
---

# CRM Full System

Multi-tenant CRM SaaS. 7 development phases total; phases 1–3 done, phase 4 (Gmail/Outlook OAuth, calendar sync, R2 attachments) is next.

## Memory notes
- [[project_phases]] — 7-phase roadmap with completion status and deferred follow-ups
- [[db_supabase]] — Supabase Postgres + Prisma (queries only); schema changes applied manually via SQL Editor (firewall blocks Prisma migrate)
- [[api_keys]] — services configured: Clerk (auth), Supabase (DB), OpenAI (AI — chosen over Anthropic), Stripe (billing). *Names only, no secret values.*
- [[skills_installed]] — Supabase, Postgres Best Practices, Stripe skills installed globally
