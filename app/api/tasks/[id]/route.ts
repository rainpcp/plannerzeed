import { NextRequest, NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";

function getUserId(request: NextRequest): string | null {
  return request.headers.get("x-user-id");
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  const db = await getDb();
  if (body.completed !== undefined) {
    db.run("UPDATE tasks SET completed = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?", [body.completed ? 1 : 0, id, userId]);
  }
  if (body.title) {
    db.run("UPDATE tasks SET title = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?", [body.title, id, userId]);
  }
  saveDb();
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const db = await getDb();
  db.run("DELETE FROM tasks WHERE id = ? AND user_id = ?", [id, userId]);
  saveDb();
  return NextResponse.json({ success: true });
}
