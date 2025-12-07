
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import Cart from "@/models/Cart";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { checkOutInfo, orderItems, totalPrice } = await req.json();

        if (!checkOutInfo || !orderItems || orderItems.length === 0) {
            return NextResponse.json({ message: "Invalid data" }, { status: 400 });
        }

        await connectToDatabase();

        // Create Order
        const newOrder = await Order.create({
            user: session.user.id,
            items: orderItems.map((item: any) => ({
                product: item.product._id,
                name: item.product.name,
                size: item.size,
                color: item.color,
                quantity: item.quantity,
                price: item.product.discountPrice || item.product.price,
            })),
            subtotal: totalPrice, // Simplified for now
            totalAmount: totalPrice,
            shippingAddress: {
                fullName: `${checkOutInfo.firstName} ${checkOutInfo.lastName}`,
                line1: checkOutInfo.address,
                city: checkOutInfo.city,
                state: checkOutInfo.state,
                pincode: checkOutInfo.zip,
                country: checkOutInfo.country,
                phone: "9999999999", // Add phone field to checkout form or get from user profile
            },
            paymentMethod: "COD",
            orderStatus: "PLACED",
        });

        // Clear Cart
        await Cart.findOneAndUpdate(
            { user: session.user.id },
            { $set: { items: [] } }
        );

        return NextResponse.json({ orderId: newOrder._id });
    } catch (error: any) {
        console.error("Order creation error:", error);
        return NextResponse.json({ message: error.message || "Failed to create order" }, { status: 500 });
    }
}
