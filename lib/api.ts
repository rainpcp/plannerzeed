import type { Settings } from "./types";

function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("plannerzeed-user-id");
}

async function fetchApi(path: string, options?: RequestInit) {
  const userId = getUserId();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (userId) {
    headers["x-user-id"] = userId;
  }
  return fetch(`/api${path}`, {
    ...options,
    headers: { ...headers, ...options?.headers },
  });
}

export async function apiLogin(email: string, password: string) {
  const res = await fetchApi("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function apiRegister(name: string, email: string, password: string) {
  const res = await fetchApi("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function apiGetTasks() {
  const res = await fetchApi("/tasks");
  if (!res.ok) return [];
  return res.json();
}

export async function apiCreateTask(task: any) {
  const res = await fetchApi("/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function apiToggleTask(id: string, completed: boolean) {
  const res = await fetchApi(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify({ completed }),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function apiDeleteTask(id: string) {
  const res = await fetchApi(`/tasks/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function apiGetNotes() {
  const res = await fetchApi("/notes");
  if (!res.ok) return [];
  return res.json();
}

export async function apiCreateNote(note: any) {
  const res = await fetchApi("/notes", {
    method: "POST",
    body: JSON.stringify(note),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function apiUpdateNote(id: string, updates: any) {
  const res = await fetchApi(`/notes/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function apiDeleteNote(id: string) {
  const res = await fetchApi(`/notes/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function apiGetSettings() {
  const res = await fetchApi("/settings");
  if (!res.ok) return { pushNotifications: true, doNotDisturb: false, theme: "dark", accentColor: "#85adff", cloudSync: false };
  return res.json();
}

export async function apiUpdateSettings(updates: Partial<Settings>) {
  const res = await fetchApi("/settings", {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function apiGetProfile() {
  const res = await fetchApi("/profile");
  if (!res.ok) return null;
  return res.json();
}

export async function apiUpdateProfile(updates: any) {
  const res = await fetchApi("/profile", {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  if (!res.ok) return null;
  return res.json();
}
