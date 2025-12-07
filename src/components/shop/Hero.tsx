
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface Banner {
    _id: string;
    title: string;
    subtitle?: string;
    imageUrl: string;
    linkUrl?: string;
}

export default function Hero({ banners }: { banners: Banner[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-advance carousel
    useEffect(() => {
        if (banners.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners.length]);

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);

    // Fallback if no banners
    if (!banners || banners.length === 0) {
        return (
            <div className="relative bg-gray-50 h-[500px] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" alt="Hero" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left text-white">
                    <h1 className="text-4xl sm:text-6xl font-bold mb-4">Everyday Comfort.<br />Simple Prices.</h1>
                    <p className="text-lg sm:text-xl mb-8 max-w-lg">Discover our new collection of premium cottons and silk blends.</p>
                    <div className="flex gap-4 justify-center sm:justify-start">
                        <Link href="/shop?category=Men" className="px-8 py-3 bg-white text-black font-medium rounded hover:bg-gray-100">Shop Men</Link>
                        <Link href="/shop?category=Women" className="px-8 py-3 bg-transparent border border-white text-white font-medium rounded hover:bg-white/10">Shop Women</Link>
                    </div>
                </div>
            </div>
        );
    }

    const currentBanner = banners[currentIndex];

    return (
        <div className="relative bg-gray-50 h-[500px] sm:h-[600px] flex items-center overflow-hidden group">
            <div className="absolute inset-0 z-0 transition-opacity duration-1000">
                <div key={currentBanner._id} className="absolute inset-0">
                    <img
                        src={currentBanner.imageUrl}
                        alt={currentBanner.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left w-full">
                <h1 key={currentBanner._id + "title"} className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 animate-fade-in-up">
                    {currentBanner.title}
                </h1>
                {currentBanner.subtitle && (
                    <p key={currentBanner._id + "sub"} className="text-lg sm:text-xl text-gray-100 mb-8 max-w-lg animate-fade-in-up animation-delay-200">
                        {currentBanner.subtitle}
                    </p>
                )}
                {currentBanner.linkUrl && (
                    <Link
                        href={currentBanner.linkUrl}
                        className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-sm text-gray-900 bg-white hover:bg-gray-100 transition-all shadow-lg animate-fade-in-up animation-delay-400"
                    >
                        Shop Collection
                    </Link>
                )}
            </div>

            {/* Carousel Controls */}
            {banners.length > 1 && (
                <>
                    <button onClick={prevSlide} className="absolute left-4 z-20 p-2 bg-white/20 text-white rounded-full hover:bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowLeft size={24} />
                    </button>
                    <button onClick={nextSlide} className="absolute right-4 z-20 p-2 bg-white/20 text-white rounded-full hover:bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight size={24} />
                    </button>
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                        {banners.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? "bg-white w-6" : "bg-white/50"}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

