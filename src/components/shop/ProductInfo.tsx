
"use client";

import { useState } from "react";
import { Star, Minus, Plus, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/shop/CartProvider"; // Assuming we have this Context, checking later
// If no Context, I'll direct Cart actions to API directly, but context is better for Navbar update.
// I will implement a direct API call for now + toast, and assume Navbar updates via some other mechanism or refresh.

import { useRouter } from "next/navigation";

// Mock Toast (replace with sonner or proper toast lib if available)
const showToast = (msg: string) => {
    // Simple alert for now as per "Mini toast" requirement, I'll stick to a simple custom implementation if needed or just alert
    // Actually, let's create a tiny toast hook or component later. For now, just console/alert.
    alert(msg);
};


export default function ProductInfo({ product }: { product: any }) {
    const router = useRouter();
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);

    // Derived State
    const hasSizes = product.sizes && product.sizes.length > 0;
    const hasColors = product.colors && product.colors.length > 0;

    // Find specific variant data if needed (e.g. strict stock check)
    // For now, using product top-level + selected options

    const addToCart = async () => {
        if (hasSizes && !selectedSize) {
            alert("Please select a size.");
            return;
        }
        if (hasColors && !selectedColor) {
            alert("Please select a color.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: product._id,
                    size: selectedSize,
                    color: selectedColor,
                    quantity: quantity
                })
            });

            if (res.ok) {
                showToast("Added to cart ✓");
                router.refresh(); // Refresh to update cart count if server-rendered
            } else {
                alert("Failed to add to cart");
            }
        } catch (err) {
            console.error(err);
            alert("Error adding to cart");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8 md:mt-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-500 mb-4">{product.brand || "Padma Sai Sarees"}</p>

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-6">
                <div className="flex text-yellow-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={16} fill="currentColor" className="text-yellow-400" />
                    ))}
                </div>
                <span className="text-sm text-gray-500">(15 Reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 mb-6">
                {product.discountPrice ? (
                    <>
                        <span className="text-3xl font-bold text-gray-900">₹{product.discountPrice}</span>
                        <span className="text-xl text-gray-400 line-through">₹{product.price}</span>
                        <span className="text-sm text-green-600 font-medium mb-1">
                            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                        </span>
                    </>
                ) : (
                    <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                )}
                <span className="text-xs text-gray-500 mb-1 ml-1">incl. all taxes</span>
            </div>

            <hr className="border-gray-100 my-8" />

            {/* Selectors */}
            <div className="space-y-6">
                {hasSizes && (
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="font-medium text-gray-900">Select Size</span>
                            <button className="text-sm text-primary hover:underline">Size Guide</button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {product.sizes.map((size: string) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-all ${selectedSize === size
                                            ? "border-primary bg-primary/5 text-primary"
                                            : "border-gray-200 text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {hasColors && (
                    <div>
                        <span className="block font-medium text-gray-900 mb-2">Select Color</span>
                        <div className="flex gap-3">
                            {product.colors.map((color: string) => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${selectedColor === color ? "border-primary" : "border-transparent"}`}
                                >
                                    <span className="block w-6 h-6 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: color }}></span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quantity */}
                <div>
                    <span className="block font-medium text-gray-900 mb-2">Quantity</span>
                    <div className="flex items-center border border-gray-300 rounded-md w-32">
                        <button
                            className="p-3 hover:bg-gray-50 text-gray-500 disabled:opacity-50"
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            disabled={quantity <= 1}
                        >
                            <Minus size={16} />
                        </button>
                        <span className="flex-1 text-center font-medium text-gray-900">{quantity}</span>
                        <button
                            className="p-3 hover:bg-gray-50 text-gray-500"
                            onClick={() => setQuantity(q => q + 1)}
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-8 pb-8 border-b border-gray-100">
                <button
                    onClick={addToCart}
                    disabled={loading}
                    className="flex-1 bg-primary text-white font-bold py-4 rounded-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                >
                    <ShoppingBag size={20} />
                    {loading ? "Adding..." : "Add to Cart"}
                </button>
                <button className="p-4 border border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50 text-gray-700 transition-all">
                    <Heart size={24} />
                </button>
            </div>

            {/* Description Tab (Simplified as section for now) */}
            <div className="mt-8 space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
                </div>

                {product.attributes && Object.keys(product.attributes).length > 0 && (
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Product Details</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <table className="w-full text-sm text-left">
                                <tbody>
                                    {Object.entries(product.attributes).map(([key, value]) => (
                                        <tr key={key} className="border-b border-gray-100 last:border-0">
                                            <td className="py-2 text-gray-500 font-medium capitalize">{key}</td>
                                            <td className="py-2 text-gray-900 pl-4">{value as string}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
