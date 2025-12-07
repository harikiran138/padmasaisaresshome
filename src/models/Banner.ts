
import mongoose, { Schema, Document } from "mongoose";

export interface IBanner extends Document {
    title: string;
    subtitle?: string;
    imageUrl: string;
    linkUrl?: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
    {
        title: { type: String, required: true },
        subtitle: { type: String },
        imageUrl: { type: String, required: true },
        linkUrl: { type: String },
        isActive: { type: Boolean, default: true },
        sortOrder: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.models.Banner || mongoose.model<IBanner>("Banner", BannerSchema);
