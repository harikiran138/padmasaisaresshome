
"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { createCategory, updateCategory } from "@/app/actions/categories";

export default function CategoryForm({ initialData }: { initialData?: any }) {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        try {
            if (initialData?._id) {
                formData.set("id", initialData._id);
                await updateCategory(formData);
            } else {
                await createCategory(formData);
            }
        } catch (error) {
            alert("Failed to save category");
            setLoading(false);
        }
    }

    return (
        <form action={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-2xl">
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-black">Category Name</label>
                    <input type="text" name="name" defaultValue={initialData?.name} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-black" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-black">Slug</label>
                    <input type="text" name="slug" defaultValue={initialData?.slug} placeholder="Auto-generated if empty" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-black" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-black">Description</label>
                    <textarea name="description" defaultValue={initialData?.description} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-black"></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-black">Image</label>
                    <div className="mt-1 flex flex-col gap-4">
                        <input
                            type="text"
                            name="image"
                            defaultValue={initialData?.image}
                            placeholder="Image URL"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-black"
                        />
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">- OR -</span>
                        </div>
                        <input
                            type="file"
                            name="file"
                            accept="image/*"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                        />
                    </div>
                </div>

                <div className="flex items-center">
                    <input id="isActive" name="isActive" type="checkbox" defaultChecked={initialData?.isActive ?? true} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                    <label htmlFor="isActive" className="ml-2 block text-sm font-medium text-black">
                        Active (Visible)
                    </label>
                </div>

                <div className="pt-4">
                    <button type="submit" disabled={loading} className="w-full bg-primary text-white px-4 py-2 rounded-md font-bold hover:bg-primary/90 disabled:opacity-70 flex justify-center items-center">
                        {loading ? "Saving..." : <><Save size={18} className="mr-2" /> Save Category</>}
                    </button>
                </div>
            </div>
        </form>
    );
}
