
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Link from "next/link";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

async function deleteProduct(formData: FormData) {
    "use server";
    const id = formData.get("id");
    await connectToDatabase();
    await Product.findByIdAndDelete(id);
    revalidatePath("/admin/products");
}

export default async function AdminProductsPage() {
    await connectToDatabase();
    const products = await Product.find().populate("category").sort({ createdAt: -1 });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <Link href="/admin/products/add" className="bg-primary text-white px-4 py-2 rounded-md flex items-center hover:bg-primary/90">
                    <Plus size={18} className="mr-2" />
                    Add Product
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-sm font-medium text-gray-900">Product</th>
                                <th className="px-6 py-3 text-sm font-medium text-gray-900">Category</th>
                                <th className="px-6 py-3 text-sm font-medium text-gray-900">Price</th>
                                <th className="px-6 py-3 text-sm font-medium text-gray-900">Stock</th>
                                <th className="px-6 py-3 text-sm font-medium text-gray-900">Status</th>
                                <th className="px-6 py-3 text-sm font-medium text-gray-900 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product: any) => (
                                    <tr key={product._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <img src={product.images[0]} alt={product.name} className="h-10 w-10 rounded object-cover mr-3" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                    <div className="text-xs text-gray-500">{product.brand}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {product.category?.name || "Uncategorized"}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            ₹{product.price.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {product.stock}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {product.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right flex justify-end gap-2">
                                            <Link href={`/admin/products/edit/${product._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
                                                <Edit2 size={16} />
                                            </Link>
                                            <form action={deleteProduct}>
                                                <input type="hidden" name="id" value={product._id.toString()} />
                                                <button type="submit" className="p-2 text-red-600 hover:bg-red-50 rounded-full">
                                                    <Trash2 size={16} />
                                                </button>
                                            </form>
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
