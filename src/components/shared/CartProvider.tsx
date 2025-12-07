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
    // basic check, ideally useSession
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Load cart from API or localStorage
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await fetch("/api/cart");
                if (res.ok) {
                    const data = await res.json();
                    setIsLoggedIn(true);
                    // Map backend items to frontend CartItem structure
                    const backendItems = data.items.map((item: any) => ({
                        productId: item.product._id || item.product, // handle populate vs id
                        name: item.name || item.product.name,
                        price: item.price || item.product.price,
                        image: item.image || item.product.images?.[0] || "/placeholder.jpg",
                        quantity: item.quantity,
                        size: item.size,
                        color: item.color,
                        priceAtAddTime: item.priceAtAddTime,
                    }));
                    setCartItems(backendItems);
                } else {
                    // Fallback to local storage
                    const savedCart = localStorage.getItem("cart");
                    if (savedCart) setCartItems(JSON.parse(savedCart));
                }
            } catch (e) {
                console.error("Failed to fetch cart", e);
                const savedCart = localStorage.getItem("cart");
                if (savedCart) setCartItems(JSON.parse(savedCart));
            } finally {
                setIsInitialized(true);
            }
        };
        fetchCart();
    }, []);

    // Save cart to localStorage if not logged in
    useEffect(() => {
        if (isInitialized && !isLoggedIn) {
            localStorage.setItem("cart", JSON.stringify(cartItems));
        }
    }, [cartItems, isInitialized, isLoggedIn]);

    const addToCart = async (item: CartItem) => {
        // Optimistic update
        setCartItems((prev) => {
            const existingItem = prev.find(
                (i) => i.productId === item.productId && i.size === item.size && i.color === item.color
            );
            if (existingItem) {
                return prev.map((i) =>
                    i.productId === item.productId && i.size === item.size && i.color === item.color
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            }
            return [...prev, item];
        });

        if (isLoggedIn) {
            try {
                await fetch("/api/cart", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(item),
                });
            } catch (error) {
                console.error("Failed to sync add to cart", error);
            }
        }
    };

    const removeFromCart = async (productId: string, size?: string, color?: string) => {
        setCartItems((prev) =>
            prev.filter((i) => !(i.productId === productId && i.size === size && i.color === color))
        );

        if (isLoggedIn) {
            try {
                await fetch("/api/cart", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productId, size, color }),
                });
            } catch (error) {
                console.error("Failed to sync remove from cart", error);
            }
        }
    };

    const updateQuantity = async (productId: string, quantity: number, size?: string, color?: string) => {
        const newQty = Math.max(1, quantity);
        setCartItems((prev) =>
            prev.map((i) =>
                i.productId === productId && i.size === size && i.color === color
                    ? { ...i, quantity: newQty }
                    : i
            )
        );

        if (isLoggedIn) {
            try {
                await fetch("/api/cart", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productId, quantity: newQty, size, color }),
                });
            } catch (error) {
                console.error("Failed to sync update quantity", error);
            }
        }
    };

    const clearCart = () => {
        setCartItems([]);
        if (!isLoggedIn) localStorage.removeItem("cart");
        // API clear logic if needed, usually manually handled
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
