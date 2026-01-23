"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, User, Search, LogOut, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/shop/CartProvider";
import { useSession } from "next-auth/react";
import { logoutAction } from "@/app/actions/auth";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { cartCount } = useCart();
    const { data: session } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
            setIsOpen(false);
        }
    };

    const navLinks = [
        { name: "The Collection", href: "/shop" },
        { name: "New Arrivals", href: "/shop?sort=newest" },
        { name: "Traditional", href: "/shop?category=traditional" },
        { name: "Modern", href: "/shop?category=modern" },
    ];

    return (
        <nav 
            className={`sticky top-0 z-[100] transition-all duration-500 ${
                isScrolled 
                ? "bg-white/80 backdrop-blur-xl border-b border-gray-100 py-3 shadow-sm" 
                : "bg-white border-b border-transparent py-5"
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="flex justify-between items-center h-12">
                    {/* Left: Nav Links */}
                    <div className="hidden lg:flex items-center space-x-10">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                href={link.href}
                                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors hover:text-primary ${
                                    pathname === link.href ? "text-primary" : "text-gray-500"
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Center: Logo */}
                    <Link href="/" className="flex-shrink-0 group">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl md:text-3xl font-black text-gray-900 tracking-[-0.05em] leading-none transition-transform group-hover:scale-105">
                                PADMA SAI
                            </span>
                            <span className="text-[8px] font-black tracking-[0.5em] uppercase text-gray-400 mt-1">Sarees Home</span>
                        </div>
                    </Link>

                    {/* Right: Actions */}
                    <div className="flex items-center space-x-6">
                        {/* Search Desktop */}
                        <form onSubmit={handleSearch} className="hidden lg:flex items-center relative group">
                            <input
                                type="text"
                                placeholder="SEARCH"
                                className="w-0 group-hover:w-48 transition-all duration-500 bg-transparent border-b border-gray-200 focus:border-primary outline-none text-[10px] font-bold tracking-widest uppercase py-1 pr-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="text-gray-900 cursor-pointer group-hover:text-primary transition-colors" size={18} />
                        </form>

                        <div className="flex items-center space-x-6">
                            {session ? (
                                <div className="relative group/account">
                                    <button className="flex items-center gap-2 group">
                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:border-primary transition-colors">
                                            <User size={14} className="text-gray-600 group-hover:text-primary" />
                                        </div>
                                        <ChevronDown size={12} className="text-gray-400 group-hover:text-primary transition-transform group-hover:rotate-180" />
                                    </button>

                                    <div className="absolute right-0 top-full pt-4 opacity-0 scale-95 pointer-events-none group-hover/account:opacity-100 group-hover/account:scale-100 group-hover/account:pointer-events-auto transition-all duration-300 z-50 origin-top-right">
                                        <div className="bg-white rounded-sm shadow-2xl border border-gray-50 w-56 py-4 overflow-hidden">
                                            <div className="px-6 py-4 border-b border-gray-50 mb-2">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Signed in as</p>
                                                <p className="text-sm font-black text-gray-900 mt-1 truncate">{session.user.name}</p>
                                            </div>
                                            <Link href="/profile" className="block px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-primary hover:bg-gray-50 transition-all">
                                                My Profile
                                            </Link>
                                            <Link href="/orders" className="block px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-primary hover:bg-gray-50 transition-all">
                                                My Orders
                                            </Link>
                                            {session.user.role === 'admin' && (
                                                <Link href="/admin" className="block px-6 py-3 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 transition-all">
                                                    Admin Vault
                                                </Link>
                                            )}
                                            <div className="mt-4 pt-4 border-t border-gray-50 px-6">
                                                <button
                                                    onClick={async () => await logoutAction()}
                                                    className="w-full text-left text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
                                                >
                                                    Safe Exit
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-gray-900 hover:text-primary transition-colors pr-2 border-r border-gray-200">
                                    Member Entrance
                                </Link>
                            )}

                            <Link href="/cart" className="relative group">
                                <ShoppingCart size={20} className="text-gray-900 group-hover:text-primary transition-colors" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-3 -right-3 bg-primary text-white text-[9px] font-black rounded-full h-5 w-5 flex items-center justify-center shadow-lg shadow-primary/30 border-2 border-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="lg:hidden text-gray-900 hover:text-primary focus:outline-none transition-colors"
                            >
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu - Premium Slide Out */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000] lg:hidden top-0 h-screen"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-full max-w-sm bg-white z-[1001] shadow-2xl lg:hidden h-screen"
                        >
                            <div className="flex flex-col h-full p-8 md:p-12">
                                <div className="flex justify-between items-center mb-16">
                                    <div className="flex flex-col">
                                        <span className="text-xl font-black tracking-tighter">PADMA SAI</span>
                                        <span className="text-[8px] font-black tracking-[0.3em] uppercase text-gray-400">Gateway</span>
                                    </div>
                                    <button onClick={() => setIsOpen(false)} className="p-3 bg-gray-50 rounded-full">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-8 mb-auto">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className="block text-3xl font-black uppercase tracking-tighter hover:text-primary transition-all"
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>

                                <div className="pt-10 border-t border-gray-100">
                                    {session ? (
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                                                    <User size={20} className="text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Curated for</p>
                                                    <p className="text-lg font-black text-gray-900 mt-1">{session.user.name}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Link 
                                                    href="/profile" 
                                                    onClick={() => setIsOpen(false)}
                                                    className="bg-gray-50 text-center py-4 text-[10px] font-black uppercase tracking-widest rounded-sm"
                                                >
                                                    Profile
                                                </Link>
                                                <button 
                                                    onClick={async () => { await logoutAction(); setIsOpen(false); }}
                                                    className="bg-red-50 text-red-600 text-center py-4 text-[10px] font-black uppercase tracking-widest rounded-sm"
                                                >
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <Link
                                                href="/login"
                                                onClick={() => setIsOpen(false)}
                                                className="block w-full text-center bg-primary text-white py-5 font-black uppercase tracking-widest text-xs rounded-sm shadow-xl shadow-primary/20"
                                            >
                                                Member Entrance
                                            </Link>
                                            <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">or experience the collection first</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}
