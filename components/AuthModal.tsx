"use client";
import React, { useState } from "react";
import { useStore } from "../lib/store-context";
import { X, Mail, Lock, User, Phone, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, authMode, setAuthMode, login, register, authLoading } = useStore();
  const [form, setForm] = useState({ email: "", password: "", first_name: "", last_name: "", phone: "" });
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  if (!authModalOpen) return null;

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (authMode === "login") {
        await login(form.email, form.password);
      } else {
        if (!form.first_name.trim()) { setError("Vui lòng nhập họ tên"); return; }
        await register(form);
      }
    } catch (err: any) {
      setError(err.message || "Đã có lỗi xảy ra");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setAuthModalOpen(false)}>
      <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="relative p-8 pb-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-gold rounded flex items-center justify-center">
              <span className="text-jet-black font-bold font-serif text-lg">G</span>
            </div>
            <span className="text-pearl-white font-serif text-xl tracking-widest">Estate</span>
          </div>
          <h2 className="text-2xl font-serif font-light text-white mt-4">
            {authMode === "login" ? "Đăng Nhập" : "Tạo Tài Khoản"}
          </h2>
          <p className="text-white/40 text-sm mt-1">
            {authMode === "login" ? "Chào mừng trở lại!" : "Đăng ký để trải nghiệm đầy đủ"}
          </p>
          <button onClick={() => setAuthModalOpen(false)} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {authMode === "register" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="text" placeholder="Họ" value={form.first_name} onChange={e => set("first_name", e.target.value)} required
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:border-gold/50 placeholder:text-white/25 transition-colors" />
              </div>
              <div className="relative">
                <input type="text" placeholder="Tên" value={form.last_name} onChange={e => set("last_name", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-gold/50 placeholder:text-white/25 transition-colors" />
              </div>
            </div>
          )}

          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input type="email" placeholder="Email" value={form.email} onChange={e => set("email", e.target.value)} required
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:border-gold/50 placeholder:text-white/25 transition-colors" />
          </div>

          {authMode === "register" && (
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="tel" placeholder="Số điện thoại (tùy chọn)" value={form.phone} onChange={e => set("phone", e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:border-gold/50 placeholder:text-white/25 transition-colors" />
            </div>
          )}

          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input type={showPass ? "text" : "password"} placeholder="Mật khẩu" value={form.password} onChange={e => set("password", e.target.value)} required minLength={8}
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg pl-10 pr-10 py-3 text-sm outline-none focus:border-gold/50 placeholder:text-white/25 transition-colors" />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70">
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button type="submit" disabled={authLoading}
            className="w-full bg-gold text-jet-black font-semibold py-3.5 rounded-lg text-sm uppercase tracking-widest hover:bg-gold/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
            {authLoading ? <Loader2 size={16} className="animate-spin" /> : null}
            {authMode === "login" ? "Đăng Nhập" : "Tạo Tài Khoản"}
          </button>

          <p className="text-center text-white/40 text-sm pt-2">
            {authMode === "login" ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
            <button type="button" onClick={() => { setAuthMode(authMode === "login" ? "register" : "login"); setError(""); }}
              className="text-gold hover:text-gold/80 font-medium transition-colors">
              {authMode === "login" ? "Đăng ký ngay" : "Đăng nhập"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
