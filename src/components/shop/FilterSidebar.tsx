"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const categories = ["Women", "Men", "Kids", "Ethnic", "Casual", "Formal"];
const sizes = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];
const colors = ["Red", "Blue", "Green", "White", "Black", "Gold", "Pink"];

export default function FilterSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || ""); // Removed trailing comma

    const currentCategory = searchParams.get("category");
    const currentSizes = searchParams.getAll("size"); // Simplified usage

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (key === "category") {
            if (params.get("category") === value) {
                params.delete("category");
            } else {
                params.set("category", value);
            }
        } else if (key === "size") {
            // Toggle logic for multiple selection
            const sizes = params.getAll("size");
            if (sizes.includes(value)) {
                params.delete("size");
                sizes.filter(s => s !== value).forEach(s => params.append("size", s));
            } else {
                params.append("size", value);
            }
        } else {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        }

        router.push(`/shop?${params.toString()}`, { scroll: false });
    };

    const applyPriceFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (minPrice) params.set("minPrice", minPrice);
        else params.delete("minPrice");

        if (maxPrice) params.set("maxPrice", maxPrice);
        else params.delete("maxPrice");

        router.push(`/shop?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="space-y-8">
            {/* Categories */}
            <div>
                <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
                <ul className="space-y-2">
                    {categories.map((cat) => (
                        <li key={cat}>
                            <button
                                onClick={() => handleFilterChange("category", cat)}
                                className={`text-sm ${currentCategory === cat ? "text-primary font-bold" : "text-gray-600 hover:text-primary"
                                    }`}
                            >
                                {cat}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Price */}
            <div>
                <h3 className="font-bold text-gray-900 mb-4">Price</h3>
                <div className="flex items-center space-x-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <span>-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <button
                        onClick={applyPriceFilter}
                        className="px-3 py-1 bg-gray-900 text-white text-sm rounded hover:bg-gray-800"
                    >
                        Go
                    </button>
                </div>
            </div>

            {/* Sizes */}
            {/* ... Implemented simply ... */}
        </div>
    );
}
