---
name: API Keys and Services Setup
description: Environment keys configured — Clerk, Supabase, OpenAI (not Anthropic), Stripe with webhook
type: project
originSessionId: 710d9cce-3bbd-412a-ace1-d89c98df0fc8
---
User has configured the following keys in .env (as of 2026-05-02):
- **Clerk**: Publishable key, secret key, webhook secret
- **Supabase**: Connection keys (replacing local PostgreSQL)
- **OpenAI**: API key (chosen instead of Anthropic for AI features)
- **Stripe**: Secret key, webhook secret, publishable key

**Why:** These are the service choices for the CRM — Clerk for auth, Supabase for DB, OpenAI for AI, Stripe for billing.
**How to apply:** When implementing AI features, use OpenAI SDK/API, not Anthropic. Update .env.example to reflect Supabase and OpenAI instead of local Postgres and Anthropic.
