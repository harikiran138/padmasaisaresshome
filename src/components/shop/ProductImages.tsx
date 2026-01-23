"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductImages({ images, name }: { images: string[]; name: string }) {
    const [mainImage, setMainImage] = useState(images[0] || "/placeholder.jpg");
    const [isZoomed, setIsZoomed] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setMousePos({ x, y });
    };

    return (
        <div className="flex flex-col-reverse lg:flex-row gap-6">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setMainImage(img)}
                        className={`group relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 transition-all duration-500 rounded-sm overflow-hidden ${
                            mainImage === img 
                            ? "ring-1 ring-primary ring-offset-2" 
                            : "opacity-60 hover:opacity-100 grayscale hover:grayscale-0"
                        }`}
                    >
                        <Image 
                            src={img} 
                            alt={`${name} thumbnail ${idx}`} 
                            fill
                            sizes="80px"
                            className="object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        {mainImage === img && (
                            <motion.div 
                                layoutId="active-thumb"
                                className="absolute inset-0 bg-primary/5 pointer-events-none"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Main Image Viewport */}
            <div 
                className="flex-1 rounded-sm overflow-hidden bg-gray-50 relative group cursor-crosshair border border-gray-100"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
            >
                <div className="aspect-[4/5] relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={mainImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                            className="absolute inset-0"
                        >
                            <Image 
                                src={mainImage} 
                                alt={name} 
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                                priority
                                className={`object-cover transition-transform duration-200 ease-out ${
                                    isZoomed ? "scale-150" : "scale-100"
                                }`}
                                style={isZoomed ? {
                                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`
                                } : undefined}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Luxury Overlay */}
                    <div className="absolute inset-0 pointer-events-none ring-1 ring-black/5 inset-px rounded-sm"></div>
                </div>

                {/* Badge if Discounted (Placeholder logic for now) */}
                <div className="absolute top-4 left-4 pointer-events-none">
                    <span className="bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 text-gray-900 shadow-sm border border-gray-100">
                        Heritage Collection
                    </span>
                </div>
            </div>
        </div>
    );
}
