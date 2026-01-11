'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    quantity: number;
    image: string;
}

interface CartContextType {
    items: CartItem[];
    isOpen: boolean;
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    itemCount: number;
    subtotal: number;
    discount: number;
    total: number;
    appliedCoupon: string | null;
    applyCoupon: (code: string) => boolean;
    removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'aspre_cart';
const COUPON_STORAGE_KEY = 'aspre_coupon';

// Valid coupons
const VALID_COUPONS: Record<string, number> = {
    'vectric10': 0.10, // 10% off
};

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
    const [isHydrated, setIsHydrated] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);

        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart:', e);
            }
        }

        if (savedCoupon) {
            setAppliedCoupon(savedCoupon);
        }

        setIsHydrated(true);
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, isHydrated]);

    // Save coupon to localStorage
    useEffect(() => {
        if (isHydrated) {
            if (appliedCoupon) {
                localStorage.setItem(COUPON_STORAGE_KEY, appliedCoupon);
            } else {
                localStorage.removeItem(COUPON_STORAGE_KEY);
            }
        }
    }, [appliedCoupon, isHydrated]);

    const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
        setItems((prev) => {
            const existingItem = prev.find((i) => i.id === item.id);

            if (existingItem) {
                // Limit to 1 item per product (per requirements)
                return prev;
            }

            return [...prev, { ...item, quantity: 1 }];
        });

        setIsOpen(true);
    }, []);

    const removeFromCart = useCallback((id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const updateQuantity = useCallback((id: string, quantity: number) => {
        if (quantity < 1) return;
        // Limit to 1 item per product
        if (quantity > 1) return;

        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
        setAppliedCoupon(null);
    }, []);

    const openCart = useCallback(() => setIsOpen(true), []);
    const closeCart = useCallback(() => setIsOpen(false), []);
    const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

    const applyCoupon = useCallback((code: string): boolean => {
        const normalizedCode = code.toLowerCase().trim();

        if (VALID_COUPONS[normalizedCode]) {
            setAppliedCoupon(normalizedCode);
            return true;
        }

        return false;
    }, []);

    const removeCoupon = useCallback(() => {
        setAppliedCoupon(null);
    }, []);

    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    const subtotal = items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const discount = appliedCoupon
        ? subtotal * (VALID_COUPONS[appliedCoupon] || 0)
        : 0;

    const total = subtotal - discount;

    return (
        <CartContext.Provider
            value={{
                items,
                isOpen,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                openCart,
                closeCart,
                toggleCart,
                itemCount,
                subtotal,
                discount,
                total,
                appliedCoupon,
                applyCoupon,
                removeCoupon,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);

    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }

    return context;
}
