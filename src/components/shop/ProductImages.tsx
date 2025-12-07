
"use client";

import { useState } from "react";

export default function ProductImages({ images, name }: { images: string[]; name: string }) {
    const [mainImage, setMainImage] = useState(images[0] || "/placeholder.jpg");

    return (
        <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setMainImage(img)}
                        className={`border-2 rounded-md overflow-hidden min-w-[60px] w-16 h-16 md:w-20 md:h-20 flex-shrink-0 ${mainImage === img ? "border-primary" : "border-gray-200 hover:border-gray-300"}`}
                    >
                        <img src={img} alt={`${name} thumb ${idx}`} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 aspect-[3/4] md:aspect-[4/5] bg-gray-50 rounded-lg overflow-hidden border border-gray-100 relative">
                <img src={mainImage} alt={name} className="w-full h-full object-cover" />
            </div>
        </div>
    );
}
