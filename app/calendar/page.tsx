"use client";

import { useState } from "react";
import Sidebar from "../components/sidebar";
import BottomNavBar from "../components/bottom-nav";
import FAB from "../components/fab";
import AddTaskModal from "../components/add-task-modal";
import TaskDetailModal from "../components/task-detail-modal";
import AuthGuard from "../components/auth-guard";
import { useApp } from "../context";

function CalendarContent() {
  const { tasks, toggleTask } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const today = new Date().getDate();
  const isCurrentMonth = new Date().getMonth() === currentMonth && new Date().getFullYear() === currentYear;
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const thaiMonths = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  const thaiDays = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสฯ", "ศุกร์", "เสาร์"];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays: { day: number; isCurrentMonth: boolean; dateStr: string }[] = [];

  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const m = currentMonth === 0 ? 11 : currentMonth - 1;
    const y = currentMonth === 0 ? currentYear - 1 : currentYear;
    calendarDays.push({ day: d, isCurrentMonth: false, dateStr: `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}` });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    calendarDays.push({ day: d, isCurrentMonth: true, dateStr });
  }

  const remaining = 42 - calendarDays.length;
  for (let i = 1; i <= remaining; i++) {
    const m = currentMonth === 11 ? 0 : currentMonth + 1;
    const y = currentMonth === 11 ? currentYear + 1 : currentYear;
    calendarDays.push({ day: i, isCurrentMonth: false, dateStr: `${y}-${String(m + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}` });
  }

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const getTasksForDay = (dateStr: string) => {
    return tasks.filter(t => t.date === dateStr);
  };

  const selectedDayTasks = selectedDay
    ? getTasksForDay(`${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`)
    : [];

  return (
    <div className="bg-background text-on-surface font-body min-h-screen">
      <Sidebar />
      <main className="md:ml-72 min-h-screen flex flex-col relative">
        <header className="flex justify-between items-center px-8 py-4 w-full sticky top-0 z-40 bg-slate-950/40 backdrop-blur-lg shadow-[0_8px_32px_rgba(105,156,255,0.08)]">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-black bg-gradient-to-r from-[#85adff] to-[#ac8aff] bg-clip-text text-transparent font-headline">ปฏิทิน</h2>
            <div className="flex bg-surface-container-low p-1 rounded-lg">
              <button className="px-4 py-1.5 text-xs font-bold text-blue-300 bg-white/5 rounded-md transition-all">เดือน</button>
              <button className="px-4 py-1.5 text-xs font-medium text-slate-400 hover:text-on-surface transition-all">สัปดาห์</button>
              <button className="px-4 py-1.5 text-xs font-medium text-slate-400 hover:text-on-surface transition-all">วัน</button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                <span className="material-symbols-outlined text-sm">search</span>
              </span>
              <input className="bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:ring-1 focus:ring-primary/50 placeholder:text-slate-600 transition-all" placeholder="ค้นหาเหตุการณ์..." type="text" />
            </div>
            <button className="p-2 text-slate-400 hover:bg-white/5 rounded-full transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <section className="flex-1 p-8 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h3 className="text-4xl font-extrabold font-headline tracking-tight">{thaiMonths[currentMonth]} <span className="text-primary-dim font-light">{currentYear}</span></h3>
                <div className="flex gap-2">
                  <button onClick={prevMonth} className="p-2 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                  </button>
                  <button onClick={nextMonth} className="p-2 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                  </button>
                </div>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-primary to-secondary rounded-lg font-bold text-sm shadow-[0_8px_20px_rgba(105,156,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all">
                <span className="material-symbols-outlined text-xl">add</span>
                สร้างกิจกรรม
              </button>
            </div>
            <div className="grid grid-cols-7 gap-4">
              {thaiDays.map(d => (
                <div key={d} className="text-center text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant pb-2">{d}</div>
              ))}
              {calendarDays.map((item, idx) => {
                const isToday = item.isCurrentMonth && item.day === today && isCurrentMonth;
                const isSelected = item.isCurrentMonth && item.day === selectedDay;
                const dayTasks = getTasksForDay(item.dateStr);
                return (
                  <div
                    key={idx}
                    onClick={() => item.isCurrentMonth && setSelectedDay(item.day === selectedDay ? null : item.day)}
                    className={`aspect-square p-3 rounded-2xl border transition-all cursor-pointer ${
                      !item.isCurrentMonth
                        ? "bg-surface-container-lowest opacity-30 text-xs"
                        : isToday
                        ? "bg-surface-variant ring-2 ring-primary/50 relative overflow-hidden shadow-[0_20px_40px_rgba(105,156,255,0.15)]"
                        : isSelected
                        ? "bg-surface-container-high border-primary/30"
                        : "bg-surface-container-low border-white/5 hover:bg-surface-container-high"
                    }`}
                  >
                    {isToday && (
                      <div className="absolute top-0 right-0 p-2 opacity-20">
                        <span className="material-symbols-outlined text-4xl">flare</span>
                      </div>
                    )}
                    <div className={`flex justify-between items-start ${isToday ? "relative z-10" : ""}`}>
                      <span className={`text-sm font-bold ${isToday ? "text-primary font-black" : ""}`}>{item.day}</span>
                    </div>
                    {dayTasks.length > 0 && (
                      <div className="mt-1 space-y-0.5">
                        {dayTasks.slice(0, 3).map(task => (
                          <div
                            key={task.id}
                            onClick={e => { e.stopPropagation(); setSelectedTaskId(task.id); }}
                            className={`text-[8px] px-1 py-0.5 rounded truncate font-medium cursor-pointer ${
                              task.color === "primary" ? "bg-primary/20 text-primary" :
                              task.color === "secondary" ? "bg-secondary/20 text-secondary" :
                              "bg-tertiary/20 text-tertiary"
                            } ${task.completed ? "line-through opacity-50" : ""}`}
                          >
                            {task.title}
                          </div>
                        ))}
                        {dayTasks.length > 3 && (
                          <p className="text-[8px] text-on-surface-variant">+{dayTasks.length - 3} เพิ่มเติม</p>
                        )}
                      </div>
                    )}
                    {isToday && dayTasks.length === 0 && (
                      <p className="mt-1 text-[8px] text-primary-dim uppercase font-bold tracking-wider">วันนี้</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
          <aside className="w-80 bg-surface-container-low border-l border-white/5 p-6 hidden xl:block overflow-y-auto">
            {selectedDay ? (
              <>
                <div className="mb-8">
                  <h4 className="text-lg font-bold font-headline mb-1">
                    {selectedDay} {thaiMonths[currentMonth]} {currentYear + 543}
                  </h4>
                  <p className="text-xs text-on-surface-variant font-medium">{selectedDayTasks.length} งาน</p>
                </div>
                <div className="space-y-4">
                  {selectedDayTasks.length === 0 ? (
                    <div className="p-6 border-2 border-dashed border-outline-variant/30 rounded-xl flex flex-col items-center justify-center text-center opacity-50">
                      <span className="material-symbols-outlined text-3xl mb-2">event_busy</span>
                      <p className="text-xs font-bold uppercase tracking-widest">ไม่มีงาน</p>
                    </div>
                  ) : (
                    selectedDayTasks.map(task => (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTaskId(task.id)}
                        className={`p-4 bg-surface-container-highest rounded-xl border border-white/5 group transition-all cursor-pointer ${
                          task.completed ? "opacity-50" : "hover:border-primary/30"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            onClick={e => { e.stopPropagation(); toggleTask(task.id); }}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 cursor-pointer ${
                              task.completed ? "bg-primary border-primary" : "border-outline-variant"
                            }`}
                          >
                            {task.completed && (
                              <span className="material-symbols-outlined text-on-primary" style={{ fontSize: 14 }}>check</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className={`text-sm font-semibold mb-1 ${task.completed ? "line-through" : ""}`}>{task.title}</h5>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                task.priority === "high" ? "bg-primary/10 text-primary" :
                                task.priority === "medium" ? "bg-secondary/10 text-secondary" :
                                "bg-tertiary/10 text-tertiary"
                              }`}>
                                {task.priority === "high" ? "ด่วนมาก" : task.priority === "medium" ? "ปกติ" : "ต่ำ"}
                              </span>
                              {task.time && (
                                <span className="text-[10px] text-on-surface-variant flex items-center gap-0.5">
                                  <span className="material-symbols-outlined" style={{ fontSize: 12 }}>schedule</span>
                                  {task.time}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="mb-8">
                  <h4 className="text-lg font-bold font-headline mb-1">งานที่ยังไม่กำหนดเวลา</h4>
                  <p className="text-xs text-on-surface-variant font-medium">กดที่ปฏิทินเพื่อดูงานในแต่ละวัน</p>
                </div>
                <div className="space-y-4">
                  {tasks.filter(t => !t.date).slice(0, 5).map(task => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTaskId(task.id)}
                      className="p-4 bg-surface-container-highest rounded-xl border border-white/5 group hover:border-primary/30 transition-all cursor-pointer"
                    >
                      <div className="flex justify-between mb-2">
                        <span className={`text-[10px] uppercase font-bold tracking-wider ${
                          task.color === "primary" ? "text-primary" :
                          task.color === "secondary" ? "text-secondary" : "text-tertiary"
                        }`}>{task.category}</span>
                      </div>
                      <h5 className={`text-sm font-semibold mb-2 ${task.completed ? "line-through opacity-50" : ""}`}>{task.title}</h5>
                    </div>
                  ))}
                  {tasks.filter(t => !t.date).length === 0 && (
                    <div className="p-6 border-2 border-dashed border-outline-variant/30 rounded-xl flex flex-col items-center justify-center text-center opacity-50">
                      <span className="material-symbols-outlined text-3xl mb-2">post_add</span>
                      <p className="text-xs font-bold uppercase tracking-widest">ยังไม่มีงาน</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </aside>
        </div>
      </main>
      <BottomNavBar />
      <FAB />
      <AddTaskModal />
      <TaskDetailModal taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />
    </div>
  );
}

export default function CalendarPage() {
  return (
    <AuthGuard>
      <CalendarContent />
    </AuthGuard>
  );
}
