"use client";

import { useEffect, useState, Suspense } from "react";
import ProductFilters from "@/components/shop/ProductFilters";
import ProductCard from "@/components/shop/ProductCard";
import SortDropdown from "@/components/shop/SortDropdown";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { getCategories, getProducts } from "@/app/actions/shop";

function ShopContent(props: {
    searchParams: any;
}) {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useState<any>({});
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            const params = await props.searchParams;
            setSearchParams(params);
            
            const [p, c] = await Promise.all([
                getProducts({
                    category: params.category,
                    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
                    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
                    sort: params.sort,
                    search: params.q,
                }),
                getCategories()
            ]);
            
            setProducts(p);
            setCategories(c);
            setLoading(false);
        };
        fetchAll();
    }, [props.searchParams]);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Elegant Hero Header for Shop */}
            <div className="bg-gray-50 py-16 md:py-24 border-b border-gray-100 mb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-secondary font-black tracking-[0.3em] uppercase text-xs mb-4 block"
                    >
                        Our Exclusive Collection
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl md:text-7xl font-black text-gray-900 mb-6 font-serif"
                    >
                        {searchParams.category || "The Gallery"}
                    </motion.h1>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="h-1 w-24 bg-primary mx-auto rounded-full"
                    ></motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Filters Sidebar - Desktop */}
                    <aside className="hidden lg:block w-72 shrink-0">
                        <div className="sticky top-24">
                            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-8 flex items-center gap-2">
                                <SlidersHorizontal size={16} /> Filters
                            </h2>
                            <ProductFilters categories={categories} />
                        </div>
                    </aside>

                    {/* Product Area */}
                    <main className="flex-1">
                        {/* Toolbar */}
                        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 pb-6 border-b border-gray-100">
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <span className="text-gray-500 font-medium text-sm">
                                    {products.length} Masterpieces Found
                                </span>
                                <button 
                                    onClick={() => setShowMobileFilters(true)}
                                    className="lg:hidden flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-sm text-sm font-bold hover:bg-gray-200 transition-colors"
                                >
                                    <SlidersHorizontal size={14} /> Filters
                                </button>
                            </div>
                            <SortDropdown />
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3, 4, 6].map((i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="bg-gray-100 aspect-[3/4] rounded-sm mb-4"></div>
                                        <div className="h-4 bg-gray-100 w-2/3 mb-2 rounded-sm"></div>
                                        <div className="h-4 bg-gray-100 w-1/3 rounded-sm"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <AnimatePresence mode="wait">
                                {products.length === 0 ? (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center py-32 bg-gray-50/50 rounded-sm border border-dashed border-gray-200"
                                    >
                                        <h3 className="text-2xl font-black text-gray-900 mb-3">No Pieces Found</h3>
                                        <p className="text-gray-500 max-w-xs mx-auto italic">"True beauty is worth the wait, but these specific filters yield no results."</p>
                                        <button 
                                            onClick={() => window.location.href = '/shop'}
                                            className="mt-8 text-primary font-black uppercase tracking-widest text-xs border-b-2 border-primary pb-1"
                                        >
                                            Reset Filters
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        key={JSON.stringify(searchParams)}
                                        variants={container}
                                        initial="hidden"
                                        animate="show"
                                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
                                    >
                                        {products.map((p: any) => (
                                            <ProductCard key={p._id} product={p} />
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}
                    </main>
                </div>
            </div>

            {/* Mobile Filters Overlay */}
            <AnimatePresence>
                {showMobileFilters && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMobileFilters(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
                        />
                        <motion.div 
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-full max-w-sm bg-white z-[60] shadow-2xl p-8 lg:hidden"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-xl font-black uppercase tracking-widest">Filters</h2>
                                <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X size={24} />
                                </button>
                            </div>
                            <ProductFilters categories={categories} />
                            <button 
                                onClick={() => setShowMobileFilters(false)}
                                className="w-full bg-primary text-white font-black py-4 mt-8 rounded-sm uppercase tracking-widest text-xs"
                            >
                                Apply Filters
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function ShopPage(props: { searchParams: any }) {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ShopContent searchParams={props.searchParams} />
        </Suspense>
    );
}
