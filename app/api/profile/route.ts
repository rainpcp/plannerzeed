import { NextRequest, NextResponse } from "next/server";
import { handleGetProfile, handleUpdateProfile } from "@/lib/api-handlers";

function getUserId(request: NextRequest): string | null {
  return request.headers.get("x-user-id");
}

export async function GET(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const profile = await handleGetProfile(userId);
  if (!profile) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }
  return NextResponse.json(profile);
}

export async function PUT(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const profile = await handleUpdateProfile(body, userId);
  return NextResponse.json(profile);
}
