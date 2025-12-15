
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Banner from "@/models/Banner";
import Review from "@/models/Review";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        await connectToDatabase();

        // 1. Clear existing data
        await User.deleteMany();
        await Product.deleteMany();
        await Category.deleteMany();
        await Banner.deleteMany();
        await Review.deleteMany();

        // 2. Create Users
        const hashedPassword = await bcrypt.hash("password123", 10);
        const adminUser = await User.create({
            name: "Admin User",
            email: "admin@example.com",
            password: hashedPassword,
            role: "admin",
        });

        const demoUser = await User.create({
            name: "Test User",
            email: "test@example.com",
            password: hashedPassword,
            role: "customer",
            addresses: [
                {
                    fullName: "John Doe",
                    line1: "123 Main St",
                    city: "Hyderabad",
                    state: "Telangana",
                    pincode: "500081",
                    country: "India",
                    phone: "9876543210"
                }
            ]
        });

        // 3. Create Categories
        const categoriesData = [
            { name: "Sarees", slug: "sarees", description: "Elegant traditional sarees" },
            { name: "Lehengas", slug: "lehengas", description: "Wedding and party lehengas" },
            { name: "Kurtas", slug: "kurtas", description: "Comfortable daily wear kurtas" },
            { name: "Suits", slug: "suits", description: "Salwar suits and sets" },
            { name: "Accessories", slug: "accessories", description: "Dupattas, shawls and more" },
            { name: "Jewellery", slug: "jewellery", description: "Traditional jewellery" },
        ];
        const categories = await Category.insertMany(categoriesData);
        // Create a map for easy lookup
        const catMap: Record<string, any> = {};
        categories.forEach(c => { catMap[c.name] = c._id; });

        // 4. Create Banners
        await Banner.create([
            {
                title: "Festival Collection 2025",
                subtitle: "Flat 20% Off on Silk Sarees",
                imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200",
                linkUrl: "/shop?category=Sarees",
                isActive: true,
                sortOrder: 1
            },
            {
                title: "Wedding Season Special",
                subtitle: "Designer Lehengas starting ₹15,999",
                imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1200",
                linkUrl: "/shop?category=Lehengas",
                isActive: true,
                sortOrder: 2
            }
        ]);

        // 5. Create Products with Relations & Variants
        const productsData = [
            {
                name: "Kanjivaram Silk Saree - Royal Red",
                slug: "kanjivaram-silk-saree-royal-red",
                description: "Authentic Kanjivaram silk saree with rich zari border. Perfect for weddings and festivals. Handwoven by master weavers.",
                price: 12999,
                discountPrice: 10999,
                category: catMap["Sarees"],
                brand: "Kanjivaram Weaves",
                stock: 15,
                images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800"],
                isFeatured: true,
                isBestSeller: true,
                isActive: true,
                variants: [
                    { sku: "KANJ-RED-FS", size: "Free Size", color: "Red", stock: 15 }
                ],
                attributes: { Material: "Silk", Origin: "Kanchipuram", Occasion: "Wedding" }
            },
            {
                name: "Banarasi Georgette Saree - Midnight Blue",
                slug: "banarasi-georgette-saree-midnight-blue",
                description: "Lightweight and elegant Georgette saree with intricate Banarasi weave. Ideal for evening parties.",
                price: 5499,
                category: catMap["Sarees"],
                brand: "Banarasi Silk House",
                stock: 25,
                images: ["https://images.unsplash.com/photo-1595137453483-34e8f170f3f2?auto=format&fit=crop&q=80&w=800"],
                isFeatured: true,
                isActive: true,
                variants: [
                    { sku: "BAN-BLU-FS", size: "Free Size", color: "Blue", stock: 25 }
                ],
                attributes: { Material: "Georgette", Weave: "Banarasi" }
            },
            {
                name: "Designer Embroidered Lehenga - Pink",
                slug: "designer-embroidered-lehenga-pink",
                description: "Heavy embroidery lehenga choli set with matching dupatta. A stunning choice for bridesmaids.",
                price: 15999,
                category: catMap["Lehengas"],
                brand: "Desi Couture",
                stock: 5,
                images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800"],
                isActive: true,
                variants: [
                    { sku: "LEH-PNK-S", size: "S", color: "Pink", stock: 2 },
                    { sku: "LEH-PNK-M", size: "M", color: "Pink", stock: 2 },
                    { sku: "LEH-PNK-L", size: "L", color: "Pink", stock: 1 }
                ],
                attributes: { Material: "Silk Blend", Work: "Zari & Embroidery", Type: "Semi-Stitched" }
            },
            {
                name: "Handloom Cotton Kurta - White",
                slug: "handloom-cotton-kurta-white",
                description: "Breathable and comfortable handloom cotton kurta for summer. Classic fit.",
                price: 999,
                category: catMap["Kurtas"],
                brand: "Khadi India",
                stock: 50,
                images: ["https://images.unsplash.com/photo-1627581134267-3343d22b827e?auto=format&fit=crop&q=80&w=800"],
                isFeatured: true,
                isActive: true,
                variants: [
                    { sku: "KUR-WHT-S", size: "S", color: "White", stock: 10 },
                    { sku: "KUR-WHT-M", size: "M", color: "White", stock: 20 },
                    { sku: "KUR-WHT-L", size: "L", color: "White", stock: 20 }
                ],
                attributes: { Material: "Cotton", Sleeves: "Full", Neck: "Mandarin" }
            },
            {
                name: "Floral Anarkali Suit",
                slug: "floral-anarkali-suit",
                description: "Beautiful floral printed Anarkali suit with chiffon dupatta. Elegant and comfortable.",
                price: 2499,
                discountPrice: 1999,
                category: catMap["Suits"],
                brand: "Ethnic Vibes",
                stock: 20,
                images: ["https://images.unsplash.com/photo-1583391733958-842279c13ee0?auto=format&fit=crop&q=80&w=800"],
                isBestSeller: true,
                isActive: true,
                variants: [
                    { sku: "ANA-PCH-M", size: "M", color: "Peach", stock: 10 },
                    { sku: "ANA-PCH-L", size: "L", color: "Peach", stock: 10 }
                ],
                attributes: { Material: "Chiffon", Pattern: "Floral Print" }
            },
            {
                name: "Silk Dupatta - Multi Color",
                slug: "silk-dupatta-multi-color",
                description: "Pure silk dupatta with traditional prints to elevate your ethnic look.",
                price: 1299,
                category: catMap["Accessories"],
                brand: "Silk Route",
                stock: 60,
                images: ["https://images.unsplash.com/photo-1601659851610-86ec177dc5ef?auto=format&fit=crop&q=80&w=800"],
                isActive: true,
                variants: [
                    { sku: "DUP-MUL-FS", size: "Free Size", color: "Multi", stock: 60 }
                ],
                attributes: { Material: "Silk", Length: "2.5m" }
            },
            {
                name: "Traditional Temple Jewellery Set",
                slug: "traditional-temple-jewellery-set",
                description: "Gold-plated temple jewellery necklace and earring set. Intricate craftsmanship.",
                price: 1499,
                category: catMap["Jewellery"],
                brand: "Divine Ornaments",
                stock: 30,
                images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800"],
                isFeatured: true,
                isActive: true,
                variants: [
                    { sku: "JW-GLD-FS", size: "Free Size", color: "Gold", stock: 30 }
                ],
                attributes: { Material: "Gold Plated", Type: "Necklace Set" }
            },
        ];

        const createdProducts = await Product.insertMany(productsData);

        // 2a. Create Extra Users for Reviews
        const verifyUser = await User.create({
            name: "Verified Buyer",
            email: "buyer@example.com",
            password: hashedPassword,
            role: "customer"
        });
        const guestUser = await User.create({
            name: "Guest User",
            email: "guest@example.com",
            password: hashedPassword,
            role: "customer"
        });
        const reviewers = [demoUser, verifyUser, guestUser];

        // 6. Generate Reviews
        let reviewCount = 0;
        for (const product of createdProducts) {
            const numReviews = Math.floor(Math.random() * 3); // Max 3 reviews since we have 3 users
            if (numReviews > 0) {
                let totalRating = 0;
                // Shuffle reviewers for randomness
                const shuffledReviewers = [...reviewers].sort(() => 0.5 - Math.random());

                for (let i = 0; i < numReviews; i++) {
                    const reviewer = shuffledReviewers[i];
                    const rating = Math.floor(Math.random() * 2) + 4;
                    totalRating += rating;

                    await Review.create({
                        user: reviewer._id,
                        product: product._id,
                        name: reviewer.name,
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

        // 7. Add to Wishlist for Demo User
        if (createdProducts.length > 0) {
            const wishlistItems = createdProducts.slice(0, 3).map(p => p._id);
            await User.findByIdAndUpdate(demoUser._id, { wishlist: wishlistItems });
        }

        return NextResponse.json({
            message: "Database seeded successfully with Categories, Banners, Products (with Variants) & Reviews",
            users: { admin: adminUser.email, user: demoUser.email },
            productCount: productsData.length,
            categoryCount: categories.length,
        });
    } catch (error) {
        console.error("Seeding error:", error);
        return NextResponse.json({ error: "Failed to seed database: " + (error as Error).message }, { status: 500 });
    }
}
