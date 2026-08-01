import {create} from 'zustand';
import type {CartItem, Product, ProductColor} from '../types';

interface CartStore {

    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (productId: string) => void
    updateQuantity: (productId: string, quantity: number) => void
    clearCart: () => void
    getTotalItems: () => number
    getTotalPrice: () => number
    totalWeight: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],

    addItem: (newItem) => {
        set((state) => {

            const existing = state.items.find(
                item => item.product.id === newItem.product.id && item.selected_size === newItem.selected_size && item.selected_color?.name === newItem.selected_color?.name
            )

            if (existing) {
                return {
                    items: state.items.map(item => 
                        item === existing 
                        ? {...item, quantity: item.quantity + newItem.quantity}
                        : item
                    )
                }
            } else {
                return {
                    items: [...state.items, newItem]
                }
            }
        })
    },

    removeItem: (productId: string) => {
        set((state) => ({
            items: state.items.filter(item => item.product.id !== productId )

        }))
    },

    updateQuantity: (productId: string, quantity: number) => {
        set((state) => ({
            items: state.items.map(item => 
                item.product.id === productId
                ? {...item, quantity: quantity}
                : item
            )
        }))
    },

    clearCart: () => set({ items: []}),

    getTotalPrice: () => {
        return get().items.reduce(
            (sum, item) => sum + item.unit_price * item.quantity, 0
        )
    },

    getTotalItems: () => {
        return get().items.reduce(
            (sum, item) => sum + item.quantity, 0
        )
    },

    totalWeight: () => {
        return get().items.reduce(
            (sum, item) => sum + item.product.weight * item.quantity, 0
        )
    }
}))