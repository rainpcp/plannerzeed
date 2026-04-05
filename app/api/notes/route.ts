import { NextRequest, NextResponse } from "next/server";
import { handleGetNotes, handleCreateNote } from "@/lib/api-handlers";

function getUserId(request: NextRequest): string | null {
  return request.headers.get("x-user-id");
}

export async function GET(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const notes = await handleGetNotes(userId);
  return NextResponse.json(notes);
}

export async function POST(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const note = await handleCreateNote(body, userId);
  return NextResponse.json(note);
}
