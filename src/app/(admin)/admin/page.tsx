import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { redirect } from "next/navigation";
import { IndianRupee, ShoppingCart, Package, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import User from "@/models/User";
import SeedButton from "@/components/admin/SeedButton";
import { motion } from "framer-motion";

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
        { $match: { paymentStatus: "PAID" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

    const stats = [
        { label: "Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, trend: "+12%", color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Acquisitions", value: totalOrders, icon: ShoppingCart, trend: "+5%", color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Collection", value: totalProducts, icon: Package, trend: "+2 new", color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Society", value: totalUsers, icon: Users, trend: "+8%", color: "text-orange-600", bg: "bg-orange-50" },
    ];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-gray-900 uppercase italic">Salon Intelligence</h1>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Real-time boutique performance analytics</p>
                </div>
                <div className="flex gap-4">
                    <SeedButton />
                </div>
            </div>

            {/* Cinematic Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white border border-gray-100 p-8 shadow-sm group hover:border-primary transition-all duration-500 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <stat.icon size={120} />
                        </div>
                        <div className="relative">
                            <div className={`w-10 h-10 ${stat.bg} ${stat.color} flex items-center justify-center rounded-sm mb-6`}>
                                <stat.icon size={18} />
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <div className="flex items-baseline gap-3 mt-1">
                                <h3 className="text-2xl font-black text-gray-900 tracking-tighter italic">{stat.value}</h3>
                                <span className="text-[9px] font-black text-emerald-500 flex items-center">
                                    <TrendingUp size={10} className="mr-1" />
                                    {stat.trend}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Transactions & Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Acquisitions */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900">Recent Acquisitions</h2>
                        <button className="text-[9px] font-black uppercase tracking-widest text-primary hover:text-black transition-colors">View All Archive</button>
                    </div>
                    
                    <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-50 bg-[#fafafa]">
                                    <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Descriptor</th>
                                    <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Patron</th>
                                    <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                    <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">State</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentOrders.map((order: any) => (
                                    <tr key={order._id} className="hover:bg-[#fafafa] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="text-[10px] font-black text-gray-900 uppercase">#{order.orderId}</div>
                                            <div className="text-[8px] font-bold text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-[10px] font-black text-gray-700 uppercase">{order.shippingAddress?.fullName || order.guestEmail || "Society Member"}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-[10px] font-black text-gray-900 italic">₹{order.totalAmount.toLocaleString()}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-sm ${
                                                order.orderStatus === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700' :
                                                order.orderStatus === 'CANCELLED' ? 'bg-rose-50 text-rose-700' :
                                                'bg-amber-50 text-amber-700 font-bold'
                                            }`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Growth Insights */}
                <div className="space-y-6">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900">Salon Velocity</h2>
                    <div className="bg-black text-white p-8 rounded-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4">
                            <ArrowUpRight className="text-primary opacity-50 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </div>
                        <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-2 text-primary">Monthly Target</p>
                        <h4 className="text-3xl font-black tracking-tighter italic italic">84% ACHIEVED</h4>
                        <div className="mt-8 bg-white/10 h-1 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: "84%" }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="bg-primary h-full"
                            />
                        </div>
                        <p className="mt-6 text-[9px] font-medium text-gray-500 leading-relaxed uppercase tracking-tighter">
                            The collection is performing exceptionally. acquisitions are up 15% from last month.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
