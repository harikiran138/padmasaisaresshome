import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";

export async function GET() {
    try {
        console.log("[DB-TEST] Starting connection test");
        const MONGODB_URI = process.env.MONGODB_URI;
        
        await connectToDatabase();
        
        const state = mongoose.connection.readyState;
        const states: Record<number, string> = {
            0: "disconnected",
            1: "connected",
            2: "connecting",
            3: "disconnecting",
            99: "uninitialized"
        };

        return NextResponse.json({
            status: "ok",
            readyState: state,
            readyStateText: states[state] || "unknown",
            uri: MONGODB_URI ? `${MONGODB_URI.substring(0, 15)}...` : "undefined",
            dbName: mongoose.connection.name,
            host: mongoose.connection.host,
        });
    } catch (error: any) {
        return NextResponse.json({
            status: "error",
            message: error.message,
            stack: error.stack,
            readyState: mongoose.connection.readyState
        }, { status: 500 });
    }
}
