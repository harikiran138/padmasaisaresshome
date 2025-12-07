import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Product from "@/models/Product";
import bcrypt from "bcryptjs";
import Review from "@/models/Review";

export async function GET() {
    try {
        await connectToDatabase();

        // Clear existing data
        await User.deleteMany();
        await Product.deleteMany();
        await Review.deleteMany();

        // Create Admin User
        const hashedPassword = await bcrypt.hash("admin", 10);
        const adminUser = await User.create({
            name: "Admin User",
            email: "admin@admin.com",
            password: hashedPassword,
            role: "admin",
        });

        const demoUser = await User.create({
            name: "John Doe",
            email: "user@example.com",
            password: hashedPassword,
            role: "user",
        });

        // Create Products
        const products = [
            {
                name: "Kanjivaram Silk Saree",
                slug: "kanjivaram-silk-saree",
                description: "Authentic Kanjivaram silk saree with rich zari border. Perfect for weddings and festivals.",
                price: 12999,
                discountPrice: 10999,
                category: "Women",
                sizes: ["Free Size"],
                colors: ["Red", "Gold"],
                stock: 15,
                images: ["https://placehold.co/600x800/png?text=Saree+1"],
                isFeatured: true,
                isBestSeller: true,
            },
            {
                name: "Banarasi Georgette Saree",
                slug: "banarasi-georgette-saree",
                description: "Lightweight and elegant Georgette saree with Banarasi weave.",
                price: 5499,
                category: "Women",
                sizes: ["Free Size"],
                colors: ["Blue", "Silver"],
                stock: 25,
                images: ["https://placehold.co/600x800/png?text=Saree+2"],
                isFeatured: true,
            },
            {
                name: "Designer Embroidered Lehenga",
                slug: "designer-embroidered-lehenga",
                description: "Heavy embroidery lehenga choli set.",
                price: 15999,
                category: "Women",
                sizes: ["S", "M", "L"],
                colors: ["Pink"],
                stock: 5,
                images: ["https://placehold.co/600x800/png?text=Lehenga"],
            },
            {
                name: "Men's Cotton Kurta",
                slug: "mens-cotton-kurta",
                description: "Breathable cotton kurta for summer.",
                price: 999,
                category: "Men",
                sizes: ["S", "M", "L", "XL", "XXL"],
                colors: ["White", "Yellow"],
                stock: 50,
                images: ["https://placehold.co/600x800/png?text=Kurta"],
                isFeatured: true,
            },
            {
                name: "Slim Fit Denim Jeans",
                slug: "slim-fit-denim-jeans",
                description: "Premium washed denim jeans with stretch.",
                price: 1999,
                discountPrice: 1499,
                category: "Men",
                sizes: ["30", "32", "34", "36"],
                colors: ["Blue", "Black"],
                stock: 40,
                images: ["https://placehold.co/600x800/png?text=Jeans"],
                isBestSeller: true,
            },
            {
                name: "Formal White Shirt",
                slug: "formal-white-shirt",
                description: "Crisp white shirt for office wear.",
                price: 1299,
                category: "Men",
                sizes: ["S", "M", "L", "XL"],
                colors: ["White"],
                stock: 60,
                images: ["https://placehold.co/600x800/png?text=Shirt"],
            },
            {
                name: "Kids Party Wear Frock",
                slug: "kids-party-wear-frock",
                description: "Cute frock with floral patterns.",
                price: 1499,
                category: "Kids",
                sizes: ["2-3Y", "4-5Y", "6-7Y"],
                colors: ["Pink", "White"],
                stock: 30,
                images: ["https://placehold.co/600x800/png?text=Frock"],
                isFeatured: true,
            },
        ];

        const createdProducts = await Product.insertMany(products);

        // Generate Reviews
        let reviewCount = 0;
        for (const product of createdProducts) {
            const numReviews = Math.floor(Math.random() * 6); // 0-5 reviews
            if (numReviews > 0) {
                let totalRating = 0;
                for (let i = 0; i < numReviews; i++) {
                    const rating = Math.floor(Math.random() * 2) + 4; // 4 or 5 stars mostly
                    totalRating += rating;

                    await Review.create({
                        user: demoUser._id,
                        product: product._id,
                        name: demoUser.name,
                        rating: rating,
                        comment: "Great product! Really satisfied with the quality and delivery.",
                    });
                    reviewCount++;
                }

                product.numReviews = numReviews;
                product.averageRating = totalRating / numReviews;
                await product.save();
            }
        }

        // Add to Wishlist for Demo User
        if (createdProducts.length > 0) {
            const wishlistItems = createdProducts.slice(0, 3).map(p => p._id);
            await User.findByIdAndUpdate(demoUser._id, { wishlist: wishlistItems });
        }

        return NextResponse.json({
            message: "Database seeded successfully with Reviews & Wishlist",
            users: { admin: adminUser.email, user: demoUser.email },
            productCount: products.length,
            reviewCount,
        });
    } catch (error) {
        console.error("Seeding error:", error);
        return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
    }
}
