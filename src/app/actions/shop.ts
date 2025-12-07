
"use server";

import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Banner from "@/models/Banner";

export async function getFeaturedProducts() {
    await connectToDatabase();
    // Assuming 'isFeatured' or just grabbing latest/random for now if no featured flag
    // The user mentioned "Featured products (best-sellers, new)"
    // We added isFeatured in seed, let's try to use that, or fallback to latest
    const products = await Product.find({ isActive: true }) // Add { isFeatured: true } if schema has it, or just limit
        .sort({ createdAt: -1 })
        .limit(8)
        .populate("category", "slug name")
        .lean();

    return products.map(p => ({
        ...p,
        _id: p._id.toString(),
        category: p.category ? { ...p.category, _id: p.category._id.toString() } : null,
    }));
}

export async function getCategories() {
    await connectToDatabase();
    const categories = await Category.find({ isActive: true })
        .sort({ name: 1 })
        .lean();

    return categories.map(c => ({
        ...c,
        _id: c._id.toString(),
    }));
}

export async function getBanners() {
    await connectToDatabase();
    const banners = await Banner.find({ isActive: true })
        .sort({ sortOrder: 1 })
        .lean();

    return banners.map(b => ({
        ...b,
        _id: b._id.toString(),
    }));
}

export async function getProducts({
    category,
    minPrice,
    maxPrice,
    sort,
    search
}: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    search?: string;
}) {
    await connectToDatabase();

    const query: any = { isActive: true };

    if (category) {
        // Find category ID by slug
        const categoryDoc = await Category.findOne({ slug: category });
        if (categoryDoc) {
            query.category = categoryDoc._id;
        }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        query.price = {};
        if (minPrice !== undefined) query.price.$gte = minPrice;
        if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }

    let sortOption: any = { createdAt: -1 }; // Default: Newest

    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "newest") sortOption = { createdAt: -1 };

    const products = await Product.find(query)
        .sort(sortOption)
        .populate("category", "slug name")
        .lean();

    return products.map(p => ({
        ...p,
        _id: p._id.toString(),
        category: p.category ? { ...p.category, _id: p.category._id.toString() } : null,
        createdAt: p.createdAt?.toISOString(),
        updatedAt: p.updatedAt?.toISOString(),
    }));
}

export async function getProductBySlug(slug: string) {
    await connectToDatabase();
    const product = await Product.findOne({ slug, isActive: true })
        .populate("category", "name slug")
        .lean();

    if (!product) return null;

    return {
        ...product,
        _id: product._id.toString(),
        category: product.category ? { ...product.category, _id: product.category._id.toString() } : null,
        createdAt: product.createdAt?.toISOString(),
        updatedAt: product.updatedAt?.toISOString(),
    };
}
