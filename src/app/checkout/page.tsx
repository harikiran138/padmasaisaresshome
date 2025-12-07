"use client";

import { useCart } from "@/components/shop/CartProvider";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Added missing import

export default function CheckoutPage() {
    const { cartItems, subtotal: cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: "India", // Default
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    checkOutInfo: formData,
                    orderItems: cartItems,
                    totalPrice: cartTotal + Math.round(cartTotal * 0.05), // + Tax
                }),
            });

            const data = await response.json();

            if (response.ok) {
                clearCart();
                router.push(`/order-confirmation/${data.orderId}`);
            } else {
                alert(data.error || "Something went wrong within checkout");
            }
        } catch (error) {
            console.error(error);
            alert("Failed to place order");
        } finally {
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Your cart is empty. <Link href="/shop" className="text-primary hover:underline">Go Shopping</Link></p>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Form */}
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        required
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        required
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    required
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        required
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        required
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">ZIP / Postal Code</label>
                                    <input
                                        type="text"
                                        name="zip"
                                        required
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            e.target.value = val;
                                            handleChange(e);
                                        }}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Country</label>
                                    <select
                                        name="country"
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    >
                                        <option value="India">India</option>
                                        <option value="US">United States</option>
                                        {/* Add more */}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <h3 className="text-lg font-bold mb-4">Payment Method</h3>
                                <div className="p-4 border rounded-md bg-gray-50 text-gray-500 text-sm">
                                    Payment integration (Razorpay/Stripe) will be initialized here.
                                    For now, proceeding will simulate a successful payment.
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full bg-primary text-white py-3 rounded-md font-bold hover:bg-primary/90 transition-colors shadow-lg disabled:bg-gray-400"
                            >
                                {isProcessing ? "Processing..." : "Place Order"}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-100 p-8 rounded-lg">
                        <h2 className="text-xl font-bold mb-6">Your Order</h2>
                        <ul className="space-y-4 mb-6">
                            {cartItems.map(item => (
                                <li key={`${item.product._id}-${item.size}`} className="flex justify-between">
                                    <span className="text-gray-600">{item.product.name} x {item.quantity}</span>
                                    <span className="font-medium">₹{(item.product.discountPrice || item.product.price) * item.quantity}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>₹{cartTotal + Math.round(cartTotal * 0.05)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
