"use client";

import { useState } from "react";
import Sidebar from "../components/sidebar";
import BottomNavBar from "../components/bottom-nav";
import FAB from "../components/fab";
import AuthGuard from "../components/auth-guard";
import { useApp } from "../context";

function SettingsContent() {
  const { settings, profile, updateSettings, updateProfile, user, logout } = useApp();
  const [name, setName] = useState(user?.name || profile.name);
  const [email, setEmail] = useState(user?.email || profile.email);
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = () => {
    updateProfile({ name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-surface-dim text-on-surface antialiased min-h-screen">
      <Sidebar />
      <main className="md:ml-72 min-h-screen pb-24">
        <header className="flex justify-between items-center px-8 py-6 w-full sticky top-0 z-30 bg-slate-950/40 backdrop-blur-lg shadow-[0_8px_32px_rgba(105,156,255,0.08)]">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black bg-gradient-to-r from-[#85adff] to-[#ac8aff] bg-clip-text text-transparent font-headline tracking-tight">ตั้งค่า</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative group hidden sm:block">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-lg">search</span>
              <input className="bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:ring-1 focus:ring-primary/40 transition-all" placeholder="ค้นหาการตั้งค่า..." type="text" />
            </div>
            <button className="material-symbols-outlined text-blue-300 hover:bg-white/5 p-2 rounded-full transition-colors">notifications</button>
          </div>
        </header>
        <div className="max-w-5xl mx-auto px-8 py-10 space-y-12">
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4">
              <h3 className="text-xl font-bold font-headline mb-2">โปรไฟล์</h3>
              <p className="text-sm text-on-surface-variant">จัดการข้อมูลส่วนตัวและความเป็นส่วนตัวของคุณ</p>
            </div>
            <div className="lg:col-span-8 glass-panel p-8 rounded-lg space-y-8">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/50 transition-all bg-surface-container-highest flex items-center justify-center text-2xl font-bold text-on-surface-variant">
                    {profile.avatar}
                  </div>
                  <button className="absolute bottom-0 right-0 main-gradient-bg w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-surface-dim">
                    <span className="material-symbols-outlined text-xs text-on-primary">edit</span>
                  </button>
                </div>
                <div className="flex-1 space-y-4 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">ชื่อผู้ใช้</label>
                      <input
                        className="w-full bg-surface-container-low border-none rounded-md px-4 py-2 text-sm focus:ring-1 focus:ring-primary/40"
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">อีเมล</label>
                      <input
                        className="w-full bg-surface-container-low border-none rounded-md px-4 py-2 text-sm focus:ring-1 focus:ring-primary/40"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-white/5 items-center gap-4">
                {saved && <span className="text-sm text-primary">บันทึกสำเร็จ!</span>}
                <button
                  onClick={handleSaveProfile}
                  className="px-6 py-2 rounded-full text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
                >
                  บันทึกการเปลี่ยนแปลง
                </button>
              </div>
            </div>
          </section>
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4">
              <h3 className="text-xl font-bold font-headline mb-2">บัญชีผู้ใช้</h3>
              <p className="text-sm text-on-surface-variant">ความปลอดภัยและการเชื่อมต่อบัญชี</p>
            </div>
            <div className="lg:col-span-8 space-y-4">
              <div className="glass-panel p-6 rounded-lg flex items-center justify-between group hover:bg-surface-variant/80 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">lock</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">เปลี่ยนรหัสผ่าน</h4>
                    <p className="text-xs text-on-surface-variant">ปรับปรุงความปลอดภัยของบัญชีคุณ</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
              </div>
              <div className="glass-panel p-6 rounded-lg flex items-center justify-between group hover:bg-surface-variant/80 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-tertiary-container/20 flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined">cloud_sync</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">ซิงค์ข้อมูลคลาวด์</h4>
                    <p className="text-xs text-on-surface-variant">สำรองข้อมูลอัตโนมัติไปยังเซิร์ฟเวอร์</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest mr-2 ${settings.cloudSync ? "text-primary" : "text-on-surface-variant"}`}>
                    {settings.cloudSync ? "Connected" : "Disconnected"}
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
                </div>
              </div>
            </div>
          </section>
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4">
              <h3 className="text-xl font-bold font-headline mb-2">ธีมและการแสดงผล</h3>
              <p className="text-sm text-on-surface-variant">ปรับแต่งประสบการณ์การใช้งานตามความชอบ</p>
            </div>
            <div className="lg:col-span-8 glass-panel p-8 rounded-lg space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary-container/20 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined">palette</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">ธีม</h4>
                    <p className="text-xs text-on-surface-variant">เลือกโหมดสว่างหรือโหมดมืด</p>
                  </div>
                </div>
                <div className="bg-surface-container-low p-1 rounded-full flex">
                  <button
                    onClick={() => updateSettings({ theme: "light" })}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      settings.theme === "light" ? "bg-primary text-on-primary-container shadow-md" : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >สว่าง</button>
                  <button
                    onClick={() => updateSettings({ theme: "dark" })}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      settings.theme === "dark" ? "bg-primary text-on-primary-container shadow-md" : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >มืด</button>
                </div>
              </div>
              <div className="pt-6 border-t border-white/5 space-y-4">
                <h5 className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">โทนสีหลัก</h5>
                <div className="flex gap-4">
                  {["#85adff", "#ac8aff", "#8ce7ff", "#ff716c"].map(color => (
                    <button
                      key={color}
                      onClick={() => updateSettings({ accentColor: color })}
                      className={`w-8 h-8 rounded-full transition-all ${
                        settings.accentColor === color ? "ring-2 ring-offset-2 ring-offset-surface ring-primary" : ""
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4">
              <h3 className="text-xl font-bold font-headline mb-2">การแจ้งเตือน</h3>
              <p className="text-sm text-on-surface-variant">ควบคุมการแจ้งเตือนและการเตือนความจำ</p>
            </div>
            <div className="lg:col-span-8 space-y-4">
              <div className="glass-panel p-6 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">notifications_active</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">การแจ้งเตือนแบบพุช</h4>
                    <p className="text-xs text-on-surface-variant">รับข่าวสารและการเตือนผ่านอุปกรณ์</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    className="sr-only peer"
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={() => updateSettings({ pushNotifications: !settings.pushNotifications })}
                  />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="glass-panel p-6 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center text-error">
                    <span className="material-symbols-outlined">do_not_disturb_on</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">โหมดห้ามรบกวน</h4>
                    <p className="text-xs text-on-surface-variant">ปิดการแจ้งเตือนในช่วงเวลาที่กำหนด</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    className="sr-only peer"
                    type="checkbox"
                    checked={settings.doNotDisturb}
                    onChange={() => updateSettings({ doNotDisturb: !settings.doNotDisturb })}
                  />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </section>
          <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-6 opacity-60">
            <div className="flex items-center gap-8 text-[10px] uppercase tracking-widest font-bold">
              <a className="hover:text-primary transition-colors" href="#">ข้อตกลงการใช้งาน</a>
              <a className="hover:text-primary transition-colors" href="#">นโยบายความเป็นส่วนตัว</a>
              <a className="hover:text-primary transition-colors" href="#">ศูนย์ความช่วยเหลือ</a>
            </div>
            <p className="text-xs font-medium text-on-surface-variant">Chronos v2.4.0 — Made with Intent</p>
          </div>
        </div>
      </main>
      <BottomNavBar />
      <FAB />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  );
}
