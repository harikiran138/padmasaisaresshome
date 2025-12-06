"use client";

import { useState } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "../shared/CartProvider";

interface ProductActionsProps {
    product: any;
}

export default function ProductActions({ product }: ProductActionsProps) {
    const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
    const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart({
            productId: product._id,
            name: product.name,
            price: product.discountPrice || product.price,
            quantity,
            size: selectedSize,
            color: selectedColor,
            image: product.images?.[0] || "/placeholder.jpg",
        });
        alert("Added to cart!");
    };

    return (
        <div className="space-y-6">
            {/* Price */}
            <div className="border-b border-gray-100 pb-6">
                {product.discountPrice ? (
                    <div className="flex items-center space-x-4">
                        <span className="text-3xl font-bold text-gray-900">₹{product.discountPrice}</span>
                        <span className="text-xl text-gray-500 line-through">₹{product.price}</span>
                        <span className="text-green-600 font-semibold">
                            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                        </span>
                    </div>
                ) : (
                    <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                )}
            </div>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Color</h3>
                    <div className="flex space-x-3">
                        {product.colors.map((color: string) => (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`w-8 h-8 rounded-full border-2 focus:outline-none ${selectedColor === color ? "border-primary ring-2 ring-primary ring-offset-2" : "border-gray-200"
                                    }`}
                                style={{ backgroundColor: color.toLowerCase() }}
                                title={color}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-medium text-gray-900">Size</h3>
                        <button className="text-sm text-primary hover:underline">Size Chart</button>
                    </div>
                    <div className="grid grid-cols-4 gap-4 sm:grid-cols-6">
                        {product.sizes.map((size: string) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`py-3 px-4 border rounded-md text-sm font-medium focus:outline-none ${selectedSize === size
                                        ? "border-primary bg-primary text-white"
                                        : "border-gray-200 text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <div className="w-32">
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                        >-</button>
                        <input
                            type="number"
                            value={quantity}
                            readOnly
                            className="w-full text-center py-2 focus:outline-none"
                        />
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                        >+</button>
                    </div>
                </div>

                <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary text-white py-3 px-8 rounded-md font-bold hover:bg-primary/90 transition-colors flex items-center space-x-2 justify-center"
                >
                    <ShoppingCart size={20} />
                    <span>Add to Cart</span>
                </button>

                <button className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600">
                    <Heart size={20} />
                </button>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500 pt-4">
                <span>Includes taxes and shipping</span>
                <span>•</span>
                <span>Secure payments</span>
            </div>
        </div>
    );
}
