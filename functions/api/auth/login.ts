export const onRequestPost: PagesFunction<{ DB: D1Database }> = async (context) => {
  const { email, password } = await context.request.json();
  const user = await context.env.DB.prepare("SELECT id, name, email FROM users WHERE email = ? AND password_hash = ?").bind(email, password).first() as { id: string; name: string; email: string } | null;
  if (!user) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401, headers: { "Content-Type": "application/json" } });
  return new Response(JSON.stringify(user), { headers: { "Content-Type": "application/json" } });
};
