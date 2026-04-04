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
  if (body.title) db.run("UPDATE notes SET title = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?", [body.title, id, userId]);
  if (body.content !== undefined) db.run("UPDATE notes SET content = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?", [body.content, id, userId]);
  if (body.category) db.run("UPDATE notes SET category = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?", [body.category, id, userId]);
  if (body.color) db.run("UPDATE notes SET color = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?", [body.color, id, userId]);
  if (body.isFavorite !== undefined) db.run("UPDATE notes SET is_favorite = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?", [body.isFavorite ? 1 : 0, id, userId]);
  saveDb();
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const db = await getDb();
  db.run("DELETE FROM notes WHERE id = ? AND user_id = ?", [id, userId]);
  saveDb();
  return NextResponse.json({ success: true });
}
