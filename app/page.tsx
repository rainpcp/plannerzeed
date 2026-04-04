"use client";

import { useState } from "react";
import Sidebar from "./components/sidebar";
import TopNavBar from "./components/top-navbar";
import BottomNavBar from "./components/bottom-nav";
import FAB from "./components/fab";
import AddTaskModal from "./components/add-task-modal";
import TaskDetailModal from "./components/task-detail-modal";
import AuthGuard from "./components/auth-guard";
import { useApp } from "./context";

function HomeContent() {
  const { tasks, toggleTask } = useApp();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const thaiDays = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
  const thaiMonths = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  const dateStr = `วัน${thaiDays[now.getDay()]}ที่ ${now.getDate()} ${thaiMonths[now.getMonth()]}`;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const thaiMonthsShort = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    return `${d.getDate()} ${thaiMonthsShort[d.getMonth()]}`;
  };

  const todayTasks = tasks.filter(t => t.date === todayStr);
  const upcomingTasks = tasks.filter(t => t.date && t.date > todayStr);
  const noDateTasks = tasks.filter(t => !t.date);

  const renderTaskRow = (task: typeof tasks[0]) => (
    <div
      key={task.id}
      onClick={() => setSelectedTaskId(task.id)}
      className={`glass-panel p-4 flex items-center gap-4 rounded-lg border border-white/5 hover:bg-surface-variant/40 transition-all cursor-pointer ${
        task.completed ? "opacity-50" : ""
      }`}
    >
      <div
        onClick={e => { e.stopPropagation(); toggleTask(task.id); }}
        className={`w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer shrink-0 ${
          task.completed ? "bg-primary border-primary" : "border-outline-variant hover:border-primary"
        }`}
      >
        {task.completed && (
          <span className="material-symbols-outlined text-on-primary" style={{ fontSize: 16 }}>check</span>
        )}
      </div>
      <div className={`w-3 h-3 rounded-full shrink-0 ${
        task.color === "primary" ? "bg-primary" :
        task.color === "secondary" ? "bg-secondary" :
        "bg-tertiary"
      }`}></div>
      <div className="flex-1 min-w-0">
        <span className={`text-on-surface ${task.completed ? "line-through" : task.priority === "high" ? "font-semibold" : "font-medium"}`}>
          {task.title}
        </span>
        {task.date && task.date !== todayStr && (
          <p className="text-[10px] text-on-surface-variant">{formatDate(task.date)}</p>
        )}
      </div>
      {task.time && (
        <span className="text-on-surface-variant text-xs font-medium shrink-0">{task.time}</span>
      )}
      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase shrink-0 ${
        task.priority === "high" ? "bg-primary/10 text-primary" :
        task.priority === "medium" ? "bg-secondary/10 text-secondary" :
        "bg-tertiary/10 text-tertiary"
      }`}>
        {task.priority === "high" ? "ด่วนมาก" : task.priority === "medium" ? "ปกติ" : "ต่ำ"}
      </span>
    </div>
  );

  const renderTaskCard = (task: typeof tasks[0], i: number) => (
    <div
      key={task.id}
      onClick={() => setSelectedTaskId(task.id)}
      className="glass-panel p-8 rounded-lg border border-white/5 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 cursor-pointer"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <span className="text-6xl font-black font-headline">0{i + 1}</span>
      </div>
      <div className="space-y-4 relative z-10">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
          task.color === "primary" ? "main-gradient-bg shadow-primary-dim/20" :
          task.color === "secondary" ? "bg-secondary shadow-secondary/20" :
          "bg-tertiary shadow-tertiary/20"
        }`}>
          <span className={`material-symbols-outlined ${
            task.color === "primary" ? "text-on-primary" :
            task.color === "secondary" ? "text-on-secondary" :
            "text-on-tertiary"
          }`}>{task.icon || "task"}</span>
        </div>
        <h4 className={`text-xl font-bold text-on-surface ${task.completed ? "line-through opacity-50" : ""}`}>{task.title}</h4>
        {task.description && (
          <p className="text-on-surface-variant text-sm line-clamp-2">{task.description}</p>
        )}
        <div className="flex items-center gap-2 pt-2 flex-wrap">
          <span className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider ${
            task.priority === "high" ? "bg-primary/10 text-primary" :
            task.priority === "medium" ? "bg-secondary/10 text-secondary" :
            "bg-tertiary/10 text-tertiary"
          }`}>
            {task.priority === "high" ? "ด่วนมาก" : task.priority === "medium" ? "ปกติ" : "ต่ำ"}
          </span>
          {task.date && (
            <span className="text-on-surface-variant text-[10px] font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">calendar_today</span> {formatDate(task.date)}
            </span>
          )}
          {task.time && (
            <span className="text-on-surface-variant text-[10px] font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">schedule</span> {task.time}{task.endTime ? ` - ${task.endTime}` : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Sidebar />
      <TopNavBar />
      <main className="md:pl-72 min-h-screen pb-24 md:pb-12">
        <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-12">
          <section className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="space-y-2">
              <p className="text-tertiary font-bold tracking-[0.2em] text-xs uppercase">{dateStr}</p>
              <h2 className="text-5xl md:text-6xl font-black font-headline tracking-tighter text-on-surface">ภาพรวมวันนี้</h2>
            </div>
            {totalCount > 0 && (
              <div className="glass-panel p-6 rounded-lg flex items-center gap-6 border border-white/5 shadow-xl">
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-surface-container-highest" cx="40" cy="40" fill="transparent" r="36" stroke="currentColor" strokeWidth="6" />
                    <circle className="text-primary" cx="40" cy="40" fill="transparent" r="36" stroke="currentColor" strokeDasharray="226.2" strokeDashoffset={226.2 - (226.2 * progress) / 100} strokeWidth="6" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold font-headline text-on-surface">{progress}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-on-surface font-bold text-lg">เป้าหมายรายวัน</p>
                  <p className="text-on-surface-variant text-sm">สำเร็จแล้ว {completedCount} จาก {totalCount} งาน</p>
                </div>
              </div>
            )}
          </section>

          {totalCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">task_alt</span>
              <h3 className="text-xl font-bold font-headline text-on-surface mb-2">ยังไม่มีงาน</h3>
              <p className="text-on-surface-variant mb-6">กดปุ่ม + เพื่อเพิ่มงานแรกของคุณ</p>
            </div>
          ) : (
            <>
              {todayTasks.length > 0 && (
                <section className="space-y-6">
                  <h3 className="text-xl font-bold font-headline flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">today</span>
                    งานวันนี้ ({todayTasks.length})
                  </h3>
                  <div className="space-y-3">
                    {todayTasks.map(renderTaskRow)}
                  </div>
                </section>
              )}

              {upcomingTasks.length > 0 && (
                <section className="space-y-6">
                  <h3 className="text-xl font-bold font-headline flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">event_upcoming</span>
                    งานที่กำลังจะมาถึง
                  </h3>
                  <div className="space-y-3">
                    {upcomingTasks.map(renderTaskRow)}
                  </div>
                </section>
              )}

              {noDateTasks.length > 0 && (
                <section className="space-y-6">
                  <h3 className="text-xl font-bold font-headline flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary">task</span>
                    งานที่ไม่มีกำหนด
                  </h3>
                  <div className="space-y-3">
                    {noDateTasks.map(renderTaskRow)}
                  </div>
                </section>
              )}

              {todayTasks.filter(t => t.priority === "high").length > 0 && (
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold font-headline flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary">star</span>
                      งานสำคัญ
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {todayTasks.filter(t => t.priority === "high").slice(0, 3).map((task, i) => renderTaskCard(task, i))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>
      <BottomNavBar />
      <FAB />
      <AddTaskModal />
      <TaskDetailModal taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
    </div>
  );
}

export default function Home() {
  return (
    <AuthGuard>
      <HomeContent />
    </AuthGuard>
  );
}
