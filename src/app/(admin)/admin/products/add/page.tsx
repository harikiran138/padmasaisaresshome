import connectToDatabase from "@/lib/db";
import Category from "@/models/Category";
import ProductForm from "@/components/admin/ProductForm";

export default async function AddProductPage() {
    await connectToDatabase();
    // Serialize to plain JSON to avoid "Only plain objects can be passed to Client Components"
    const categoriesDoc = await Category.find({ isActive: true }).select("name _id").sort({ name: 1 }).lean();
    const categories = categoriesDoc.map((c: any) => ({ _id: c._id.toString(), name: c.name }));

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Add New Product</h1>
            <ProductForm categories={categories} />
        </div>
    );
}
