import { NextRequest, NextResponse } from "next/server";
import { getDb, randomUUID, saveDb } from "@/lib/db";

function getUserId(request: NextRequest): string | null {
  return request.headers.get("x-user-id");
}

function parseResults(results: any[]): any[] {
  if (!results.length) return [];
  const cols = results[0].columns;
  return results[0].values.map((row: any[]) => {
    const obj: Record<string, any> = {};
    cols.forEach((col: string, i: number) => { obj[col] = row[i]; });
    return obj;
  });
}

export async function GET(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await getDb();
  const results = db.exec("SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC", [userId]);
  const notes = parseResults(results);
  return NextResponse.json(notes.map(n => ({
    id: n.id, title: n.title, content: n.content, category: n.category,
    color: n.color, updatedAt: n.updated_at, isFavorite: !!n.is_favorite,
  })));
}

export async function POST(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await request.json();
  const db = await getDb();
  const id = randomUUID();
  db.run(
    "INSERT INTO notes (id, user_id, title, content, category, color, is_favorite) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id, userId, data.title, data.content || null, data.category, data.color, data.isFavorite ? 1 : 0]
  );
  saveDb();
  return NextResponse.json({ id, ...data, updatedAt: new Date().toISOString() });
}
