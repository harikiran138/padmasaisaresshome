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
    totalConfig?: {
        subtotal: number;
    };
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
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        items: [CartItemSchema],
    },
    { timestamps: true }
);



export default mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);
