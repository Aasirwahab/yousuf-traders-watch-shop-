// Client-safe shipping options shared by the checkout UI and the server-side
// order logic. Cost is in whole USD units (matches Product.price).

export const SHIPPING_METHODS = [
  {
    id: "insured-standard",
    label: "Complimentary insured delivery",
    detail: "5–7 business days · fully insured",
    cost: 0,
  },
  {
    id: "insured-express",
    label: "Express insured delivery",
    detail: "1–2 business days · signature required",
    cost: 75,
  },
] as const;

export type ShippingMethodId = (typeof SHIPPING_METHODS)[number]["id"];

export function getShippingMethod(id: string) {
  return SHIPPING_METHODS.find((method) => method.id === id);
}
