export default function TopNavBar() {
  return (
    <header className="flex justify-between items-center px-8 py-4 w-full sticky top-0 z-40 bg-slate-950/40 backdrop-blur-lg md:pl-80 shadow-[0_8px_32px_rgba(105,156,255,0.08)]">
      <div className="flex items-center gap-6">
        <span className="text-xl font-black bg-gradient-to-r from-[#85adff] to-[#ac8aff] bg-clip-text text-transparent font-headline">Ethereal Chronos</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-white/5 transition-colors text-slate-400">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div className="w-8 h-8 rounded-full overflow-hidden md:hidden">
          <div className="w-full h-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant text-xs font-bold">T</div>
        </div>
      </div>
    </header>
  );
}
