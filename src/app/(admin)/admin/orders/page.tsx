
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import { updateOrderStatus } from "@/app/actions/orders";
import { Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";

export default async function AdminOrdersPage({ searchParams }: { searchParams: { status?: string } }) {
    await connectToDatabase();

    const statusFilter = searchParams.status;
    const query = statusFilter ? { status: statusFilter } : {};

    const orders = await Order.find(query)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .lean();

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Placed": return <Clock size={16} className="text-yellow-600" />;
            case "Shipped": return <Truck size={16} className="text-blue-600" />;
            case "Delivered": return <CheckCircle size={16} className="text-green-600" />;
            case "Cancelled": return <XCircle size={16} className="text-red-600" />;
            default: return <Package size={16} className="text-gray-600" />;
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const colors: Record<string, string> = {
            "Placed": "bg-yellow-100 text-yellow-800",
            "Shipped": "bg-blue-100 text-blue-800",
            "Delivered": "bg-green-100 text-green-800",
            "Cancelled": "bg-red-100 text-red-800",
        };
        return (
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-800"}`}>
                {getStatusIcon(status)}
                {status}
            </span>
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                <div className="flex gap-2">
                    {["Placed", "Shipped", "Delivered", "Cancelled"].map(status => (
                        <a
                            key={status}
                            href={`?status=${status}`}
                            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${statusFilter === status ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                        >
                            {status}
                        </a>
                    ))}
                    {statusFilter && (
                        <a href="/admin/orders" className="px-3 py-1.5 rounded text-sm font-medium text-gray-600 hover:text-gray-900">
                            Clear Filter
                        </a>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-sm font-medium text-gray-900">Order ID</th>
                                <th className="px-6 py-3 text-sm font-medium text-gray-900">Customer</th>
                                <th className="px-6 py-3 text-sm font-medium text-gray-900">Date</th>
                                <th className="px-6 py-3 text-sm font-medium text-gray-900">Amount</th>
                                <th className="px-6 py-3 text-sm font-medium text-gray-900">Status</th>
                                <th className="px-6 py-3 text-sm font-medium text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order: any) => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-mono text-gray-600">
                                            #{order._id.toString().slice(-8).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {order.user?.name || order.shippingAddress?.fullName || "Guest"}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {order.user?.email || "No email"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            ₹{order.totalAmount?.toLocaleString() || order.totalPrice?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <form action={updateOrderStatus} className="flex items-center gap-2">
                                                <input type="hidden" name="orderId" value={order._id.toString()} />
                                                <select
                                                    name="status"
                                                    defaultValue=""
                                                    className="text-xs border-gray-300 rounded focus:ring-primary focus:border-primary"
                                                    onChange={(e) => e.target.form?.requestSubmit()}
                                                >
                                                    <option value="" disabled>Update Status</option>
                                                    <option value="Placed">Placed</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
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
