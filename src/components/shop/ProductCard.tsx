"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, Eye } from "lucide-react";
import { IProduct } from "@/models/Product";
import WishlistButton from "../shared/WishlistButton";
import { motion } from "framer-motion";

interface ProductCardProps {
    product: Partial<IProduct> & { _id: string };
}

export default function ProductCard({ product }: ProductCardProps) {
    const discountPercentage = product.discountPrice
        ? Math.round(((product.price! - product.discountPrice) / product.price!) * 100)
        : 0;

    const isHot = product.isFeatured || (product.numReviews && product.numReviews > 10);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group relative bg-white rounded-sm overflow-hidden border border-gray-100/50 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500"
        >
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                <Link href={`/product/${product.slug}`}>
                    <Image
                        src={product.images?.[0] || "/placeholder.jpg"}
                        alt={product.name || "Product Image"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                </Link>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                    {discountPercentage > 0 && (
                        <span className="bg-accent text-white text-[10px] font-black px-2 py-1 tracking-widest uppercase">
                            {discountPercentage}% OFF
                        </span>
                    )}
                    {isHot && (
                        <span className="bg-secondary text-black text-[10px] font-black px-2 py-1 tracking-widest uppercase">
                            Trending
                        </span>
                    )}
                </div>

                {/* Quick Actions overlay */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <Link 
                        href={`/product/${product.slug}`}
                        className="p-3 bg-white text-gray-900 rounded-full hover:bg-primary hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
                    >
                        <Eye size={20} />
                    </Link>
                    <button className="p-3 bg-white text-gray-900 rounded-full hover:bg-primary hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-500 delay-75 shadow-lg">
                        <ShoppingCart size={20} />
                    </button>
                </div>

                <div className="absolute top-3 right-3 z-10">
                    <WishlistButton productId={product._id} />
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="mb-1 flex justify-between items-start">
                    <div>
                        <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mb-1">
                            {product.brand || "Artisan Collection"}
                        </p>
                        <h3 className="text-gray-900 font-bold text-base leading-snug line-clamp-1 hover:text-primary transition-colors">
                            <Link href={`/product/${product.slug}`}>
                                {product.name}
                            </Link>
                        </h3>
                    </div>
                </div>

                <div className="flex items-center space-x-1 mb-4">
                    <div className="flex text-secondary">
                        {[...Array(5)].map((_, i) => (
                            <Star 
                                key={i} 
                                size={12} 
                                fill={i < Math.floor(product.averageRating || 4) ? "currentColor" : "none"} 
                                className={i < Math.floor(product.averageRating || 4) ? "" : "text-gray-200"}
                            />
                        ))}
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">({product.numReviews || 0})</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div>
                        {product.discountPrice ? (
                            <div className="flex items-center gap-2">
                                <span className="text-primary font-black text-xl">₹{product.discountPrice.toLocaleString()}</span>
                                <span className="text-gray-400 line-through text-xs font-medium">₹{product.price?.toLocaleString()}</span>
                            </div>
                        ) : (
                            <span className="text-primary font-black text-xl">₹{product.price?.toLocaleString()}</span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

