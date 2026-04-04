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
  return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
};

export const onRequestDelete: PagesFunction<{ DB: D1Database }> = async (context) => {
  const userId = await auth(context);
  if (typeof userId !== "string") return userId;
  const id = context.params.id;
  await context.env.DB.prepare("DELETE FROM notes WHERE id = ? AND user_id = ?").bind(id, userId).run();
  return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
};
