import { NextRequest, NextResponse } from "next/server";
import { handleToggleTask, handleDeleteTask } from "@/lib/api-handlers";

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
  if (body.completed !== undefined) {
    const result = await handleToggleTask(id, body.completed, userId);
    return NextResponse.json(result);
  }
  return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const result = await handleDeleteTask(id, userId);
  return NextResponse.json(result);
}
