import mongoose from "mongoose";
import { OrderRepository } from "../repositories/order.repository";
import { CartRepository } from "../repositories/cart.repository";
import { ProductRepository } from "../repositories/product.repository";
import { AppError } from "../utils/AppError";
import connectToDatabase from "@/lib/db";

const orderRepo = new OrderRepository();
const cartRepo = new CartRepository();
const productRepo = new ProductRepository();

export class OrderService {
    
    async createOrder(params: { 
        userId?: string, 
        sessionId?: string, 
        paymentMethod: string, 
        shippingAddress: any,
        guestEmail?: string
    }) {
        const { userId, sessionId, paymentMethod, shippingAddress, guestEmail } = params;
        await connectToDatabase();
        
        // Start Mongoose session for Transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // 1. Get Cart (Supports both user and guest)
            const cart = await cartRepo.findByUserIdOrSessionId(userId, sessionId);
            if (!cart || cart.items.length === 0) {
                throw new AppError("Cart is empty", 400);
            }

            // 2. Validate Stock & Calculate Total (Strict DB verification)
            let subtotal = 0;
            const orderItems = [];
            
            for (const item of cart.items) {
                const productId = (item.product as any)._id || item.product;
                
                // Atomic Stock Deduction within Transaction
                const product = await productRepo.deductStock(
                    productId.toString(), 
                    item.quantity, 
                    { size: item.size, color: item.color },
                    session
                );
                
                // priceAtAddTime is for UI only, always use current DB price
                const activePrice = product.discountPrice || product.price;
                subtotal += activePrice * item.quantity;
                
                orderItems.push({
                    product: product._id,
                    name: product.name,
                    quantity: item.quantity,
                    price: activePrice,
                    size: item.size,
                    color: item.color
                });
            }

            // Shipping logic (Can be moved to a calculator utility later)
            const shippingFee = subtotal > 1000 ? 0 : 99; 
            const total = subtotal + shippingFee;

            // 3. Create Order
            const orderId = `PSH-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            const order = await orderRepo.create([{
                user: userId as any,
                sessionId,
                guestEmail,
                orderId,
                items: orderItems,
                totalAmount: total,
                subtotal,
                shippingFee,
                shippingAddress,
                paymentMethod: paymentMethod as any,
                paymentStatus: 'PENDING',
                orderStatus: 'PLACED',
                auditLog: [{
                    status: 'PLACED',
                    timestamp: new Date(),
                    note: 'Order initiated by client'
                }]
            }], { session });

            // 4. Clear Cart
            await cartRepo.update(cart._id.toString(), { items: [] }, { session });

            // Commit all changes
            await session.commitTransaction();
            return order;

        } catch (error) {
            // Rollback everything on failure
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async getUserOrders(userId: string) {
        await connectToDatabase();
        return await orderRepo.find({ user: userId });
    }
    
    async getOrderById(orderId: string) {
        await connectToDatabase();
        return await orderRepo.findOne({ orderId });
    }

    // New: Handle Payment Success hook
    async markAsPaid(orderId: string, paymentDetails: any) {
        await connectToDatabase();
        return await orderRepo.updateByOrderId(orderId, {
            paymentStatus: 'PAID',
            orderStatus: 'CONFIRMED',
            paymentId: paymentDetails.id,
            $push: {
                auditLog: {
                    status: 'PAID',
                    timestamp: new Date(),
                    note: `Payment successful: ${paymentDetails.method}`
                }
            }
        });
    }
}

export const orderService = new OrderService();
