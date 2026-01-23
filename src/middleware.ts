import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { pathname } = req.nextUrl;
    const role = req.auth?.user?.role;

    // Define Protected Zones
    const isAdminRoute = pathname.startsWith("/admin");
    const isProfileRoute = pathname.startsWith("/profile");
    const isCheckoutRoute = pathname.startsWith("/checkout");
    
    // API Protection Zones
    const isApiAdmin = pathname.startsWith("/api/admin");
    const isApiProtected = pathname.startsWith("/api/orders") || pathname.startsWith("/api/cart") || pathname.startsWith("/api/upload");

    // 1. API Protection (JSON Response)
    if (isApiAdmin) {
        if (!isLoggedIn || role !== "admin") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }
    }

    if (isApiProtected) {
        if (!isLoggedIn) {
             return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }
    }

    // 2. Page Protection (Redirects)
    if (isAdminRoute) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/login", req.nextUrl));
        }
        if (role !== "admin") {
            return NextResponse.redirect(new URL("/", req.nextUrl));
        }
    }

    if ((isProfileRoute || isCheckoutRoute) && !isLoggedIn) {
        return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req.nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|images).*)",
    ],
};
