
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import mongoose from "mongoose";

export async function GET() {
    try {
        await connectToDatabase();
        const userCount = await User.countDocuments();
        const dbState = mongoose.connection.readyState;

        return NextResponse.json({
            status: "success",
            message: "Connected to database",
            dbState: dbState, // 1 = connected
            userCount: userCount,
            env: {
                hasMongoUri: !!process.env.MONGODB_URI,
                mongoUriLength: process.env.MONGODB_URI?.length,
                hasAuthSecret: !!process.env.AUTH_SECRET,
            }
        });
    } catch (error: any) {
        return NextResponse.json({
            status: "error",
            message: error.message,
            stack: error.stack,
        }, { status: 500 });
    }
}
