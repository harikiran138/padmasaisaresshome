
import { getCategories, getProducts } from "@/app/actions/shop";
import ProductFilters from "@/components/shop/ProductFilters";
import ProductCard from "@/components/shop/ProductCard";
import SortDropdown from "@/components/shop/SortDropdown"; // We'll create this next

export default async function ShopPage(props: {
    searchParams: Promise<{ category?: string; minPrice?: string; maxPrice?: string; sort?: string; q?: string }>;
}) {
    const searchParams = await props.searchParams;

    const products = await getProducts({
        category: searchParams.category,
        minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
        maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
        sort: searchParams.sort,
        search: searchParams.q,
    });

    const categories = await getCategories();

    return (
        <div className="bg-white min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-8 border-b border-gray-100">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Shop</h1>
                        <p className="text-gray-500 mt-2">
                            {searchParams.category
                                ? `Showing results for ${searchParams.category}`
                                : "Explore our exclusive collection"}
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <SortDropdown />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Filters Sidebar */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <ProductFilters categories={categories} />
                    </aside>

                    {/* Product Grid */}
                    <div className="lg:col-span-3">
                        {products.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 rounded-lg">
                                <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
                                <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {products.map((p) => (
                                    <ProductCard key={p._id} product={p} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
