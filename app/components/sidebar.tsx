import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col gap-y-2 p-6 h-screen w-72 fixed left-0 top-0 bg-[#091328]/80 backdrop-blur-xl border-r border-white/5 z-50">
      <div className="mb-10 px-2">
        <h1 className="text-2xl font-bold text-blue-300 font-headline">Chronos</h1>
        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Productivity System</p>
      </div>
      <nav className="flex flex-col gap-y-2">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-blue-300 bg-blue-400/10 rounded-xl transition-all duration-300 ease-in-out font-medium text-sm">
          <span className="material-symbols-outlined">today</span>
          ภาพรวมวันนี้
        </Link>
        <Link href="/calendar" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-blue-200 hover:bg-white/5 rounded-xl transition-all duration-300 ease-in-out font-medium text-sm">
          <span className="material-symbols-outlined">calendar_today</span>
          ปฏิทิน
        </Link>
        <Link href="/tasks" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-blue-200 hover:bg-white/5 rounded-xl transition-all duration-300 ease-in-out font-medium text-sm">
          <span className="material-symbols-outlined">format_list_bulleted</span>
          รายการงาน
        </Link>
        <Link href="/notes" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-blue-200 hover:bg-white/5 rounded-xl transition-all duration-300 ease-in-out font-medium text-sm">
          <span className="material-symbols-outlined">sticky_note_2</span>
          บันทึก
        </Link>
        <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-blue-200 hover:bg-white/5 rounded-xl transition-all duration-300 ease-in-out font-medium text-sm mt-auto">
          <span className="material-symbols-outlined">settings</span>
          ตั้งค่า
        </Link>
      </nav>
      <div className="mt-auto pt-6 border-t border-white/5 flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-highest">
          <div className="w-full h-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant text-sm font-bold">T</div>
        </div>
        <div>
          <p className="text-sm font-bold text-on-surface">ธีรภัทร์</p>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Pro Plan</p>
        </div>
      </div>
    </aside>
  );
}
