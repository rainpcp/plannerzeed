"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "../context";

export default function RegisterPage() {
  const { register } = useApp();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }
    if (password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const success = register(name, email, password);
    setLoading(false);
    if (success) {
      router.push("/");
    } else {
      setError("อีเมลนี้มีผู้ใช้งานแล้ว");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black font-headline bg-gradient-to-r from-[#85adff] to-[#ac8aff] bg-clip-text text-transparent">Chronos</h1>
          <p className="text-slate-400 text-sm mt-1">Productivity System</p>
        </div>
        <div className="glass-panel p-8 rounded-lg border border-white/10">
          <h2 className="text-2xl font-bold font-headline text-on-surface mb-6">สร้างบัญชีใหม่</h2>
          {error && (
            <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg text-sm text-error">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold block mb-1">ชื่อ</label>
              <input
                className="w-full bg-surface-container-low border-none rounded-md px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/40"
                type="text"
                placeholder="ชื่อของคุณ"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold block mb-1">อีเมล</label>
              <input
                className="w-full bg-surface-container-low border-none rounded-md px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/40"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold block mb-1">รหัสผ่าน</label>
              <input
                className="w-full bg-surface-container-low border-none rounded-md px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/40"
                type="password"
                placeholder="อย่างน้อย 6 ตัวอักษร"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold block mb-1">ยืนยันรหัสผ่าน</label>
              <input
                className="w-full bg-surface-container-low border-none rounded-md px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/40"
                type="password"
                placeholder="กรอกรหัสผ่านอีกครั้ง"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg main-gradient-bg text-on-primary font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "กำลังสร้างบัญชี..." : "สมัครสมาชิก"}
            </button>
          </form>
          <p className="text-center text-sm text-on-surface-variant mt-6">
            มีบัญชีอยู่แล้ว?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
