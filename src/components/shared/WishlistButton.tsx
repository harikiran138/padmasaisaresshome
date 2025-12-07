"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toggleWishlist } from "@/app/actions/user";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface WishlistButtonProps {
    productId: string;
    initialIsWishlisted?: boolean;
}

export default function WishlistButton({ productId, initialIsWishlisted = false }: WishlistButtonProps) {
    const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link click
        e.stopPropagation();

        if (!session) {
            router.push("/login");
            return;
        }

        setLoading(true);
        // Optimistic update
        setIsWishlisted(!isWishlisted);

        try {
            const newState = await toggleWishlist(productId);
            setIsWishlisted(newState); // sync with server
        } catch (error) {
            setIsWishlisted(!isWishlisted); // revert
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`p-2 rounded-full transition-all transform hover:scale-110 ${isWishlisted ? "bg-red-50 text-red-500" : "bg-white text-gray-500 hover:text-red-500"
                }`}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
            <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
    );
}
