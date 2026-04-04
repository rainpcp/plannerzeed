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
  const user = await context.env.DB.prepare("SELECT id, name, email FROM users WHERE id = ?").bind(userId).first();
  return new Response(JSON.stringify(user), { headers: { "Content-Type": "application/json" } });
};

export const onRequestPut: PagesFunction<{ DB: D1Database }> = async (context) => {
  const userId = await auth(context);
  if (typeof userId !== "string") return userId;
  const body = await context.request.json();
  if (body.name || body.email) {
    await context.env.DB.prepare(
      "UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), updated_at = datetime('now') WHERE id = ?"
    ).bind(body.name || null, body.email || null, userId).run();
  }
  const user = await context.env.DB.prepare("SELECT id, name, email FROM users WHERE id = ?").bind(userId).first();
  return new Response(JSON.stringify(user), { headers: { "Content-Type": "application/json" } });
};
