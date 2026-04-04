import { randomUUID } from "node:crypto";

type Env = { DB: D1Database };

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

function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}

async function handleAuthLogin(context: any): Promise<Response> {
  const { email, password } = await context.request.json();
  const user = await context.env.DB.prepare("SELECT id, name, email FROM users WHERE email = ? AND password_hash = ?").bind(email, password).first() as { id: string; name: string; email: string } | null;
  if (!user) return jsonResponse({ error: "Invalid credentials" }, 401);
  return jsonResponse(user);
}

async function handleAuthRegister(context: any): Promise<Response> {
  const { name, email, password } = await context.request.json();
  const existing = await context.env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
  if (existing) return jsonResponse({ error: "Email already exists" }, 400);
  const id = randomUUID();
  await context.env.DB.prepare("INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)").bind(id, name, email, password).run();
  await context.env.DB.prepare("INSERT INTO settings (id, user_id) VALUES (?, ?)").bind(randomUUID(), id).run();
  return jsonResponse({ id, name, email });
}

async function handleProfileGet(context: any): Promise<Response> {
  const userId = await auth(context);
  if (typeof userId !== "string") return userId;
  const user = await context.env.DB.prepare("SELECT id, name, email FROM users WHERE id = ?").bind(userId).first();
  return jsonResponse(user);
}

async function handleProfilePut(context: any): Promise<Response> {
  const userId = await auth(context);
  if (typeof userId !== "string") return userId;
  const body = await context.request.json();
  if (body.name || body.email) {
    await context.env.DB.prepare(
      "UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), updated_at = datetime('now') WHERE id = ?"
    ).bind(body.name || null, body.email || null, userId).run();
  }
  const user = await context.env.DB.prepare("SELECT id, name, email FROM users WHERE id = ?").bind(userId).first();
  return jsonResponse(user);
}

async function handleSettingsGet(context: any): Promise<Response> {
  const userId = await auth(context);
  if (typeof userId !== "string") return userId;
  const settings = await context.env.DB.prepare("SELECT * FROM settings WHERE user_id = ?").bind(userId).first() as any;
  if (!settings) return jsonResponse({ pushNotifications: true, doNotDisturb: false, theme: "dark", accentColor: "#85adff", cloudSync: false });
  return jsonResponse({
    pushNotifications: !!settings.push_notifications,
    doNotDisturb: !!settings.do_not_disturb,
    theme: settings.theme,
    accentColor: settings.accent_color,
    cloudSync: !!settings.cloud_sync,
  });
}

async function handleSettingsPut(context: any): Promise<Response> {
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
  return jsonResponse({ success: true });
}

async function handleNotesGet(context: any): Promise<Response> {
  const userId = await auth(context);
  if (typeof userId !== "string") return userId;
  const { results } = await context.env.DB.prepare("SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC").bind(userId).all();
  return jsonResponse((results as any[]).map((n: any) => ({
    id: n.id, title: n.title, content: n.content, category: n.category,
    color: n.color, updatedAt: n.updated_at, isFavorite: !!n.is_favorite,
  })));
}

async function handleNotesPost(context: any): Promise<Response> {
  const userId = await auth(context);
  if (typeof userId !== "string") return userId;
  const data = await context.request.json();
  const id = randomUUID();
  await context.env.DB.prepare(
    "INSERT INTO notes (id, user_id, title, content, category, color, is_favorite) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).bind(id, userId, data.title, data.content || null, data.category, data.color, data.isFavorite ? 1 : 0).run();
  return jsonResponse({ id, ...data, updatedAt: new Date().toISOString() });
}

async function handleNotesPut(context: any, id: string): Promise<Response> {
  const userId = await auth(context);
  if (typeof userId !== "string") return userId;
  const body = await context.request.json();
  const fields: string[] = [];
  const values: any[] = [];
  if (body.title) { fields.push("title = ?"); values.push(body.title); }
  if (body.content !== undefined) { fields.push("content = ?"); values.push(body.content); }
  if (body.category) { fields.push("category = ?"); values.push(body.category); }
  if (body.color) { fields.push("color = ?"); values.push(body.color); }
  if (body.isFavorite !== undefined) { fields.push("is_favorite = ?"); values.push(body.isFavorite ? 1 : 0); }
  fields.push("updated_at = datetime('now')");
  values.push(id, userId);
  if (fields.length > 1) {
    await context.env.DB.prepare(`UPDATE notes SET ${fields.join(", ")} WHERE id = ? AND user_id = ?`).bind(...values).run();
  }
  return jsonResponse({ success: true });
}

async function handleNotesDelete(context: any, id: string): Promise<Response> {
  const userId = await auth(context);
  if (typeof userId !== "string") return userId;
  await context.env.DB.prepare("DELETE FROM notes WHERE id = ? AND user_id = ?").bind(id, userId).run();
  return jsonResponse({ success: true });
}

async function handleTasksGet(context: any): Promise<Response> {
  const userId = await auth(context);
  if (typeof userId !== "string") return userId;
  const { results } = await context.env.DB.prepare("SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC").bind(userId).all();
  return jsonResponse((results as any[]).map((t: any) => ({
    id: t.id, title: t.title, description: t.description, category: t.category,
    priority: t.priority, date: t.date, time: t.time, endTime: t.end_time,
    completed: !!t.completed, icon: t.icon, color: t.color,
  })));
}

async function handleTasksPost(context: any): Promise<Response> {
  const userId = await auth(context);
  if (typeof userId !== "string") return userId;
  const data = await context.request.json();
  const id = randomUUID();
  await context.env.DB.prepare(
    "INSERT INTO tasks (id, user_id, title, description, category, priority, date, time, end_time, icon, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(id, userId, data.title, data.description || null, data.category, data.priority, data.date || null, data.time || null, data.endTime || null, data.icon || "task", data.color || "primary").run();
  return jsonResponse({ id, ...data, completed: false });
}

async function handleTasksPut(context: any, id: string): Promise<Response> {
  const userId = await auth(context);
  if (typeof userId !== "string") return userId;
  const body = await context.request.json();
  if (body.completed !== undefined) {
    await context.env.DB.prepare("UPDATE tasks SET completed = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?").bind(body.completed ? 1 : 0, id, userId).run();
  }
  if (body.title) {
    await context.env.DB.prepare("UPDATE tasks SET title = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?").bind(body.title, id, userId).run();
  }
  return jsonResponse({ success: true });
}

async function handleTasksDelete(context: any, id: string): Promise<Response> {
  const userId = await auth(context);
  if (typeof userId !== "string") return userId;
  await context.env.DB.prepare("DELETE FROM tasks WHERE id = ? AND user_id = ?").bind(id, userId).run();
  return jsonResponse({ success: true });
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname;
  const method = context.request.method;

  if (pathname === "/api/auth/login" && method === "POST") {
    return handleAuthLogin(context);
  }
  if (pathname === "/api/auth/register" && method === "POST") {
    return handleAuthRegister(context);
  }
  if (pathname === "/api/profile" && method === "GET") {
    return handleProfileGet(context);
  }
  if (pathname === "/api/profile" && method === "PUT") {
    return handleProfilePut(context);
  }
  if (pathname === "/api/settings" && method === "GET") {
    return handleSettingsGet(context);
  }
  if (pathname === "/api/settings" && method === "PUT") {
    return handleSettingsPut(context);
  }
  if (pathname === "/api/notes" && method === "GET") {
    return handleNotesGet(context);
  }
  if (pathname === "/api/notes" && method === "POST") {
    return handleNotesPost(context);
  }
  if (pathname.startsWith("/api/notes/") && method === "PUT") {
    const id = pathname.replace("/api/notes/", "");
    return handleNotesPut(context, id);
  }
  if (pathname.startsWith("/api/notes/") && method === "DELETE") {
    const id = pathname.replace("/api/notes/", "");
    return handleNotesDelete(context, id);
  }
  if (pathname === "/api/tasks" && method === "GET") {
    return handleTasksGet(context);
  }
  if (pathname === "/api/tasks" && method === "POST") {
    return handleTasksPost(context);
  }
  if (pathname.startsWith("/api/tasks/") && method === "PUT") {
    const id = pathname.replace("/api/tasks/", "");
    return handleTasksPut(context, id);
  }
  if (pathname.startsWith("/api/tasks/") && method === "DELETE") {
    const id = pathname.replace("/api/tasks/", "");
    return handleTasksDelete(context, id);
  }

  return new Response("Not Found", { status: 404 });
};
