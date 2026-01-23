"use server";

import { auth, signIn, signOut } from "@/auth"; // Server-side auth
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { registerSchema } from "@/lib/validations/auth";
import { z } from "zod";
import bcrypt from "bcryptjs";

export async function registerUser(formData: FormData) {
    try {
        const rawData = Object.fromEntries(formData.entries());
        const validatedFields = registerSchema.safeParse(rawData);

        if (!validatedFields.success) {
            return { error: "Invalid input data" };
        }

        const { email, password, name } = validatedFields.data;

        await connectToDatabase();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { error: "User already exists" };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        await User.create({
            name,
            email,
            password: hashedPassword,
            role: "user",
            loginHistory: [{ date: new Date(), ip: "signup", device: "web" }]
        });
        
        // Auto-login? Or redirect to login?
        // Typically, we ask them to login or do it automatically. 
        // signIn("credentials", ...) might work in Server Action?
        // Let's just return success and let Local client redirect (as it does).
        
        return { success: true };

    } catch (error) {
        console.error("Registration Error:", error);
        return { error: "Something went wrong. Please try again." };
    }
}

export async function logoutAction() {
    try {
        const session = await auth();
        if (session?.user?.id) {
            await connectToDatabase();
            // Revoke Access
            await User.findByIdAndUpdate(session.user.id, { 
                $unset: { refreshToken: 1 }, 
                $push: { 
                    loginHistory: { 
                        date: new Date(), 
                        ip: "logout", 
                        device: "logout" 
                    } 
                } 
            });
        }
    } catch (error) {
        console.error("Logout Revocation Failed:", error);
    }
    
    // Perform NextAuth SignOut (Server Side)
    await signOut({ redirectTo: "/login" });
}
