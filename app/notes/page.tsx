import Sidebar from "../components/sidebar";
import BottomNavBar from "../components/bottom-nav";
import FAB from "../components/fab";

export default function NotesPage() {
  return (
    <div className="bg-background text-on-surface flex min-h-screen">
      <Sidebar />
      <main className="flex-grow md:ml-72 min-h-screen flex flex-col relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[30rem] h-[30rem] bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>
        <header className="sticky top-0 z-40 bg-slate-950/60 backdrop-blur-xl flex justify-between items-center w-full px-8 py-4">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold tracking-tighter text-blue-300">Ethereal Chronos</h1>
          </div>
          <div className="flex items-center space-x-6">
            <span className="material-symbols-outlined text-slate-400 hover:text-blue-200 transition-colors cursor-pointer">notifications</span>
          </div>
        </header>
        <div className="flex flex-col lg:flex-row flex-grow p-6 gap-6 relative z-10 overflow-hidden h-[calc(100vh-72px)]">
          <section className="w-full lg:w-80 flex flex-col space-y-4 h-full">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-bold text-on-surface">บันทึกล่าสุด</h2>
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">tune</span>
            </div>
            <div className="flex-grow overflow-y-auto space-y-3 pr-2 pb-10">
              <div className="p-5 rounded-lg bg-surface-container-high border border-outline-variant/15 relative overflow-hidden group transition-all duration-300">
                <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-primary to-secondary"></div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Reflections</span>
                  <span className="text-[10px] text-on-surface-variant">2 นาที</span>
                </div>
                <h3 className="font-bold text-on-surface leading-tight mb-2">The Obsidian Lens: Structural Logic</h3>
                <p className="text-xs text-on-surface-variant line-clamp-2">Exploration of depth and layers within the new UI system...</p>
              </div>
              <div className="p-5 rounded-lg bg-surface-container-low/50 border border-outline-variant/5 hover:bg-surface-container-high transition-all duration-300 group cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Ideas</span>
                  <span className="text-[10px] text-on-surface-variant">4 ชม.</span>
                </div>
                <h3 className="font-bold text-on-surface leading-tight mb-2">Quarterly Roadmap 2024</h3>
                <p className="text-xs text-on-surface-variant line-clamp-2">Key milestones for the development team...</p>
              </div>
              <div className="p-5 rounded-lg bg-surface-container-low/50 border border-outline-variant/5 hover:bg-surface-container-high transition-all duration-300 group cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Meetings</span>
                  <span className="text-[10px] text-on-surface-variant">เมื่อวาน</span>
                </div>
                <h3 className="font-bold text-on-surface leading-tight mb-2">Client Brief: Astral Systems</h3>
                <p className="text-xs text-on-surface-variant line-clamp-2">Meeting notes regarding the rebrand...</p>
              </div>
            </div>
          </section>
          <section className="flex-grow glass-panel bg-surface-variant/40 rounded-lg flex flex-col border border-outline-variant/10 overflow-hidden">
            <div className="p-4 border-b border-outline-variant/10 flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <button className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors">
                  <span className="material-symbols-outlined text-lg">format_bold</span>
                </button>
                <button className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors">
                  <span className="material-symbols-outlined text-lg">format_italic</span>
                </button>
                <button className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors">
                  <span className="material-symbols-outlined text-lg">format_list_bulleted</span>
                </button>
                <button className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors">
                  <span className="material-symbols-outlined text-lg">format_quote</span>
                </button>
              </div>
              <button className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-primary px-4 py-2 rounded-full border border-primary/20 hover:bg-primary/5 transition-all">
                <span className="material-symbols-outlined text-sm">share</span>
                <span>Share</span>
              </button>
            </div>
            <div className="px-10 py-8 space-y-4">
              <input className="w-full bg-transparent border-none text-4xl font-extrabold tracking-tight text-on-surface focus:ring-0 placeholder-on-surface-variant/30 px-0" type="text" defaultValue="The Obsidian Lens: Structural Logic" />
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-2 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Reflections</span>
                </div>
              </div>
            </div>
            <div className="flex-grow px-10 pb-10 overflow-y-auto">
              <textarea className="w-full h-full bg-transparent border-none text-on-surface-variant leading-relaxed text-lg focus:ring-0 resize-none p-0 placeholder-on-surface-variant/20" placeholder="เริ่มเขียนที่นี่..." defaultValue={`This design system moves away from the rigid, boxed-in architecture of traditional productivity apps and instead embraces the concept of "The Obsidian Lens."

The goal is to create a digital environment that feels like a high-end physical planner resting on a dark, polished stone surface.`} />
            </div>
          </section>
        </div>
      </main>
      <BottomNavBar />
      <FAB />
    </div>
  );
}
