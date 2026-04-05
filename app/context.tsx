"use client";

import { useState, useEffect, createContext, useContext, type ReactNode } from "react";
import type { Task, Note, Settings, UserProfile } from "../lib/types";
import { defaultSettings, defaultUserProfile } from "../lib/mock-data";
import * as api from "../lib/api";

interface AuthState {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("plannerzeed-user-id");
    if (userId) {
      setIsAuthenticated(true);
      loadData();
    } else {
      setLoading(false);
    }
  }, []);

  const loadData = async () => {
    try {
      const [tasksData, notesData, settingsData, profileData] = await Promise.all([
        api.apiGetTasks(),
        api.apiGetNotes(),
        api.apiGetSettings(),
        api.apiGetProfile(),
      ]);
      if (tasksData) setTasks(tasksData);
      if (notesData) setNotes(notesData);
      if (settingsData) setSettings(settingsData);
      if (profileData) {
        setUser({ name: profileData.name, email: profileData.email });
        setProfile(prev => ({ ...prev, name: profileData.name, email: profileData.email }));
      }
    } catch (e) {
      console.error("Failed to load data:", e);
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    const data = await api.apiLogin(email, password);
    if (data) {
      localStorage.setItem("plannerzeed-user-id", data.id);
      setIsAuthenticated(true);
      setUser({ name: data.name, email: data.email });
      setProfile(prev => ({ ...prev, name: data.name, email: data.email }));
      loadData();
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await api.apiRegister(name, email, password);
    if (data) {
      localStorage.setItem("plannerzeed-user-id", data.id);
      setIsAuthenticated(true);
      setUser({ name: data.name, email: data.email });
      setProfile(prev => ({ ...prev, name: data.name, email: data.email }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setTasks([]);
    setNotes([]);
    localStorage.removeItem("plannerzeed-user-id");
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    await api.apiToggleTask(id, !task.completed);
  };

  const addTask = async (task: Omit<Task, "id" | "completed">) => {
    const newTask = await api.apiCreateTask(task);
    if (newTask) {
      setTasks(prev => [...prev, { ...newTask, completed: false }]);
    }
  };

  const deleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    await api.apiDeleteTask(id);
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updatedAt: "เพิ่งแก้ไข" } : n));
    await api.apiUpdateNote(id, updates);
  };

  const addNote = async (note: Omit<Note, "id" | "updatedAt">) => {
    const newNote = await api.apiCreateNote(note);
    if (newNote) {
      setNotes(prev => [{ ...newNote, updatedAt: "เพิ่งสร้าง" }, ...prev]);
    }
  };

  const deleteNote = async (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    await api.apiDeleteNote(id);
  };

  const updateSettings = async (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    await api.apiUpdateSettings(updates);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
    const result = await api.apiUpdateProfile(updates);
    if (result) {
      setUser({ name: result.name, email: result.email });
    }
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
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        children
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
