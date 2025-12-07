
import connectToDatabase from "@/lib/db";
import Category from "@/models/Category";
import CategoryForm from "@/components/admin/CategoryForm";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
    await connectToDatabase();
    const category = await Category.findById(params.id).lean();

    if (!category) {
        notFound();
    }

    const initialData = {
        _id: category._id.toString(),
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        isActive: category.isActive,
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-black">Edit Category</h1>
            <CategoryForm initialData={initialData} />
        </div>
    );
}
