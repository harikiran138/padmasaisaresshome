"use server";

import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// --- WISHLIST ACTIONS ---

export async function toggleWishlist(productId: string) {
    const session = await auth();
    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

    await connectToDatabase();
    const user = await User.findById(session.user.id);

    if (!user) throw new Error("User not found");

    const isInternalList = user.wishlist.includes(productId);

    if (isInternalList) {
        // Remove
        user.wishlist = user.wishlist.filter((id: any) => id.toString() !== productId);
    } else {
        // Add
        user.wishlist.push(productId);
    }

    await user.save();
    revalidatePath("/shop");
    revalidatePath(`/product/[slug]`);
    revalidatePath("/account");
    return !isInternalList; // returns true if added, false if removed
}

export async function getWishlist() {
    const session = await auth();
    if (!session || !session.user) return [];

    await connectToDatabase();
    const user = await User.findById(session.user.id).populate("wishlist").lean();

    // Serializing manually because mongo returns complex objects
    return user?.wishlist?.map((p: any) => ({
        ...p,
        _id: p._id.toString(),
        createdAt: p.createdAt?.toISOString(),
        updatedAt: p.updatedAt?.toISOString(),
    })) || [];
}

// --- ADDRESS ACTIONS ---

export async function addAddress(address: any) {
    const session = await auth();
    if (!session || !session.user) throw new Error("Unauthorized");

    await connectToDatabase();
    await User.findByIdAndUpdate(session.user.id, {
        $push: { address: address },
    });
    revalidatePath("/account");
}

export async function deleteAddress(addressId: string) {
    const session = await auth();
    if (!session || !session.user) throw new Error("Unauthorized");

    await connectToDatabase();
    await User.findByIdAndUpdate(session.user.id, {
        $pull: { address: { _id: addressId } },
    });
    revalidatePath("/account");
}
