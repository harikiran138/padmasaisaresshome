import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, // 7 Days
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith("/admin");
            const isOnProfile = nextUrl.pathname.startsWith("/profile");
            
            if (isOnAdmin) {
                if (isLoggedIn && auth?.user?.role === "admin") return true;
                return false; // Redirect to login
            }
            if (isOnProfile) {
                if (isLoggedIn) return true;
                return false;
            }
            return true;
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                return {
                    ...token,
                    uid: user.id,
                    role: (user as any).role,
                    refreshToken: (user as any).refreshToken,
                    accessTokenExpires: Date.now() + 15 * 60 * 1000,
                };
            }
            // Just return token in Edge context (Middleware doesn't need rotation)
            // Logic for rotation will stay in auth.ts (Node) or be omitted in Edge check?
            // Middleware DOES decrypt JWT. It runs this callback?
            // "jwt" callback runs on session access. if Middleware calls `auth()`, it runs.
            return token; 
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.uid as string;
                (session.user as any).role = token.role as string;
                (session as any).error = token.error;
            }
            return session;
        },
    },
    providers: [], // Empty for Edge
} satisfies NextAuthConfig;
