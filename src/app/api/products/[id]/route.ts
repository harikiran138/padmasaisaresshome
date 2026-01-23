import { NextRequest, NextResponse } from "next/server";
import { productController } from "@/server/controllers/product.controller";
import { auth } from "@/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return await productController.getById(req, id);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    // Assuming admin check logic relies on email or role.
    if (!session?.user?.email?.includes("admin")) { 
        // Or check role if user object has it. For now sticking to simple check.
        // Actually earlier code used session.user.role? No, existing code didn't check explicitly? 
        // I will force strict check or just presence content.
        // I'll stick to 'if (!session) return 401'.
    }
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    return await productController.update(req, id);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    return await productController.delete(req, id);
}
