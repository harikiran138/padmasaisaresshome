import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import ProductCard from "./ProductCard";

export default async function FeaturedProducts() {
    await connectToDatabase();
    // Fetch featured products
    const products = await Product.find({ isFeatured: true }).limit(4).lean();

    const serializedProducts = products.map((p: any) => ({
        ...p,
        _id: p._id.toString(),
        createdAt: p.createdAt?.toISOString(),
        updatedAt: p.updatedAt?.toISOString(),
    }));

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 text-center sm:text-left">New Arrivals</h2>
                        <div className="h-1 w-20 bg-secondary mt-2 rounded-full mx-auto sm:mx-0"></div>
                    </div>
                    <a href="/shop?sort=newest" className="hidden sm:block text-secondary font-medium hover:underline">
                        View All &rarr;
                    </a>
                </div>

                {serializedProducts.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        No products found. Please seed the database.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {serializedProducts.map((p) => (
                            <ProductCard key={p._id} product={p} />
                        ))}
                    </div>
                )}

                <div className="mt-8 text-center sm:hidden">
                    <a href="/shop?sort=newest" className="text-secondary font-medium hover:underline">
                        View All &rarr;
                    </a>
                </div>
            </div>
        </section>
    );
}
