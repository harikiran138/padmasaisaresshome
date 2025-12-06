"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CartItem {
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    size?: string;
    color?: string;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (productId: string, size?: string, color?: string) => void;
    updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load cart from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save cart to localStorage
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("cart", JSON.stringify(cartItems));
        }
    }, [cartItems, isInitialized]);

    const addToCart = (item: CartItem) => {
        setCartItems((prev) => {
            const existingItem = prev.find(
                (i) =>
                    i.productId === item.productId && i.size === item.size && i.color === item.color
            );

            if (existingItem) {
                return prev.map((i) =>
                    i.productId === item.productId && i.size === item.size && i.color === item.color
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            } // Removed duplicated return statement from previous implementation thought
            return [...prev, item];
        });
    };

    const removeFromCart = (productId: string, size?: string, color?: string) => {
        setCartItems((prev) =>
            prev.filter(
                (i) => !(i.productId === productId && i.size === size && i.color === color)
            )
        );
    };

    const updateQuantity = (
        productId: string,
        quantity: number,
        size?: string,
        color?: string
    ) => {
        setCartItems((prev) =>
            prev.map((i) =>
                i.productId === productId && i.size === size && i.color === color
                    ? { ...i, quantity: Math.max(1, quantity) }
                    : i
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
