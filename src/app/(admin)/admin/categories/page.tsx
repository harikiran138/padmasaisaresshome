
import connectToDatabase from "@/lib/db";
import Category from "@/models/Category";
import Link from "next/link";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

async function deleteCategory(formData: FormData) {
    "use server";
    const id = formData.get("id");
    await connectToDatabase();
    await Category.findByIdAndDelete(id);
    revalidatePath("/admin/categories");
}

export default async function AdminCategoriesPage() {
    await connectToDatabase();
    const categories = await Category.find().sort({ createdAt: -1 });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                <Link href="/admin/categories/add" className="bg-primary text-white px-4 py-2 rounded-md flex items-center hover:bg-primary/90">
                    <Plus size={18} className="mr-2" />
                    Add Category
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-sm font-medium text-gray-900">Name</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-900">Slug</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-900">Description</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-900">Status</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-900 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    No categories found. Create one to get started.
                                </td>
                            </tr>
                        ) : (
                            categories.map((category: any) => (
                                <tr key={category._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{category.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{category.slug}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{category.description || "-"}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {category.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right flex justify-end gap-2">
                                        <Link href={`/admin/categories/edit/${category._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
                                            <Edit2 size={16} />
                                        </Link>
                                        <form action={deleteCategory}>
                                            <input type="hidden" name="id" value={category._id.toString()} />
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
    );
}
