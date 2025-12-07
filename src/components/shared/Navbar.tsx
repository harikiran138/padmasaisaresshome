"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, ShoppingCart, User, Search, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/shop/CartProvider";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { cartCount } = useCart();
    const { data: session } = useSession();
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
            setIsOpen(false);
        }
    };

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Women", href: "/shop?category=Women" },
        { name: "Men", href: "/shop?category=Men" },
        { name: "Kids", href: "/shop?category=Kids" },
        { name: "New Arrivals", href: "/shop?sort=newest" },
    ];

    return (
        <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center">
                        <span className="text-2xl font-bold text-primary tracking-tight">
                            PADMA SAI <span className="text-secondary">SAREES HOME</span>
                        </span>
                    </Link>

                    {/* Desktop Search Bar - Centered */}
                    <div className="hidden md:flex flex-1 max-w-lg mx-8">
                        <form onSubmit={handleSearch} className="w-full relative">
                            <input
                                type="text"
                                placeholder="Search for sarees, kurtas..."
                                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        </form>
                    </div>

                    {/* Desktop Nav Actions */}
                    <div className="hidden md:flex items-center space-x-6">
                        {session ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-1 text-left">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 leading-none">Hello, {session.user.name?.split(" ")[0]}</span>
                                        <span className="font-bold text-gray-900 leading-none">Account & Lists</span>
                                    </div>
                                </button>

                                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div className="bg-white rounded-md shadow-lg border border-gray-100 w-48 py-2 overflow-hidden">
                                        <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">
                                            Your Account
                                        </Link>
                                        <Link href="/account?tab=orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">
                                            Your Orders
                                        </Link>
                                        <Link href="/account?tab=wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">
                                            Your Wishlist
                                        </Link>
                                        {session.user.role === 'admin' && (
                                            <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary font-bold">
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <div className="border-t border-gray-100 mt-1 pt-1">
                                            <button
                                                onClick={() => signOut()}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4 text-sm font-medium">
                                <Link href="/login" className="text-gray-700 hover:text-primary transition-colors">
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-primary text-white px-5 py-2 rounded-full hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        <Link href="/cart" className="text-gray-600 hover:text-primary transition-colors relative">
                            <ShoppingCart size={22} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce-short">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <Link href="/cart" className="text-gray-600 relative">
                            <ShoppingCart size={24} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-700 hover:text-primary focus:outline-none p-1"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="px-4 py-4 space-y-4">
                            {/* Mobile Search */}
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                            </form>

                            {/* Links */}
                            <div className="flex flex-col space-y-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>

                            {/* Mobile Auth */}
                            <div className="pt-4 border-t border-gray-100 mt-2 space-y-3">
                                {session ? (
                                    <>
                                        <Link
                                            href="/account"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center space-x-3 px-3 py-3 rounded-md text-gray-700 hover:bg-gray-50 hover:text-primary"
                                        >
                                            <User size={20} />
                                            <span className="font-medium">My Account</span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                signOut();
                                                setIsOpen(false);
                                            }}
                                            className="w-full flex items-center space-x-3 px-3 py-3 rounded-md text-red-500 hover:bg-red-50"
                                        >
                                            <LogOut size={20} />
                                            <span className="font-medium">Sign Out</span>
                                        </button>
                                    </>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <Link
                                            href="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={() => setIsOpen(false)}
                                            className="flex justify-center items-center px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
