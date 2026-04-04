import { randomUUID } from "node:crypto";

export const onRequestPost: PagesFunction<{ DB: D1Database }> = async (context) => {
  const { name, email, password } = await context.request.json();
  const existing = await context.env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
  if (existing) return new Response(JSON.stringify({ error: "Email already exists" }), { status: 400, headers: { "Content-Type": "application/json" } });
  const id = randomUUID();
  await context.env.DB.prepare("INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)").bind(id, name, email, password).run();
  await context.env.DB.prepare("INSERT INTO settings (id, user_id) VALUES (?, ?)").bind(randomUUID(), id).run();
  return new Response(JSON.stringify({ id, name, email }), { headers: { "Content-Type": "application/json" } });
};
