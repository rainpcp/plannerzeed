"use client";

import { useState } from "react";
import { useApp } from "../context";
import { categoryColors } from "../../lib/mock-data";

export default function AddTaskModal() {
  const { showAddTask, setShowAddTask, addTask } = useApp();
  const today = new Date().toISOString().split("T")[0];
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("work");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("");
  const [endTime, setEndTime] = useState("");

  if (!showAddTask) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      priority,
      date: date || undefined,
      time: time || undefined,
      endTime: endTime || undefined,
      icon: "task",
      color: categoryColors[category] || "primary",
    });
    setTitle("");
    setDescription("");
    setDate(today);
    setTime("");
    setEndTime("");
    setCategory("work");
    setPriority("medium");
    setShowAddTask(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddTask(false)} />
      <div className="relative w-full max-w-lg glass-panel rounded-lg border border-white/10 shadow-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-headline text-on-surface">เพิ่มงานใหม่</h2>
          <button onClick={() => setShowAddTask(false)} className="p-2 rounded-full hover:bg-white/5 transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold block mb-1">ชื่องาน *</label>
            <input
              className="w-full bg-surface-container-low border-none rounded-md px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/40"
              type="text"
              placeholder="เช่น ส่งแบบร่าง UI"
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
              required
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold block mb-1">รายละเอียด</label>
            <textarea
              className="w-full bg-surface-container-low border-none rounded-md px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/40 resize-none"
              rows={3}
              placeholder="รายละเอียดเพิ่มเติม..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold block mb-1">หมวดหมู่</label>
              <select
                className="w-full bg-surface-container-low border-none rounded-md px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/40"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="work">งาน</option>
                <option value="personal">ส่วนตัว</option>
                <option value="learning">เรียนรู้</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold block mb-1">ความสำคัญ</label>
              <select
                className="w-full bg-surface-container-low border-none rounded-md px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/40"
                value={priority}
                onChange={e => setPriority(e.target.value as "high" | "medium" | "low")}
              >
                <option value="high">ด่วนมาก</option>
                <option value="medium">ปกติ</option>
                <option value="low">ต่ำ</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold block mb-1">วันที่</label>
            <input
              className="w-full bg-surface-container-low border-none rounded-md px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/40"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold block mb-1">เวลาเริ่ม</label>
              <input
                className="w-full bg-surface-container-low border-none rounded-md px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/40"
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold block mb-1">เวลาสิ้นสุด</label>
              <input
                className="w-full bg-surface-container-low border-none rounded-md px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/40"
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAddTask(false)}
              className="flex-1 py-3 rounded-lg bg-surface-container-high text-on-surface font-semibold hover:bg-surface-container-highest transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-lg main-gradient-bg text-on-primary font-semibold hover:opacity-90 transition-opacity"
            >
              เพิ่มงาน
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
