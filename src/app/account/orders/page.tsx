
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import Link from "next/link";
import { Package, ArrowLeft, ExternalLink } from "lucide-react";

export default async function OrdersPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    await connectToDatabase();

    // Fetch user orders
    const orders = await Order.find({ user: session.user.id })
        .sort({ createdAt: -1 })
        .lean();

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center mb-8">
                    <Link href="/account" className="flex items-center text-gray-500 hover:text-gray-900 mr-4 transition-colors">
                        <ArrowLeft size={20} className="mr-1" />
                        Back
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                </div>

                <div className="space-y-6">
                    {orders.length === 0 ? (
                        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-100 text-center">
                            <Package size={64} className="mx-auto text-gray-300 mb-6" />
                            <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
                            <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
                            <Link href="/shop" className="inline-block px-8 py-3 bg-primary text-white rounded-md hover:bg-primary/90 font-medium transition-colors">
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        orders.map((order: any) => (
                            <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                {/* Order Header */}
                                <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-100">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 w-full sm:w-auto">
                                        <div>
                                            <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Order Placed</p>
                                            <p className="text-sm font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Total</p>
                                            <p className="text-sm font-medium text-gray-900">₹{order.totalAmount}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Ship To</p>
                                            <p className="text-sm font-medium text-gray-900 group relative cursor-pointer">
                                                {order.shippingAddress?.fullName}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <p className="text-sm text-gray-500 mb-1">Order # {order._id.toString().slice(-8).toUpperCase()}</p>
                                        <div className="flex space-x-3">
                                            {/* Could add invoice link here */}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <h3 className={`text-lg font-bold mb-4 ${order.orderStatus === 'DELIVERED' ? 'text-green-600' :
                                            order.orderStatus === 'CANCELLED' ? 'text-red-600' : 'text-yellow-600'
                                        }`}>
                                        {order.orderStatus.charAt(0) + order.orderStatus.slice(1).toLowerCase()}
                                    </h3>

                                    <div className="space-y-6">
                                        {order.items.map((item: any, idx: number) => (
                                            <div key={idx} className="flex gap-4">
                                                <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                                    {/* Ideally we store image in order item or join with product */}
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                                                        <Package size={24} />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between">
                                                        <h4 className="font-medium text-gray-900">
                                                            <Link href={`/product/${item.product}`} className="hover:text-primary hover:underline">
                                                                {item.name}
                                                            </Link>
                                                        </h4>
                                                        <span className="font-bold text-gray-900">₹{item.price}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity} {item.size && `• Size: ${item.size}`} {item.color && `• Color: ${item.color}`}</p>

                                                    <div className="mt-2 text-sm">
                                                        <Link href={`/product/${item.product}`} className="text-primary hover:underline inline-flex items-center">
                                                            Buy it again
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
