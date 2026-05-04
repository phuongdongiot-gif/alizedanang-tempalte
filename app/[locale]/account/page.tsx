"use client";
import React, { useState } from "react";
import { useStore } from "../../../lib/store-context";
import PortalHeader from "../../../components/PortalHeader";
import PortalFooter from "../../../components/PortalFooter";
import { getDictionary } from "../../../dictionaries";
import { User, Mail, Phone, LogOut, ShoppingBag, CalendarCheck, Lock, Loader2, CheckCircle2, Heart } from "lucide-react";
import { getCustomerOrders, getCustomerBookings } from "../../../lib/medusa";

export default function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = React.useState("vi");
  const { customer, logout, token, setAuthModalOpen, setAuthMode } = useStore();
  const [tab, setTab] = useState<"profile" | "orders" | "bookings" | "wishlist">("profile");

  const [orders, setOrders] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  React.useEffect(() => { params.then(({ locale: l }) => setLocale(l)); }, [params]);

  React.useEffect(() => {
    if (!token) return;
    const loadData = async () => {
      setLoadingData(true);
      try {
        if (tab === "orders" && orders.length === 0) {
          const res = await getCustomerOrders(token);
          if (res.orders) setOrders(res.orders);
        } else if (tab === "bookings" && bookings.length === 0) {
          const res = await getCustomerBookings(token);
          if (res.bookings) setBookings(res.bookings);
        }
      } catch (e) {
        console.error("Error loading tab data", e);
      }
      setLoadingData(false);
    };
    loadData();
  }, [tab, token]);
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
        <div className="flex border-b border-white/10 mb-8 overflow-x-auto hide-scrollbar">
          {[
            { key: "profile", label: "Thông Tin", icon: User },
            { key: "orders", label: "Đơn Hàng", icon: ShoppingBag },
            { key: "bookings", label: "Đặt Lịch", icon: CalendarCheck },
            { key: "wishlist", label: "Yêu Thích", icon: Heart },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)}
              className={`flex items-center gap-2 px-6 py-3 text-sm transition-colors border-b-2 whitespace-nowrap -mb-px ${tab === t.key ? "border-gold text-gold" : "border-transparent text-white/40 hover:text-white"}`}>
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
          <div className="bg-[#0A0C10] border border-white/5 rounded-2xl p-6 min-h-[300px]">
            <h2 className="text-white font-serif text-lg mb-6">Lịch Sử Đơn Hàng</h2>
            {loadingData ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-gold" /></div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <div key={order.id} className="border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors">
                    <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-3">
                      <div>
                        <p className="text-white text-sm font-semibold">Đơn hàng #{order.display_id}</p>
                        <p className="text-white/40 text-xs mt-1">{new Date(order.created_at).toLocaleDateString("vi-VN")}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded ${order.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-gold/20 text-gold'}`}>
                          {order.status || 'Đang xử lý'}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="text-sm text-white/60">
                        {order.items?.length || 0} sản phẩm
                      </div>
                      <div className="text-gold font-bold">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.total || 0)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingBag size={48} className="text-white/10 mx-auto mb-3" />
                <p className="text-white/40 text-sm">Chưa có đơn hàng nào</p>
                <a href={`/${locale}/shop`} className="inline-block mt-4 text-gold text-sm border-b border-gold/40 hover:border-gold transition-colors">Khám phá cửa hàng</a>
              </div>
            )}
          </div>
        )}

        {tab === "bookings" && (
          <div className="bg-[#0A0C10] border border-white/5 rounded-2xl p-6 min-h-[300px]">
            <h2 className="text-white font-serif text-lg mb-6">Lịch Hẹn Của Tôi</h2>
            {loadingData ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-gold" /></div>
            ) : bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((b: any) => (
                  <div key={b.id} className="border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <CalendarCheck size={16} className="text-gold" />
                        <span className="text-white font-semibold text-sm capitalize">{b.service_type || 'Dịch vụ'}</span>
                      </div>
                      <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                        {b.status || 'Chờ xác nhận'}
                      </span>
                    </div>
                    <p className="text-white/60 text-xs mb-1">Ngày: {b.scheduled_date} {b.scheduled_time}</p>
                    {b.property_name && <p className="text-white/60 text-xs">Dự án: {b.property_name}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarCheck size={48} className="text-white/10 mx-auto mb-3" />
                <p className="text-white/40 text-sm">Chưa có lịch hẹn nào</p>
                <a href={`/${locale}/services`} className="inline-block mt-4 text-gold text-sm border-b border-gold/40 hover:border-gold transition-colors">Đặt lịch dịch vụ</a>
              </div>
            )}
          </div>
        )}

        {tab === "wishlist" && (
          <div className="bg-[#0A0C10] border border-white/5 rounded-2xl p-6 min-h-[300px]">
            <h2 className="text-white font-serif text-lg mb-6">Danh Sách Yêu Thích</h2>
            {customer?.metadata?.wishlist && Array.isArray(customer.metadata.wishlist) && customer.metadata.wishlist.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customer.metadata.wishlist.map((id: string, idx: number) => (
                  <div key={idx} className="border border-white/10 rounded p-4 flex justify-between items-center">
                    <span className="text-white text-sm">ID: {id}</span>
                    <Heart size={16} className="text-gold fill-gold" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart size={48} className="text-white/10 mx-auto mb-3" />
                <p className="text-white/40 text-sm">Chưa có mục nào được lưu</p>
                <a href={`/${locale}/properties`} className="inline-block mt-4 text-gold text-sm border-b border-gold/40 hover:border-gold transition-colors">Tìm kiếm bất động sản</a>
              </div>
            )}
          </div>
        )}
      </div>

      <PortalFooter footer={dict.portal.footer} locale={locale} />
    </div>
  );
}
