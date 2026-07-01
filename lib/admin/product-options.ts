// Allowed values for the constrained Product string fields. Kept client-safe
// (no server-only import) so both the admin form and the server action that
// validates it share one source of truth. Mirrors the union types in
// data/shop.ts (ShopProduct).
export const GENDERS = ["Men", "Ladies", "Unisex"] as const;
export const COLLECTIONS = ["Classic", "Chronograph", "Dress", "Limited", "Sport"] as const;
export const CONDITIONS = ["New", "Pre-owned"] as const;
export const MATERIALS = ["Rose gold", "Steel"] as const;
export const DIALS = ["Black", "Ivory", "Silver", "White"] as const;
export const CATEGORY_TAGS = [
  "All watches",
  "Men",
  "Ladies",
  "New arrivals",
  "Pre-owned",
  "Limited edition",
] as const;
