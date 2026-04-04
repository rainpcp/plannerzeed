"use client";

import { useApp } from "../context";

export default function FAB() {
  const { setShowAddTask } = useApp();

  return (
    <button
      onClick={() => setShowAddTask(true)}
      className="hidden md:flex fixed bottom-10 right-10 w-16 h-16 rounded-lg main-gradient-bg shadow-xl shadow-primary-dim/30 items-center justify-center text-on-primary hover:scale-110 active:scale-95 transition-all z-40"
    >
      <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
    </button>
  );
}
