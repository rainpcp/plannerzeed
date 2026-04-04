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
  const results = db.exec("SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC", [userId]);
  const tasks = parseResults(results);
  return NextResponse.json(tasks.map(t => ({
    id: t.id, title: t.title, description: t.description, category: t.category,
    priority: t.priority, date: t.date, time: t.time, endTime: t.end_time,
    completed: !!t.completed, icon: t.icon, color: t.color,
  })));
}

export async function POST(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await request.json();
  const db = await getDb();
  const id = randomUUID();
  db.run(
    "INSERT INTO tasks (id, user_id, title, description, category, priority, date, time, end_time, icon, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [id, userId, data.title, data.description || null, data.category, data.priority, data.date || null, data.time || null, data.endTime || null, data.icon || "task", data.color || "primary"]
  );
  saveDb();
  return NextResponse.json({ id, ...data, completed: false });
}
