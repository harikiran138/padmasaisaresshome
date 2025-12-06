import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth();
        const { checkOutInfo, orderItems, totalPrice } = await req.json();

        await connectToDatabase();

        // Verify stock and update it (Simplistic approach)
        // Ideally use transactions for stock management
        for (const item of orderItems) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return NextResponse.json(
                    { error: `Product not found: ${item.name}` },
                    { status: 400 }
                );
            }
            if (product.stock < item.quantity) {
                return NextResponse.json(
                    { error: `Insufficient stock for: ${item.name}` },
                    { status: 400 }
                );
            }
            product.stock -= item.quantity;
            await product.save();
        }

        const order = await Order.create({
            user: session?.user?.id,
            guestInfo: session ? undefined : {
                name: `${checkOutInfo.firstName} ${checkOutInfo.lastName}`,
                email: checkOutInfo.email,
                address: {
                    street: checkOutInfo.address,
                    city: checkOutInfo.city,
                    state: checkOutInfo.state,
                    zip: checkOutInfo.zip,
                    country: checkOutInfo.country,
                },
            },
            orderItems: orderItems.map((item: any) => ({
                product: item.productId,
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
            })),
            shippingAddress: {
                street: checkOutInfo.address,
                city: checkOutInfo.city,
                state: checkOutInfo.state,
                zip: checkOutInfo.zip,
                country: checkOutInfo.country,
            },
            paymentMethod: "Credit Card (Mock)",
            itemsPrice: orderItems.reduce((a: any, c: any) => a + c.price * c.quantity, 0),
            // Recalculating totals on backend is safer
            totalPrice: totalPrice,
            isPaid: true,
            paidAt: new Date(),
            paymentResult: { status: "COMPLETED", id: "mock_payment_id_" + Date.now() },
        });

        return NextResponse.json({ orderId: order._id });
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: e.message || "Failed to create order" }, { status: 500 });
    }
}
