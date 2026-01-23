import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem {
    product: mongoose.Types.ObjectId;
    size?: string;
    color?: string;
    quantity: number;
    priceAtAddTime: number;
}

export interface ICart extends Document {
    user?: mongoose.Types.ObjectId;
    sessionId?: string; // For guest users if we implement that later
    items: ICartItem[];
    lastKnownTotal?: number;
    createdAt: Date;
    updatedAt: Date;
}

const CartItemSchema = new Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    size: { type: String },
    color: { type: String },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    priceAtAddTime: { type: Number, required: true, min: 0 },
});

const CartSchema = new Schema<ICart>(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, sparse: true },
        sessionId: { type: String, unique: true, sparse: true },
        items: [CartItemSchema],
        lastKnownTotal: Number
    },
    { timestamps: true }
);

// Unified index to find by either but ensure one is present
CartSchema.index({ user: 1 }, { unique: true, sparse: true });
CartSchema.index({ sessionId: 1 }, { unique: true, sparse: true });

// TTL Index: Auto-delete carts after 30 days
CartSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });



export default mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);
