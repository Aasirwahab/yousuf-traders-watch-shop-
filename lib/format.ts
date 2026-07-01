// Prices are stored and displayed in LKR (whole rupees). The store is
// LKR-native — there is no USD conversion on the storefront. (PayPal settles in
// USD; wiring a real LKR→USD conversion at checkout is a separate, deferred
// concern — SL merchant accounts can't receive via PayPal today anyway.)
export function formatPrice(lkr: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(lkr);
}

/** Renders a raw USD figure. Not used on the LKR-native storefront; kept for a
 *  future real conversion at the payment boundary. */
export function formatUsd(usd: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(usd);
}
