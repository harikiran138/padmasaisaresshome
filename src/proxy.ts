import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
    const session = await auth();
    const { pathname } = request.nextUrl;

    // specific route protection
    const isAdminRoute = pathname.startsWith("/admin");
    const isAccountRoute = pathname.startsWith("/account");

    if (isAdminRoute || isAccountRoute) {
        if (!session) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        // Role based protection for admin
        if (isAdminRoute && session.user.role !== "admin") {
            return NextResponse.redirect(new URL("/account", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/account/:path*"],
};
