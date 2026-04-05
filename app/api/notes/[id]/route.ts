import { NextRequest, NextResponse } from "next/server";
import { handleUpdateNote, handleDeleteNote } from "@/lib/api-handlers";

function getUserId(request: NextRequest): string | null {
  return request.headers.get("x-user-id");
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const result = await handleUpdateNote(id, body, userId);
  return NextResponse.json(result);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const result = await handleDeleteNote(id, userId);
  return NextResponse.json(result);
}
