import { auth } from "@/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import Link from "next/link";
import User from "@/models/User";
import AccountTabs from "@/components/account/AccountTabs";
import { User as UserIcon } from "lucide-react";

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

    // Fetch user details...
    const user = await User.findById(session.user.id).populate("wishlist").lean();

    const wishlist = user?.wishlist?.map((p: any) => ({
        ...p,
        _id: p._id.toString(),
        createdAt: p.createdAt?.toISOString(),
        updatedAt: p.updatedAt?.toISOString(),
    })) || [];

    // Serialize user for client component
    const serializedUser = {
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address, // Pass addresses
    };

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AccountTabs orders={orders} wishlist={wishlist} user={serializedUser} />
            </div>
        </div>
    );
}
