
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Load environment variables manually from .env file
const envPath = path.resolve(process.cwd(), '.env');
let MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI && fs.existsSync(envPath)) {
    console.log("📄 Loading .env file manually...");
    const envConfig = fs.readFileSync(envPath, 'utf8');
    for (const line of envConfig.split('\n')) {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^"|"$/g, '');
            if (key === 'MONGODB_URI') {
                MONGODB_URI = value;
            }
        }
    }
}

if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not defined in .env or process.env");
    process.exit(1);
}

// ----------------------
// Mock Schemas for direct DB access without importing app code issues (esm/cjs)
// ----------------------
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Select: true not needed for creation
    role: { type: String, default: "user" },
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
    name: String,
    slug: String,
}, { strict: false }); // Strict false to read whatever is there

const CartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "TestUser", required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: "TestProduct" },
        quantity: Number,
    }]
}, { timestamps: true });


// ----------------------
// Test Runner
// ----------------------
async function runVerification() {
    console.log("🚀 Starting Comprehensive Service Verification...");

    // 1. Connection Test
    console.log("\n1️⃣  Testing Database Connection...");
    try {
        await mongoose.connect(MONGODB_URI as string);
        console.log("   ✅ Database Connection: PASSED (Connected to MongoDB)");
        console.log(`   📊 Connection State: ${mongoose.connection.readyState} (1 = Connected)`);
    } catch (error) {
        console.error("   ❌ Database Connection: FAILED", error);
        process.exit(1);
    }

    // Models (using "Test" prefix to avoid collisions if models already compiled)
    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    // Use existing collections if possible
    const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
    const Cart = mongoose.models.Cart || mongoose.model('Cart', CartSchema);

    // 2. User Data Persistence
    console.log("\n2️⃣  Testing User Data Persistence...");
    const testUserEmail = `whitebox_test_${Date.now()}@example.com`;
    let userId;
    try {
        // Create
        const newUser = await User.create({
            name: "Whitebox Tester",
            email: testUserEmail,
            password: "hashedpassword123",
            role: "user"
        });
        userId = newUser._id;
        console.log("   ✅ User Creation (Save): PASSED");

        // Retrieve
        const foundUser = await User.findOne({ email: testUserEmail });
        if (foundUser && foundUser.name === "Whitebox Tester") {
            console.log("   ✅ User Retrieval: PASSED");
        } else {
            throw new Error("User retrieval failed or data mismatch");
        }

    } catch (error) {
        console.error("   ❌ User Persistence: FAILED", error);
    }

    // 3. Product Data Availability
    console.log("\n3️⃣  Testing Product Data Retrieval...");
    let productId;
    try {
        const product = await Product.findOne({});
        if (product) {
            console.log(`   ✅ Product Retrieval: PASSED (Found: ${product.name || 'Request product name'})`);
            productId = product._id;
        } else {
            console.log("   ⚠️ Product Retrieval: SKIPPED (No products found in DB. Run seed if needed.)");
        }
    } catch (error) {
        console.error("   ❌ Product Retrieval: FAILED", error);
    }

    // 4. Cart Operations
    console.log("\n4️⃣  Testing Cart Operations (Data Traveling & Saving)...");
    if (userId && productId) {
        try {
            // Add (Save)
            const cart = await Cart.create({
                user: userId,
                items: [{ product: productId, quantity: 2 }]
            });
            console.log("   ✅ Cart Item Addition (Save): PASSED");

            // Retrieve
            const foundCart = await Cart.findOne({ user: userId });
            if (foundCart && foundCart.items.length === 1 && foundCart.items[0].quantity === 2) {
                console.log("   ✅ Cart Retrieval: PASSED");
            } else {
                throw new Error("Cart data mismatch");
            }

            // Cleanup Cart
            await Cart.deleteOne({ _id: cart._id });
            console.log("   ✅ Cart Cleanup (Delete): PASSED");

        } catch (error) {
            console.error("   ❌ Cart Operations: FAILED", error);
        }
    } else {
        console.log("   ⚠️ Skipping Cart Test (Requires both User and Product to be successful)");
    }

    // Cleanup User
    if (userId) {
        await User.deleteOne({ _id: userId });
        console.log("   ✅ User Cleanup (Delete): PASSED");
    }

    // 5. API Status Check (Simulated)
    console.log("\n5️⃣  Checking Service Status Indicators...");
    // Direct mongoose check
    if (mongoose.connection.readyState === 1) {
        console.log("   ✅ Database Service Status: HEALTHY");
    } else {
        console.log("   ❌ Database Service Status: UNHEALTHY");
    }

    console.log("\n🏁 Verification Complete.");
    process.exit(0);
}

runVerification();
