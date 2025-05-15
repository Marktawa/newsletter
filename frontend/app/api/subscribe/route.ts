import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { name, email } = await req.json();

    try {
        const response = await fetch(`$process.env.STRAPI_URL}/api/subscribers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
            },
            body: JSON.stringify({ data: { name, email } }),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data }, { status: response.status });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error", error },
            { status: 500 }
        );
    }
}