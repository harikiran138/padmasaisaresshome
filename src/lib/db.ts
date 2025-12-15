import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    // Change cache key to bypass potentially stale global state from previous hot reloads
    var mongoose_cache_v2: MongooseCache | undefined;
}

let cached = global.mongoose_cache_v2;

if (!cached) {
    cached = global.mongoose_cache_v2 = { conn: null, promise: null };
}

async function connectToDatabase() {
    console.log("[DB] connectToDatabase called (v2 cache)");

    if (cached!.conn) {
        console.log("[DB] Checking cached connection status, readyState:", cached!.conn.connection.readyState);
        if (cached!.conn.connection.readyState === 1) {
            console.log("[DB] Using valid cached connection");
            return cached!.conn;
        }
        console.log("[DB] Cached connection is not ready (state " + cached!.conn.connection.readyState + "), reconnecting...");
        cached!.conn = null;
        cached!.promise = null;
    }

    if (!cached!.promise) {
        console.log("[DB] No cached promise, creating new connection to:", MONGODB_URI?.substring(0, 15) + "...");
        const opts = {
            bufferCommands: true,
            serverSelectionTimeoutMS: 5000, // Fail faster if DB is unreachable
            socketTimeoutMS: 45000,
        };

        cached!.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            console.log("[DB] New connection established successfully");
            return mongoose;
        }).catch(err => {
            console.error("[DB] Connection error:", err);
            // Verify if URI is correct/whitelist issues
            if (err.name === 'MongooseServerSelectionError') {
                console.error("[DB] Could not connect to any servers. Check IP whitelist and URI.");
            }
            cached!.promise = null; // Reset promise so next try can happen
            throw err;
        });
    }

    try {
        console.log("[DB] Awaiting connection promise...");
        cached!.conn = await cached!.promise;
        console.log("[DB] Connection promise resolved");
    } catch (e) {
        console.error("[DB] Failure in awaiting connection:", e);
        cached!.promise = null;
        throw e;
    }

    return cached!.conn;
}

export default connectToDatabase;
