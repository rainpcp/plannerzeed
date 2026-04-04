import Link from "next/link";

export default function BottomNavBar() {
  return (
    <nav className="md:hidden fixed bottom-6 left-6 right-6 h-16 glass-panel rounded-full border border-white/10 shadow-2xl flex items-center justify-around px-4 z-50">
      <Link href="/" className="text-primary flex flex-col items-center gap-0.5">
        <span className="material-symbols-outlined">today</span>
        <span className="text-[10px] font-bold">วันนี้</span>
      </Link>
      <Link href="/calendar" className="text-on-surface-variant flex flex-col items-center gap-0.5">
        <span className="material-symbols-outlined">calendar_today</span>
        <span className="text-[10px] font-bold">ปฏิทิน</span>
      </Link>
      <div className="relative -top-8">
        <button className="w-14 h-14 rounded-full main-gradient-bg shadow-lg shadow-primary-dim/40 flex items-center justify-center text-on-primary">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
        </button>
      </div>
      <Link href="/notes" className="text-on-surface-variant flex flex-col items-center gap-0.5">
        <span className="material-symbols-outlined">sticky_note_2</span>
        <span className="text-[10px] font-bold">บันทึก</span>
      </Link>
      <Link href="/settings" className="text-on-surface-variant flex flex-col items-center gap-0.5">
        <span className="material-symbols-outlined">settings</span>
        <span className="text-[10px] font-bold">ตั้งค่า</span>
      </Link>
    </nav>
  );
}
