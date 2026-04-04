import { NextRequest, NextResponse } from "next/server";
import { getDb, randomUUID, saveDb } from "@/lib/db";

export async function POST(request: NextRequest) {
  const { name, email, password } = await request.json();
  const db = await getDb();
  const existing = db.exec("SELECT id FROM users WHERE email = ?", [email]);
  if (existing.length && existing[0].values.length) {
    return NextResponse.json({ error: "Email already exists" }, { status: 400 });
  }
  const id = randomUUID();
  db.run("INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)", [id, name, email, password]);
  db.run("INSERT INTO settings (id, user_id) VALUES (?, ?)", [randomUUID(), id]);
  saveDb();
  return NextResponse.json({ id, name, email });
}
