
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";
import { User as UserIcon, Mail, Calendar, ShoppingBag, ShieldCheck } from "lucide-react";

export default async function AdminUsersPage() {
    await connectToDatabase();
    
    // Fetch users and perform manual aggregation for order counts (MVP approach within server component)
    const users = await User.find({ role: { $ne: "admin" } }).sort({ createdAt: -1 }).lean();
    
    const userStats = await Promise.all(users.map(async (user: any) => {
        const orderCount = await Order.countDocuments({ user: user._id });
        const totalSpent = await Order.aggregate([
            { $match: { user: user._id, orderStatus: { $ne: "CANCELLED" } } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        return {
            ...user,
            orderCount,
            totalSpent: totalSpent[0]?.total || 0
        };
    }));

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase">Society</h1>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Nurturing relationships within the elite circle</p>
                </div>
                
                <div className="flex items-center gap-4 bg-black/5 px-6 py-3 rounded-sm border border-black/10">
                    <ShieldCheck size={16} className="text-black" />
                    <div>
                        <div className="text-[10px] font-black text-black uppercase tracking-widest">{users.length} Active Members</div>
                        <div className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.1em]">Total Boutique Society</div>
                    </div>
                </div>
            </div>

            {/* Society Table */}
            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 bg-[#fafafa]">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">MEMBER</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">ENGAGEMENT</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">VALUATION</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">INCEPTION</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">CREDENTIALS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {userStats.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <UserIcon size={40} className="text-gray-100" />
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Society Archives Empty</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                userStats.map((user: any) => (
                                    <tr key={user._id} className="group hover:bg-[#fafafa] transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-[12px] font-black uppercase ring-4 ring-black/5">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black text-gray-900 uppercase tracking-tight">{user.name}</div>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <span className="text-[9px] font-bold text-gray-400 uppercase">Premium Member</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <ShoppingBag size={12} className="text-gray-300" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{user.orderCount} Acquisitions</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-[10px] font-black text-gray-900 italic tracking-tight">₹{user.totalSpent.toLocaleString()}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={12} className="text-gray-300" />
                                                <span className="text-[10px] font-black text-gray-500 uppercase">
                                                    {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 text-gray-400 group-hover:text-primary transition-colors">
                                                <Mail size={12} />
                                                <span className="text-[10px] font-bold lowercase tracking-normal">{user.email}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
