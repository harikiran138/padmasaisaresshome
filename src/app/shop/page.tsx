import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import ProductCard from "@/components/shop/ProductCard";
import FilterSidebar from "@/components/shop/FilterSidebar";

interface ShopPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };
}

export default async function ShopPage(props: ShopPageProps) {
    // Handle Next.js 15 async searchParams
    const searchParams = props.searchParams instanceof Promise
        ? await props.searchParams
        : await Promise.resolve(props.searchParams);

    await connectToDatabase();

    const query: Record<string, any> = {};

    // Category Filter
    if (searchParams.category) {
        query.category = searchParams.category;
    }

    // Search Filter
    if (searchParams.search) {
        const searchRegex = new RegExp(searchParams.search as string, "i");
        query.$or = [
            { name: searchRegex },
            { description: searchRegex },
            { category: searchRegex },
        ];
    }

    // Price Filter
    if (searchParams.minPrice || searchParams.maxPrice) {
        query.price = {};
        if (searchParams.minPrice) {
            query.price.$gte = Number(searchParams.minPrice);
        }
        if (searchParams.maxPrice) {
            query.price.$lte = Number(searchParams.maxPrice);
        }
    }

    // Sort Logic
    let sort: any = { createdAt: -1 }; // Default Newest
    if (searchParams.sort === "low_high") {
        sort = { price: 1 };
    } else if (searchParams.sort === "high_low") {
        sort = { price: -1 };
    } else if (searchParams.sort === "best_selling") {
        sort = { isBestSeller: -1 };
    }

    const products = await Product.find(query).sort(sort).lean();

    const serializedProducts = products.map((p: any) => ({
        ...p,
        _id: p._id.toString(),
        createdAt: p.createdAt?.toISOString(),
        updatedAt: p.updatedAt?.toISOString(),
    }));

    return (
        <div className="bg-white min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <FilterSidebar />
                    </aside>

                    {/* Product Grid */}
                    <main className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {searchParams.search
                                        ? `Search Results for "${searchParams.search}"`
                                        : searchParams.category
                                            ? `${searchParams.category} Collection`
                                            : "All Products"}
                                </h1>
                                <span className="text-gray-500 text-sm">
                                    {serializedProducts.length} Products
                                </span>
                        </div>

                        {serializedProducts.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 rounded-lg">
                                <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                                <a href="/shop" className="text-primary hover:underline mt-2 inline-block">Clear Filters</a>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {serializedProducts.map((p) => (
                                    <ProductCard key={p._id} product={p} />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
