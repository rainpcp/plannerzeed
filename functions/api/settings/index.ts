import { randomUUID } from "node:crypto";

function getUserId(context: any): string | null {
  return context.request.headers.get("x-user-id");
}

async function auth(context: any): Promise<string | Response> {
  const userId = getUserId(context);
  if (!userId) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  const user = await context.env.DB.prepare("SELECT id FROM users WHERE id = ?").bind(userId).first();
  if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 401, headers: { "Content-Type": "application/json" } });
  return userId;
}

export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  const userId = await auth(context);
  if (typeof userId !== "string") return userId;
  const settings = await context.env.DB.prepare("SELECT * FROM settings WHERE user_id = ?").bind(userId).first() as any;
  if (!settings) return new Response(JSON.stringify({ pushNotifications: true, doNotDisturb: false, theme: "dark", accentColor: "#85adff", cloudSync: false }), { headers: { "Content-Type": "application/json" } });
  return new Response(JSON.stringify({
    pushNotifications: !!settings.push_notifications,
    doNotDisturb: !!settings.do_not_disturb,
    theme: settings.theme,
    accentColor: settings.accent_color,
    cloudSync: !!settings.cloud_sync,
  }), { headers: { "Content-Type": "application/json" } });
};

export const onRequestPut: PagesFunction<{ DB: D1Database }> = async (context) => {
  const userId = await auth(context);
  if (typeof userId !== "string") return userId;
  const body = await context.request.json();
  const existing = await context.env.DB.prepare("SELECT id FROM settings WHERE user_id = ?").bind(userId).first();
  if (existing) {
    const fields: string[] = [];
    const values: any[] = [];
    if (body.pushNotifications !== undefined) { fields.push("push_notifications = ?"); values.push(body.pushNotifications ? 1 : 0); }
    if (body.doNotDisturb !== undefined) { fields.push("do_not_disturb = ?"); values.push(body.doNotDisturb ? 1 : 0); }
    if (body.theme) { fields.push("theme = ?"); values.push(body.theme); }
    if (body.accentColor) { fields.push("accent_color = ?"); values.push(body.accentColor); }
    if (body.cloudSync !== undefined) { fields.push("cloud_sync = ?"); values.push(body.cloudSync ? 1 : 0); }
    if (fields.length > 0) {
      fields.push("updated_at = datetime('now')");
      values.push(userId);
      await context.env.DB.prepare(`UPDATE settings SET ${fields.join(", ")} WHERE user_id = ?`).bind(...values).run();
    }
  } else {
    const id = randomUUID();
    await context.env.DB.prepare(
      "INSERT INTO settings (id, user_id, push_notifications, do_not_disturb, theme, accent_color, cloud_sync) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind(id, userId, body.pushNotifications ? 1 : 0, body.doNotDisturb ? 1 : 0, body.theme || "dark", body.accentColor || "#85adff", body.cloudSync ? 1 : 0).run();
  }
  return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
};
