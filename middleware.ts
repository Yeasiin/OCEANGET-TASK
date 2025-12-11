import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard"];

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const path = req.nextUrl.pathname;

    const isProtectedRoute = protectedRoutes.includes(path);

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
    if (token && !isProtectedRoute) {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    if (path === "/") {
        if (token) {
            return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
        } else {
            return NextResponse.redirect(new URL("/login", req.nextUrl));
        }
    }


    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
