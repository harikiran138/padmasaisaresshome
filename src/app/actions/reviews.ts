"use server";

import connectToDatabase from "@/lib/db";
import Review from "@/models/Review";
import Product from "@/models/Product";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function submitReview(productId: string, rating: number, comment: string) {
    const session = await auth();
    if (!session || !session.user) {
        throw new Error("You must be logged in to review.");
    }

    if (rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5.");
    }

    if (!comment.trim()) {
        throw new Error("Comment cannot be empty.");
    }

    await connectToDatabase();

    // Create Review
    await Review.create({
        user: session.user.id,
        product: productId,
        name: session.user.name || "Anonymous",
        rating,
        comment,
    });

    // Recalculate Product Rating
    const reviews = await Review.find({ product: productId });
    const numReviews = reviews.length;
    const averageRating =
        reviews.reduce((acc, r) => acc + r.rating, 0) / numReviews;

    await Product.findByIdAndUpdate(productId, {
        numReviews,
        averageRating,
    });

    revalidatePath(`/product/[slug]`); // Revalidate all product pages (or precise slug if passed)
    // We can just rely on the layout/page revalidation or explicit slug
}
