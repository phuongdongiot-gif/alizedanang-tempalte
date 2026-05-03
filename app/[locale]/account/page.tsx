"use client";
import React, { useState } from "react";
import { useStore } from "../../../lib/store-context";
import PortalHeader from "../../../components/PortalHeader";
import PortalFooter from "../../../components/PortalFooter";
import { getDictionary } from "../../../dictionaries";
import { User, Mail, Phone, LogOut, ShoppingBag, CalendarCheck, Lock, Loader2, CheckCircle2 } from "lucide-react";

export default function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = React.useState("vi");
  const { customer, logout, token, setAuthModalOpen, setAuthMode } = useStore();
  const [tab, setTab] = useState<"profile" | "orders" | "bookings">("profile");

  React.useEffect(() => { params.then(({ locale: l }) => setLocale(l)); }, [params]);
  const dict = getDictionary(locale);

  if (!customer) {
    return (
      <div className="min-h-screen bg-[#070A10] text-pearl-white">
        <PortalHeader nav={dict.portal.nav} locale={locale} />
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
            <User size={36} className="text-white/20" />
          </div>
          <h1 className="font-serif text-3xl font-light mb-3">Tài Khoản Của Bạn</h1>
          <p className="text-white/40 text-sm mb-8">Đăng nhập để xem lịch sử đặt hàng và dịch vụ</p>
          <div className="flex gap-3">
            <button onClick={() => { setAuthMode("login"); setAuthModalOpen(true); }}
              className="px-8 py-3 border border-gold/40 text-gold text-sm uppercase tracking-widest hover:bg-gold hover:text-jet-black transition-all">
              Đăng Nhập
            </button>
            <button onClick={() => { setAuthMode("register"); setAuthModalOpen(true); }}
              className="px-8 py-3 bg-gold text-jet-black text-sm font-bold uppercase tracking-widest hover:bg-gold/90 transition-all">
              Đăng Ký
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070A10] text-pearl-white">
      <PortalHeader nav={dict.portal.nav} locale={locale} />

      <div className="max-w-[900px] mx-auto px-6 lg:px-12 pt-32 pb-24">
        {/* Profile Banner */}
        <div className="flex items-center gap-5 mb-10 p-6 bg-white/3 border border-white/5 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center flex-shrink-0">
            <span className="text-gold font-bold font-serif text-2xl">{customer.first_name?.charAt(0)}</span>
          </div>
          <div className="flex-1">
            <h1 className="text-white text-xl font-serif">{customer.first_name} {customer.last_name}</h1>
            <p className="text-white/40 text-sm">{customer.email}</p>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm transition-colors">
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-8">
          {[
            { key: "profile", label: "Thông Tin", icon: User },
            { key: "orders", label: "Đơn Hàng", icon: ShoppingBag },
            { key: "bookings", label: "Đặt Lịch", icon: CalendarCheck },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)}
              className={`flex items-center gap-2 px-6 py-3 text-sm transition-colors border-b-2 -mb-px ${tab === t.key ? "border-gold text-gold" : "border-transparent text-white/40 hover:text-white"}`}>
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === "profile" && (
          <div className="bg-[#0A0C10] border border-white/5 rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-serif text-lg mb-4">Thông Tin Cá Nhân</h2>
            {[
              { label: "Họ", value: customer.first_name, icon: User },
              { label: "Tên", value: customer.last_name, icon: User },
              { label: "Email", value: customer.email, icon: Mail },
              { label: "Điện thoại", value: customer.phone || "Chưa cập nhật", icon: Phone },
            ].map(field => (
              <div key={field.label} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
                <field.icon size={16} className="text-gold/60 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-white/40 text-xs mb-0.5">{field.label}</p>
                  <p className="text-white text-sm">{field.value}</p>
                </div>
              </div>
            ))}
            <div className="pt-4">
              <p className="text-white/25 text-xs flex items-center gap-1"><Lock size={11} /> Để thay đổi thông tin, vui lòng liên hệ bộ phận hỗ trợ</p>
            </div>
          </div>
        )}

        {tab === "orders" && (
          <div className="text-center py-20 bg-[#0A0C10] border border-white/5 rounded-2xl">
            <ShoppingBag size={48} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/40 text-sm">Chưa có đơn hàng nào</p>
            <a href={`/${locale}/shop`} className="inline-block mt-4 text-gold text-sm border-b border-gold/40 hover:border-gold">Khám phá cửa hàng</a>
          </div>
        )}

        {tab === "bookings" && (
          <div className="text-center py-20 bg-[#0A0C10] border border-white/5 rounded-2xl">
            <CalendarCheck size={48} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/40 text-sm">Chưa có lịch hẹn nào</p>
            <a href={`/${locale}/services`} className="inline-block mt-4 text-gold text-sm border-b border-gold/40 hover:border-gold">Đặt lịch dịch vụ</a>
          </div>
        )}
      </div>

      <PortalFooter footer={dict.portal.footer} locale={locale} />
    </div>
  );
}
