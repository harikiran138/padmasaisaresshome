
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import Cart from "@/models/Cart";
import Product from "@/models/Product";

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        let cart = await Cart.findOne({ user: session.user.id }).populate("items.product");

        if (!cart) {
            return NextResponse.json({ items: [] });
        }

        return NextResponse.json(cart);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { productId, quantity, size, color } = await req.json();

        if (!productId || quantity < 1) {
            return NextResponse.json({ message: "Invalid data" }, { status: 400 });
        }

        await connectToDatabase();
        const product = await Product.findById(productId);

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        let cart = await Cart.findOne({ user: session.user.id });

        if (!cart) {
            cart = await Cart.create({ user: session.user.id, items: [] });
        }

        const itemIndex = cart.items.findIndex((item: any) =>
            item.product.toString() === productId &&
            item.size === size &&
            item.color === color
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
            cart.items[itemIndex].priceAtAddTime = product.price;
        } else {
            cart.items.push({
                product: productId,
                quantity,
                size,
                color,
                priceAtAddTime: product.price,
            });
        }

        await cart.save();
        return NextResponse.json(cart);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { productId, quantity, size, color } = await req.json();
        await connectToDatabase();
        const cart = await Cart.findOne({ user: session.user.id });

        if (!cart) return NextResponse.json({ message: "Cart not found" }, { status: 404 });

        const item = cart.items.find((item: any) =>
            item.product.toString() === productId &&
            item.size === size &&
            item.color === color
        );

        if (item) {
            item.quantity = quantity;
            await cart.save();
        }

        return NextResponse.json(cart);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { productId, size, color } = await req.json();
        await connectToDatabase();
        const cart = await Cart.findOne({ user: session.user.id });

        if (cart) {
            cart.items = cart.items.filter((item: any) =>
                !(item.product.toString() === productId && item.size === size && item.color === color)
            );
            await cart.save();
        }

        return NextResponse.json(cart);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
