import pool from "./d1";
import type { Task, Note, Settings, UserProfile } from "./types";

export async function handleLogin(email: string, password: string) {
  const result = await pool.query<{ id: string; name: string; email: string }>(
    "SELECT id, name, email FROM users WHERE email = ? AND password_hash = ?",
    [email, password]
  );
  if (result.rows.length === 0) return { error: "Invalid credentials", status: 401 };
  return { user: result.rows[0] };
}

export async function handleRegister(name: string, email: string, password: string) {
  const existing = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
  if (existing.rows.length > 0) return { error: "Email already exists", status: 400 };
  const id = crypto.randomUUID();
  await pool.query(
    "INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)",
    [id, name, email, password]
  );
  await pool.query(
    "INSERT INTO settings (id, user_id) VALUES (?, ?)",
    [crypto.randomUUID(), id]
  );
  return { id, name, email };
}

export async function handleGetProfile(userId: string) {
  const result = await pool.query("SELECT id, name, email FROM users WHERE id = ?", [userId]);
  return result.rows[0] || null;
}

export async function handleUpdateProfile(updates: { name?: string; email?: string }, userId: string) {
  if (updates.name || updates.email) {
    await pool.query(
      "UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), updated_at = datetime('now') WHERE id = ?",
      [updates.name || null, updates.email || null, userId]
    );
  }
  const result = await pool.query("SELECT id, name, email FROM users WHERE id = ?", [userId]);
  return result.rows[0] || null;
}

export async function handleGetSettings(userId: string) {
  const result = await pool.query("SELECT * FROM settings WHERE user_id = ?", [userId]);
  const settings = result.rows[0];
  if (!settings) return { pushNotifications: true, doNotDisturb: false, theme: "dark", accentColor: "#85adff", cloudSync: false };
  return {
    pushNotifications: !!settings.push_notifications,
    doNotDisturb: !!settings.do_not_disturb,
    theme: settings.theme,
    accentColor: settings.accent_color,
    cloudSync: !!settings.cloud_sync,
  };
}

export async function handleUpdateSettings(updates: Partial<Settings>, userId: string) {
  const existing = await pool.query("SELECT id FROM settings WHERE user_id = ?", [userId]);
  if (existing.rows.length > 0) {
    const fields: string[] = [];
    const values: any[] = [];
    if (updates.pushNotifications !== undefined) { fields.push("push_notifications = ?"); values.push(updates.pushNotifications ? 1 : 0); }
    if (updates.doNotDisturb !== undefined) { fields.push("do_not_disturb = ?"); values.push(updates.doNotDisturb ? 1 : 0); }
    if (updates.theme) { fields.push("theme = ?"); values.push(updates.theme); }
    if (updates.accentColor) { fields.push("accent_color = ?"); values.push(updates.accentColor); }
    if (updates.cloudSync !== undefined) { fields.push("cloud_sync = ?"); values.push(updates.cloudSync ? 1 : 0); }
    if (fields.length > 0) {
      fields.push("updated_at = datetime('now')");
      values.push(userId);
      await pool.query(`UPDATE settings SET ${fields.join(", ")} WHERE user_id = ?`, values);
    }
  } else {
    const id = crypto.randomUUID();
    await pool.query(
      "INSERT INTO settings (id, user_id, push_notifications, do_not_disturb, theme, accent_color, cloud_sync) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, userId, updates.pushNotifications ? 1 : 0, updates.doNotDisturb ? 1 : 0, updates.theme || "dark", updates.accentColor || "#85adff", updates.cloudSync ? 1 : 0]
    );
  }
  return { success: true };
}

export async function handleGetNotes(userId: string) {
  const result = await pool.query(
    "SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC",
    [userId]
  );
  return result.rows.map((n: any) => ({
    id: n.id, title: n.title, content: n.content, category: n.category,
    color: n.color, updatedAt: n.updated_at, isFavorite: !!n.is_favorite,
  }));
}

export async function handleCreateNote(note: any, userId: string) {
  const id = crypto.randomUUID();
  await pool.query(
    "INSERT INTO notes (id, user_id, title, content, category, color, is_favorite) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id, userId, note.title, note.content || null, note.category, note.color, note.isFavorite ? 1 : 0]
  );
  return { id, ...note, updatedAt: new Date().toISOString() };
}

export async function handleUpdateNote(id: string, updates: any, userId: string) {
  const fields: string[] = [];
  const values: any[] = [];
  if (updates.title) { fields.push("title = ?"); values.push(updates.title); }
  if (updates.content !== undefined) { fields.push("content = ?"); values.push(updates.content); }
  if (updates.category) { fields.push("category = ?"); values.push(updates.category); }
  if (updates.color) { fields.push("color = ?"); values.push(updates.color); }
  if (updates.isFavorite !== undefined) { fields.push("is_favorite = ?"); values.push(updates.isFavorite ? 1 : 0); }
  fields.push("updated_at = datetime('now')");
  values.push(id, userId);
  if (fields.length > 1) {
    await pool.query(`UPDATE notes SET ${fields.join(", ")} WHERE id = ? AND user_id = ?`, values);
  }
  return { success: true };
}

export async function handleDeleteNote(id: string, userId: string) {
  await pool.query("DELETE FROM notes WHERE id = ? AND user_id = ?", [id, userId]);
  return { success: true };
}

export async function handleGetTasks(userId: string) {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC",
    [userId]
  );
  return result.rows.map((t: any) => ({
    id: t.id, title: t.title, description: t.description, category: t.category,
    priority: t.priority, date: t.date, time: t.time, endTime: t.end_time,
    completed: !!t.completed, icon: t.icon, color: t.color,
  }));
}

export async function handleCreateTask(task: any, userId: string) {
  const id = crypto.randomUUID();
  await pool.query(
    "INSERT INTO tasks (id, user_id, title, description, category, priority, date, time, end_time, icon, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [id, userId, task.title, task.description || null, task.category, task.priority, task.date || null, task.time || null, task.endTime || null, task.icon || "task", task.color || "primary"]
  );
  return { id, ...task, completed: false };
}

export async function handleToggleTask(id: string, completed: boolean, userId: string) {
  await pool.query(
    "UPDATE tasks SET completed = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?",
    [completed ? 1 : 0, id, userId]
  );
  return { success: true };
}

export async function handleDeleteTask(id: string, userId: string) {
  await pool.query("DELETE FROM tasks WHERE id = ? AND user_id = ?", [id, userId]);
  return { success: true };
}
