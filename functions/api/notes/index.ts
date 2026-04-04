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
  const { results } = await context.env.DB.prepare("SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC").bind(userId).all();
  return new Response(JSON.stringify((results as any[]).map((n: any) => ({
    id: n.id, title: n.title, content: n.content, category: n.category,
    color: n.color, updatedAt: n.updated_at, isFavorite: !!n.is_favorite,
  }))), { headers: { "Content-Type": "application/json" } });
};

export const onRequestPost: PagesFunction<{ DB: D1Database }> = async (context) => {
  const userId = await auth(context);
  if (typeof userId !== "string") return userId;
  const data = await context.request.json();
  const id = randomUUID();
  await context.env.DB.prepare(
    "INSERT INTO notes (id, user_id, title, content, category, color, is_favorite) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).bind(id, userId, data.title, data.content || null, data.category, data.color, data.isFavorite ? 1 : 0).run();
  return new Response(JSON.stringify({ id, ...data, updatedAt: new Date().toISOString() }), { headers: { "Content-Type": "application/json" } });
};
