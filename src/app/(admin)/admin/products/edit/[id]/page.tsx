
import connectToDatabase from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";

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
    // Ensure deep cloning/cleaning of data to avoid "Plain Object" warnings
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
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-black">Edit Product</h1>
            <ProductForm categories={categories} initialData={initialData} />
        </div>
    );
}
