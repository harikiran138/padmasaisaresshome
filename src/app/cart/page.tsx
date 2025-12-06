"use client";

import { useCart } from "@/components/shared/CartProvider";
import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-20">
                <div className="bg-white p-8 rounded-full shadow-sm mb-6">
                    <ShoppingBag size={64} className="text-gray-300" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
                <p className="text-gray-500 mb-8 max-w-md text-center">
                    Looks like you haven't added anything to your cart yet. Browse our collections to find your perfect style.
                </p>
                <Link
                    href="/shop"
                    className="px-8 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
                        <ul className="divide-y divide-gray-100">
                            {cartItems.map((item) => (
                                <li key={`${item.productId}-${item.size}-${item.color}`} className="p-6 flex flex-col sm:flex-row items-center gap-6">
                                    <div className="w-24 h-32 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>

                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            <Link href={`/product/${item.productId}`} className="hover:text-primary">
                                                {item.name}
                                            </Link>
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Size: {item.size} | Color: {item.color}
                                        </p>
                                        <p className="text-primary font-bold mt-2">₹{item.price}</p>
                                    </div>

                                    <div className="flex items-center border border-gray-200 rounded-md">
                                        <button
                                            onClick={() => updateQuantity(item.productId, item.quantity - 1, item.size, item.color)}
                                            className="px-3 py-1 text-gray-600 hover:bg-gray-50"
                                            disabled={item.quantity <= 1}
                                        >-</button>
                                        <span className="px-3 py-1 text-gray-900">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.productId, item.quantity + 1, item.size, item.color)}
                                            className="px-3 py-1 text-gray-600 hover:bg-gray-50"
                                        >+</button>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.productId, item.size, item.color)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="p-6 border-t border-gray-100">
                            <button onClick={clearCart} className="text-sm text-red-500 hover:underline">
                                Clear Cart
                            </button>
                        </div>
                    </div>

                    {/* Checkout Summary */}
                    <div className="w-full lg:w-96">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax (Estimate)</span>
                                    <span>₹{Math.round(cartTotal * 0.05)}</span>
                                </div>
                                <div className="border-t border-gray-100 pt-4 flex justify-between text-lg font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>₹{cartTotal + Math.round(cartTotal * 0.05)}</span>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className="block w-full text-center bg-primary text-white py-3 rounded-md font-bold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
                            >
                                Proceed to Checkout
                            </Link>

                            <p className="text-center text-xs text-gray-400 mt-4">
                                Secure Checkout with Razorpay/Stripe Support
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
