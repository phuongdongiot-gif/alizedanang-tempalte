"use client";
import React, { useState } from "react";
import { useStore } from "../../../lib/store-context";
import PortalHeader from "../../../components/PortalHeader";
import PortalFooter from "../../../components/PortalFooter";
import { getDictionary } from "../../../dictionaries";
import { MapPin, Phone, Mail, FileText, Image, DollarSign, CheckCircle2, Loader2 } from "lucide-react";

const PROPERTY_TYPES = ["Căn hộ chung cư", "Nhà phố", "Biệt thự", "Đất nền", "Shophouse", "Penthouse"];
const TRANSACTION_TYPES = ["Bán", "Cho thuê"];

export default function PostListingPage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = React.useState("vi");
  const { customer, setAuthModalOpen, setAuthMode } = useStore();
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [form, setForm] = useState({
    title: "", description: "", price: "", area: "", beds: "", baths: "",
    address: "", district: "", city: "Đà Nẵng",
    property_type: PROPERTY_TYPES[0], transaction_type: TRANSACTION_TYPES[0],
    contact_name: customer?.first_name + " " + (customer?.last_name || "") || "",
    contact_phone: customer?.phone || "",
    contact_email: customer?.email || "",
  });

  React.useEffect(() => { params.then(({ locale: l }) => setLocale(l)); }, [params]);
  const dict = getDictionary(locale);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    // Gửi tin đăng lên NestJS backend
    try {
      await new Promise(r => setTimeout(r, 1500)); // Simulate API call
      setStatus("success");
    } catch {
      setStatus("idle");
    }
  };

  if (!customer) {
    return (
      <div className="min-h-screen bg-[#070A10] text-pearl-white">
        <PortalHeader nav={dict.portal.nav} locale={locale} />
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
          <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-6">
            <FileText size={36} className="text-gold" />
          </div>
          <h1 className="font-serif text-3xl font-light mb-3">Đăng Tin Bất Động Sản</h1>
          <p className="text-white/40 text-sm mb-8 max-w-md">Vui lòng đăng nhập hoặc tạo tài khoản để đăng tin bất động sản của bạn</p>
          <div className="flex gap-3">
            <button onClick={() => { setAuthMode("login"); setAuthModalOpen(true); }}
              className="px-8 py-3 border border-gold/40 text-gold text-sm uppercase tracking-widest hover:bg-gold hover:text-jet-black transition-all">Đăng Nhập</button>
            <button onClick={() => { setAuthMode("register"); setAuthModalOpen(true); }}
              className="px-8 py-3 bg-gold text-jet-black text-sm font-bold uppercase tracking-widest">Đăng Ký Miễn Phí</button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#070A10] text-pearl-white">
        <PortalHeader nav={dict.portal.nav} locale={locale} />
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
          <CheckCircle2 size={72} className="text-green-400 mb-6" />
          <h1 className="font-serif text-3xl font-light mb-3">Tin Đăng Đã Được Gửi!</h1>
          <p className="text-white/40 text-sm mb-8 max-w-md">Tin đăng của bạn đang được xem xét và sẽ xuất hiện trên website sau khi được duyệt (trong vòng 24h)</p>
          <div className="flex gap-3">
            <a href={`/${locale}`} className="px-8 py-3 border border-white/20 text-white text-sm uppercase tracking-widest hover:bg-white/5 transition-all">Về Trang Chủ</a>
            <button onClick={() => setStatus("idle")} className="px-8 py-3 bg-gold text-jet-black text-sm font-bold uppercase tracking-widest">Đăng Tin Khác</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070A10] text-pearl-white">
      <PortalHeader nav={dict.portal.nav} locale={locale} />

      <div className="max-w-[900px] mx-auto px-6 lg:px-12 pt-32 pb-24">
        <div className="mb-10">
          <span className="text-gold text-[10px] tracking-[0.4em] uppercase font-light block mb-3">Đăng Tin</span>
          <h1 className="font-serif text-4xl font-light">Đăng Tin Bất Động Sản</h1>
          <p className="text-white/40 text-sm mt-2">Điền thông tin chi tiết để tin đăng của bạn tiếp cận nhiều khách hàng hơn</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Basic Info */}
          <div className="bg-[#0A0C10] border border-white/5 rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-medium flex items-center gap-2 mb-4"><FileText size={16} className="text-gold" /> Thông Tin Cơ Bản</h2>
            <div>
              <label className="text-white/40 text-xs block mb-1.5">Tiêu đề tin đăng *</label>
              <input value={form.title} onChange={e => set("title", e.target.value)} required
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-gold/50"
                placeholder="VD: Căn hộ 2PN Alize Đà Nẵng view biển đẹp, full nội thất" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/40 text-xs block mb-1.5">Loại BĐS</label>
                <select value={form.property_type} onChange={e => set("property_type", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-gold/50">
                  {PROPERTY_TYPES.map(t => <option key={t} value={t} className="bg-[#111]">{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-white/40 text-xs block mb-1.5">Mục đích</label>
                <select value={form.transaction_type} onChange={e => set("transaction_type", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-gold/50">
                  {TRANSACTION_TYPES.map(t => <option key={t} value={t} className="bg-[#111]">{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1.5">Mô tả chi tiết</label>
              <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={4}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-gold/50 resize-none"
                placeholder="Mô tả đặc điểm nổi bật, tiện ích, hướng nhà, tầng..." />
            </div>
          </div>

          {/* Section 2: Location */}
          <div className="bg-[#0A0C10] border border-white/5 rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-medium flex items-center gap-2 mb-4"><MapPin size={16} className="text-gold" /> Vị Trí</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/40 text-xs block mb-1.5">Quận/Huyện *</label>
                <input value={form.district} onChange={e => set("district", e.target.value)} required
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-gold/50" placeholder="Sơn Trà" />
              </div>
              <div>
                <label className="text-white/40 text-xs block mb-1.5">Thành phố</label>
                <input value={form.city} onChange={e => set("city", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-gold/50" />
              </div>
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1.5">Địa chỉ cụ thể</label>
              <input value={form.address} onChange={e => set("address", e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-gold/50" placeholder="Số nhà, đường, phường..." />
            </div>
          </div>

          {/* Section 3: Details */}
          <div className="bg-[#0A0C10] border border-white/5 rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-medium flex items-center gap-2 mb-4"><DollarSign size={16} className="text-gold" /> Thông Số & Giá</h2>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-white/40 text-xs block mb-1.5">Diện tích (m²) *</label>
                <input type="number" value={form.area} onChange={e => set("area", e.target.value)} required
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-gold/50" placeholder="65" />
              </div>
              <div>
                <label className="text-white/40 text-xs block mb-1.5">Phòng ngủ</label>
                <select value={form.beds} onChange={e => set("beds", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-gold/50">
                  <option value="" className="bg-[#111]">--</option>
                  {["Studio", "1", "2", "3", "4", "5+"].map(n => <option key={n} value={n} className="bg-[#111]">{n}</option>)}
                </select>
              </div>
              <div>
                <label className="text-white/40 text-xs block mb-1.5">Phòng tắm</label>
                <select value={form.baths} onChange={e => set("baths", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-gold/50">
                  <option value="" className="bg-[#111]">--</option>
                  {["1", "2", "3", "4+"].map(n => <option key={n} value={n} className="bg-[#111]">{n}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1.5">Giá *</label>
              <input value={form.price} onChange={e => set("price", e.target.value)} required
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-gold/50" placeholder="VD: 3.5 tỷ hoặc 15 triệu/tháng" />
            </div>
          </div>

          {/* Section 4: Contact */}
          <div className="bg-[#0A0C10] border border-white/5 rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-medium flex items-center gap-2 mb-4"><Phone size={16} className="text-gold" /> Thông Tin Liên Hệ</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-white/40 text-xs block mb-1.5">Họ tên *</label>
                <input value={form.contact_name} onChange={e => set("contact_name", e.target.value)} required
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-gold/50" />
              </div>
              <div>
                <label className="text-white/40 text-xs block mb-1.5">SĐT *</label>
                <input value={form.contact_phone} onChange={e => set("contact_phone", e.target.value)} required
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-gold/50" />
              </div>
              <div>
                <label className="text-white/40 text-xs block mb-1.5">Email</label>
                <input type="email" value={form.contact_email} onChange={e => set("contact_email", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-gold/50" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={status === "loading"}
            className="w-full bg-gold text-jet-black font-bold py-4 rounded-xl text-sm uppercase tracking-widest hover:bg-gold/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {status === "loading" ? <Loader2 size={18} className="animate-spin" /> : null}
            {status === "loading" ? "Đang gửi..." : "Đăng Tin Ngay"}
          </button>
        </form>
      </div>

      <PortalFooter footer={dict.portal.footer} locale={locale} />
    </div>
  );
}
