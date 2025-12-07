
import { getProductBySlug } from "@/app/actions/shop";
import { notFound } from "next/navigation";
import ProductImages from "@/components/shop/ProductImages";
import ProductInfo from "@/components/shop/ProductInfo";
import FeaturedProducts from "@/components/shop/FeaturedProducts";

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
    const product = await getProductBySlug(params.slug);

    if (!product) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Breadcrumb would go here */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    <ProductImages images={product.images || []} name={product.name} />
                    <ProductInfo product={product} />
                </div>

                {/* Related/Featured Products Section */}
                <div className="mt-24 border-t border-gray-100 pt-16">
                    {/* Reuse Featured Products component but maybe we want "Related" later */}
                    {/* For now, just showing some products to keep user engaged */}
                    <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
                    {/* We need to pass products to simplified FeaturedProducts if we reuse it, 
                         or fetching inside. Let's just create a quick wrapper or leave for next step. 
                         The implementation plan didn't strictly require "Related", but "Featured" is good.
                     */}
                </div>
            </div>
        </div>
    );
}
