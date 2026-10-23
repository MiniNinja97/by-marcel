import type { Product } from "../types";

export function getQuantityPrice(
  product: Product,
  quantity: number,
): number {
  if (product.type !== "KT" || !product.quantity_prices?.length) {
    return product.base_price;
  }

  const priceTier = product.quantity_prices.find(
    (tier) =>
      quantity >= tier.min_quantity &&
      (tier.max_quantity === null || quantity <= tier.max_quantity),
  );

  return priceTier?.unit_price ?? product.base_price;
}