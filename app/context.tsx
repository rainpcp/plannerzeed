"use client";

import { useState, useEffect, createContext, useContext, type ReactNode } from "react";
import type { Task, Note, Settings, UserProfile } from "../lib/types";
import { defaultSettings, defaultUserProfile } from "../lib/mock-data";

interface AuthState {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

interface AppState {
  tasks: Task[];
  notes: Note[];
  settings: Settings;
  profile: UserProfile;
  showAddTask: boolean;
  setShowAddTask: (v: boolean) => void;
  toggleTask: (id: string) => void;
  addTask: (task: Omit<Task, "id" | "completed">) => void;
  deleteTask: (id: string) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  addNote: (note: Omit<Note, "id" | "updatedAt">) => void;
  deleteNote: (id: string) => void;
  updateSettings: (updates: Partial<Settings>) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

type AppContextType = AppState & AuthState;

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [profile, setProfile] = useState<UserProfile>(defaultUserProfile);
  const [showAddTask, setShowAddTask] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const savedAuth = localStorage.getItem("plannerzeed-auth");
    if (savedAuth) {
      const auth = JSON.parse(savedAuth);
      setIsAuthenticated(true);
      setUser(auth);
    }
    const savedTasks = localStorage.getItem("plannerzeed-tasks");
    const savedNotes = localStorage.getItem("plannerzeed-notes");
    const savedSettings = localStorage.getItem("plannerzeed-settings");
    const savedProfile = localStorage.getItem("plannerzeed-profile");
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedProfile) setProfile(JSON.parse(savedProfile));
  }, []);

  useEffect(() => { localStorage.setItem("plannerzeed-tasks", JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem("plannerzeed-notes", JSON.stringify(notes)); }, [notes]);
  useEffect(() => { localStorage.setItem("plannerzeed-settings", JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem("plannerzeed-profile", JSON.stringify(profile)); }, [profile]);

  const login = (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("plannerzeed-users") || "[]");
    const found = users.find((u: { email: string; password: string }) => u.email === email && u.password === password);
    if (found) {
      setIsAuthenticated(true);
      setUser({ name: found.name, email: found.email });
      localStorage.setItem("plannerzeed-auth", JSON.stringify({ name: found.name, email: found.email }));
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("plannerzeed-users") || "[]");
    if (users.find((u: { email: string }) => u.email === email)) return false;
    users.push({ name, email, password });
    localStorage.setItem("plannerzeed-users", JSON.stringify(users));
    setIsAuthenticated(true);
    setUser({ name, email });
    localStorage.setItem("plannerzeed-auth", JSON.stringify({ name, email }));
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("plannerzeed-auth");
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (task: Omit<Task, "id" | "completed">) => {
    setTasks(prev => [...prev, { ...task, id: Date.now().toString(), completed: false }]);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updatedAt: "เพิ่งแก้ไข" } : n));
  };

  const addNote = (note: Omit<Note, "id" | "updatedAt">) => {
    setNotes(prev => [{ ...note, id: Date.now().toString(), updatedAt: "เพิ่งสร้าง" }, ...prev]);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  return (
    <AppContext.Provider value={{
      tasks, notes, settings, profile,
      showAddTask, setShowAddTask,
      toggleTask, addTask, deleteTask,
      updateNote, addNote, deleteNote,
      updateSettings, updateProfile,
      isAuthenticated, user, login, register, logout,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
