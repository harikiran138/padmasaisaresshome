import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validations/auth";
import { limiters, checkRateLimit } from "@/lib/rate-limit";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { headers } from "next/headers";

export async function POST(req: Request) {
    try {
        // 1. Rate Limiting
        const ip = (await headers()).get("x-forwarded-for") || "unknown";
        const limitRes = await checkRateLimit(limiters.auth, ip);
        
        if (!limitRes.success) {
            return errorResponse(
                "Too many attempts. Please try again later.", 
                "RATE_LIMIT_EXCEEDED", 
                429,
                { retryAfter: limitRes.retryAfter }
            );
        }

        // 2. Input Validation (Zod)
        const body = await req.json();
        const validation = registerSchema.safeParse(body);

        if (!validation.success) {
            return errorResponse(
                "Validation Failed",
                "VALIDATION_ERROR",
                400,
                validation.error.flatten()
            );
        }

        const { name, email, password } = validation.data;

        await connectToDatabase();

        // 3. Business Logic
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return errorResponse("User already exists", "USER_EXISTS", 409);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "customer",
            loginHistory: [{
                ip,
                device: req.headers.get("user-agent") || "unknown",
                date: new Date()
            }]
        });

        // 4. Response
        const { password: _, ...userWithoutPassword } = newUser.toObject();

        return successResponse({ 
            user: userWithoutPassword,
            message: "Registration successful" 
        }, 201);

    } catch (error: any) {
        console.error("Registration Error:", error);
        return errorResponse(
            "Internal Server Error",
            "INTERNAL_ERROR",
            500,
            process.env.NODE_ENV === "development" ? error.message : undefined
        );
    }
}
