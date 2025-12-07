import Link from "next/link";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { IProduct } from "@/models/Product";
import WishlistButton from "../shared/WishlistButton";

interface ProductCardProps {
    product: Partial<IProduct> & { _id: string }; // flexible type
}

export default function ProductCard({ product }: ProductCardProps) {
    const discountPercentage = product.discountPrice
        ? Math.round(((product.price! - product.discountPrice) / product.price!) * 100)
        : 0;

    return (
        <div className="group bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <img
                    src={product.images?.[0] || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {discountPercentage > 0 && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-sm">
                        {discountPercentage}% OFF
                    </span>
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    <WishlistButton productId={product._id} />
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-gray-900 font-medium text-lg leading-tight truncate mb-1">
                    <Link href={`/product/${product.slug}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                    </Link>
                </h3>
                <p className="text-gray-500 text-sm mb-1">{product.brand || "No Brand"}</p>
                <p className="text-xs text-gray-400 mb-2">{product.category}</p>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-3">
                    <div className="flex text-yellow-400">
                        <Star size={14} fill={product.averageRating && product.averageRating >= 4 ? "currentColor" : "none"} className={product.averageRating && product.averageRating >= 4 ? "" : "text-gray-300"} />
                        <span className="text-xs text-gray-500 ml-1 font-medium">{product.averageRating ? product.averageRating.toFixed(1) : "New"}</span>
                    </div>
                    {product.numReviews ? (
                        <span className="text-xs text-gray-400">({product.numReviews})</span>
                    ) : null}
                </div>

                <div className="flex items-end justify-between">
                    <div>
                        {product.discountPrice ? (
                            <div className="flex flex-col">
                                <span className="text-gray-400 line-through text-sm">₹{product.price}</span>
                                <span className="text-secondary font-bold text-lg">₹{product.discountPrice}</span>
                            </div>
                        ) : (
                            <span className="text-gray-900 font-bold text-lg">₹{product.price}</span>
                        )}
                    </div>
                    <button className="relative z-10 p-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
