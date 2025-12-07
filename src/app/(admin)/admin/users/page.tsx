
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export default async function AdminUsersPage() {
    await connectToDatabase();
    const users = await User.find({ role: "customer" }).sort({ createdAt: -1 });

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Customers</h1>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-sm font-medium text-gray-900">Name</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-900">Email</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-900">Joined Date</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-900">Orders</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    No customers found.
                                </td>
                            </tr>
                        ) : (
                            users.map((user: any) => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        - {/* To do: Aggregate order count */}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
