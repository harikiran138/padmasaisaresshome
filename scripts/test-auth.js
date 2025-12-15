
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Simple .env parser
function loadEnv() {
    const envPath = path.resolve(__dirname, '../.env');
    if (!fs.existsSync(envPath)) { console.error('.env not found'); process.exit(1); }
    const content = fs.readFileSync(envPath, 'utf8');
    const vars = {};
    content.split('\n').forEach(line => {
        const m = line.match(/^([^=]+)=(.*)$/);
        if (m) vars[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, '');
    });
    return vars;
}

const env = loadEnv();
const MONGODB_URI = env.MONGODB_URI || "mongodb://localhost:27017/padmasaisaresshome";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, select: true },
});
// Handle model recompilation error
const User = mongoose.models.User || mongoose.model('User', userSchema);

async function testAuth() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        const email = 'admin@example.com';
        const password = 'password123';

        console.log(`Looking up user: ${email}`);
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            console.error('User not found!');
            process.exit(1);
        }

        console.log('User found. Hash:', user.password);
        console.log('Comparing password...');
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            console.log('SUCCESS: Password matches!');
        } else {
            console.error('FAILURE: Password does NOT match.');
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

testAuth();
