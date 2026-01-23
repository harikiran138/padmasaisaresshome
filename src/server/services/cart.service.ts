import { CartRepository } from "../repositories/cart.repository";
import { ProductRepository } from "../repositories/product.repository";
import { AppError } from "../utils/AppError";
import connectToDatabase from "@/lib/db";

const cartRepo = new CartRepository();
const productRepo = new ProductRepository();

export class CartService {
    
    async getCart(userId?: string, sessionId?: string) {
        await connectToDatabase();
        if (!userId && !sessionId) return null;

        let cart = await cartRepo.findByUserIdOrSessionId(userId, sessionId);
        
        if (!cart) {
            cart = await cartRepo.create({ 
                user: userId ? userId : undefined, 
                sessionId: !userId ? sessionId : undefined, 
                items: [] 
            });
        }
        return cart;
    }

    async addToCart(productId: string, quantity: number, options: { userId?: string, sessionId?: string, variant?: { size?: string, color?: string } }) {
        await connectToDatabase();
        const { userId, sessionId, variant } = options;

        const product = await productRepo.findById(productId);
        if (!product) throw new AppError("Product not found", 404);

        if (product.stock < quantity) {
            throw new AppError("Insufficient stock", 400);
        }

        let cart = await cartRepo.findByUserIdOrSessionId(userId, sessionId);
        if (!cart) {
            cart = await cartRepo.create({ 
                user: userId || undefined, 
                sessionId: !userId ? sessionId : undefined, 
                items: [] 
            });
        }

        const existingItemIndex = cart.items.findIndex((item: any) => 
            item.product._id.toString() === productId && 
            item.size === variant?.size && 
            item.color === variant?.color
        );

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push({
                product: productId as any,
                quantity,
                priceAtAddTime: product.discountPrice || product.price,
                size: variant?.size,
                color: variant?.color
            });
        }

        await cart.save();
        return cart;
    }

    async updateItemQuantity(productId: string, quantity: number, options: { userId?: string, sessionId?: string, variant?: { size?: string, color?: string } }) {
        await connectToDatabase();
        const { userId, sessionId, variant } = options;

        const cart = await cartRepo.findByUserIdOrSessionId(userId, sessionId);
        if (!cart) throw new AppError("Cart not found", 404);

        const item = cart.items.find((item: any) => 
            item.product._id.toString() === productId && 
            item.size === variant?.size && 
            item.color === variant?.color
        );

        if (item) {
            item.quantity = quantity;
            await cart.save();
        }
        return cart;
    }

    async removeFromCart(productId: string, options: { userId?: string, sessionId?: string, variant?: { size?: string, color?: string } }) {
        await connectToDatabase();
        const { userId, sessionId, variant } = options;

        const cart = await cartRepo.findByUserIdOrSessionId(userId, sessionId);
        if (!cart) throw new AppError("Cart not found", 404);

        cart.items = cart.items.filter((item: any) => 
            !(item.product._id.toString() === productId && 
              item.size === variant?.size && 
              item.color === variant?.color)
        );

        await cart.save();
        return cart;
    }

    async mergeCarts(sessionId: string, userId: string) {
        await connectToDatabase();
        
        const guestCart = await cartRepo.findBySessionId(sessionId);
        if (!guestCart || guestCart.items.length === 0) return;

        let userCart = await cartRepo.findByUserId(userId);
        if (!userCart) {
            userCart = await cartRepo.create({ user: userId as any, items: [] });
        }

        // Merge items
        for (const guestItem of guestCart.items) {
            const existingItemIndex = userCart.items.findIndex((item: any) => 
                item.product._id.toString() === guestItem.product._id.toString() && 
                item.size === guestItem.size && 
                item.color === guestItem.color
            );

            if (existingItemIndex > -1) {
                userCart.items[existingItemIndex].quantity += guestItem.quantity;
            } else {
                userCart.items.push({
                    product: guestItem.product,
                    quantity: guestItem.quantity,
                    priceAtAddTime: guestItem.priceAtAddTime,
                    size: guestItem.size,
                    color: guestItem.color
                });
            }
        }

        await userCart.save();
        // Delete guest cart
        await cartRepo.delete((guestCart._id as any).toString());
        return userCart;
    }
}

export const cartService = new CartService();
