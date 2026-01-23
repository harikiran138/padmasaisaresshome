import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto"; // Node.js Crypto (OK here)
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing parameters");
                }

                await connectToDatabase();
                const user = await User.findOne({ email: credentials.email }).select("+password +refreshToken");

                if (!user || !user.password) {
                    throw new Error("Invalid credentials");
                }

                const isMatch = await bcrypt.compare(credentials.password as string, user.password);
                if (!isMatch) {
                    throw new Error("Invalid credentials");
                }
                
                // Login Success: Generate Initial Refresh Token
                const refreshToken = crypto.randomBytes(32).toString("hex");
                const refreshHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
                
                // Save Hash to DB (Secure Storage)
                user.refreshToken = refreshHash;
                await user.save();

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    refreshToken, 
                };
            },
        }),
    ],
    // Callbacks are merged. If we need to override `jwt` to do rotation (which uses Node crypto/db),
    // we must define it HERE in auth.ts because auth.config.ts runs in Edge.
    callbacks: {
        ...authConfig.callbacks,
        async jwt({ token, user, trigger, session }) {
            // 1. Initial Sign In (Same as Config, but ensuring it runs)
            if (user) {
                return {
                    ...token,
                    uid: user.id,
                    role: (user as any).role,
                    refreshToken: (user as any).refreshToken,
                    accessTokenExpires: Date.now() + 15 * 60 * 1000,
                };
            }

            // 2. Token Validity Check
            if (Date.now() < (token.accessTokenExpires as number)) {
                return token;
            }

            // 3. Token Rotation (Expired) - RUNS ON NODE (Server Actions/APIs)
            if (process.env.NEXT_RUNTIME !== 'edge') {
                 console.log("Token Expired. Rotating in Node Runtime...");
                 return await rotateRefreshToken(token);
            }
            return token;
        },
    }
});

async function rotateRefreshToken(token: any) {
    // ... same implementation ...
    try {
        await connectToDatabase();
        
        // Fetch fresh user record
        const user = await User.findById(token.uid).select("+refreshToken");
        if (!user || !user.refreshToken) throw new Error("UserRevoked");
        
        // Verify Provided Refresh Token (Hash comparison)
        const incomingHash = crypto.createHash('sha256').update(token.refreshToken).digest('hex');

        if (incomingHash !== user.refreshToken) {
            console.error("Refresh Token Reuse Detected! Revoking all.");
            user.refreshToken = undefined;
            await user.save();
            return { ...token, error: "RefreshAccessTokenError" };
        }

        // Generate NEW Set
        const newRefreshToken = crypto.randomBytes(32).toString("hex");
        const newRefreshHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');

        // Update DB
        user.refreshToken = newRefreshHash;
        await user.save();

        return {
            ...token,
            refreshToken: newRefreshToken, // Send New Raw Token
            accessTokenExpires: Date.now() + 15 * 60 * 1000,
            iat: Math.floor(Date.now() / 1000),
        };

    } catch (error) {
        console.error("Token Rotation Failed:", error);
        return { ...token, error: "RefreshAccessTokenError" };
    }
}
