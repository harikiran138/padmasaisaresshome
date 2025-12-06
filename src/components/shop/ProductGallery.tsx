"use client";

import { useState } from "react";

interface ProductGalleryProps {
    images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
    const [activeImage, setActiveImage] = useState(images && images.length > 0 ? images[0] : "/placeholder.jpg");

    if (!images || images.length === 0) {
        return (
            <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                <img src="/placeholder.jpg" alt="Product" className="w-full h-full object-cover" />
            </div>
        )
    }

    return (
        <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveImage(img)}
                        className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 ${activeImage === img ? "border-primary" : "border-transparent"
                            }`}
                    >
                        <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden relative group">
                <img
                    src={activeImage}
                    alt="Product Main"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110 cursor-zoom-in"
                />
            </div>
        </div>
    );
}
