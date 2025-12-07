
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface Category {
    _id: string;
    name: string;
    slug: string;
}

export default function ProductFilters({ categories }: { categories: Category[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");

    useEffect(() => {
        setSelectedCategory(searchParams.get("category") || "");
    }, [searchParams]);

    const handleFilterChange = (key: string, value: string | number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value.toString());
        } else {
            params.delete(key);
        }
        router.push(`/shop?${params.toString()}`);
    };

    return (
        <div className="space-y-8">
            {/* Categories */}
            <div>
                <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="radio"
                            name="category"
                            checked={selectedCategory === ""}
                            onChange={() => handleFilterChange("category", "")}
                            className="text-primary focus:ring-primary"
                        />
                        <span className="text-gray-600">All Categories</span>
                    </label>
                    {categories.map((cat) => (
                        <label key={cat._id} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="category"
                                checked={selectedCategory === cat.slug}
                                onChange={() => handleFilterChange("category", cat.slug)}
                                className="text-primary focus:ring-primary"
                            />
                            <span className="text-gray-600">{cat.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Filter */}
            <div>
                <h3 className="font-bold text-gray-900 mb-4">Price Range</h3>
                <div className="flex items-center gap-2 mb-4">
                    <input
                        type="number"
                        placeholder="Min"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                    />
                    <span className="text-gray-400">-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
