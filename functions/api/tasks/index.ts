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
  const { results } = await context.env.DB.prepare("SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC").bind(userId).all();
  return new Response(JSON.stringify((results as any[]).map((t: any) => ({
    id: t.id, title: t.title, description: t.description, category: t.category,
    priority: t.priority, date: t.date, time: t.time, endTime: t.end_time,
    completed: !!t.completed, icon: t.icon, color: t.color,
  }))), { headers: { "Content-Type": "application/json" } });
};

export const onRequestPost: PagesFunction<{ DB: D1Database }> = async (context) => {
  const userId = await auth(context);
  if (typeof userId !== "string") return userId;
  const data = await context.request.json();
  const id = randomUUID();
  await context.env.DB.prepare(
    "INSERT INTO tasks (id, user_id, title, description, category, priority, date, time, end_time, icon, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(id, userId, data.title, data.description || null, data.category, data.priority, data.date || null, data.time || null, data.endTime || null, data.icon || "task", data.color || "primary").run();
  return new Response(JSON.stringify({ id, ...data, completed: false }), { headers: { "Content-Type": "application/json" } });
};
