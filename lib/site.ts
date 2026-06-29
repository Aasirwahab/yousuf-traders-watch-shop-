// Absolute site origin for sitemap, robots, canonical, and structured data.
// Override per environment with NEXT_PUBLIC_SITE_URL (no trailing slash needed).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://yousuftrade.store").replace(/\/+$/, "");
