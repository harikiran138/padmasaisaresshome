import { NextRequest, NextResponse } from "next/server";
import { productController } from "@/server/controllers/product.controller";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
    return await productController.getAll(req);
}

export async function POST(req: NextRequest) {
    const session = await auth();
    // Admin Middleware Check
    if (!session || session.user?.role !== "admin") {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    return await productController.create(req);
}

