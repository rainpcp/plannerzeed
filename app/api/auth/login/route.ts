import { NextRequest, NextResponse } from "next/server";
import { getDb, randomUUID, saveDb } from "@/lib/db";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  const db = await getDb();
  const results = db.exec(
    "SELECT id, name, email FROM users WHERE email = ? AND password_hash = ?",
    [email, password]
  );
  if (!results.length || !results[0].values.length) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const cols = results[0].columns;
  const row = results[0].values[0];
  const user: Record<string, any> = {};
  cols.forEach((col: string, i: number) => { user[col] = row[i]; });
  return NextResponse.json(user);
}
