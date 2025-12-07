import { auth } from "@/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import Link from "next/link";
import { User, Package, Clock, CheckCircle, AlertCircle, ShoppingBag } from "lucide-react";

export default async function AccountPage() {
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar / Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-500">
                                    <User size={48} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">{session.user.name}</h2>
                                <p className="text-gray-500 text-sm mb-4">{session.user.email}</p>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                    {session.user.role}
                                </span>
                            </div>

                            <div className="mt-8 border-t border-gray-100 pt-6 space-y-4">
                                {session.user.role === "admin" && (
                                    <Link
                                        href="/admin"
                                        className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800"
                                    >
                                        Admin Dashboard
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content / Orders */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                    <ShoppingBag className="mr-2" size={20} />
                                    Order History
                                </h3>
                                <span className="bg-gray-100 text-gray-600 py-1 px-3 rounded-full text-xs font-medium">
                                    {orders.length} Orders
                                </span>
                            </div>

                            {orders.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                                        <Package size={48} />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
                                    <p className="mt-1 text-gray-500">start shopping to make your first order.</p>
                                    <div className="mt-6">
                                        <Link
                                            href="/shop"
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                                        >
                                            Browse Products
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-100">
                                    {orders.map((order: any) => (
                                        <li key={order._id} className="p-6 hover:bg-gray-50 transition-colors">
                                            <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-4 sm:space-y-0">
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between sm:justify-start sm:space-x-4 mb-2">
                                                        <span className="text-sm font-bold text-gray-900">#{order._id.toString().slice(-8).toUpperCase()}</span>
                                                        <StatusBadge status={order.status} />
                                                    </div>
                                                    <div className="text-sm text-gray-500 space-y-1">
                                                        <p className="flex items-center">
                                                            <Clock size={14} className="mr-1.5" />
                                                            {new Date(order.createdAt).toLocaleDateString(undefined, {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                        <p>{order.orderItems.length} items • ₹{order.totalPrice}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center sm:space-x-4">
                                                    <Link
                                                        href={`/order-confirmation/${order._id}`}
                                                        className="w-full sm:w-auto text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        Pending: "bg-yellow-100 text-yellow-800",
        Processing: "bg-blue-100 text-blue-800",
        Shipped: "bg-indigo-100 text-indigo-800",
        Delivered: "bg-green-100 text-green-800",
        Cancelled: "bg-red-100 text-red-800",
    };

    const icons: Record<string, any> = {
        Pending: Clock,
        Processing: Package,
        Shipped: Package,
        Delivered: CheckCircle,
        Cancelled: AlertCircle,
    };

    const Icon = icons[status] || Clock;

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}>
            <Icon size={12} className="mr-1" />
            {status}
        </span>
    );
}
