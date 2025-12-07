"use server";

import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";

export async function registerUser(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
        return { error: "All fields are required" };
    }

    try {
        await connectToDatabase();

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { error: "User with this email already exists" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // We can't easily sign in from a server action called by a client component 
        // if we want to redirect on the client side, OR we can do it here.
        // Let's try to sign in here. If it throws a redirect, we might need to catch it 
        // or handle it on client. `signIn` usually throws.
        try {
            // Attempt to sign in
            await signIn("credentials", { email, password, redirect: false });
        } catch (err) {
            console.error("Auto-login failed after registration:", err);
            // Ignore error here, let the user sign in manually if auto-login fails
            // It's better than showing a registration error when registration actually succeeded.
        }

        return { success: true };

    } catch (error) {
        console.error("Registration error:", error);
        return { error: "Something went wrong. Please try again." };
    }
}
