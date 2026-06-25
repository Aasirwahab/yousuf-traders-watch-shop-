// Shared currency formatter. Prices are whole USD units across the catalog,
// carts, and orders (see Product.price in prisma/schema.prisma).
export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}
