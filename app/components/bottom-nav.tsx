"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "../context";

export default function BottomNavBar() {
  const pathname = usePathname();
  const { setShowAddTask } = useApp();

  const links = [
    { href: "/", icon: "today", label: "วันนี้" },
    { href: "/calendar", icon: "calendar_today", label: "ปฏิทิน" },
    { href: "/notes", icon: "sticky_note_2", label: "บันทึก" },
    { href: "/settings", icon: "settings", label: "ตั้งค่า" },
  ];

  return (
    <nav className="md:hidden fixed bottom-6 left-6 right-6 h-16 glass-panel rounded-full border border-white/10 shadow-2xl flex items-center justify-around px-4 z-50">
      {links.map(link => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`${isActive ? "text-primary" : "text-on-surface-variant"} flex flex-col items-center gap-0.5`}
          >
            <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
              {link.icon}
            </span>
            <span className="text-[10px] font-bold">{link.label}</span>
          </Link>
        );
      })}
      <div className="relative -top-8">
        <button
          onClick={() => setShowAddTask(true)}
          className="w-14 h-14 rounded-full main-gradient-bg shadow-lg shadow-primary-dim/40 flex items-center justify-center text-on-primary"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
        </button>
      </div>
    </nav>
  );
}
