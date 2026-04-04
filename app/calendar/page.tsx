import Sidebar from "../components/sidebar";
import BottomNavBar from "../components/bottom-nav";
import FAB from "../components/fab";

export default function CalendarPage() {
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
                <h3 className="text-4xl font-extrabold font-headline tracking-tight">พฤษภาคม <span className="text-primary-dim font-light">2024</span></h3>
                <div className="flex gap-2">
                  <button className="p-2 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                  </button>
                  <button className="p-2 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors">
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
              <div className="text-center text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant pb-2">อาทิตย์</div>
              <div className="text-center text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant pb-2">จันทร์</div>
              <div className="text-center text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant pb-2">อังคาร</div>
              <div className="text-center text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant pb-2">พุธ</div>
              <div className="text-center text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant pb-2">พฤหัสฯ</div>
              <div className="text-center text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant pb-2">ศุกร์</div>
              <div className="text-center text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant pb-2">เสาร์</div>
              {[28,29,30].map(d => (
                <div key={`prev-${d}`} className="aspect-square p-3 rounded-2xl bg-surface-container-lowest opacity-30 text-xs">{d}</div>
              ))}
              {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31].map(d => (
                <div key={d} className="aspect-square p-3 rounded-2xl bg-surface-container-low border border-white/5 hover:bg-surface-container-high transition-colors">
                  <span className="text-sm font-bold">{d}</span>
                </div>
              ))}
              <div className="aspect-square p-3 rounded-2xl bg-surface-variant ring-2 ring-primary/50 relative overflow-hidden shadow-[0_20px_40px_rgba(105,156,255,0.15)]">
                <div className="absolute top-0 right-0 p-2 opacity-20">
                  <span className="material-symbols-outlined text-4xl">flare</span>
                </div>
                <div className="flex justify-between items-start relative z-10">
                  <span className="text-sm font-black text-primary">15</span>
                </div>
                <div className="mt-3 p-1.5 bg-primary rounded border-l-2 border-white/40 shadow-lg">
                  <p className="text-[10px] text-on-primary truncate font-black uppercase">Workshop</p>
                </div>
                <p className="mt-1 text-[8px] text-primary-dim uppercase font-bold tracking-wider">วันนี้</p>
              </div>
              <div className="aspect-square p-3 rounded-2xl bg-surface-container-lowest opacity-30 text-xs">1</div>
            </div>
          </section>
        </div>
      </main>
      <BottomNavBar />
      <FAB />
    </div>
  );
}
