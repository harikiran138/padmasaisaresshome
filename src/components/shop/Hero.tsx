import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <div className="relative bg-gray-50 h-[600px] flex items-center overflow-hidden">
            {/* Background Image Placeholder - In real app use Next Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://placehold.co/1920x800/png?text=Padma+Sai+Sarees+Home&font=playfair"
                    alt="Hero Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">
                    Refining Tradition, <br />
                    <span className="text-secondary">Redefining Style.</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-lg">
                    Explore our exclusive collection of sarees, kurtas, and modern ethnic wear for the whole family.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link
                        href="/shop?category=Women"
                        className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-sm text-white bg-primary hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
                    >
                        Shop Women
                    </Link>
                    <Link
                        href="/shop?category=Men"
                        className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-sm text-white hover:bg-white hover:text-gray-900 transition-all"
                    >
                        Shop Men
                    </Link>
                </div>
            </div>
        </div>
    );
}
