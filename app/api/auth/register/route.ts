import { NextRequest, NextResponse } from "next/server";
import { handleRegister } from "@/lib/api-handlers";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();
    const result = await handleRegister(name, email, password);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
