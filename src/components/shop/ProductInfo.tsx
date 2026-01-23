"use client";

import { useState } from "react";
import { Star, Minus, Plus, Heart, ShoppingBag, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/providers/ToastProvider";
import { useCart } from "@/components/shop/CartProvider";

export default function ProductInfo({ product }: { product: {
    _id: string;
    name: string;
    brand?: string;
    price: number;
    discountPrice?: number;
    sizes?: string[];
    colors?: string[];
    description: string;
    attributes?: Record<string, string>;
} }) {
    const router = useRouter();
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const { showToast } = useToast();
    const { addToCart: addToCartContext } = useCart();

    const hasSizes = product.sizes && product.sizes.length > 0;
    const hasColors = product.colors && product.colors.length > 0;

    const addToCart = async () => {
        if (hasSizes && !selectedSize) {
            showToast("info", "Sizing Required", "Please select a size to view the Drape.");
            return;
        }
        if (hasColors && !selectedColor) {
            showToast("info", "Palette Selection", "Please choose your exquisite color.");
            return;
        }

        setLoading(true);

        try {
            const success = await addToCartContext(product._id, quantity, selectedSize, selectedColor);

            if (success) {
                setIsAdded(true);
                setTimeout(() => setIsAdded(false), 3000);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="md:pl-8"
        >
            <div className="mb-8">
                <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-accent font-black tracking-[0.2em] uppercase text-xs mb-3 block"
                >
                    {product.brand || "Padma Sai Collection"}
                </motion.span>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">{product.name}</h1>
                
                <div className="flex items-center gap-4">
                    <div className="flex text-yellow-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={16} fill="currentColor" className="text-yellow-400" />
                        ))}
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">(24 Reviews)</span>
                </div>
            </div>

            <div className="flex items-baseline gap-4 mb-10">
                {product.discountPrice ? (
                    <>
                        <span className="text-4xl font-black text-primary">₹{product.discountPrice.toLocaleString()}</span>
                        <span className="text-xl text-gray-400 line-through font-medium">₹{product.price.toLocaleString()}</span>
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-black tracking-tighter">
                            SAVE {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                        </span>
                    </>
                ) : (
                    <span className="text-4xl font-black text-gray-900">₹{product.price.toLocaleString()}</span>
                )}
            </div>

            <p className="text-gray-500 leading-relaxed mb-10 text-lg italic border-l-4 border-gray-100 pl-6">
                "{product.description}"
            </p>

            <div className="space-y-10">
                {hasSizes && (
                    <div>
                        <div className="flex justify-between mb-4">
                            <span className="text-xs font-black uppercase tracking-widest text-gray-900">Select Size</span>
                            <button className="text-xs font-bold text-primary hover:underline border-b border-primary/20">Size Guide</button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {product.sizes?.map((size: string) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`w-14 h-14 border-2 flex items-center justify-center text-sm font-black transition-all duration-300 ${selectedSize === size
                                            ? "border-primary bg-primary text-white scale-105 shadow-lg shadow-primary/20"
                                            : "border-gray-100 text-gray-900 hover:border-gray-300 bg-white"
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
                        <span className="block text-xs font-black uppercase tracking-widest text-gray-900 mb-4">Exquisite Colors</span>
                        <div className="flex gap-4">
                            {product.colors?.map((color: string) => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-10 h-10 rounded-full border-2 p-1 transition-all duration-300 ${selectedColor === color ? "border-primary scale-110 shadow-md" : "border-transparent"}`}
                                >
                                    <span 
                                        className="block w-full h-full rounded-full border border-black/5 shadow-inner" 
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    ></span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <span className="block text-xs font-black uppercase tracking-widest text-gray-900 mb-4">Quantity</span>
                    <div className="inline-flex items-center bg-gray-50 rounded-sm border border-gray-100">
                        <button
                            className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 text-gray-500 disabled:opacity-30 transition-colors"
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            disabled={quantity <= 1}
                        >
                            <Minus size={14} />
                        </button>
                        <span className="w-12 text-center font-black text-gray-900">{quantity}</span>
                        <button
                            className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 text-gray-500 transition-colors"
                            onClick={() => setQuantity(q => q + 1)}
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 mt-12">
                <button
                    onClick={addToCart}
                    disabled={loading || (hasSizes && !selectedSize) || (hasColors && !selectedColor)}
                    className={`flex-1 relative overflow-hidden h-16 rounded-sm font-black uppercase tracking-[0.2em] text-xs transition-all duration-500 shadow-xl disabled:opacity-50 disabled:shadow-none ${
                        isAdded ? "bg-green-600 text-white shadow-green-200" : "bg-primary text-white shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                    }`}
                >
                    <AnimatePresence mode="wait">
                        {isAdded ? (
                            <motion.div 
                                key="added"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="flex items-center justify-center gap-2"
                            >
                                <Check size={18} /> Piece Added
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="add"
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="flex items-center justify-center gap-2"
                            >
                                <ShoppingBag size={18} /> {loading ? "Invoking..." : "Add to Gallery"}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
                <button className="w-16 h-16 border-2 border-gray-100 flex items-center justify-center hover:bg-gray-50 hover:border-gray-200 text-gray-400 hover:text-red-500 transition-all duration-300 rounded-sm">
                    <Heart size={24} />
                </button>
            </div>

            <div className="mt-16 bg-gray-50/50 p-8 rounded-sm space-y-8">
                {product.attributes && Object.keys(product.attributes).length > 0 && (
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-6 flex items-center gap-2">
                             Product Specs
                        </h3>
                        <div className="grid grid-cols-2 gap-y-4">
                            {Object.entries(product.attributes).map(([key, value]) => (
                                <div key={key} className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">{key}</span>
                                    <span className="text-sm font-bold text-gray-900">{value as string}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
