"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useToast } from "@/components/providers/ToastProvider";

interface CartItem {
    product: any;
    quantity: number;
    size?: string;
    color?: string;
    priceAtAddTime: number;
}

interface CartContextType {
    cartItems: CartItem[];
    cartCount: number;
    subtotal: number;
    isLoading: boolean;
    refreshCart: () => Promise<void>;
    addToCart: (productId: string, quantity: number, size?: string, color?: string) => Promise<boolean>;
    updateQuantity: (productId: string, quantity: number, size: string, color: string) => Promise<void>;
    removeFromCart: (productId: string, size: string, color: string) => Promise<void>;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();
    const { showToast } = useToast();

    // Session Management
    const [sessionId, setSessionId] = useState<string | null>(null);

    useEffect(() => {
        let sid = localStorage.getItem("cart_session_id");
        if (!sid) {
            sid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            localStorage.setItem("cart_session_id", sid);
        }
        setSessionId(sid);
    }, []);

    const fetchHeaders = useCallback(() => {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };
        const sid = localStorage.getItem("cart_session_id");
        if (sid) {
            headers["x-session-id"] = sid;
        }
        return headers;
    }, []);

    const refreshCart = useCallback(async () => {
        const sid = localStorage.getItem("cart_session_id");
        if (!sid) return;

        try {
            setIsLoading(true);
            const res = await fetch("/api/cart", {
                headers: fetchHeaders()
            });
            if (res.ok) {
                const data = await res.json();
                setCartItems(data?.items || []);
            }
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        } finally {
            setIsLoading(false);
        }
    }, [fetchHeaders]);

    useEffect(() => {
        if (sessionId) {
            refreshCart();
        }
    }, [sessionId, refreshCart, pathname]);

    const addToCart = async (productId: string, quantity: number, size?: string, color?: string) => {
        try {
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: fetchHeaders(),
                body: JSON.stringify({ productId, quantity, size, color }),
            });

            if (res.ok) {
                await refreshCart();
                showToast("success", "Exquisite Choice", "Item added to your collection.");
                return true;
            } else {
                const error = await res.json();
                showToast("error", "Selection Error", error.message || "Could not add to cart.");
                return false;
            }
        } catch (error) {
            showToast("error", "System Error", "A minor interruption occurred. Please try again.");
            return false;
        }
    };

    const updateQuantity = async (productId: string, quantity: number, size: string, color: string) => {
        try {
            const res = await fetch("/api/cart", {
                method: "PUT",
                headers: fetchHeaders(),
                body: JSON.stringify({ productId, quantity, size, color }),
            });
            if (res.ok) {
                await refreshCart();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const removeFromCart = async (productId: string, size: string, color: string) => {
        try {
            const res = await fetch("/api/cart", {
                method: "DELETE",
                headers: fetchHeaders(),
                body: JSON.stringify({ productId, size, color }),
            });
            if (res.ok) {
                await refreshCart();
                showToast("info", "Cart Updated", "Item removed from your bag.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const clearCart = () => {
        setCartItems([]);
        // Local state clear is usually enough after successful checkout
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cartItems.reduce((acc, item) => {
        const price = item.product?.discountPrice || item.product?.price || 0;
        return acc + price * item.quantity;
    }, 0);

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            cartCount, 
            subtotal, 
            isLoading,
            refreshCart, 
            addToCart, 
            updateQuantity, 
            removeFromCart, 
            clearCart 
        }}>
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
