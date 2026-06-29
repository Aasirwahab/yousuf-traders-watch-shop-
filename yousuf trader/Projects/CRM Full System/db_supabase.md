---
name: Database - Supabase with manual SQL
description: Using Supabase PostgreSQL; schema changes applied manually via SQL Editor due to firewall blocking Prisma migrations
type: project
originSessionId: 792acaa1-af8f-4b5f-bf34-86baad6c5be0
---
Currently using Supabase as the PostgreSQL provider with Prisma ORM for queries only.

Schema changes (new tables, columns, enums) must be applied manually via the Supabase SQL Editor — Prisma `db push` / `migrate` is blocked by a firewall.

**Why:** Firewall blocks direct Prisma migration connections to Supabase. The SQL Editor in the Supabase dashboard bypasses this.
**How to apply:** When adding new models or schema changes, generate the equivalent SQL (matching Prisma naming conventions) for the user to paste into Supabase SQL Editor. Keep the Prisma schema file in sync for type generation (`prisma generate` works fine). Use `DATABASE_URL` (pooled) and `DIRECT_URL` for runtime queries.
