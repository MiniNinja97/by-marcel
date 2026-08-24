import { create } from "zustand";
import type { CartItem, Product, ProductColor } from "../types";

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (item: CartItem) => void;
  updateQuantity: (item: CartItem, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  totalWeight: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (newItem) => {
    set((state) => {
      const existing = state.items.find(
        (item) =>
          item.product.id === newItem.product.id &&
          JSON.stringify(item.selected_options) ===
            JSON.stringify(newItem.selected_options) &&
          item.custom_text === newItem.custom_text,
      );

      if (existing) {
        return {
          items: state.items.map((item) =>
            item === existing
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item,
          ),
        };
      } else {
        return {
          items: [...state.items, newItem],
        };
      }
    });
  },

  removeItem: (itemToRemove) => {
    set((state) => ({
        items: state.items.filter(
            item => item !== itemToRemove
        )
    }))
},

updateQuantity: (itemToUpdate, quantity) => {
    set((state) => ({
        items: state.items.map(item =>
            item === itemToUpdate
                ? { ...item, quantity }
                : item
        )
    }))
},

  clearCart: () => set({ items: [] }),

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
    return get().items.reduce(
      (sum, item) => sum + item.product.weight * item.quantity,
      0,
    );
  },
}));
