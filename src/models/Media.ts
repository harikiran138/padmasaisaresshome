import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMedia {
    filename: string;
    originalName: string;
    path: string; // URL path
    mimeType: string;
    size: number;
    uploadedBy: string; // Admin User ID
    createdAt: Date;
}

const MediaSchema = new Schema<IMedia & Document>({
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    path: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Media: Model<IMedia & Document> = mongoose.models.Media || mongoose.model<IMedia & Document>("Media", MediaSchema);

export default Media;
