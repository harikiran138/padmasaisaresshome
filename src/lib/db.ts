import mongoose from 'mongoose';


interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        throw new Error('Please define the MONGODB_URI environment variable inside .env');
    }

    if (cached!.conn && cached!.conn.connection.readyState === 1) {
        return cached!.conn;
    }

    if (!cached!.promise) {
        const opts = {
            bufferCommands: false, // Changed to false to fail fast
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        mongoose.set('strictQuery', true);
        mongoose.set('bufferCommands', false);

        console.log("Connecting to MongoDB...");
        cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log("MongoDB Connected Successfully");
            return mongoose;
        }).catch((err) => {
            console.error("MongoDB Connection Error:", err);
            throw err;
        });
    }

    try {
        cached!.conn = await cached!.promise;
    } catch (e) {
        cached!.promise = null;
        throw e;
    }

    return cached!.conn;
}

export default connectToDatabase;
