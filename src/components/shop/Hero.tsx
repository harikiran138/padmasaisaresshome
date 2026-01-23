
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Banner {
    _id: string;
    title: string;
    subtitle?: string;
    imageUrl: string;
    linkUrl?: string;
}

export default function Hero({ banners }: { banners: Banner[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    // Auto-advance carousel
    useEffect(() => {
        if (banners.length <= 1) return;
        const interval = setInterval(() => {
            setDirection(1);
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [banners.length]);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const nextSlide = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    if (!banners || banners.length === 0) {
        return (
            <div className="relative bg-gray-900 h-[500px] sm:h-[700px] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" alt="Hero" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl sm:text-6xl font-bold mb-4 text-white">Classic Elegance.<br /><span className="text-primary-light">Timeless Style.</span></h1>
                        <p className="text-lg sm:text-xl mb-8 max-w-lg text-gray-200">Exquisite sarees crafted for the modern woman who values tradition.</p>
                        <div className="flex gap-4">
                            <Link href="/shop" className="px-8 py-4 bg-white text-black font-bold rounded-sm hover:bg-gray-100 transition-all">Explore Collection</Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    const currentBanner = banners[currentIndex];

    return (
        <div className="relative bg-gray-900 h-[500px] sm:h-[700px] flex items-center overflow-hidden group">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.5 }
                    }}
                    className="absolute inset-0"
                >
                    <div className="relative w-full h-full">
                        <img
                            src={currentBanner.imageUrl}
                            alt={currentBanner.title}
                            className="w-full h-full object-cover scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <motion.div
                    key={currentIndex + "content"}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="max-w-2xl"
                >
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        {currentBanner.title}
                    </h1>
                    {currentBanner.subtitle && (
                        <p className="text-lg sm:text-xl text-gray-200 mb-10 leading-relaxed">
                            {currentBanner.subtitle}
                        </p>
                    )}
                    {currentBanner.linkUrl && (
                        <Link
                            href={currentBanner.linkUrl}
                            className="inline-flex items-center justify-center px-10 py-4 bg-white text-gray-900 text-lg font-bold rounded-sm hover:bg-primary hover:text-white transition-all duration-300 shadow-2xl"
                        >
                            Shop the Look
                        </Link>
                    )}
                </motion.div>
            </div>

            {/* Carousel Controls */}
            {banners.length > 1 && (
                <>
                    <button onClick={prevSlide} className="absolute left-4 z-20 p-3 bg-black/20 text-white rounded-full hover:bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-1/2 top-1/2">
                        <ArrowLeft size={28} />
                    </button>
                    <button onClick={nextSlide} className="absolute right-4 z-20 p-3 bg-black/20 text-white rounded-full hover:bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-1/2 top-1/2">
                        <ArrowRight size={28} />
                    </button>
                    
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 z-20">
                        {banners.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setDirection(idx > currentIndex ? 1 : -1);
                                    setCurrentIndex(idx);
                                }}
                                className="relative h-2 rounded-full overflow-hidden transition-all duration-500"
                                style={{ width: idx === currentIndex ? "48px" : "12px", backgroundColor: idx === currentIndex ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.3)" }}
                            >
                                {idx === currentIndex && (
                                    <motion.div 
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 8, ease: "linear" }}
                                        className="absolute inset-0 bg-primary"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}


