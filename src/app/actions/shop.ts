"use server";

import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Banner from "@/models/Banner";

export async function getBanners() {
  await connectToDatabase();
  try {
      const banners = await Banner.find({ isActive: true }).sort({ sortOrder: 1 }).lean();
      return JSON.parse(JSON.stringify(banners));
  } catch (error) {
      console.error("Error fetching banners:", error);
      return [];
  }
}

export async function getCategories() {
  await connectToDatabase();
  try {
      const categories = await Category.find({ isActive: true }).sort({ name: 1 }).lean();
      return JSON.parse(JSON.stringify(categories));
  } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
  }
}

export async function getFeaturedProducts() {
  await connectToDatabase();
  try {
      const products = await Product.find({ isActive: true, isFeatured: true })
        .populate("category")
        .sort({ createdAt: -1 })
        .limit(8)
        .lean();

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
      console.error("Error fetching featured products:", error);
      return [];
  }
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

    try {
        const products = await Product.find(query)
            .sort(sortOption)
            .populate("category", "slug name")
            .lean();

        return JSON.parse(JSON.stringify(products));
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

export async function getProductBySlug(slug: string) {
    await connectToDatabase();
    try {
        const product = await Product.findOne({ slug, isActive: true })
            .populate("category", "name slug")
            .lean();

        if (!product) return null;

        return JSON.parse(JSON.stringify(product));
    } catch (error) {
        console.error("Error fetching product by slug:", error);
        return null;
    }
}
