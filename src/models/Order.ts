import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
    user?: mongoose.Types.ObjectId;
    sessionId?: string;
    guestEmail?: string;
    items: {
        product: mongoose.Types.ObjectId;
        name: string;
        size?: string;
        color?: string;
        quantity: number;
        price: number;
    }[];
    subtotal: number;
    shippingFee: number;
    totalAmount: number;
    currency: string;
    paymentMethod: "COD" | "RAZORPAY" | "STRIPE";
    paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
    orderStatus: "PLACED" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    shippingAddress: {
        fullName: string;
        line1: string;
        line2?: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
        phone: string;
    };
    orderId: string; // Readable ID
    auditLog: { status: string; timestamp: Date; note: string }[];
    paymentId?: string;
    paymentOrderId?: string;
    paymentSignature?: string;
    createdAt: Date;
    updatedAt: Date;
}

const shippingAddressSchema = new Schema(
    {
        fullName: { type: String, required: true },
        line1: { type: String, required: true },
        line2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        country: { type: String, default: "India" },
        phone: { type: String, required: true },
    },
    { _id: false }
);

const orderItemSchema = new Schema(
    {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        size: { type: String },
        color: { type: String },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
    },
    { _id: false }
);

const OrderSchema = new Schema<IOrder>(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
        sessionId: { type: String, index: true },
        guestEmail: { type: String },
        items: {
            type: [orderItemSchema],
            validate: (v: unknown[]) => v.length > 0,
        },
        subtotal: { type: Number, required: true, min: 0 },
        shippingFee: { type: Number, required: true, min: 0, default: 0 },
        totalAmount: { type: Number, required: true, min: 0 },
        currency: { type: String, default: "INR" },
        paymentMethod: {
            type: String,
            enum: ["COD", "RAZORPAY", "STRIPE"],
            default: "COD",
        },
        paymentStatus: {
            type: String,
            enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
            default: "PENDING",
            index: true,
        },
        orderStatus: {
            type: String,
            enum: ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
            default: "PLACED",
            index: true,
        },
        shippingAddress: { type: shippingAddressSchema, required: true },
        orderId: { type: String, unique: true, required: true },
        auditLog: [{
            status: String,
            timestamp: { type: Date, default: Date.now },
            note: String
        }],
        paymentId: { type: String },
        paymentOrderId: { type: String },
        paymentSignature: { type: String },
    },
    { timestamps: true }
);

OrderSchema.index({ createdAt: -1 });

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
