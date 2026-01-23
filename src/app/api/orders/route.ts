import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { orderService } from "@/server/services/order.service";
import { errorResponse, successResponse } from "@/lib/api-utils";
import { headers } from "next/headers";

export async function GET(req: Request) {
    try {
        const session = await auth();
        const sessionId = (await headers()).get("x-session-id");
        
        if (!session?.user?.id && !sessionId) {
            return errorResponse("Unauthorized", "UNAUTHORIZED", 401);
        }

        const orders = await orderService.getUserOrders(session?.user?.id as string);
        return successResponse(orders);
    } catch (error: any) {
        return errorResponse(error.message);
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        const sessionId = (await headers()).get("x-session-id") || undefined;
        
        if (!session?.user?.id && !sessionId) {
            return errorResponse("Unauthorized", "UNAUTHORIZED", 401);
        }

        const { address, paymentMethod, guestEmail } = await req.json();

        const order = await orderService.createOrder({
            userId: session?.user?.id,
            sessionId,
            paymentMethod,
            shippingAddress: address,
            guestEmail
        });

        return successResponse({ 
            message: "Order placed successfully", 
            order 
        }, 201);

    } catch (error: any) {
        console.error("Order creation error:", error);
        return errorResponse(error.message || "Failed to create order", "ORDER_ERROR", error.status || 500);
    }
}
