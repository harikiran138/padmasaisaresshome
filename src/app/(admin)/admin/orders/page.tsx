
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import { updateOrderStatus } from "@/app/actions/orders";
import { Package, Truck, CheckCircle, XCircle, Clock, Calendar, Hash, User as UserIcon } from "lucide-react";

export default async function AdminOrdersPage({ searchParams }: { searchParams: { status?: string } }) {
    await connectToDatabase();

    const statusFilter = searchParams.status;
    const query = statusFilter ? { orderStatus: statusFilter } : {};

    const orders = await Order.find(query)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .lean();

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "PLACED": return "bg-amber-50 text-amber-700 border-amber-100";
            case "CONFIRMED": return "bg-blue-50 text-blue-700 border-blue-100";
            case "SHIPPED": return "bg-indigo-50 text-indigo-700 border-indigo-100";
            case "DELIVERED": return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "CANCELLED": return "bg-rose-50 text-rose-700 border-rose-100";
            default: return "bg-gray-50 text-gray-700 border-gray-100";
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase">Acquisitions</h1>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Orchestrate the journey of every piece</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                    {["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map(status => (
                        <a
                            key={status}
                            href={`?status=${status}`}
                            className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest border transition-all ${
                                statusFilter === status 
                                ? 'bg-black text-white border-black ring-4 ring-black/5' 
                                : 'bg-white text-gray-400 border-gray-100 hover:border-primary hover:text-primary'
                            }`}
                        >
                            {status}
                        </a>
                    ))}
                    {statusFilter && (
                        <a href="/admin/orders" className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors">
                            CLEAR
                        </a>
                    )}
                </div>
            </div>

            {/* Collection Table */}
            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 bg-[#fafafa]">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">IDENTIFIER</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">PATRON</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">VALUATION</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">TIMESTAMP</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">STATE</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Package size={40} className="text-gray-100" />
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No matching records found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order: any) => (
                                    <tr key={order._id} className="group hover:bg-[#fafafa] transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <Hash size={12} className="text-gray-300" />
                                                <span className="text-[10px] font-black text-gray-900 tracking-tighter uppercase">{order.orderId}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                                                    <UserIcon size={14} className="text-gray-400" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black text-gray-900 uppercase">{order.shippingAddress?.fullName || "Anonymous Patron"}</div>
                                                    <div className="text-[9px] font-bold text-gray-400 truncate max-w-[120px]">{order.user?.email || order.guestEmail || "No digital signature"}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-[10px] font-black text-gray-900 italic tracking-tight">₹{order.totalAmount.toLocaleString()}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={12} className="text-gray-300" />
                                                <span className="text-[10px] font-black text-gray-500 uppercase">{new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm border ${getStatusStyle(order.orderStatus)}`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <form action={updateOrderStatus} className="inline-block relative">
                                                <input type="hidden" name="orderId" value={order._id.toString()} />
                                                <select
                                                    name="status"
                                                    defaultValue={order.orderStatus}
                                                    className="appearance-none bg-[#fafafa] border border-gray-100 text-[9px] font-black uppercase tracking-widest px-4 py-2 pr-8 focus:outline-none focus:border-primary cursor-pointer transition-colors"
                                                    onChange={(e) => e.target.form?.requestSubmit()}
                                                >
                                                    <option value="PLACED">Placed</option>
                                                    <option value="CONFIRMED">Confirmed</option>
                                                    <option value="SHIPPED">Shipped</option>
                                                    <option value="DELIVERED">Delivered</option>
                                                    <option value="CANCELLED">Cancelled</option>
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                                                    <Clock size={10} />
                                                </div>
                                            </form>
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
