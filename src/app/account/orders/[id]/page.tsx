
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import Link from "next/link";
import { ArrowLeft, Package, MapPin, Truck } from "lucide-react";

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    await connectToDatabase();

    const order = await Order.findOne({ _id: params.id, user: session.user.id }).lean();

    if (!order) {
        notFound();
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link href="/account" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-4 transition-colors">
                        <ArrowLeft size={18} className="mr-1" /> Back to Account
                    </Link>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-end">
                        <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
                        <p className="text-gray-500 mt-2 sm:mt-0">Order # <span className="font-mono">{order._id.toString().slice(-8).toUpperCase()}</span></p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Status Card */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Status</h2>
                            <div className="flex items-center space-x-4">
                                <div className={`p-3 rounded-full ${order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                    <Truck size={24} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{order.orderStatus}</p>
                                    <p className="text-sm text-gray-500">
                                        {order.orderStatus === 'PLACED' ? 'Your order has been placed successfully.' :
                                            order.orderStatus === 'SHIPPED' ? 'Your order is on the way.' :
                                                order.orderStatus === 'DELIVERED' ? 'Your order has been delivered.' : 'Update coming soon.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                                <h2 className="font-bold text-gray-900">Items</h2>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {order.items.map((item: any, idx: number) => (
                                    <div key={idx} className="p-6 flex gap-4">
                                        <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 flex-shrink-0">
                                            <Package size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <h3 className="font-medium text-gray-900">{item.name}</h3>
                                                <span className="font-bold">₹{item.price * item.quantity}</span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Qty: {item.quantity}
                                                {item.size && ` | Size: ${item.size}`}
                                                {item.color && ` | Color: ${item.color}`}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Summary */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h2 className="font-bold text-gray-900 mb-4">Summary</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{order.subtotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>₹{order.shippingFee}</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between font-bold text-gray-900 text-lg">
                                    <span>Total</span>
                                    <span>₹{order.totalAmount}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h2 className="font-bold text-gray-900 mb-4">Shipping Address</h2>
                            <div className="flex items-start">
                                <MapPin size={20} className="text-gray-400 mt-1 mr-2 flex-shrink-0" />
                                <address className="not-italic text-sm text-gray-600">
                                    <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                                    <p>{order.shippingAddress.line1}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                                    <p>{order.shippingAddress.country}</p>
                                    <p className="mt-2 text-gray-500">Phone: {order.shippingAddress.phone}</p>
                                </address>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
