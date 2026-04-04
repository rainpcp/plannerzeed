import Sidebar from "../components/sidebar";
import BottomNavBar from "../components/bottom-nav";
import FAB from "../components/fab";

export default function TasksPage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col md:ml-72 h-screen overflow-hidden relative">
        <header className="bg-slate-950/60 backdrop-blur-xl flex justify-between items-center w-full px-6 py-4 max-w-full sticky top-0 z-40">
          <div className="flex items-center gap-6 flex-1">
            <div className="bg-surface-container-low px-4 py-2 rounded-full flex items-center gap-3 w-full max-w-md">
              <span className="material-symbols-outlined text-on-surface-variant">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-sm w-full text-on-surface" placeholder="ค้นหางาน..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-blue-200 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </header>
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8 space-y-12">
            <div className="space-y-2">
              <h2 className="text-5xl font-extrabold tracking-tighter font-headline text-on-surface">รายการงาน</h2>
              <p className="text-on-surface-variant text-lg tracking-tight">โฟกัสสิ่งที่สำคัญวันนี้</p>
            </div>
            <section className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-primary">งาน</h3>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">4 งาน</span>
              </div>
              <div className="space-y-3">
                <div className="glass-panel p-4 flex items-center gap-4 group cursor-pointer transition-all hover:translate-x-1 rounded-lg border border-primary/40">
                  <div className="w-6 h-6 rounded border-2 border-primary/40 flex items-center justify-center group-hover:border-primary">
                    <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontSize: 16 }}>check</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-on-surface font-semibold">นำเสนอกลยุทธ์ Q3</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    <span className="text-xs font-bold uppercase tracking-wider">10:00</span>
                  </div>
                </div>
                <div className="glass-panel p-4 flex items-center gap-4 group cursor-pointer transition-all hover:bg-surface-variant/40 rounded-lg border border-outline-variant/15">
                  <div className="w-6 h-6 rounded border-2 border-outline-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontSize: 16 }}>check</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-on-surface font-medium">ตรวจสอบ Design Tokens</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    <span className="text-xs font-bold uppercase tracking-wider">14:30</span>
                  </div>
                </div>
              </div>
            </section>
            <section className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-secondary">ส่วนตัว</h3>
                <span className="text-[10px] bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">2 งาน</span>
              </div>
              <div className="space-y-3">
                <div className="glass-panel p-4 flex items-center gap-4 group cursor-pointer transition-all hover:bg-surface-variant/40 rounded-lg border border-outline-variant/15">
                  <div className="w-6 h-6 rounded border-2 border-outline-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontSize: 16 }}>check</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-on-surface font-medium">โยคะตอนเย็น</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    <span className="text-xs font-bold uppercase tracking-wider">18:00</span>
                  </div>
                </div>
              </div>
            </section>
            <section className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-tertiary">เรียนรู้</h3>
                <span className="text-[10px] bg-tertiary/10 text-tertiary px-2 py-0.5 rounded-full">1 งาน</span>
              </div>
              <div className="space-y-3">
                <div className="glass-panel p-4 flex items-center gap-4 group cursor-pointer transition-all hover:bg-surface-variant/40 rounded-lg border border-outline-variant/15">
                  <div className="w-6 h-6 rounded border-2 border-outline-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontSize: 16 }}>check</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-on-surface font-medium">คอร์ส TypeScript ขั้นสูง</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    <span className="text-xs font-bold uppercase tracking-wider">21:00</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <BottomNavBar />
      <FAB />
    </div>
  );
}
