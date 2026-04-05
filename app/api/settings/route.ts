import { NextRequest, NextResponse } from "next/server";
import { handleGetSettings, handleUpdateSettings } from "@/lib/api-handlers";

function getUserId(request: NextRequest): string | null {
  return request.headers.get("x-user-id");
}

export async function GET(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const settings = await handleGetSettings(userId);
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const result = await handleUpdateSettings(body, userId);
  return NextResponse.json(result);
}
