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

export const onRequestPut: PagesFunction<{ DB: D1Database }> = async (context) => {
  const userId = await auth(context);
  if (typeof userId !== "string") return userId;
  const id = context.params.id;
  const body = await context.request.json();
  if (body.completed !== undefined) {
    await context.env.DB.prepare("UPDATE tasks SET completed = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?").bind(body.completed ? 1 : 0, id, userId).run();
  }
  if (body.title) {
    await context.env.DB.prepare("UPDATE tasks SET title = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?").bind(body.title, id, userId).run();
  }
  return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
};

export const onRequestDelete: PagesFunction<{ DB: D1Database }> = async (context) => {
  const userId = await auth(context);
  if (typeof userId !== "string") return userId;
  const id = context.params.id;
  await context.env.DB.prepare("DELETE FROM tasks WHERE id = ? AND user_id = ?").bind(id, userId).run();
  return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
};
