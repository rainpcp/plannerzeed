import { NextRequest, NextResponse } from "next/server";
import { getDb, randomUUID, saveDb } from "@/lib/db";

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
  const results = db.exec("SELECT * FROM settings WHERE user_id = ?", [userId]);
  const settings = parseResults(results);
  if (!settings) return NextResponse.json({ pushNotifications: true, doNotDisturb: false, theme: "dark", accentColor: "#85adff", cloudSync: false });
  return NextResponse.json({
    pushNotifications: !!settings.push_notifications,
    doNotDisturb: !!settings.do_not_disturb,
    theme: settings.theme,
    accentColor: settings.accent_color,
    cloudSync: !!settings.cloud_sync,
  });
}

export async function PUT(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const db = await getDb();
  const existing = db.exec("SELECT id FROM settings WHERE user_id = ?", [userId]);
  const hasExisting = existing.length && existing[0].values.length;
  if (hasExisting) {
    const updates: string[] = [];
    const values: any[] = [];
    if (body.pushNotifications !== undefined) { updates.push("push_notifications = ?"); values.push(body.pushNotifications ? 1 : 0); }
    if (body.doNotDisturb !== undefined) { updates.push("do_not_disturb = ?"); values.push(body.doNotDisturb ? 1 : 0); }
    if (body.theme) { updates.push("theme = ?"); values.push(body.theme); }
    if (body.accentColor) { updates.push("accent_color = ?"); values.push(body.accentColor); }
    if (body.cloudSync !== undefined) { updates.push("cloud_sync = ?"); values.push(body.cloudSync ? 1 : 0); }
    if (updates.length > 0) {
      updates.push("updated_at = datetime('now')");
      values.push(userId);
      db.run(`UPDATE settings SET ${updates.join(", ")} WHERE user_id = ?`, values);
    }
  } else {
    const id = randomUUID();
    db.run(
      "INSERT INTO settings (id, user_id, push_notifications, do_not_disturb, theme, accent_color, cloud_sync) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, userId, body.pushNotifications ? 1 : 0, body.doNotDisturb ? 1 : 0, body.theme || "dark", body.accentColor || "#85adff", body.cloudSync ? 1 : 0]
    );
  }
  saveDb();
  return NextResponse.json({ success: true });
}
