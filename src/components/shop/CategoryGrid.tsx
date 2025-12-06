import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
    {
        name: "Women's Collection",
        image: "https://placehold.co/600x800/png?text=Women",
        href: "/shop?category=Women",
        description: "Sarees, Lehengas, and more",
    },
    {
        name: "Men's Fashion",
        image: "https://placehold.co/600x800/png?text=Men",
        href: "/shop?category=Men",
        description: "Kurtas, Shirts, and Trousers",
    },
    {
        name: "Kids Wear",
        image: "https://placehold.co/600x800/png?text=Kids",
        href: "/shop?category=Kids",
        description: "Cute and comfortable outfits",
    },
];

export default function CategoryGrid() {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Browse through our wide range of curated collections for everyone.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.map((cat) => (
                        <Link
                            key={cat.name}
                            href={cat.href}
                            className="group relative h-96 overflow-hidden rounded-lg shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            <div className="absolute inset-0">
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                            </div>

                            <div className="absolute bottom-0 left-0 p-8 w-full text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-2xl font-bold mb-2">{cat.name}</h3>
                                <p className="text-gray-300 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                    {cat.description}
                                </p>
                                <span className="inline-flex items-center text-secondary font-medium group-hover:underline">
                                    Shop Now <ArrowRight size={16} className="ml-2" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
