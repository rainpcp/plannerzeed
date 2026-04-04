import { Hono } from "hono";
import { cors } from "hono/cors";
import { randomUUID } from "node:crypto";

type Bindings = {
  DB: any;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("/*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

// Auth
app.post("/api/auth/register", async (c) => {
  const { name, email, password } = await c.req.json();
  const existing = await c.env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
  if (existing) return c.json({ error: "Email already exists" }, 400);
  const id = randomUUID();
  await c.env.DB.prepare("INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)").bind(id, name, email, password).run();
  await c.env.DB.prepare("INSERT INTO settings (id, user_id) VALUES (?, ?)").bind(randomUUID(), id).run();
  return c.json({ id, name, email });
});

app.post("/api/auth/login", async (c) => {
  const { email, password } = await c.req.json();
  const user = await c.env.DB.prepare("SELECT id, name, email FROM users WHERE email = ? AND password_hash = ?").bind(email, password).first() as { id: string; name: string; email: string } | null;
  if (!user) return c.json({ error: "Invalid credentials" }, 401);
  return c.json(user);
});

// Auth middleware
const auth = async (c: any, next: any) => {
  const userId = c.req.header("x-user-id");
  if (!userId) return c.json({ error: "Unauthorized" }, 401);
  const user = await c.env.DB.prepare("SELECT id FROM users WHERE id = ?").bind(userId).first();
  if (!user) return c.json({ error: "User not found" }, 401);
  c.set("userId", userId);
  await next();
};

// Tasks
app.get("/api/tasks", auth, async (c) => {
  const userId = c.get("userId");
  const { results } = await c.env.DB.prepare("SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC").bind(userId).all();
  return c.json((results as any[]).map((t: any) => ({
    id: t.id, title: t.title, description: t.description, category: t.category,
    priority: t.priority, date: t.date, time: t.time, endTime: t.end_time,
    completed: !!t.completed, icon: t.icon, color: t.color,
  })));
});

app.post("/api/tasks", auth, async (c) => {
  const userId = c.get("userId");
  const data = await c.req.json();
  const id = randomUUID();
  await c.env.DB.prepare(
    "INSERT INTO tasks (id, user_id, title, description, category, priority, date, time, end_time, icon, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(id, userId, data.title, data.description || null, data.category, data.priority, data.date || null, data.time || null, data.endTime || null, data.icon || "task", data.color || "primary").run();
  return c.json({ id, ...data, completed: false });
});

app.put("/api/tasks/:id", auth, async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  const body = await c.req.json();
  if (body.completed !== undefined) {
    await c.env.DB.prepare("UPDATE tasks SET completed = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?").bind(body.completed ? 1 : 0, id, userId).run();
  }
  if (body.title) {
    await c.env.DB.prepare("UPDATE tasks SET title = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?").bind(body.title, id, userId).run();
  }
  return c.json({ success: true });
});

app.delete("/api/tasks/:id", auth, async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  await c.env.DB.prepare("DELETE FROM tasks WHERE id = ? AND user_id = ?").bind(id, userId).run();
  return c.json({ success: true });
});

// Notes
app.get("/api/notes", auth, async (c) => {
  const userId = c.get("userId");
  const { results } = await c.env.DB.prepare("SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC").bind(userId).all();
  return c.json((results as any[]).map((n: any) => ({
    id: n.id, title: n.title, content: n.content, category: n.category,
    color: n.color, updatedAt: n.updated_at, isFavorite: !!n.is_favorite,
  })));
});

app.post("/api/notes", auth, async (c) => {
  const userId = c.get("userId");
  const data = await c.req.json();
  const id = randomUUID();
  await c.env.DB.prepare(
    "INSERT INTO notes (id, user_id, title, content, category, color, is_favorite) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).bind(id, userId, data.title, data.content || null, data.category, data.color, data.isFavorite ? 1 : 0).run();
  return c.json({ id, ...data, updatedAt: new Date().toISOString() });
});

app.put("/api/notes/:id", auth, async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  const body = await c.req.json();
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
    await c.env.DB.prepare(`UPDATE notes SET ${fields.join(", ")} WHERE id = ? AND user_id = ?`).bind(...values).run();
  }
  return c.json({ success: true });
});

app.delete("/api/notes/:id", auth, async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  await c.env.DB.prepare("DELETE FROM notes WHERE id = ? AND user_id = ?").bind(id, userId).run();
  return c.json({ success: true });
});

// Settings
app.get("/api/settings", auth, async (c) => {
  const userId = c.get("userId");
  const settings = await c.env.DB.prepare("SELECT * FROM settings WHERE user_id = ?").bind(userId).first() as any;
  if (!settings) return c.json({ pushNotifications: true, doNotDisturb: false, theme: "dark", accentColor: "#85adff", cloudSync: false });
  return c.json({
    pushNotifications: !!settings.push_notifications,
    doNotDisturb: !!settings.do_not_disturb,
    theme: settings.theme,
    accentColor: settings.accent_color,
    cloudSync: !!settings.cloud_sync,
  });
});

app.put("/api/settings", auth, async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json();
  const existing = await c.env.DB.prepare("SELECT id FROM settings WHERE user_id = ?").bind(userId).first();
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
      await c.env.DB.prepare(`UPDATE settings SET ${fields.join(", ")} WHERE user_id = ?`).bind(...values).run();
    }
  } else {
    const id = randomUUID();
    await c.env.DB.prepare(
      "INSERT INTO settings (id, user_id, push_notifications, do_not_disturb, theme, accent_color, cloud_sync) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind(id, userId, body.pushNotifications ? 1 : 0, body.doNotDisturb ? 1 : 0, body.theme || "dark", body.accentColor || "#85adff", body.cloudSync ? 1 : 0).run();
  }
  return c.json({ success: true });
});

// Profile
app.get("/api/profile", auth, async (c) => {
  const userId = c.get("userId");
  const user = await c.env.DB.prepare("SELECT id, name, email FROM users WHERE id = ?").bind(userId).first();
  return c.json(user);
});

app.put("/api/profile", auth, async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json();
  if (body.name || body.email) {
    await c.env.DB.prepare(
      "UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), updated_at = datetime('now') WHERE id = ?"
    ).bind(body.name || null, body.email || null, userId).run();
  }
  const user = await c.env.DB.prepare("SELECT id, name, email FROM users WHERE id = ?").bind(userId).first();
  return c.json(user);
});

export default app;
