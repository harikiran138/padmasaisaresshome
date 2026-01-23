import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    name: string;
    slug: string;
    description: string;
    price: number;
    discountPrice?: number;
    images: string[];
    category: mongoose.Types.ObjectId; // Changed to ObjectId
    brand: string;
    variants: {
        sku?: string;
        size?: string;
        color?: string;
        additionalPrice: number;
        stock: number;
    }[];
    attributes?: Map<string, string>;
    sizes: string[];
    colors: string[];
    stock: number;
    isFeatured: boolean;
    isBestSeller: boolean;
    averageRating: number;
    numReviews: number;
    currency: string;
    isActive: boolean;
    inventoryLog: { date: Date; quantity: number; reason: string }[];
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const variantSchema = new Schema(
    {
        sku: String,
        size: String,
        color: String,
        additionalPrice: { type: Number, default: 0 },
        stock: { type: Number, default: 0 },
    },
    { _id: false }
);

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        currency: { type: String, default: "INR" },
        discountPrice: { type: Number },
        images: [{ type: String, required: true }],
        category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
        brand: { type: String, default: "No Brand" },

        // Variants
        variants: [variantSchema],

        // Dynamic Attributes (e.g., Material: Cotton)
        attributes: {
            type: Map,
            of: String,
        },

        // Legacy/Direct fields (optional if moving fully to variants, but keeping for simple products)
        sizes: [{ type: String }],
        colors: [{ type: String }],
        stock: { type: Number, required: true, default: 0, min: 0 },

        isActive: { type: Boolean, default: true, index: true },
        isFeatured: { type: Boolean, default: false },
        isBestSeller: { type: Boolean, default: false },
        averageRating: { type: Number, default: 0 },
        numReviews: { type: Number, default: 0 },
        inventoryLog: [{
          date: { type: Date, default: Date.now },
          quantity: { type: Number, required: true },
          reason: { type: String, required: true }
        }],
        deletedAt: { type: Date },
    },
    { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text", brand: "text" });

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
