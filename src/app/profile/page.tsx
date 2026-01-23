"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
        if (status === "authenticated") {
            fetchOrders();
        }
    }, [status]);

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/orders");
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4">Profile</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Name</label>
                                <p className="font-medium text-gray-900">{session?.user?.name}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Email</label>
                                <p className="font-medium text-gray-900">{session?.user?.email}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Role</label>
                                <span className="inline-block px-2 py-0.5 mt-1 text-xs font-bold rounded-full bg-gray-100 text-gray-800">
                                    {session?.user?.role || "Customer"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order History */}
                <div className="col-span-2">
                    <h2 className="text-xl font-bold mb-4">Order History</h2>
                    {orders.length === 0 ? (
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center text-gray-500">
                            No orders found.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <div key={order._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-center mb-4 border-b pb-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Order ID: <span className="font-mono text-gray-900">#{order._id.slice(-6).toUpperCase()}</span></p>
                                            <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                                                order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                                order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {order.orderStatus}
                                            </span>
                                            <p className="font-bold text-lg mt-1">₹{order.totalAmount}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {order.items.map((item: any, idx: number) => (
                                            <div key={idx} className="flex gap-4">
                                                <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                                     {/* Use product image if available in item snapshot */}
                                                     {item.image && <img src={item.image} className="w-full h-full object-cover" alt={item.name} />}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{item.name}</p>
                                                    <p className="text-sm text-gray-500">Qty: {item.quantity} {item.size && `• ${item.size}`}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
