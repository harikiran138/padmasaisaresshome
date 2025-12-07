
"use client";

import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { updateProduct, createProduct } from "@/app/actions/products";

interface Category {
    _id: string;
    name: string;
}

interface ProductData {
    _id?: string;
    name: string;
    price: number;
    description: string;
    category: string;
    brand: string;
    stock: number;
    images: string[];
    isActive: boolean;
    variants: any[];
    attributes?: Record<string, string>;
}

export default function ProductForm({ categories, initialData }: { categories: Category[], initialData?: ProductData }) {
    const [variants, setVariants] = useState<any[]>(initialData?.variants || []);

    // Convert Map/Object to Array for attributes form
    const initialAttrs = initialData?.attributes
        ? Object.entries(initialData.attributes).map(([key, value]) => ({ key, value }))
        : [];

    const [attributes, setAttributes] = useState<{ key: string; value: string }[]>(initialAttrs);
    const [loading, setLoading] = useState(false);

    const addVariant = () => {
        setVariants([...variants, { sku: "", size: "", color: "", stock: 0, additionalPrice: 0 }]);
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const updateVariant = (index: number, field: string, value: any) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    const addAttribute = () => {
        setAttributes([...attributes, { key: "", value: "" }]);
    };

    const removeAttribute = (index: number) => {
        setAttributes(attributes.filter((_, i) => i !== index));
    };

    const updateAttribute = (index: number, field: "key" | "value", value: string) => {
        const newAttributes = [...attributes];
        newAttributes[index][field] = value;
        setAttributes(newAttributes);
    };

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        // Serialize variants and attributes to JSON
        formData.set("variants", JSON.stringify(variants));

        const attrMap: Record<string, string> = {};
        attributes.forEach(a => {
            if (a.key) attrMap[a.key] = a.value;
        });
        formData.set("attributes", JSON.stringify(attrMap));

        try {
            if (initialData?._id) {
                formData.set("id", initialData._id);
                await updateProduct(formData);
            } else {
                await createProduct(formData);
            }
        } catch (error) {
            alert("Failed to save product");
            setLoading(false);
        }
    }


    const preventNonNumeric = (e: React.KeyboardEvent) => {
        if (["e", "E", "+", "-"].includes(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <form action={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 text-black">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-black">Product Name</label>
                        <input type="text" name="name" defaultValue={initialData?.name} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-black" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black">Brand</label>
                        <input type="text" name="brand" defaultValue={initialData?.brand} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-black" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black">Category</label>
                        <select name="category" defaultValue={initialData?.category} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-black">
                            <option value="">Select Category</option>
                            {categories.map((c) => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-black">Description</label>
                        <textarea name="description" defaultValue={initialData?.description} required rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-black"></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black">Main Image</label>
                        <div className="mt-1 flex flex-col gap-4">
                            <input
                                type="url"
                                name="image"
                                defaultValue={initialData?.images?.[0]}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-black"
                                placeholder="https://..."
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

                    <div className="flex items-center pt-6">
                        <input id="isActive" name="isActive" type="checkbox" defaultChecked={initialData?.isActive ?? true} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                        <label htmlFor="isActive" className="ml-2 block text-sm font-medium text-black">
                            Active (Visible)
                        </label>
                    </div>
                </div>
            </div>

            {/* Pricing & Stock */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 text-black">Pricing & Base Stock</h2>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-black">Base Price (₹)</label>
                        <input
                            type="number"
                            name="price"
                            defaultValue={initialData?.price}
                            required
                            min="0"
                            onKeyDown={preventNonNumeric}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-black"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-black">Total Stock</label>
                        <input
                            type="number"
                            name="stock"
                            defaultValue={initialData?.stock}
                            required
                            min="0"
                            onKeyDown={preventNonNumeric}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-black"
                            placeholder="Overall stock if no variants"
                        />
                    </div>
                </div>
            </div>

            {/* Variants */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-black">Variants (Size/Color)</h2>
                    <button type="button" onClick={addVariant} className="text-sm bg-gray-100 text-black px-3 py-1.5 rounded-md hover:bg-gray-200 border border-gray-300 flex items-center">
                        <Plus size={16} className="mr-1" /> Add Variant
                    </button>
                </div>

                {variants.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No variants added. Product will effectively be "Free Size" / "One Color".</p>
                ) : (
                    <div className="space-y-3">
                        {variants.map((v, i) => (
                            <div key={i} className="flex gap-4 items-end p-4 bg-gray-50 rounded border border-gray-200">
                                <div>
                                    <label className="block text-xs font-medium text-black">Size</label>
                                    <input type="text" value={v.size} onChange={(e) => updateVariant(i, 'size', e.target.value)} placeholder="S, M..." className="w-20 px-2 py-1 border rounded text-sm text-black" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-black">Color</label>
                                    <input type="text" value={v.color} onChange={(e) => updateVariant(i, 'color', e.target.value)} placeholder="Red..." className="w-24 px-2 py-1 border rounded text-sm text-black" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-black">Stock</label>
                                    <input
                                        type="number"
                                        value={v.stock}
                                        min="0"
                                        onKeyDown={preventNonNumeric}
                                        onChange={(e) => updateVariant(i, 'stock', Number(e.target.value))}
                                        className="w-20 px-2 py-1 border rounded text-sm text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-black">Extra ₹</label>
                                    <input
                                        type="number"
                                        value={v.additionalPrice}
                                        min="0"
                                        onKeyDown={preventNonNumeric}
                                        onChange={(e) => updateVariant(i, 'additionalPrice', Number(e.target.value))}
                                        className="w-20 px-2 py-1 border rounded text-sm text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-black">SKU</label>
                                    <input type="text" value={v.sku} onChange={(e) => updateVariant(i, 'sku', e.target.value)} placeholder="Unique ID" className="w-32 px-2 py-1 border rounded text-sm text-black" />
                                </div>
                                <button type="button" onClick={() => removeVariant(i)} className="text-red-500 hover:text-red-700 p-2">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Dynamic Attributes */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-black">Specifications / Attributes</h2>
                    <button type="button" onClick={addAttribute} className="text-sm bg-gray-100 text-black px-3 py-1.5 rounded-md hover:bg-gray-200 border border-gray-300 flex items-center">
                        <Plus size={16} className="mr-1" /> Add Attribute
                    </button>
                </div>

                {attributes.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No Key-Value attributes added.</p>
                ) : (
                    <div className="space-y-3">
                        {attributes.map((attr, i) => (
                            <div key={i} className="flex gap-4 items-center">
                                <input type="text" value={attr.key} onChange={(e) => updateAttribute(i, 'key', e.target.value)} placeholder="Key (e.g. Material)" className="flex-1 px-3 py-2 border rounded text-sm text-black" />
                                <span className="text-gray-400">:</span>
                                <input type="text" value={attr.value} onChange={(e) => updateAttribute(i, 'value', e.target.value)} placeholder="Value (e.g. Cotton)" className="flex-1 px-3 py-2 border rounded text-sm text-black" />
                                <button type="button" onClick={() => removeAttribute(i)} className="text-red-500 hover:text-red-700">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-end pt-4 pb-12">
                <button type="submit" disabled={loading} className="bg-primary text-white px-8 py-3 rounded-md font-bold flex items-center hover:bg-primary/90 disabled:opacity-70">
                    {loading ? "Saving..." : <><Save size={18} className="mr-2" /> Save Product</>}
                </button>
            </div>
        </form>
    );

}
