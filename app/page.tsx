import Sidebar from "./components/sidebar";
import TopNavBar from "./components/top-navbar";
import BottomNavBar from "./components/bottom-nav";
import FAB from "./components/fab";

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Sidebar />
      <TopNavBar />
      <main className="md:pl-72 min-h-screen pb-24 md:pb-12">
        <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-12">
          <section className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="space-y-2">
              <p className="text-tertiary font-bold tracking-[0.2em] text-xs uppercase">วันพุธที่ 24 พฤษภาคม</p>
              <h2 className="text-5xl md:text-6xl font-black font-headline tracking-tighter text-on-surface">ภาพรวมวันนี้</h2>
            </div>
            <div className="glass-panel p-6 rounded-lg flex items-center gap-6 border border-white/5 shadow-xl">
              <div className="relative w-20 h-20">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-surface-container-highest" cx="40" cy="40" fill="transparent" r="36" stroke="currentColor" strokeWidth="6" />
                  <circle className="text-primary" cx="40" cy="40" fill="transparent" r="36" stroke="currentColor" strokeDasharray="226.2" strokeDashoffset="67.8" strokeWidth="6" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold font-headline text-on-surface">70%</span>
                </div>
              </div>
              <div>
                <p className="text-on-surface font-bold text-lg">เป้าหมายรายวัน</p>
                <p className="text-on-surface-variant text-sm">สำเร็จแล้ว 7 จาก 10 งาน</p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-headline flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">star</span>
                งานสำคัญ 3 ลำดับ
              </h3>
              <button className="text-sm font-semibold text-primary hover:underline transition-all">ดูทั้งหมด</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel p-8 rounded-lg border border-white/5 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="text-6xl font-black font-headline">01</span>
                </div>
                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl main-gradient-bg flex items-center justify-center shadow-lg shadow-primary-dim/20">
                    <span className="material-symbols-outlined text-on-primary">design_services</span>
                  </div>
                  <h4 className="text-xl font-bold text-on-surface">ส่งแบบร่าง UI</h4>
                  <p className="text-on-surface-variant text-sm line-clamp-2">ตรวจสอบความถูกต้องของสีและฟอนต์ตาม Design System ใหม่</p>
                  <div className="flex items-center gap-2 pt-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-md uppercase tracking-wider">ด่วนมาก</span>
                    <span className="text-on-surface-variant text-[10px] font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span> 09:00 - 11:00
                    </span>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-8 rounded-lg border border-white/5 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="text-6xl font-black font-headline">02</span>
                </div>
                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shadow-lg shadow-secondary/20">
                    <span className="material-symbols-outlined text-on-secondary">groups</span>
                  </div>
                  <h4 className="text-xl font-bold text-on-surface">ประชุมทีมประจำสัปดาห์</h4>
                  <p className="text-on-surface-variant text-sm line-clamp-2">หารือเกี่ยวกับความคืบหน้าของโปรเจกต์ Chronos และแผนงานถัดไป</p>
                  <div className="flex items-center gap-2 pt-2">
                    <span className="px-2 py-1 bg-secondary/10 text-secondary text-[10px] font-bold rounded-md uppercase tracking-wider">ปกติ</span>
                    <span className="text-on-surface-variant text-[10px] font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span> 13:30 - 15:00
                    </span>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-8 rounded-lg border border-white/5 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="text-6xl font-black font-headline">03</span>
                </div>
                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-tertiary flex items-center justify-center shadow-lg shadow-tertiary/20">
                    <span className="material-symbols-outlined text-on-tertiary">fitness_center</span>
                  </div>
                  <h4 className="text-xl font-bold text-on-surface">ออกกำลังกาย (Leg Day)</h4>
                  <p className="text-on-surface-variant text-sm line-clamp-2">เน้นการฝึกกล้ามเนื้อขาและคาร์ดิโอเป็นเวลา 45 นาที</p>
                  <div className="flex items-center gap-2 pt-2">
                    <span className="px-2 py-1 bg-tertiary/10 text-tertiary text-[10px] font-bold rounded-md uppercase tracking-wider">ส่วนตัว</span>
                    <span className="text-on-surface-variant text-[10px] font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span> 18:00 - 19:30
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <h3 className="text-xl font-bold font-headline">ไทม์ไลน์รายวัน</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">light_mode</span>
                  <h4 className="text-2xl font-black font-headline text-on-surface">เช้า</h4>
                </div>
                <div className="space-y-4 border-l-2 border-outline-variant pl-6 ml-3">
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-primary ring-4 ring-background"></div>
                    <div className="bg-surface-container-low p-4 rounded-lg">
                      <p className="text-[10px] font-bold text-primary mb-1 uppercase tracking-widest">07:00</p>
                      <p className="text-sm font-semibold">ตื่นนอนและทำสมาธิ</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-primary ring-4 ring-background"></div>
                    <div className="bg-surface-container-low p-4 rounded-lg">
                      <p className="text-[10px] font-bold text-primary mb-1 uppercase tracking-widest">09:00</p>
                      <p className="text-sm font-semibold">Deep Work: งานออกแบบ</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">wb_sunny</span>
                  <h4 className="text-2xl font-black font-headline text-on-surface">บ่าย</h4>
                </div>
                <div className="space-y-4 border-l-2 border-outline-variant pl-6 ml-3">
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-secondary ring-4 ring-background"></div>
                    <div className="bg-surface-container-low p-4 rounded-lg">
                      <p className="text-[10px] font-bold text-secondary mb-1 uppercase tracking-widest">13:30</p>
                      <p className="text-sm font-semibold">ประชุมโปรเจกต์ Chronos</p>
                    </div>
                  </div>
                  <div className="relative opacity-60">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-outline ring-4 ring-background"></div>
                    <div className="bg-surface-container-low p-4 rounded-lg">
                      <p className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-widest">15:30</p>
                      <p className="text-sm font-semibold line-through">ตอบอีเมลลูกค้า</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary">dark_mode</span>
                  <h4 className="text-2xl font-black font-headline text-on-surface">เย็น</h4>
                </div>
                <div className="space-y-4 border-l-2 border-outline-variant pl-6 ml-3">
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-tertiary ring-4 ring-background"></div>
                    <div className="bg-surface-container-low p-4 rounded-lg">
                      <p className="text-[10px] font-bold text-tertiary mb-1 uppercase tracking-widest">18:00</p>
                      <p className="text-sm font-semibold">ออกกำลังกาย</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-tertiary ring-4 ring-background"></div>
                    <div className="bg-surface-container-low p-4 rounded-lg">
                      <p className="text-[10px] font-bold text-tertiary mb-1 uppercase tracking-widest">20:30</p>
                      <p className="text-sm font-semibold">อ่านหนังสือและพักผ่อน</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <BottomNavBar />
      <FAB />
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
    </div>
  );
}
