
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Category {
    _id: string;
    name: string;
    slug: string;
    image?: string;
    description?: string;
}

export default function CategoryGrid({ categories }: { categories: Category[] }) {
    // If no categories from DB, use placeholders or empty state
    // But ideally we should have seeded categories.

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Browse through our wide range of curated collections.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.length > 0 ? categories.map((cat) => (
                        <Link
                            key={cat._id}
                            href={`/shop?category=${cat.slug}`}
                            className="group relative h-96 overflow-hidden rounded-lg shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            <div className="absolute inset-0">
                                <img
                                    src={cat.image || `https://placehold.co/600x800/png?text=${cat.name}`}
                                    alt={cat.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                            </div>

                            <div className="absolute bottom-0 left-0 p-8 w-full text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-2xl font-bold mb-2">{cat.name}</h3>
                                {cat.description && (
                                    <p className="text-gray-300 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        {cat.description}
                                    </p>
                                )}
                                <span className="inline-flex items-center text-secondary font-medium group-hover:underline">
                                    Shop Now <ArrowRight size={16} className="ml-2" />
                                </span>
                            </div>
                        </Link>
                    )) : (
                        <div className="col-span-3 text-center text-gray-500">No categories found.</div>
                    )}
                </div>
            </div>
        </section>
    );
}

