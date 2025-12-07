import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: "user" | "admin";
    image?: string;
    address?: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    }[];
    wishlist?: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, select: false },
        role: { type: String, enum: ["user", "admin"], default: "user" },
        image: { type: String },
        address: [
            {
                street: String,
                city: String,
                state: String,
                zip: String,
                country: String,
            },
        ],
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
