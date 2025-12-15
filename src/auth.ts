import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// Extended types for session
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
        }
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) {
                    console.log("[Auth] Missing credentials");
                    return null;
                }

                try {
                    console.log("[Auth] Authorize called with:", credentials?.email);

                    try {
                        await connectToDatabase();
                        console.log("[Auth] Database connected");
                    } catch (dbError) {
                        console.error("[Auth] Database connection failed:", dbError);
                        throw new Error("Database connection failed");
                    }

                    const user = await User.findOne({ email: credentials.email }).select("+password");
                    console.log("[Auth] User lookup result:", user ? "Found" : "Not Found");

                    if (!user) {
                        console.log("[Auth] User not found for email:", credentials?.email);
                        throw new Error("Invalid credentials");
                    }

                    console.log("[Auth] Verifying password...");
                    const isMatch = await bcrypt.compare(credentials.password as string, user.password);
                    console.log("[Auth] Password match result:", isMatch);

                    if (!isMatch) {
                        console.log("[Auth] Password mismatch for:", credentials?.email);
                        throw new Error("Invalid credentials");
                    }

                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    };
                } catch (error) {
                    console.error("[Auth] Detailed Auth error:", error);
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (token) {
                session.user.role = token.role;
                session.user.id = token.id;
            }
            return session;
        },
    },
    secret: process.env.AUTH_SECRET,
});
