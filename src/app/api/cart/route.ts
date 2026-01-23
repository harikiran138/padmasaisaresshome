
import { NextRequest, NextResponse } from "next/server";
import { cartController } from "@/server/controllers/cart.controller";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
    const session = await auth();
    const sessionId = req.headers.get("x-session-id") || undefined;
    if (!session?.user?.id && !sessionId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    return await cartController.getCart(req, session?.user?.id, sessionId);
}

export async function POST(req: NextRequest) {
    const session = await auth();
    const sessionId = req.headers.get("x-session-id") || undefined;
    if (!session?.user?.id && !sessionId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    return await cartController.addItem(req, session?.user?.id, sessionId);
}

export async function PUT(req: NextRequest) {
    const session = await auth();
    const sessionId = req.headers.get("x-session-id") || undefined;
    if (!session?.user?.id && !sessionId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    return await cartController.updateItem(req, session?.user?.id, sessionId);
}

export async function DELETE(req: NextRequest) {
    const session = await auth();
    const sessionId = req.headers.get("x-session-id") || undefined;
    if (!session?.user?.id && !sessionId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    return await cartController.removeItem(req, session?.user?.id, sessionId);
}

