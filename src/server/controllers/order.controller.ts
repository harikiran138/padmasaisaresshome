import { NextRequest, NextResponse } from "next/server";
import { orderService } from "../services/order.service";
import { handleError } from "../utils/AppError";
import { z } from "zod";

const createOrderSchema = z.object({
    address: z.object({
        fullName: z.string(),
        addressLine1: z.string(),
        city: z.string(),
        state: z.string(),
        pincode: z.string(),
        mobile: z.string()
    }),
    paymentMethod: z.enum(['cod', 'online']).default('cod')
});

export class OrderController {
    
    async create(req: NextRequest, userId: string) {
        try {
            const body = await req.json();
            const validation = createOrderSchema.safeParse(body);
            
            if (!validation.success) {
                return NextResponse.json({ success: false, error: validation.error.flatten().fieldErrors }, { status: 400 });
            }

            const { address, paymentMethod } = validation.data;
            const order = await orderService.createOrder({
                userId,
                paymentMethod,
                shippingAddress: address
            });
            
            return NextResponse.json({ success: true, data: order }, { status: 201 });
        } catch (error) {
            return this.sendError(error);
        }
    }

    async getUserOrders(req: NextRequest, userId: string) {
        try {
            const orders = await orderService.getUserOrders(userId);
            return NextResponse.json({ success: true, data: orders });
        } catch (error) {
            return this.sendError(error);
        }
    }

    private sendError(error: unknown) {
        const errResponse = handleError(error);
        return NextResponse.json(errResponse, { status: errResponse.statusCode });
    }
}

export const orderController = new OrderController();
