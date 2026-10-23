import { create } from "zustand";
import type { CartItem } from "../types";
import { getQuantityPrice } from "../types/getQuantityPrice";

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (item: CartItem) => void;
  updateQuantity: (item: CartItem, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  totalWeight: () => number;
  discountCode: string | null;
  setDiscountCode: (code: string | null) => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  discountCode: null,
  setDiscountCode: (code) => set({ discountCode: code }),

  addItem: (newItem) => {
    set((state) => {
      const existing = state.items.find(
        (item) =>
          item.product.id === newItem.product.id &&
          item.variant_id === newItem.variant_id &&
          JSON.stringify(item.selected_options) ===
            JSON.stringify(newItem.selected_options) &&
          JSON.stringify(item.custom_texts) ===
            JSON.stringify(newItem.custom_texts) &&
          item.selected_background_color?.id ===
            newItem.selected_background_color?.id &&
          item.selected_print_color?.id === newItem.selected_print_color?.id &&
          item.custom_photo === undefined &&
          newItem.custom_photo === undefined,
      );

      if (existing) {
  return {
    items: state.items.map((item) => {
      if (item !== existing) return item;

      const newQuantity = item.quantity + newItem.quantity;

      return {
        ...item,
        quantity: newQuantity,
        unit_price:
          item.product.type === "KT"
            ? getQuantityPrice(item.product, newQuantity)
            : item.unit_price,
      };
    }),
  };
}

      return {
        items: [...state.items, newItem],
      };
    });
  },

  removeItem: (itemToRemove) => {
    set((state) => ({
      items: state.items.filter((item) => item !== itemToRemove),
    }));
  },

  updateQuantity: (itemToUpdate, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item === itemToUpdate
          ? {
              ...item,
              quantity,
              unit_price:
                item.product.type === "KT"
                  ? getQuantityPrice(item.product, quantity)
                  : item.unit_price,
            }
          : item,
      ),
    }));
  },

  clearCart: () =>
    set({
      items: [],
      discountCode: null,
    }),

  getTotalPrice: () => {
    return get().items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0,
    );
  },

  getTotalItems: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  totalWeight: () => {
    return get().items.reduce((sum, item) => {
      const selectedVariant = item.product.variants?.find(
        (variant) => variant.id === item.variant_id,
      );

      const itemWeight = selectedVariant?.weight ?? item.product.weight;

      return sum + itemWeight * item.quantity;
    }, 0);
  },
}));
