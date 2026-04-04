"use client";

import { useState } from "react";
import Sidebar from "../components/sidebar";
import BottomNavBar from "../components/bottom-nav";
import FAB from "../components/fab";
import AddTaskModal from "../components/add-task-modal";
import TaskDetailModal from "../components/task-detail-modal";
import AuthGuard from "../components/auth-guard";
import { useApp } from "../context";

function TasksContent() {
  const { tasks, toggleTask, deleteTask } = useApp();
  const [search, setSearch] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const categories = [...new Set(tasks.map(t => t.category))];
  const filteredTasks = tasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    return `${d.getDate()} ${thaiMonths[d.getMonth()]} ${d.getFullYear() + 543}`;
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col md:ml-72 h-screen overflow-hidden relative">
        <header className="bg-slate-950/60 backdrop-blur-xl flex justify-between items-center w-full px-6 py-4 max-w-full sticky top-0 z-40">
          <div className="flex items-center gap-6 flex-1">
            <div className="bg-surface-container-low px-4 py-2 rounded-full flex items-center gap-3 w-full max-w-md">
              <span className="material-symbols-outlined text-on-surface-variant">search</span>
              <input
                className="bg-transparent border-none focus:ring-0 text-sm w-full text-on-surface"
                placeholder="ค้นหางาน..."
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-blue-200 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8 space-y-12">
          <div className="space-y-2">
            <h2 className="text-5xl font-extrabold tracking-tighter font-headline text-on-surface">รายการงาน</h2>
            <p className="text-on-surface-variant text-lg tracking-tight">โฟกัสสิ่งที่สำคัญวันนี้</p>
          </div>
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">task_alt</span>
              <h3 className="text-xl font-bold font-headline text-on-surface mb-2">ยังไม่มีงาน</h3>
              <p className="text-on-surface-variant mb-6">กดปุ่ม + เพื่อเพิ่มงานแรกของคุณ</p>
            </div>
          ) : (
            categories.map(cat => {
              const catTasks = filteredTasks.filter(t => t.category === cat);
              if (catTasks.length === 0) return null;
              return (
                <section key={cat} className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <h3 className={`text-xs uppercase tracking-[0.2em] font-bold ${
                      cat === "work" ? "text-primary" : cat === "personal" ? "text-secondary" : "text-tertiary"
                    }`}>{cat === "work" ? "งาน" : cat === "personal" ? "ส่วนตัว" : "เรียนรู้"}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      cat === "work" ? "bg-primary/10 text-primary" :
                      cat === "personal" ? "bg-secondary/10 text-secondary" :
                      "bg-tertiary/10 text-tertiary"
                    }`}>{catTasks.length} งาน</span>
                  </div>
                  <div className="space-y-3">
                    {catTasks.map(task => (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTaskId(task.id)}
                        className={`glass-panel p-4 flex items-center gap-4 group cursor-pointer transition-all rounded-lg border ${
                          task.completed ? "opacity-50" : ""
                        } border-outline-variant/15 hover:bg-surface-variant/40`}
                      >
                        <div
                          onClick={e => { e.stopPropagation(); toggleTask(task.id); }}
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer shrink-0 ${
                            task.completed ? "bg-primary border-primary" : "border-outline-variant group-hover:border-primary"
                          }`}
                        >
                          {task.completed && (
                            <span className="material-symbols-outlined text-on-primary" style={{ fontSize: 16 }}>check</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`text-on-surface ${task.completed ? "line-through" : task.priority === "high" ? "font-semibold" : "font-medium"}`}>
                            {task.title}
                          </span>
                          {task.date && (
                            <p className="text-[10px] text-on-surface-variant mt-0.5">{formatDate(task.date)}</p>
                          )}
                        </div>
                        {task.time && (
                          <div className="flex items-center gap-2 text-on-surface-variant">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            <span className="text-xs font-bold uppercase tracking-wider">{task.time}</span>
                          </div>
                        )}
                        <button
                          onClick={e => { e.stopPropagation(); deleteTask(task.id); }}
                          className="p-1 text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })
          )}
        </div>
      </main>
      <BottomNavBar />
      <FAB />
      <AddTaskModal />
      <TaskDetailModal taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />
    </div>
  );
}

export default function TasksPage() {
  return (
    <AuthGuard>
      <TasksContent />
    </AuthGuard>
  );
}
