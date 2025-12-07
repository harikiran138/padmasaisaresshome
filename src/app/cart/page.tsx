
"use client";

import Link from "next/link";
import { useCart } from "@/components/shop/CartProvider";
import { ShoppingBag, Trash2, ArrowRight, Minus, Plus } from "lucide-react";

export default function CartPage() {
    const { cartItems, cartCount, subtotal, updateQuantity, removeFromCart } = useCart();

    if (cartCount === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white px-4">
                <div className="bg-gray-50 p-6 rounded-full mb-6">
                    <ShoppingBag size={48} className="text-gray-400" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
                <p className="text-gray-500 mb-8 max-w-md text-center">
                    Looks like you haven't added anything to your cart yet. Explore our collection of sarees and ethnic wear.
                </p>
                <Link
                    href="/shop"
                    className="px-8 py-3 bg-primary text-white font-bold rounded-md hover:bg-primary/90 transition-all flex items-center"
                >
                    Start Shopping <ArrowRight size={18} className="ml-2" />
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {cartItems.map((item, idx) => {
                            // Fallback in case product was deleted but still in cart
                            if (!item.product) return null;
                            const uniqueKey = `${item.product._id}-${item.size}-${item.color}`;

                            return (
                                <div key={uniqueKey} className="flex gap-4 sm:gap-6 p-6 bg-white border border-gray-100 rounded-lg shadow-sm">
                                    <Link href={`/product/${item.product.slug}`} className="flex-shrink-0">
                                        <div className="w-24 h-32 bg-gray-100 rounded-md overflow-hidden">
                                            <img
                                                src={item.product.images?.[0] || "/placeholder.jpg"}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </Link>

                                    <div className="flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                                                    <Link href={`/product/${item.product.slug}`} className="hover:text-primary">
                                                        {item.product.name}
                                                    </Link>
                                                </h3>
                                                <p className="text-sm text-gray-500 mb-1">{item.product.brand}</p>
                                                <div className="flex gap-4 text-xs font-medium text-gray-500">
                                                    {item.size && <span>Size: {item.size}</span>}
                                                    {item.color && (
                                                        <span className="flex items-center gap-1">
                                                            Color: <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: item.color }}></span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="font-bold text-gray-900">
                                                ₹{(item.product.discountPrice || item.product.price) * item.quantity}
                                            </p>
                                        </div>

                                        <div className="flex-1 flex items-end justify-between mt-4">
                                            {/* Quantity */}
                                            <div className="flex items-center border border-gray-200 rounded-md">
                                                <button
                                                    onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1), item.size || "", item.color || "")}
                                                    className="p-1.5 hover:bg-gray-50 text-gray-600 disabled:opacity-50"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.product._id, item.quantity + 1, item.size || "", item.color || "")}
                                                    className="p-1.5 hover:bg-gray-50 text-gray-600"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.product._id, item.size || "", item.color || "")}
                                                className="text-red-500 hover:text-red-700 text-sm flex items-center font-medium"
                                            >
                                                <Trash2 size={16} className="mr-1" /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping Estimate</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax Estimate</span>
                                    <span>Included</span>
                                </div>

                                <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg text-gray-900">
                                    <span>Order Total</span>
                                    <span>₹{subtotal}</span>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className="block w-full py-3 bg-primary text-white text-center font-bold rounded-md hover:bg-primary/90 transition-all shadow-md"
                            >
                                Continue to Checkout
                            </Link>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                Secure Checkout. COD Available.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
