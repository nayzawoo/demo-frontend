import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type CartItem = {
    id: number;
    image?: string;
    title: string;
    price: number;
    quantity: number;
};

type CartState = {
    count: number;
    cart: CartItem[];
    addCart: (item: CartItem) => void;
    removeCart: (id: number) => void;
    getTotalPrice: () => number;
    updateQuantity: (id: number, quantity: number) => void;
    reduceQuantity: (id: number) => void;
    clearCart: () => void;
};

export const useCart = create<CartState>()(
    persist(
        (set, get) => ({
            count: 0,
            cart: [],
            addCart: (item) =>
                set((state) => {
                    const existingItem = state.cart.find((cartItem) => cartItem.id === item.id);
                    if (existingItem) {
                        return {
                            count: state.count + 1,
                            cart: state.cart.map((cartItem) =>
                                cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
                            ),
                        };
                    }
                    return {
                        count: state.count + 1,
                        cart: [...state.cart, { ...item, quantity: 1 }],
                    };
                }),
            removeCart: (id) =>
                set((state) => {
                    const existingItem = state.cart.find((item) => item.id === id);
                    if (existingItem && existingItem.quantity > 1) {
                        return {
                            count: state.count - 1,
                            cart: state.cart.map((cartItem) => (cartItem.id === id ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem)),
                        };
                    }
                    return {
                        count: state.count - 1,
                        cart: state.cart.filter((item) => item.id !== id),
                    };
                }),
            clearCart: () => set({ cart: [], count: 0 }),
            reduceQuantity: (id: number) =>
                set((state) => {
                    const existingItem = state.cart.find((item) => item.id === id);
                    if (existingItem && existingItem.quantity > 1) {
                        return {
                            count: state.count - 1,
                            cart: state.cart.map((cartItem) => (cartItem.id === id ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem)),
                        };
                    }
                    return state;
                }),
            updateQuantity: (id: number, quantity: number) =>
                set((state) => {
                    if (quantity < 1) {
                        return state;
                    }
                    const existingItem = state.cart.find((item) => item.id === id);
                    if (existingItem) {
                        const quantityDiff = quantity - existingItem.quantity;
                        return {
                            count: state.count + quantityDiff,
                            cart: state.cart.map((cartItem) => (cartItem.id === id ? { ...cartItem, quantity: quantity } : cartItem)),
                        };
                    }
                    return state;
                }),
            getTotalPrice: () => {
                const state = get();
                return state.cart.reduce((total, item) => total + item.price * item.quantity, 0) + 20; // add $20 shipping fee
            },
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
