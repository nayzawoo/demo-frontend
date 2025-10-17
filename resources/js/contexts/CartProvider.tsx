import type { Cart, CartItem, Product } from '@/types';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type CartContextType = {
    cart: Cart;
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: number) => void;
    clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'demo_frontend_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return [];
            return JSON.parse(raw) as CartItem[];
        } catch (e) {
            console.error('Failed to read cart from storage', e);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (e) {
            console.error('Failed to persist cart to storage', e);
        }
    }, [items]);

    const addItem = (product: Product, quantity = 1) => {
        setItems((prev) => {
            const existingIndex = prev.findIndex((i) => i.product_id === product.id);
            if (existingIndex >= 0) {
                const next = [...prev];
                const existing = next[existingIndex];
                next[existingIndex] = {
                    ...existing,
                    quantity: (existing.quantity || 0) + quantity,
                };
                return next;
            }

            const newItem: CartItem = {
                product,
                product_id: product.id,
                name: product.name,
                price: product.price,
                quantity,
            };
            return [...prev, newItem];
        });
    };

    const removeItem = (productId: number) => {
        setItems((prev) => prev.filter((i) => i.product_id !== productId));
    };

    const clearCart = () => setItems([]);

    const cart = useMemo<Cart>(() => {
        const total = items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 0), 0);
        const count = items.reduce((s, it) => s + (it.quantity || 0), 0);
        return { items, total, count } as Cart;
    }, [items]);

    return <CartContext.Provider value={{ cart, addItem, removeItem, clearCart }}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within a CartProvider');
    return ctx;
};

export default CartProvider;
