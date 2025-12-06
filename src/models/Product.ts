import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    name: string;
    slug: string;
    description: string;
    price: number;
    discountPrice?: number;
    images: string[];
    category: string;
    sizes: string[];
    colors: string[];
    stock: number;
    isFeatured: boolean;
    isBestSeller: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        discountPrice: { type: Number },
        images: [{ type: String }],
        category: { type: String, required: true },
        sizes: [{ type: String }],
        colors: [{ type: String }],
        stock: { type: Number, required: true, default: 0 },
        isFeatured: { type: Boolean, default: false },
        isBestSeller: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
