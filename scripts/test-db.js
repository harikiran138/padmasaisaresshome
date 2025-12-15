
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Simple .env parser since we might not have dotenv installed
function loadEnv() {
    const envPath = path.resolve(__dirname, '../.env');
    if (!fs.existsSync(envPath)) {
        console.error('.env file not found at', envPath);
        process.exit(1);
    }
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    envContent.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            let value = match[2].trim();
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            envVars[match[1].trim()] = value;
        }
    });
    return envVars;
}

const env = loadEnv();
const MONGODB_URI = env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI not found in .env');
    process.exit(1);
}

console.log('Attempting to connect to MongoDB...');
// Mask the password in the log
const maskedUri = MONGODB_URI.replace(/:([^@]+)@/, ':****@');
console.log('URI:', maskedUri);

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('SUCCESS: Connected to MongoDB!');
        console.log('Connection ready state:', mongoose.connection.readyState);
        return mongoose.connection.close();
    })
    .then(() => {
        console.log('Connection closed.');
        process.exit(0);
    })
    .catch(err => {
        console.error('ERROR: Could not connect to MongoDB');
        console.error(err);
        process.exit(1);
    });
