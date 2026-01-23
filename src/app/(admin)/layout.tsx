"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
    LayoutDashboard, 
    ShoppingBag, 
    ShoppingCart, 
    LogOut, 
    List, 
    Image as ImageIcon, 
    Users,
    Menu,
    X,
    ChevronLeft
} from "lucide-react";
import { useState } from "react";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Catalog", icon: ShoppingBag },
    { href: "/admin/orders", label: "Acquisitions", icon: ShoppingCart },
    { href: "/admin/categories", label: "Collections", icon: List },
    { href: "/admin/banners", label: "Curation", icon: ImageIcon },
    { href: "/admin/users", label: "Society", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-[#fafafa] font-inter">
            {/* Elegant Sidebar */}
            <motion.aside 
                initial={false}
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className="bg-gray-900 flex-shrink-0 relative flex flex-col z-50 shadow-2xl"
            >
                {/* Branding */}
                <div className="h-24 flex items-center px-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center font-black italic text-white text-lg">P</div>
                        {isSidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="overflow-hidden whitespace-nowrap"
                            >
                                <h1 className="text-xs font-black uppercase tracking-[0.3em] text-white">Curator <span className="text-primary">Ops</span></h1>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto scrollbar-hide">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
                        
                        return (
                            <Link key={item.href} href={item.href}>
                                <div className={`relative flex items-center h-12 rounded-sm transition-all group px-3 ${
                                    isActive ? "text-white" : "text-gray-400 hover:text-white"
                                }`}>
                                    {isActive && (
                                        <motion.div 
                                            layoutId="activeNav"
                                            className="absolute inset-0 bg-white/5 rounded-sm border-l-2 border-primary"
                                        />
                                    )}
                                    <Icon size={18} className={`relative flex-shrink-0 ${isActive ? "text-primary" : "group-hover:text-primary transition-colors"}`} />
                                    {isSidebarOpen && (
                                        <motion.span 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="ml-3 text-[10px] font-black uppercase tracking-[0.2em] relative"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Actions */}
                <div className="p-4 border-t border-white/5 bg-black/20">
                    <Link href="/">
                        <div className="flex items-center h-12 px-3 text-gray-500 hover:text-white transition-all rounded-sm">
                            <LogOut size={18} className="flex-shrink-0" />
                            {isSidebarOpen && (
                                <span className="ml-3 text-[10px] font-black uppercase tracking-[0.2em]">Return To Salon</span>
                            )}
                        </div>
                    </Link>
                    
                    <button 
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="mt-4 w-full h-8 flex items-center justify-center text-gray-600 hover:text-primary transition-all rounded-sm border border-white/5"
                    >
                        <ChevronLeft size={14} className={`transform transition-transform ${isSidebarOpen ? "" : "rotate-180"}`} />
                    </button>
                </div>
            </motion.aside>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
                
                <main className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
}
