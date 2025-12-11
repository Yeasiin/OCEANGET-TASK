import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const response = await axios.post(
            "https://reqres.in/api/login",
            body, {
            headers: { "x-api-key": process.env.REQRES_API_KEY || "" },
        }
        );

        const token = response.data.token;
        const res = NextResponse.json({ success: true });
        res.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60,
            secure: true,
            sameSite: "lax",
        });

        return res;
    } catch (err: any) {
        return NextResponse.json(
            { error: err.response?.data?.error || "Login failed" },
            { status: 401 }
        );
    }
}
