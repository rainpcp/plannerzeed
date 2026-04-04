"use client";

import { useApp } from "../context";

interface TaskDetailModalProps {
  taskId: string | null;
  onClose: () => void;
}

export default function TaskDetailModal({ taskId, onClose }: TaskDetailModalProps) {
  const { tasks, toggleTask, deleteTask } = useApp();
  const task = tasks.find(t => t.id === taskId);

  if (!task) return null;

  const thaiDays = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
  const thaiMonths = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

  const formatFullDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `วัน${thaiDays[d.getDay()]}ที่ ${d.getDate()} ${thaiMonths[d.getMonth()]} ${d.getFullYear() + 543}`;
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md glass-panel rounded-lg border border-white/10 shadow-2xl overflow-hidden">
        <div className={`h-2 ${
          task.color === "primary" ? "bg-gradient-to-r from-primary to-primary-dim" :
          task.color === "secondary" ? "bg-gradient-to-r from-secondary to-secondary-dim" :
          "bg-gradient-to-r from-tertiary to-tertiary-dim"
        }`} />
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className={`text-xl font-bold font-headline text-on-surface ${task.completed ? "line-through opacity-50" : ""}`}>
                {task.title}
              </h3>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                  task.priority === "high" ? "bg-primary/10 text-primary" :
                  task.priority === "medium" ? "bg-secondary/10 text-secondary" :
                  "bg-tertiary/10 text-tertiary"
                }`}>
                  {task.priority === "high" ? "ด่วนมาก" : task.priority === "medium" ? "ปกติ" : "ต่ำ"}
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                  task.category === "work" ? "bg-primary/10 text-primary" :
                  task.category === "personal" ? "bg-secondary/10 text-secondary" :
                  "bg-tertiary/10 text-tertiary"
                }`}>
                  {task.category === "work" ? "งาน" : task.category === "personal" ? "ส่วนตัว" : "เรียนรู้"}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-white/5 transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {task.description && (
            <div className="mb-4">
              <p className="text-sm text-on-surface-variant leading-relaxed">{task.description}</p>
            </div>
          )}

          <div className="space-y-3 mb-6">
            {task.date && (
              <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-primary">calendar_today</span>
                <span>{formatFullDate(task.date)}</span>
              </div>
            )}
            {task.time && (
              <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary">schedule</span>
                <span>{task.time}{task.endTime ? ` - ${task.endTime}` : ""}</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { toggleTask(task.id); }}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                task.completed
                  ? "bg-surface-container-high text-on-surface hover:bg-primary/10 hover:text-primary"
                  : "bg-primary text-on-primary hover:bg-primary-dim"
              }`}
            >
              <span className="material-symbols-outlined text-lg">
                {task.completed ? "undo" : "check_circle"}
              </span>
              {task.completed ? "ยกเลิกเสร็จสิ้น" : "เสร็จสิ้น"}
            </button>
            <button
              onClick={() => { deleteTask(task.id); onClose(); }}
              className="py-3 px-4 rounded-lg bg-error/10 text-error hover:bg-error/20 transition-colors"
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
