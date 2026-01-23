
"use client";

import { useState } from "react";
import { Plus, Trash2, Save, Image as ImageIcon, Briefcase, Ruler, ListTree, ChevronRight } from "lucide-react";
import { updateProduct, createProduct } from "@/app/actions/products";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/providers/ToastProvider";

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

type TabType = "BASICS" | "MEDIA" | "INVENTORY" | "SPECIFICATIONS";

export default function ProductForm({ categories, initialData }: { categories: Category[], initialData?: ProductData }) {
    const [activeTab, setActiveTab] = useState<TabType>("BASICS");
    const [variants, setVariants] = useState<any[]>(initialData?.variants || []);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    // Attributes management
    const initialAttrs = initialData?.attributes
        ? Object.entries(initialData.attributes).map(([key, value]) => ({ key, value }))
        : [];
    const [attributes, setAttributes] = useState<{ key: string; value: string }[]>(initialAttrs);

    const tabs: { id: TabType; icon: any; label: string }[] = [
        { id: "BASICS", icon: Briefcase, label: "Core Details" },
        { id: "MEDIA", icon: ImageIcon, label: "Visuals" },
        { id: "INVENTORY", icon: Ruler, label: "Archives & Variants" },
        { id: "SPECIFICATIONS", icon: ListTree, label: "Specifications" },
    ];

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
        formData.set("variants", JSON.stringify(variants));
        const attrMap: Record<string, string> = {};
        attributes.forEach(a => { if (a.key) attrMap[a.key] = a.value; });
        formData.set("attributes", JSON.stringify(attrMap));

        try {
            if (initialData?._id) {
                formData.set("id", initialData._id);
                await updateProduct(formData);
                showToast("success", "Collection Updated", "The masterpiece has been successfully refined.");
            } else {
                await createProduct(formData);
                showToast("success", "Boutique Expanded", "New acquisition successfully integrated into the collection.");
            }
        } catch (error) {
            showToast("error", "Operational Failure", "Could not sync changes to the boutique archives.");
        } finally {
            setLoading(false);
        }
    }

    const FormRow = ({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) => (
        <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
        </div>
    );

    return (
        <form action={handleSubmit} className="bg-white border border-gray-100 shadow-xl overflow-hidden min-h-[600px] flex flex-col">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-100 bg-[#fafafa]">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-5 border-b-2 transition-all duration-300 ${
                            activeTab === tab.id 
                            ? "border-black bg-white" 
                            : "border-transparent text-gray-400 hover:text-black grayscale hover:grayscale-0"
                        }`}
                    >
                        <tab.icon size={14} className={activeTab === tab.id ? "text-black" : "text-gray-300"} />
                        <span className="text-[10px] font-black uppercase tracking-[0.15em]">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Form Content */}
            <div className="flex-1 p-8 lg:p-12 relative">
                <AnimatePresence mode="wait">
                    {activeTab === "BASICS" && (
                        <motion.div
                            key="basics"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="col-span-2">
                                    <FormRow label="Identifier / Name" required>
                                        <input type="text" name="name" defaultValue={initialData?.name} required className="w-full bg-[#fafafa] border border-gray-100 text-[11px] font-black uppercase tracking-widest px-4 py-3 focus:outline-none focus:border-black transition-colors" />
                                    </FormRow>
                                </div>
                                <FormRow label="Boutique / Brand">
                                    <input type="text" name="brand" defaultValue={initialData?.brand} className="w-full bg-[#fafafa] border border-gray-100 text-[11px] font-black uppercase tracking-widest px-4 py-3 focus:outline-none focus:border-black transition-colors" />
                                </FormRow>
                                <FormRow label="Curation / Category" required>
                                    <select name="category" defaultValue={initialData?.category} required className="w-full appearance-none bg-[#fafafa] border border-gray-100 text-[11px] font-black uppercase tracking-widest px-4 py-3 focus:outline-none focus:border-black transition-colors cursor-pointer">
                                        <option value="">Select Category</option>
                                        {categories.map((c) => (
                                            <option key={c._id} value={c._id}>{c.name}</option>
                                        ))}
                                    </select>
                                </FormRow>
                                <div className="col-span-2">
                                    <FormRow label="Boutique Narrative / Description" required>
                                        <textarea name="description" defaultValue={initialData?.description} required rows={5} className="w-full bg-[#fafafa] border border-gray-100 text-[11px] font-bold px-4 py-3 focus:outline-none focus:border-black transition-colors resize-none leading-relaxed" />
                                    </FormRow>
                                </div>
                                <div className="col-span-2 py-4 flex items-center gap-4">
                                    <input id="isActive" name="isActive" type="checkbox" defaultChecked={initialData?.isActive ?? true} className="w-4 h-4 rounded-none border-gray-100 text-black focus:ring-black cursor-pointer" />
                                    <label htmlFor="isActive" className="text-[10px] font-black text-black uppercase tracking-[0.2em] cursor-pointer">Archive Visibility (Active in Boutique)</label>
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <button type="button" onClick={() => setActiveTab("MEDIA")} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:translate-x-1 transition-transform group">
                                    Visuals Orchestration <ChevronRight size={14} className="group-hover:text-primary transition-colors" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "MEDIA" && (
                        <motion.div
                            key="media"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-8"
                        >
                            <div className="space-y-6">
                                <FormRow label="Primary Silhouette / Image URL">
                                    <input type="url" name="image" defaultValue={initialData?.images?.[0]} placeholder="https://..." className="w-full bg-[#fafafa] border border-gray-100 text-[11px] font-bold px-4 py-3 focus:outline-none focus:border-black transition-colors" />
                                </FormRow>
                                <div className="p-8 border-2 border-dashed border-gray-100 flex flex-col items-center gap-4 bg-[#fafafa]/50">
                                    <ImageIcon size={32} className="text-gray-200" />
                                    <div className="text-center">
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Internal Digital Capture</div>
                                        <input type="file" name="file" accept="image/*" className="block w-full text-[10px] text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-[9px] file:font-black file:bg-black file:text-white hover:file:bg-black/80 cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between pt-4">
                                <button type="button" onClick={() => setActiveTab("BASICS")} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:-translate-x-1 transition-transform group opacity-50 hover:opacity-100">
                                    Back to Details
                                </button>
                                <button type="button" onClick={() => setActiveTab("INVENTORY")} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:translate-x-1 transition-transform group">
                                    Archives & Variants <ChevronRight size={14} className="group-hover:text-primary transition-colors" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "INVENTORY" && (
                        <motion.div
                            key="inventory"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-2 gap-8">
                                <FormRow label="Base Valuation / Price (₹)" required>
                                    <input type="number" name="price" defaultValue={initialData?.price} required min="0" className="w-full bg-[#fafafa] border border-gray-100 text-[11px] font-black px-4 py-3 focus:outline-none focus:border-black transition-colors" />
                                </FormRow>
                                <FormRow label="Aggregate Stock / Total" required>
                                    <input type="number" name="stock" defaultValue={initialData?.stock} required min="0" className="w-full bg-[#fafafa] border border-gray-100 text-[11px] font-black px-4 py-3 focus:outline-none focus:border-black transition-colors" />
                                </FormRow>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Acquisition Variants</h3>
                                    <button type="button" onClick={addVariant} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors">
                                        <Plus size={12} /> Add Variant
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {variants.map((v, i) => (
                                        <div key={i} className="flex flex-wrap gap-4 items-end p-6 bg-[#fafafa] border border-gray-100 group relative">
                                            <div className="flex-1 min-w-[100px]">
                                                <FormRow label="Scale / Size">
                                                    <input type="text" value={v.size} onChange={(e) => updateVariant(i, 'size', e.target.value)} placeholder="S, M..." className="w-full bg-white border border-gray-100 text-[10px] font-black uppercase px-3 py-2 focus:outline-none focus:border-black" />
                                                </FormRow>
                                            </div>
                                            <div className="flex-1 min-w-[100px]">
                                                <FormRow label="Hue / Color">
                                                    <input type="text" value={v.color} onChange={(e) => updateVariant(i, 'color', e.target.value)} placeholder="Rose..." className="w-full bg-white border border-gray-100 text-[10px] font-black uppercase px-3 py-2 focus:outline-none focus:border-black" />
                                                </FormRow>
                                            </div>
                                            <div className="w-24">
                                                <FormRow label="Inventory">
                                                    <input type="number" value={v.stock} min="0" onChange={(e) => updateVariant(i, 'stock', Number(e.target.value))} className="w-full bg-white border border-gray-100 text-[10px] font-black px-3 py-2 focus:outline-none focus:border-black" />
                                                </FormRow>
                                            </div>
                                            <div className="w-24">
                                                <FormRow label="Premium (₹)">
                                                    <input type="number" value={v.additionalPrice} min="0" onChange={(e) => updateVariant(i, 'additionalPrice', Number(e.target.value))} className="w-full bg-white border border-gray-100 text-[10px] font-black px-3 py-2 focus:outline-none focus:border-black" />
                                                </FormRow>
                                            </div>
                                            <button type="button" onClick={() => removeVariant(i)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {variants.length === 0 && (
                                        <div className="py-8 text-center border border-dashed border-gray-100 bg-[#fafafa]/50">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Standard Silhouette (No Variants)</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between pt-4">
                                <button type="button" onClick={() => setActiveTab("MEDIA")} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:-translate-x-1 transition-transform group opacity-50 hover:opacity-100">
                                    Back to Visuals
                                </button>
                                <button type="button" onClick={() => setActiveTab("SPECIFICATIONS")} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:translate-x-1 transition-transform group">
                                    Specifications <ChevronRight size={14} className="group-hover:text-primary transition-colors" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "SPECIFICATIONS" && (
                        <motion.div
                            key="specifications"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-8"
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Technical Characteristics</h3>
                                    <button type="button" onClick={addAttribute} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors">
                                        <Plus size={12} /> Add Characteristic
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {attributes.map((attr, i) => (
                                        <div key={i} className="flex gap-4 items-center bg-[#fafafa] border border-gray-100 p-4">
                                            <input type="text" value={attr.key} onChange={(e) => updateAttribute(i, 'key', e.target.value)} placeholder="Aspect (e.g. Weave)" className="flex-1 bg-white border border-gray-100 text-[10px] font-black uppercase px-4 py-2 focus:outline-none focus:border-black" />
                                            <span className="text-gray-300 font-black tracking-widest">:</span>
                                            <input type="text" value={attr.value} onChange={(e) => updateAttribute(i, 'value', e.target.value)} placeholder="Detail (e.g. Jacquard)" className="flex-1 bg-white border border-gray-100 text-[10px] font-black uppercase px-4 py-2 focus:outline-none focus:border-black" />
                                            <button type="button" onClick={() => removeAttribute(i)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {attributes.length === 0 && (
                                        <div className="py-8 text-center border border-dashed border-gray-100 bg-[#fafafa]/50">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Standard Specifications Only</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between pt-12">
                                <button type="button" onClick={() => setActiveTab("INVENTORY")} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:-translate-x-1 transition-transform group opacity-50 hover:opacity-100">
                                    Back to Archives
                                </button>
                                <button type="submit" disabled={loading} className="px-12 py-4 bg-black text-white text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-black/90 disabled:opacity-50 transition-all shadow-xl shadow-black/10">
                                    {loading ? "ARCHIVING..." : <><Save size={16} /> Finalize Acquisition</>}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </form>
    );
}
