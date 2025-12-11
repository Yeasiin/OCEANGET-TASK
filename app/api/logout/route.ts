import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const res = NextResponse.json({ message: "Logged out successfully" });
        res.cookies.set({
            name: "token",
            value: "",
            maxAge: 0,
            path: "/",
        });

        return res;
    } catch (error) {
        return NextResponse.json(
            { error: "Logout failed" },
            { status: 500 }
        );
    }
}
