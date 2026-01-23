"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SORT_OPTIONS = [
    { label: "Chronological: Newest", value: "newest" },
    { label: "Value: Low to High", value: "price_asc" },
    { label: "Value: High to Low", value: "price_desc" },
    { label: "Prestige: Popular", value: "popular" },
];

export default function SortDropdown() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const currentSortValue = searchParams.get("sort") || "newest";
    const currentSort = SORT_OPTIONS.find(opt => opt.value === currentSortValue) || SORT_OPTIONS[0];

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", value);
        router.push(`/shop?${params.toString()}`, { scroll: false });
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 bg-white border border-gray-100 px-6 py-3 rounded-sm group transition-all hover:border-gray-300 shadow-sm"
            >
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Arrange by</span>
                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest min-w-[140px] text-left">{currentSort.label}</span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-100 shadow-2xl z-50 py-3 rounded-sm overflow-hidden"
                    >
                        {SORT_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleSortChange(option.value)}
                                className={`w-full text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${
                                    currentSortValue === option.value 
                                    ? "bg-primary text-white" 
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
