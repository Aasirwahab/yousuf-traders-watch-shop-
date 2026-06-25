import "server-only";

import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Rate limiting is only active when Upstash Redis is configured. Set both
// UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in the environment.
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

// Separate buckets by sensitivity: cart mutations are frequent and cheap,
// order placement is rare and expensive, so it gets a much tighter window.
const limiters = redis
  ? {
      cart: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(30, "1 m"),
        prefix: "rl:cart",
        analytics: true,
      }),
      checkout: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "1 m"),
        prefix: "rl:checkout",
        analytics: true,
      }),
    }
  : null;

export type RateLimitBucket = keyof NonNullable<typeof limiters>;

/** Best-effort client identifier from proxy headers. */
async function clientKey(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

/**
 * Returns true when the request is allowed. Fails OPEN (allows) when Redis is
 * not configured or unreachable, so a misconfiguration or outage never blocks
 * legitimate shopping — it only removes the abuse protection until restored.
 */
export async function checkRateLimit(bucket: RateLimitBucket): Promise<boolean> {
  if (!limiters) return true;
  try {
    const { success } = await limiters[bucket].limit(await clientKey());
    return success;
  } catch {
    return true;
  }
}
