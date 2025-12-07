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
                    return null;
                }

                try {
                    console.log("Authorize called with:", credentials?.email);
                    await connectToDatabase();
                    const user = await User.findOne({ email: credentials.email }).select("+password");

                    if (!user) {
                        console.log("User not found:", credentials?.email);
                        throw new Error("Invalid credentials");
                    }

                    const isMatch = await bcrypt.compare(credentials.password as string, user.password);

                    if (!isMatch) {
                        console.log("Password mismatch for:", credentials?.email);
                        throw new Error("Invalid credentials");
                    }

                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    };
                } catch (error) {
                    console.error("Auth error:", error);
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
