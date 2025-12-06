import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import { redirect } from "next/navigation";

export default function AddProductPage() {
    async function createProduct(formData: FormData) {
        "use server";

        const name = formData.get("name") as string;
        const price = Number(formData.get("price"));
        const category = formData.get("category") as string;
        const description = formData.get("description") as string;
        const stock = Number(formData.get("stock"));
        const slug = name.toLowerCase().replace(/ /g, "-") + "-" + Date.now();
        const image = formData.get("image") as string || "https://placehold.co/600x800";

        await connectToDatabase();
        await Product.create({
            name,
            slug,
            price,
            category,
            description,
            stock,
            images: [image],
            sizes: ["S", "M", "L", "XL"], // Default for demo
            colors: ["Multi"],
        });

        redirect("/admin/products");
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

            <form action={createProduct} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input type="text" name="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                        <input type="number" name="price" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Stock</label>
                        <input type="number" name="stock" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select name="category" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm">
                        <option value="Women">Women</option>
                        <option value="Men">Men</option>
                        <option value="Kids">Kids</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input type="url" name="image" placeholder="https://..." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"></textarea>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-primary/90">
                        Create Product
                    </button>
                </div>
            </form>
        </div>
    );
}
