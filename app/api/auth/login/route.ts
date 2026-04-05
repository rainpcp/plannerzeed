import { NextRequest, NextResponse } from "next/server";
import { handleLogin } from "@/lib/api-handlers";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const result = await handleLogin(email, password);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(result.user);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
