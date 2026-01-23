
import connectToDatabase from "@/lib/db";
import Category from "@/models/Category";
import ProductForm from "@/components/admin/ProductForm";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

export default async function AddProductPage() {
    await connectToDatabase();
    
    // Fetch active categories for the curation form
    const categoriesDoc = await Category.find({ isActive: true }).select("name _id").sort({ name: 1 }).lean();
    const categories = categoriesDoc.map((c: any) => ({ 
        _id: c._id.toString(), 
        name: c.name 
    }));

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
                            NEW CURATION <Sparkles className="text-gray-200" size={32} />
                        </h1>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.4em] leading-relaxed">
                            Integrating a new masterpiece into the boutique's digital collection
                        </p>
                    </div>
                </div>
                
                <div className="hidden md:block">
                    <div className="px-6 py-3 border border-gray-100 bg-[#fafafa] flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Archive Protocol Active</span>
                    </div>
                </div>
            </div>

            {/* Acquisition Form Context */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-12">
                    <ProductForm categories={categories} />
                </div>
            </div>
        </div>
    );
}
