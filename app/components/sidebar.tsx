"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "../context";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useApp();

  const links = [
    { href: "/", icon: "today", label: "ภาพรวมวันนี้" },
    { href: "/calendar", icon: "calendar_today", label: "ปฏิทิน" },
    { href: "/tasks", icon: "format_list_bulleted", label: "รายการงาน" },
    { href: "/notes", icon: "sticky_note_2", label: "บันทึก" },
    { href: "/settings", icon: "settings", label: "ตั้งค่า" },
  ];

  const userName = user?.name || "ผู้ใช้";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <aside className="hidden md:flex flex-col gap-y-2 p-6 h-screen w-72 fixed left-0 top-0 bg-[#091328]/80 backdrop-blur-xl border-r border-white/5 z-50">
      <div className="mb-10 px-2">
        <h1 className="text-2xl font-bold text-blue-300 font-headline">Chronos</h1>
        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Productivity System</p>
      </div>
      <nav className="flex flex-col gap-y-2 flex-1">
        {links.map(link => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out font-medium text-sm ${
                isActive
                  ? "text-blue-300 bg-blue-400/10"
                  : "text-slate-400 hover:text-blue-200 hover:bg-white/5"
              }`}
            >
              <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {link.icon}
              </span>
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-6 border-t border-white/5 flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-highest flex items-center justify-center text-on-surface-variant text-sm font-bold">
          {userInitial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-on-surface truncate">{userName}</p>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Pro Plan</p>
        </div>
        <button
          onClick={logout}
          className="p-2 text-on-surface-variant hover:text-error transition-colors"
          title="ออกจากระบบ"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
        </button>
      </div>
    </aside>
  );
}
