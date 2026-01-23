"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, Variants } from "framer-motion";

interface Category {
    _id: string;
    name: string;
    slug: string;
    image?: string;
    description?: string;
}

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

export default function CategoryGrid({ categories }: { categories: Category[] }) {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-secondary font-black tracking-[0.3em] uppercase text-xs mb-4 block">Our Collections</span>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Curated for Elegance</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                        Explore our handcrafted range of sarees, from traditional weaves to modern silhouettes.
                    </p>
                </motion.div>

                <motion.div 
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-10"
                >
                    {categories.length > 0 ? categories.map((cat) => (
                        <motion.div key={cat._id} variants={item}>
                            <Link
                                href={`/shop?category=${cat.slug}`}
                                className="group relative block h-[500px] overflow-hidden rounded-sm shadow-sm transition-all duration-700 hover:shadow-2xl hover:shadow-primary/20"
                            >
                                <div className="absolute inset-0">
                                    <img
                                        src={cat.image || `https://placehold.co/600x800/png?text=${cat.name}`}
                                        alt={cat.name}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-80 transition-opacity"></div>
                                </div>

                                <div className="absolute inset-x-0 bottom-0 p-10 text-white translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                    <h3 className="text-3xl font-black mb-3">{cat.name}</h3>
                                    {cat.description && (
                                        <p className="text-gray-300 mb-6 line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 italic">
                                            "{cat.description}"
                                        </p>
                                    )}
                                    <span className="inline-flex items-center gap-2 text-white font-black tracking-widest uppercase text-xs border-b-2 border-primary pb-1 group-hover:border-secondary transition-colors">
                                        Explore <ArrowRight size={14} />
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    )) : (
                        <div className="col-span-3 text-center py-20 bg-gray-50 rounded-lg">
                            <p className="text-gray-400 font-medium">Coming soon: Our exquisite collections.</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}

