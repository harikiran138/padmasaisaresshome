
import { getProductBySlug, getProducts } from "@/app/actions/shop";
import { notFound } from "next/navigation";
import ProductImages from "@/components/shop/ProductImages";
import ProductInfo from "@/components/shop/ProductInfo";
import FeaturedProducts from "@/components/shop/FeaturedProducts";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const allRelated = await getProducts({ category: product.category?.slug });
    const relatedProducts = allRelated
        .filter((p: any) => p._id !== product._id)
        .slice(0, 4);

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
                    <div className="mb-0">
                        {/* We reuse the FeaturedProducts component structure but pass related items */}
                        <FeaturedProducts products={relatedProducts} />
                    </div>
                </div>
            </div>
        </div>
    );
}
