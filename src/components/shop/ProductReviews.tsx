"use client";

import { useState } from "react";
import { Star, User } from "lucide-react";
import { submitReview } from "@/app/actions/reviews";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Review {
    _id: string;
    name: string;
    rating: number;
    comment: string;
    createdAt: string;
}

interface ProductReviewsProps {
    productId: string;
    reviews: Review[];
}

export default function ProductReviews({ productId, reviews }: ProductReviewsProps) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) {
            router.push("/login");
            return;
        }

        setIsSubmitting(true);
        try {
            await submitReview(productId, rating, comment);
            setComment("");
            setRating(5);
            router.refresh();
        } catch (error) {
            alert("Failed to submit review.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-16 border-t border-gray-100 pt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Reviews List */}
                <div className="space-y-8">
                    {reviews.length === 0 ? (
                        <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
                    ) : (
                        reviews.map((review) => (
                            <div key={review._id} className="border-b border-gray-100 pb-8 last:border-0 hover:bg-gray-50 p-4 rounded-lg transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                        <div className="bg-gray-200 rounded-full p-1 text-gray-500">
                                            <User size={16} />
                                        </div>
                                        <span className="font-bold text-gray-900 text-sm">{review.name}</span>
                                    </div>
                                    <span className="text-gray-400 text-xs">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex text-yellow-500 mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={14}
                                            fill={star <= review.rating ? "currentColor" : "none"}
                                            className={star <= review.rating ? "" : "text-gray-300"}
                                        />
                                    ))}
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Write Review Form */}
                <div className="bg-gray-50 p-6 rounded-xl h-fit">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                            <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`focus:outline-none transition-transform hover:scale-110 ${star <= rating ? "text-yellow-500" : "text-gray-300"
                                            }`}
                                    >
                                        <Star size={24} fill="currentColor" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border"
                                placeholder="What did you like or dislike?"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Review"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
