
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import Link from "next/link";
import { Plus, Edit2, Archive, Package, Search, Filter } from "lucide-react";
import { deleteProduct } from "@/app/actions/deleteProduct";

export default async function AdminProductsPage() {
    await connectToDatabase();
    
    // Fetch only non-deleted products
    const products = await Product.find({ deletedAt: { $exists: false } })
        .populate("category")
        .sort({ createdAt: -1 })
        .lean();

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Cinematic Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-black uppercase">
                        Collection Archives
                    </h1>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.4em] leading-relaxed">
                        Curating the boutique's digital inventory with precision
                    </p>
                </div>
                <Link 
                    href="/admin/products/add" 
                    className="bg-black text-white px-8 py-4 flex items-center gap-3 hover:bg-black/90 transition-all group shadow-xl shadow-black/10"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">New Acquisition</span>
                </Link>
            </div>

            {/* Utility Bar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    <input 
                        type="text" 
                        placeholder="SEARCH ARCHIVES BY NAME, BRAND, OR CATEGORY..." 
                        className="w-full bg-[#fafafa] border border-gray-100 pl-12 pr-4 py-4 text-[10px] font-black tracking-[0.1em] focus:outline-none focus:border-black transition-colors placeholder:text-gray-300"
                    />
                </div>
                <button className="bg-[#fafafa] border border-gray-100 px-6 py-4 flex items-center justify-center gap-2 hover:border-black transition-colors">
                    <Filter size={14} className="text-gray-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.1em]">Refine View</span>
                </button>
            </div>

            {/* Luxury Collection Table */}
            <div className="bg-white border border-gray-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 bg-[#fafafa]">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Masterpiece</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Curation</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Valuation</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Vault Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Visibility</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Protocol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <Package size={48} className="text-gray-100" />
                                            <div className="space-y-1">
                                                <p className="text-[11px] font-black text-gray-300 uppercase tracking-widest">Vault Currently Empty</p>
                                                <p className="text-[9px] font-bold text-gray-200 uppercase tracking-wider">Initiate your first acquisition to populate the archives</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product: any) => (
                                    <tr key={product._id.toString()} className="group hover:bg-[#fafafa] transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-20 bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100 group-hover:border-black transition-colors relative">
                                                    {product.images?.[0] ? (
                                                        <img 
                                                            src={product.images[0]} 
                                                            alt={product.name} 
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                                            <Package size={20} className="text-gray-200" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-xs font-black text-gray-900 uppercase tracking-tight leading-tight">
                                                        {product.name}
                                                    </div>
                                                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                                                        {product.brand || "Artisan Collection"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                {product.category?.name || "Uncategorized"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-xs font-black text-gray-900 tracking-tight">
                                                ₹{product.price.toLocaleString('en-IN')}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${
                                                    product.stock > 10 
                                                        ? 'bg-green-500' 
                                                        : product.stock > 0 
                                                        ? 'bg-amber-500 animate-pulse' 
                                                        : 'bg-red-500'
                                                }`} />
                                                <span className="text-[10px] font-black text-gray-600 tracking-tight">
                                                    {product.stock} {product.stock === 1 ? 'PIECE' : 'PIECES'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 inline-block ${
                                                product.isActive 
                                                    ? 'bg-green-50 text-green-700 border border-green-100' 
                                                    : 'bg-gray-50 text-gray-500 border border-gray-100'
                                            }`}>
                                                {product.isActive ? "LIVE" : "ARCHIVED"}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link 
                                                    href={`/admin/products/edit/${product._id.toString()}`} 
                                                    className="text-gray-300 hover:text-black transition-colors p-2"
                                                    title="Refine Masterpiece"
                                                >
                                                    <Edit2 size={16} />
                                                </Link>
                                                <form action={deleteProduct}>
                                                    <input type="hidden" name="id" value={product._id.toString()} />
                                                    <button 
                                                        type="submit" 
                                                        className="text-gray-300 hover:text-red-600 transition-colors p-2"
                                                        title="Dissolution Protocol"
                                                    >
                                                        <Archive size={16} />
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
