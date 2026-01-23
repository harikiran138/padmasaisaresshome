import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

const globalForMongoose = global as unknown as { mongoose: MongooseCache };

let cached = globalForMongoose.mongoose;

if (!cached) {
    cached = globalForMongoose.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    console.log("[DB] connectToDatabase called. State:", mongoose.connection.readyState);

    // 1. If mongoose (global) is connected, use it.
    // 1. If mongoose (global) is connected, use it.
    if (mongoose.connection.readyState === 1) {
        try {
            if (!mongoose.connection.db) {
               throw new Error("Global connection ready but db missing");
            }
            await mongoose.connection.db.admin().ping();
            console.log("[DB] Already connected (readyState 1, ping success)");
            return mongoose.connection;
        } catch (e) {
            console.warn("[DB] Global connection zombie. Force closing...", e);
             try { await mongoose.disconnect(); } catch { /* ignore */ }
             // Fall through
        }
    }

    // 2. If we have a cached connection that is ready, use it.
    if (cached.conn && cached.conn.connection.readyState === 1) {
        try {
            if (!cached.conn.connection.db) {
                throw new Error("Connection ready but db object is missing");
            }
            await cached.conn.connection.db.admin().ping();
            console.log("[DB] Using cached connection (readyState 1, ping success)");
            return cached.conn;
        } catch (e) {
            console.warn("[DB] Cached connection is zombie (ping failed). Reconnecting...", e);
            cached.conn = null;
            cached.promise = null;
            // Fall through to create new connection logic
        }
    }

    // 3. If we have a cached promise, check if it yields a connected instance.
    if (cached.promise) {
        console.log("[DB] Awaiting EXISTING connection promise");
        try {
            const conn = await cached.promise;
            if (conn.connection.readyState === 1) {
                console.log("[DB] Cached promise resolved to CONNECTED state.");
                return conn;
            } else {
                console.warn("[DB] Cached promise resolved but NOT connected (State: " + conn.connection.readyState + "). Resetting cache.");
                cached.promise = null;
                cached.conn = null;
                // Fall through to create new connection
            }
        } catch (e) {
            console.error("[DB] Cached promise rejected. Resetting cache.", e);
            cached.promise = null;
            cached.conn = null;
            // Fall through to create new connection
        }
    }

    // 4. Create a new connection if needed
    if (!cached.promise) {
        const opts = {
            bufferCommands: true,
            serverSelectionTimeoutMS: 5000,
            heartbeatFrequencyMS: 1000,
        };

        console.log("[DB] Starting NEW mongoose.connect to:", MONGODB_URI?.substring(0, 25));
        
        

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((m) => {
            console.log("[DB] Promise resolved. New State:", m.connection.readyState);
            return m;
        }).catch(err => {
            console.error("[DB] Promise REJECTED:", err.message);
            cached.promise = null;
            throw err;
        });
        
        console.log("[DB] mongoose.connect call initiated");
    }

    // 5. Await the new or existing promise
    try {
        console.log("[DB] Awaiting cached.promise (fresh or existing)...");
        const conn = await cached.promise;
        
        if (conn && conn.connection.readyState === 1) {
            cached.conn = conn;
            console.log("[DB] Connection established and cached.");
        }
        
        return conn;
    } catch (e: unknown) {
        if (e instanceof Error) {
            console.error("[DB] Await failed:", e.message);
        } else {
             console.error("[DB] Await failed with non-Error object");
        }
        cached.promise = null;
        cached.conn = null;
        throw e;
    }
}

export default connectToDatabase;
