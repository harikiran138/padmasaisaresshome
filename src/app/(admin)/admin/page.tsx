import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { redirect } from "next/navigation";
import { IndianRupee, ShoppingCart, Package, Users } from "lucide-react";
import User from "@/models/User";

export default async function AdminDashboard() {
    const session = await auth();
    if (session?.user?.role !== "admin") {
        redirect("/login");
    }

    await connectToDatabase();

    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    const revenueResult = await Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).lean();

    return (
        <div>
            <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                            <h3 className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-green-50 rounded-full text-green-600">
                            <IndianRupee size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                            <h3 className="text-2xl font-bold">{totalOrders}</h3>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                            <ShoppingCart size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Total Products</p>
                            <h3 className="text-2xl font-bold">{totalProducts}</h3>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-full text-purple-600">
                            <Package size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Total Users</p>
                            <h3 className="text-2xl font-bold">{totalUsers}</h3>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-full text-orange-600">
                            <Users size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold mb-4">Recent Orders</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 text-gray-500 text-sm">
                                <th className="pb-3 text-left pl-4">Order ID</th>
                                <th className="pb-3 text-left">Customer</th>
                                <th className="pb-3 text-left">Amount</th>
                                <th className="pb-3 text-left">Status</th>
                                <th className="pb-3 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentOrders.map((order: any) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="py-3 pl-4 font-mono text-sm text-gray-600">
                                        {order._id.toString().substring(0, 8)}...
                                    </td>
                                    <td className="py-3 text-sm">
                                        {order.guestInfo?.name || "Registered User"}
                                    </td>
                                    <td className="py-3 text-sm font-medium">₹{order.totalPrice}</td>
                                    <td className="py-3 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-3 text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
