
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";

interface CartItem {
    product: any; // Using any for flexibility or shared interface
    quantity: number;
    size?: string;
    color?: string;
    priceAtAddTime: number;
}

interface CartContextType {
    cartItems: CartItem[];
    cartCount: number;
    subtotal: number;
    refreshCart: () => Promise<void>;
    addToCart: (productId: string, quantity: number, size?: string, color?: string) => Promise<boolean>;
    updateQuantity: (productId: string, quantity: number, size: string, color: string) => Promise<void>;
    removeFromCart: (productId: string, size: string, color: string) => Promise<void>;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const pathname = usePathname();

    const refreshCart = async () => {
        try {
            const res = await fetch("/api/cart");
            if (res.ok) {
                const data = await res.json();
                setCartItems(data.items || []);
            }
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        }
    };

    useEffect(() => {
        refreshCart();
    }, [pathname]); // Refresh on route change to keep consistent

    const addToCart = async (productId: string, quantity: number, size?: string, color?: string) => {
        try {
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, quantity, size, color }),
            });
            if (res.ok) {
                refreshCart();
                return true;
            }
        } catch (error) {
            console.error("Add to cart error:", error);
        }
        return false;
    };

    const updateQuantity = async (productId: string, quantity: number, size: string, color: string) => {
        try {
            await fetch("/api/cart", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, quantity, size, color }),
            });
            refreshCart();
        } catch (error) {
            console.error(error);
        }
    };

    const removeFromCart = async (productId: string, size: string, color: string) => {
        try {
            await fetch("/api/cart", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, size, color }),
            });
            refreshCart();
        } catch (error) {
            console.error(error);
        }
    };

    const clearCart = async () => {
        setCartItems([]);
        try {
            // Optional: Call API if you have a clear cart endpoint, or relying on checkout to clear backend
        } catch (error) {
            console.error(error);
        }
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cartItems.reduce((acc, item) => {
        const price = item.product.discountPrice || item.product.price;
        const extra = 0; // If you implement variant price logic later
        return acc + (price + extra) * item.quantity;
    }, 0);

    return (
        <CartContext.Provider value={{ cartItems, cartCount, subtotal, refreshCart, addToCart, updateQuantity, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
