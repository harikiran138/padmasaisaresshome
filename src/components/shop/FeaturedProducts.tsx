"use client";

import ProductCard from "./ProductCard";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

export default function FeaturedProducts({ products }: { products: any[] }) {
    return (
        <section className="py-24 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center sm:items-end mb-16 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-accent font-black tracking-[0.3em] uppercase text-xs mb-3 block text-center sm:text-left">New Arrivals</span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 text-center sm:text-left leading-tight">Trending Now</h2>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link 
                            href="/shop" 
                            className="group inline-flex items-center gap-2 bg-white px-8 py-3 rounded-sm border border-gray-200 text-gray-900 font-bold hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                        >
                            View All Collection <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium">Coming soon: Our featured masterpieces.</p>
                    </div>
                ) : (
                    <motion.div 
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
                    >
                        {products.map((p) => (
                            <ProductCard key={p._id} product={p} />
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}

