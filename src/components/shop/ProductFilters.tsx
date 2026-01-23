"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Category {
    _id: string;
    name: string;
    slug: string;
}

export default function ProductFilters({ categories }: { categories: Category[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");

    useEffect(() => {
        setSelectedCategory(searchParams.get("category") || "");
    }, [searchParams]);

    const handleFilterChange = (key: string, value: string | number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value.toString());
        } else {
            params.delete(key);
        }
        router.push(`/shop?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="space-y-12">
            <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900 mb-8 flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-primary"></span>
                    The Archive
                </h3>
                <div className="space-y-4">
                    <button
                        onClick={() => handleFilterChange("category", "")}
                        className={`group flex items-center justify-between w-full text-left transition-all duration-300 ${
                            selectedCategory === "" ? "text-primary translate-x-2" : "text-gray-500 hover:text-gray-900"
                        }`}
                    >
                        <span className="text-xs font-black uppercase tracking-widest">All Curations</span>
                        <span className={`w-1.5 h-1.5 rounded-full bg-primary transition-all duration-300 ${selectedCategory === "" ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}></span>
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat._id}
                            onClick={() => handleFilterChange("category", cat.slug)}
                            className={`group flex items-center justify-between w-full text-left transition-all duration-300 ${
                                selectedCategory === cat.slug ? "text-primary translate-x-2" : "text-gray-500 hover:text-gray-900"
                            }`}
                        >
                            <span className="text-xs font-black uppercase tracking-widest">{cat.name}</span>
                            <span className={`w-1.5 h-1.5 rounded-full bg-primary transition-all duration-300 ${selectedCategory === cat.slug ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}></span>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900 mb-8 flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-primary"></span>
                    Price Spectrum
                </h3>
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400">₹</span>
                            <input
                                type="number"
                                placeholder="MIN"
                                defaultValue={searchParams.get("minPrice") || ""}
                                className="w-full pl-8 pr-4 py-3 bg-gray-50 border-none text-[10px] font-black text-gray-900 placeholder:text-gray-300 focus:ring-1 focus:ring-primary transition-all outline-none"
                                onBlur={(e) => handleFilterChange("minPrice", e.target.value)}
                            />
                        </div>
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400">₹</span>
                            <input
                                type="number"
                                placeholder="MAX"
                                defaultValue={searchParams.get("maxPrice") || ""}
                                className="w-full pl-8 pr-4 py-3 bg-gray-50 border-none text-[10px] font-black text-gray-900 placeholder:text-gray-300 focus:ring-1 focus:ring-primary transition-all outline-none"
                                onBlur={(e) => handleFilterChange("maxPrice", e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="pt-8">
                <button 
                    onClick={() => router.push("/shop")}
                    className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors flex items-center gap-2"
                >
                    Reset Curations
                </button>
            </div>
        </div>
    );
}
