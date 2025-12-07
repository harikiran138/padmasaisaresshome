import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import ProductActions from "@/components/shop/ProductActions";
import ProductGallery from "@/components/shop/ProductGallery";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";

interface ProductPageProps {
    params: Promise<{ slug: string }> | { slug: string };
}

import Review from "@/models/Review";
import ProductReviews from "@/components/shop/ProductReviews";

// ... (keep imports)

export default async function ProductPage({ params }: ProductPageProps) {
    const resolvedParams = params instanceof Promise ? await params : await Promise.resolve(params); // Next.js 15
    const { slug } = resolvedParams;

    await connectToDatabase();
    const product = await Product.findOne({ slug }).lean();

    if (!product) {
        notFound();
    }

    // Fetch Reviews
    const reviews = await Review.find({ product: product._id }).sort({ createdAt: -1 }).lean();
    const serializedReviews = reviews.map((r: any) => ({
        ...r,
        _id: r._id.toString(),
        user: r.user.toString(),
        product: r.product.toString(),
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
    }));

    const serializedProduct = {
        ...product,
        _id: product._id.toString(),
        createdAt: (product.createdAt as Date)?.toISOString(),
        updatedAt: (product.updatedAt as Date)?.toISOString(),
    };

    return (
        <div className="bg-white min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Gallery */}
                    <div>
                        <ProductGallery images={serializedProduct.images || []} />
                    </div>

                    {/* Details */}
                    <div>
                        <nav className="text-sm text-gray-500 mb-4">
                            <a href="/" className="hover:text-primary">Home</a> /{" "}
                            <a href="/shop" className="hover:text-primary">Shop</a> /{" "}
                            <span className="text-gray-900">{serializedProduct.name}</span>
                        </nav>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
                            {serializedProduct.name}
                        </h1>

                        {/* Real Ratings */}
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="flex text-yellow-500">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={18}
                                        fill={star <= (serializedProduct.averageRating || 0) ? "currentColor" : "none"}
                                        className={star <= (serializedProduct.averageRating || 0) ? "" : "text-gray-300"}
                                    />
                                ))}
                            </div>
                            <span className="text-gray-500 text-sm">({serializedProduct.numReviews || 0} reviews)</span>
                        </div>

                        <ProductActions product={serializedProduct} />

                        <div className="mt-10 border-t border-gray-100 pt-10 space-y-6">
                            <div>
                                <h3 className="font-bold text-gray-900 mb-3">Description</h3>
                                <div className="prose prose-sm text-gray-600">
                                    <p>{serializedProduct.description}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-900 mb-3">Material & Care</h3>
                                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                                    <li>Premium quality fabric</li>
                                    <li>Machine wash cold, tumble dry low</li>
                                    <li>Do not bleach</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <ProductReviews productId={serializedProduct._id} reviews={serializedReviews} />
            </div>
        </div>
    );
}
