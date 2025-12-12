import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request : NextRequest) {
    const token = await getToken({req : request})
    const url = request.nextUrl;

    if (
        token && 
            (url.pathname === '/' ||
            url.pathname.startsWith('/login') ||
            url.pathname.startsWith('/register') ||
            url.pathname.startsWith('/verify-code')
        )
    ) {
        return NextResponse.redirect(new URL("/dashboard",request.url));
    }

    if(!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login',request.url));
    }

    return NextResponse.next();

}
export const config = {
    matcher : [
        "/dashboard/:path",
        "/register",
        "/login",
        "/",
        "/verify-code"
    ]
}