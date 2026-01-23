import Image from "next/image";
import connectToDatabase from "@/lib/db";
import Banner from "@/models/Banner";
import Link from "next/link";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

async function deleteBanner(formData: FormData) {
    "use server";
    const id = formData.get("id");
    await connectToDatabase();
    await Banner.findByIdAndDelete(id);
    revalidatePath("/admin/banners");
}

export default async function AdminBannersPage() {
    await connectToDatabase();
    const banners = await Banner.find().sort({ sortOrder: 1 });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Banners</h1>
                <Link href="/admin/banners/add" className="bg-primary text-white px-4 py-2 rounded-md flex items-center hover:bg-primary/90">
                    <Plus size={18} className="mr-2" />
                    Add Banner
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-sm font-medium text-gray-900">Title</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-900">Image</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-900">Link</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-900">Order</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-900">Status</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-900 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {banners.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                    No banners found. Create one.
                                </td>
                            </tr>
                        ) : (
                            banners.map((banner: any) => (
                                <tr key={banner._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        <div>{banner.title}</div>
                                        {banner.subtitle && <div className="text-xs text-gray-500">{banner.subtitle}</div>}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <Image
                                            src={banner.imageUrl}
                                            alt={banner.title}
                                            width={80}
                                            height={40}
                                            className="h-10 w-20 object-cover rounded"
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{banner.linkUrl}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{banner.sortOrder}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${banner.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {banner.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right flex justify-end gap-2">
                                        <form action={deleteBanner}>
                                            <input type="hidden" name="id" value={banner._id.toString()} />
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
