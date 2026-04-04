const API_BASE = "https://plannerzeed-api.phuangchomphurobchanachai.workers.dev";

function getHeaders() {
  const userId = typeof window !== "undefined" ? localStorage.getItem("plannerzeed-user-id") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (userId) headers["x-user-id"] = userId;
  return headers;
}

export async function apiLogin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (typeof window !== "undefined") localStorage.setItem("plannerzeed-user-id", data.id);
  return data;
}

export async function apiRegister(name: string, email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (typeof window !== "undefined") localStorage.setItem("plannerzeed-user-id", data.id);
  return data;
}

export async function apiGetTasks() {
  const res = await fetch(`${API_BASE}/api/tasks`, { headers: getHeaders() });
  if (!res.ok) return [];
  return res.json();
}

export async function apiCreateTask(task: any) {
  const res = await fetch(`${API_BASE}/api/tasks`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(task),
  });
  return res.json();
}

export async function apiToggleTask(id: string, completed: boolean) {
  const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ completed }),
  });
  return res.json();
}

export async function apiDeleteTask(id: string) {
  const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return res.json();
}

export async function apiGetNotes() {
  const res = await fetch(`${API_BASE}/api/notes`, { headers: getHeaders() });
  if (!res.ok) return [];
  return res.json();
}

export async function apiCreateNote(note: any) {
  const res = await fetch(`${API_BASE}/api/notes`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(note),
  });
  return res.json();
}

export async function apiUpdateNote(id: string, updates: any) {
  const res = await fetch(`${API_BASE}/api/notes/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(updates),
  });
  return res.json();
}

export async function apiDeleteNote(id: string) {
  const res = await fetch(`${API_BASE}/api/notes/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return res.json();
}

export async function apiGetSettings() {
  const res = await fetch(`${API_BASE}/api/settings`, { headers: getHeaders() });
  if (!res.ok) return { pushNotifications: true, doNotDisturb: false, theme: "dark", accentColor: "#85adff", cloudSync: false };
  return res.json();
}

export async function apiUpdateSettings(updates: any) {
  const res = await fetch(`${API_BASE}/api/settings`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(updates),
  });
  return res.json();
}

export async function apiGetProfile() {
  const res = await fetch(`${API_BASE}/api/profile`, { headers: getHeaders() });
  if (!res.ok) return null;
  return res.json();
}

export async function apiUpdateProfile(updates: any) {
  const res = await fetch(`${API_BASE}/api/profile`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(updates),
  });
  return res.json();
}
