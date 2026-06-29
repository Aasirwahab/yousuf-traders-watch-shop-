// Money is stored and charged in whole USD units (see Product.price in
// prisma/schema.prisma); PayPal settles in USD. The storefront *displays* LKR,
// converted at a fixed rate. Set NEXT_PUBLIC_LKR_PER_USD to the current rate —
// it's inlined at build time, so changing it requires a rebuild.
const LKR_PER_USD = Number(process.env.NEXT_PUBLIC_LKR_PER_USD) || 300;

/** Display price in LKR, converted from the stored USD amount. */
export function formatPrice(usd: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(usd * LKR_PER_USD);
}

/** The actual amount charged at checkout — PayPal settles in USD. */
export function formatUsd(usd: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(usd);
}
