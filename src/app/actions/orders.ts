
"use server";

import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(formData: FormData) {
    const orderId = formData.get("orderId");
    const newStatus = formData.get("status");

    if (!orderId || !newStatus) return;

    try {
        await connectToDatabase();
        await Order.findByIdAndUpdate(orderId, { status: newStatus });
        revalidatePath("/admin/orders");
    } catch (error) {
        console.error("Failed to update order status:", error);
    }
}
