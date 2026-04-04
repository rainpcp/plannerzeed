function getHeaders() {
  const userId = typeof window !== "undefined" ? localStorage.getItem("plannerzeed-user-id") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (userId) headers["x-user-id"] = userId;
  return headers;
}

async function fetchApi(path: string, options?: RequestInit) {
  const res = await fetch(path, { ...options, headers: { ...getHeaders(), ...options?.headers } });
  return res;
}

export async function apiLogin(email: string, password: string) {
  const res = await fetchApi("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (typeof window !== "undefined") localStorage.setItem("plannerzeed-user-id", data.id);
  return data;
}

export async function apiRegister(name: string, email: string, password: string) {
  const res = await fetchApi("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (typeof window !== "undefined") localStorage.setItem("plannerzeed-user-id", data.id);
  return data;
}

export async function apiGetTasks() {
  const res = await fetchApi("/api/tasks");
  if (!res.ok) return [];
  return res.json();
}

export async function apiCreateTask(task: any) {
  const res = await fetchApi("/api/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  });
  return res.json();
}

export async function apiToggleTask(id: string, completed: boolean) {
  const res = await fetchApi(`/api/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify({ completed }),
  });
  return res.json();
}

export async function apiDeleteTask(id: string) {
  const res = await fetchApi(`/api/tasks/${id}`, { method: "DELETE" });
  return res.json();
}

export async function apiGetNotes() {
  const res = await fetchApi("/api/notes");
  if (!res.ok) return [];
  return res.json();
}

export async function apiCreateNote(note: any) {
  const res = await fetchApi("/api/notes", {
    method: "POST",
    body: JSON.stringify(note),
  });
  return res.json();
}

export async function apiUpdateNote(id: string, updates: any) {
  const res = await fetchApi(`/api/notes/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return res.json();
}

export async function apiDeleteNote(id: string) {
  const res = await fetchApi(`/api/notes/${id}`, { method: "DELETE" });
  return res.json();
}

export async function apiGetSettings() {
  const res = await fetchApi("/api/settings");
  if (!res.ok) return { pushNotifications: true, doNotDisturb: false, theme: "dark", accentColor: "#85adff", cloudSync: false };
  return res.json();
}

export async function apiUpdateSettings(updates: any) {
  const res = await fetchApi("/api/settings", {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return res.json();
}

export async function apiGetProfile() {
  const res = await fetchApi("/api/profile");
  if (!res.ok) return null;
  return res.json();
}

export async function apiUpdateProfile(updates: any) {
  const res = await fetchApi("/api/profile", {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return res.json();
}
