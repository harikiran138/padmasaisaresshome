import { NextRequest, NextResponse } from "next/server";
import { uploadController } from "@/server/controllers/upload.controller";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
    const session = await auth();
    // Strict Admin Check
    // If role is undefined or not admin, 401.
    // Assuming session.user.role exists. My previous steps confirmed this usage.
    if (session?.user?.role !== "admin") {
         return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!session?.user?.id) {
         return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return await uploadController.upload(req, session.user.id);
}
