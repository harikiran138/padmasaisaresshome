
import connectToDatabase from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";
import { ArrowLeft, History } from "lucide-react";
import Link from "next/link";

export default async function EditProductPage({ params }: { params: { id: string } }) {
    await connectToDatabase();

    // Fetch Categories
    const categoriesDoc = await Category.find({ isActive: true }).select("name _id").sort({ name: 1 }).lean();
    const categories = categoriesDoc.map((c: any) => ({ _id: c._id.toString(), name: c.name }));

    // Fetch Product
    const product = await Product.findById(params.id).lean();

    if (!product) {
        notFound();
    }

    // Serialize product for Client Component
    const initialData = {
        _id: product._id.toString(),
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category.toString(),
        brand: product.brand,
        stock: product.stock,
        images: product.images,
        isActive: product.isActive,
        variants: product.variants ? product.variants.map((v: any) => ({
            sku: v.sku || "",
            size: v.size || "",
            color: v.color || "",
            additionalPrice: v.additionalPrice || 0,
            stock: v.stock || 0
        })) : [],
        attributes: product.attributes ? JSON.parse(JSON.stringify(product.attributes)) : {}
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Cinematic Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-12">
                <div className="space-y-4">
                    <Link 
                        href="/admin/products" 
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors group"
                    >
                        <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                        Return to Archives
                    </Link>
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-black flex items-center gap-4">
                            REFINE MASTERPIECE <History className="text-gray-200" size={32} />
                        </h1>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.4em] leading-relaxed">
                            Amneding the details of an existing collection piece
                        </p>
                    </div>
                </div>
                
                <div className="hidden md:block">
                    <div className="px-6 py-3 border border-gray-100 bg-[#fafafa] flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Vault Editor: {initialData.name.slice(0, 20)}...</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-12">
                    <ProductForm categories={categories} initialData={initialData} />
                </div>
            </div>
        </div>
    );
}
