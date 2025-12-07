
import CategoryForm from "@/components/admin/CategoryForm";

export default function AddCategoryPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-black">Add New Category</h1>
            <CategoryForm />
        </div>
    );
}
