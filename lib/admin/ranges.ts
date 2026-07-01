// Time-range options for the admin overview. Kept in its own module (no
// server-only / Prisma imports) so both the server metrics layer and the client
// dashboard can share one source of truth without pulling server code into the
// browser bundle.
export const RANGES = {
  today: { label: "Today", days: 1 },
  "7d": { label: "7 days", days: 7 },
  "30d": { label: "30 days", days: 30 },
  quarter: { label: "Quarter", days: 90 },
} as const;

export type RangeId = keyof typeof RANGES;

export function resolveRange(value: string | undefined): RangeId {
  return value && value in RANGES ? (value as RangeId) : "30d";
}
