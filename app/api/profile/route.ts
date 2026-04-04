import { NextRequest, NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";

function getUserId(request: NextRequest): string | null {
  return request.headers.get("x-user-id");
}

function parseResults(results: any[]): any {
  if (!results.length || !results[0].values.length) return null;
  const cols = results[0].columns;
  const row = results[0].values[0];
  const obj: Record<string, any> = {};
  cols.forEach((col: string, i: number) => { obj[col] = row[i]; });
  return obj;
}

export async function GET(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await getDb();
  const results = db.exec("SELECT id, name, email FROM users WHERE id = ?", [userId]);
  return NextResponse.json(parseResults(results));
}

export async function PUT(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const db = await getDb();
  if (body.name || body.email) {
    db.run(
      "UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), updated_at = datetime('now') WHERE id = ?",
      [body.name || null, body.email || null, userId]
    );
    saveDb();
  }
  const results = db.exec("SELECT id, name, email FROM users WHERE id = ?", [userId]);
  return NextResponse.json(parseResults(results));
}
