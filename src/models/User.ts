import mongoose, { Schema, Document } from "mongoose";

export interface IAddress {
    label: string;
    fullName?: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    phone: string;
    isDefault: boolean;
}

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: "user" | "admin" | "customer";
    image?: string;
    addresses?: {
        label: string;
        fullName?: string;
        line1: string;
        line2?: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
        phone: string;
        isDefault: boolean;
    }[];
    wishlist?: mongoose.Types.ObjectId[];
    loginHistory?: { ip: string; device?: string; date: Date }[];
    refreshToken?: string;
    isEmailVerified?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>(
    {
        label: { type: String, default: "Home" },
        fullName: { type: String },
        line1: { type: String, required: true },
        line2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        country: { type: String, default: "India" },
        phone: { type: String, required: true },
        isDefault: { type: Boolean, default: false },
    },
    { _id: false }
);

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, select: false, required: true },
        role: { type: String, enum: ["user", "admin", "customer"], default: "customer" }, // customer added to align with user
        image: { type: String },
        addresses: [AddressSchema],
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
        loginHistory: [{
          ip: String,
          device: String,
          date: { type: Date, default: Date.now }
        }],
        refreshToken: { type: String, select: false },
        isEmailVerified: { type: Boolean, default: false },
    },
    { timestamps: true }
);



export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
