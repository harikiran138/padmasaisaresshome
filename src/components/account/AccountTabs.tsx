"use client";

import { useState } from "react";
import { Package, Heart, MapPin, User, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import ProductCard from "@/components/shop/ProductCard";

interface AccountTabsProps {
    orders: any[];
    wishlist: any[];
    user: any;
}

export default function AccountTabs({ orders, wishlist, user }: AccountTabsProps) {
    const [activeTab, setActiveTab] = useState("orders");

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 flex-shrink-0">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-100">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                            <span className="text-xl font-bold">{user.name?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate w-32">{user.email}</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        <button
                            onClick={() => setActiveTab("orders")}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${activeTab === "orders" ? "bg-primary/10 text-primary font-medium" : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            <Package size={20} />
                            <span>My Orders</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("wishlist")}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${activeTab === "wishlist" ? "bg-primary/10 text-primary font-medium" : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            <Heart size={20} />
                            <span>Wishlist</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("addresses")}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${activeTab === "addresses" ? "bg-primary/10 text-primary font-medium" : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            <MapPin size={20} />
                            <span>Addresses</span>
                        </button>
                        <div className="pt-4 mt-4 border-t border-gray-100">
                            <button
                                onClick={() => signOut()}
                                className="w-full flex items-center space-x-3 px-4 py-3 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                            >
                                <LogOut size={20} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </nav>
                </div>
            </aside>

            {/* Content */}
            <main className="flex-1">
                {activeTab === "orders" && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
                        {orders.length === 0 ? (
                            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
                                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
                                <p className="text-gray-500 mt-2">Start shopping to see your orders here.</p>
                                <a href="/shop" className="inline-block mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
                                    Start Shopping
                                </a>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div key={order._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Order <span className="font-mono text-gray-700">#{order._id.substring(0, 8)}</span>
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="border-t border-gray-50 pt-4 flex justify-between items-center">
                                            <span className="font-medium text-gray-900">Total Amount</span>
                                            <span className="font-bold text-lg">₹{order.totalPrice}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "wishlist" && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h2>
                        {wishlist.length === 0 ? (
                            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
                                <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">Your wishlist is empty</h3>
                                <p className="text-gray-500 mt-2">Save items you love to find them later.</p>
                                <a href="/shop" className="inline-block mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
                                    Explore Products
                                </a>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {wishlist.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "addresses" && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Addresses</h2>
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
                            <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">Addresses</h3>
                            <p className="text-gray-500 mt-2">Manage your shipping addresses here.</p>
                            {/* Address List Implementation Planned for Next Step */}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
