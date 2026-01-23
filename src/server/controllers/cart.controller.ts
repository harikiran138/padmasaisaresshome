import { NextRequest, NextResponse } from "next/server";
import { cartService } from "../services/cart.service";
import { handleError } from "../utils/AppError";
import { z } from "zod";

// Validates "Flat" structure: productId, quantity, size, color
const cartItemSchema = z.object({
    productId: z.string(),
    quantity: z.number().min(0), // Allow 0 to remove? Or min 1. Code implies update to Q.
    size: z.string().optional(),
    color: z.string().optional()
});

export class CartController {
    
    async getCart(req: NextRequest, userId?: string, sessionId?: string) {
        try {
            // Auto-merge if both IDs are present
            if (userId && sessionId) {
                await cartService.mergeCarts(sessionId, userId);
            }
            
            const cart = await cartService.getCart(userId, sessionId);
            return NextResponse.json(cart);
        } catch (error) {
            return this.sendError(error);
        }
    }

    async addItem(req: NextRequest, userId?: string, sessionId?: string) {
        try {
            const body = await req.json();
            const validation = cartItemSchema.safeParse(body);
            
            if (!validation.success) {
                return NextResponse.json({ success: false, error: validation.error.flatten().fieldErrors }, { status: 400 });
            }

            const { productId, quantity, size, color } = validation.data;
            const cart = await cartService.addToCart(productId, quantity, { userId, sessionId, variant: { size, color } });
            
            return NextResponse.json(cart);
        } catch (error) {
            return this.sendError(error);
        }
    }

    async updateItem(req: NextRequest, userId?: string, sessionId?: string) {
        try {
            const body = await req.json();
            const validation = cartItemSchema.safeParse(body);

             if (!validation.success) {
                return NextResponse.json({ success: false, error: validation.error.flatten().fieldErrors }, { status: 400 });
            }

            const { productId, quantity, size, color } = validation.data;
            const cart = await cartService.updateItemQuantity(productId, quantity, { userId, sessionId, variant: { size, color } });
            return NextResponse.json(cart);
        } catch (error) {
            return this.sendError(error);
        }
    }

    async removeItem(req: NextRequest, userId?: string, sessionId?: string) {
        try {
            const body = await req.json();
            if (!body.productId) return NextResponse.json({ success: false, error: "Product ID required" }, { status: 400 });
            
            const cart = await cartService.removeFromCart(body.productId, { userId, sessionId, variant: { size: body.size, color: body.color } });
            return NextResponse.json(cart);
        } catch (error) {
            return this.sendError(error);
        }
    }

    private sendError(error: unknown) {
        const errResponse = handleError(error);
        return NextResponse.json({ message: errResponse.error }, { status: errResponse.statusCode });
    }
}

export const cartController = new CartController();
