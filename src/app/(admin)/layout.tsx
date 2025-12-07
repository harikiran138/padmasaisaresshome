import Link from "next/link";
import { LayoutDashboard, ShoppingBag, ShoppingCart, LogOut, List, Image, Users } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <aside className="w-64 bg-gray-900 text-white flex-shrink-0 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold">Admin Panel</h1>
                    <p className="text-xs text-gray-500 mt-1">Padma Sai Sarees Home</p>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <Link href="/admin" className="flex items-center space-x-3 px-4 py-3 rounded hover:bg-gray-800 transition-colors">
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link href="/admin/products" className="flex items-center space-x-3 px-4 py-3 rounded hover:bg-gray-800 transition-colors">
                        <ShoppingBag size={20} />
                        <span>Products</span>
                    </Link>
                    <Link href="/admin/orders" className="flex items-center space-x-3 px-4 py-3 rounded hover:bg-gray-800 transition-colors">
                        <ShoppingCart size={20} />
                        <span>Orders</span>
                    </Link>
                    <Link href="/admin/categories" className="flex items-center space-x-3 px-4 py-3 rounded hover:bg-gray-800 transition-colors">
                        <List size={20} />
                        <span>Categories</span>
                    </Link>
                    <Link href="/admin/banners" className="flex items-center space-x-3 px-4 py-3 rounded hover:bg-gray-800 transition-colors">
                        <Image size={20} />
                        <span>Banners</span>
                    </Link>
                    <Link href="/admin/users" className="flex items-center space-x-3 px-4 py-3 rounded hover:bg-gray-800 transition-colors">
                        <Users size={20} />
                        <span>Customers</span>
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <Link href="/" className="flex items-center space-x-3 px-4 py-3 rounded hover:bg-gray-800 transition-colors text-gray-400">
                        <LogOut size={20} />
                        <span>Back to Shop</span>
                    </Link>
                </div>
            </aside>

            {/* Mobile Header (simplified) */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="md:hidden bg-white shadow-sm p-4 flex items-center justify-between">
                    <h1 className="font-bold">Admin</h1>
                    <Link href="/" className="text-sm">Back</Link>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
