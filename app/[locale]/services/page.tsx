"use client";
import React, { useState } from "react";
import PortalHeader from "../../../components/PortalHeader";
import PortalFooter from "../../../components/PortalFooter";
import { getDictionary } from "../../../dictionaries";
import { MEDUSA_URL } from "../../../lib/medusa";
import { CalendarCheck, Wrench, Palette, FileText, Home, Sofa, CheckCircle2, Loader2 } from "lucide-react";

const SERVICES = [
  { key: "viewing", icon: Home, label: "Đặt Lịch Xem Nhà", desc: "Lịch hẹn xem căn hộ và nhà ở tại Alize Đà Nẵng với chuyên viên tư vấn", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
  { key: "consulting", icon: CalendarCheck, label: "Gói Tư Vấn BĐS", desc: "Tư vấn chuyên sâu về mua bán, đầu tư và pháp lý bất động sản", color: "text-gold", bg: "bg-gold/10 border-gold/20" },
  { key: "rental", icon: FileText, label: "Hợp Đồng Cho Thuê", desc: "Dịch vụ soạn thảo và quản lý hợp đồng cho thuê chuyên nghiệp", color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20" },
  { key: "repair", icon: Wrench, label: "Sửa Chữa & Cải Tạo", desc: "Dịch vụ sửa chữa, cải tạo và renovation nhà ở chất lượng cao", color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20" },
  { key: "deco", icon: Palette, label: "Deco & Trang Trí", desc: "Thiết kế và thi công trang trí nội thất theo phong cách cao cấp", color: "text-pink-400", bg: "bg-pink-400/10 border-pink-400/20" },
  { key: "furniture", icon: Sofa, label: "Tư Vấn Nội Thất", desc: "Tư vấn lựa chọn và cung cấp nội thất phù hợp với không gian", color: "text-green-400", bg: "bg-green-400/10 border-green-400/20" },
];

export default function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = React.useState("vi");
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [form, setForm] = useState({ customer_name: "", customer_phone: "", customer_email: "", scheduled_date: "", scheduled_time: "", notes: "", property_name: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  React.useEffect(() => { params.then(({ locale: l }) => setLocale(l)); }, [params]);
  const dict = getDictionary(locale);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer_name || !form.customer_phone) { setErrorMsg("Vui lòng nhập họ tên và số điện thoại"); return; }
    setStatus("loading"); setErrorMsg("");
    try {
      const res = await fetch(`${MEDUSA_URL}/store/bookings`, {
        method: "POST", 
        headers: { 
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
        },
        body: JSON.stringify({ ...form, service_type: selectedService.key }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Lỗi gửi yêu cầu"); }
      setStatus("success");
      setForm({ customer_name: "", customer_phone: "", customer_email: "", scheduled_date: "", scheduled_time: "", notes: "", property_name: "" });
    } catch (err: any) {
      setStatus("error"); setErrorMsg(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A10] text-pearl-white">
      <PortalHeader nav={dict.portal.nav} locale={locale} />

      <section className="pt-32 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-gold text-[10px] tracking-[0.4em] uppercase font-light block mb-4">Alize Đà Nẵng</span>
          <h1 className="font-serif text-4xl md:text-5xl font-light tracking-tight mb-4">Dịch Vụ Bất Động Sản</h1>
          <p className="text-champagne/60 font-light text-sm">Đặt lịch ngay — chuyên viên sẽ liên hệ xác nhận trong 30 phút</p>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Service selector */}
          <div>
            <h2 className="text-white/50 text-xs uppercase tracking-widest mb-5">Chọn loại dịch vụ</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICES.map(svc => (
                <button key={svc.key} onClick={() => setSelectedService(svc)}
                  className={`text-left p-4 rounded-xl border transition-all ${selectedService.key === svc.key ? `${svc.bg} border-current` : "border-white/5 hover:border-white/20 bg-white/3"}`}>
                  <svc.icon size={20} className={`${svc.color} mb-2`} />
                  <h3 className={`text-sm font-medium mb-1 ${selectedService.key === svc.key ? "text-white" : "text-white/70"}`}>{svc.label}</h3>
                  <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{svc.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Booking form */}
          <div className="bg-[#0A0C10] border border-white/5 rounded-2xl p-7">
            <div className="flex items-center gap-3 mb-6">
              <selectedService.icon size={22} className={selectedService.color} />
              <h2 className="text-white font-serif text-xl">{selectedService.label}</h2>
            </div>

            {status === "success" ? (
              <div className="text-center py-10 md:py-12">
                <CheckCircle2 size={56} className="text-green-400 mx-auto mb-4" />
                <h3 className="text-white text-xl font-serif mb-2">Đặt lịch thành công!</h3>
                <p className="text-white/50 text-sm mb-6">Chúng tôi sẽ liên hệ trong 30 phút để xác nhận lịch hẹn</p>
                <button onClick={() => setStatus("idle")} className="text-gold border-b border-gold/50 text-sm">Đặt thêm lịch khác</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/40 text-xs block mb-1.5">Họ và tên *</label>
                    <input value={form.customer_name} onChange={e => set("customer_name", e.target.value)} required
                      className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold/50" placeholder="Nguyễn Văn A" />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs block mb-1.5">Số điện thoại *</label>
                    <input value={form.customer_phone} onChange={e => set("customer_phone", e.target.value)} required
                      className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold/50" placeholder="0901234567" />
                  </div>
                </div>

                <div>
                  <label className="text-white/40 text-xs block mb-1.5">Email (tùy chọn)</label>
                  <input type="email" value={form.customer_email} onChange={e => set("customer_email", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold/50" placeholder="email@gmail.com" />
                </div>

                {["viewing", "consulting", "rental"].includes(selectedService.key) && (
                  <div>
                    <label className="text-white/40 text-xs block mb-1.5">Dự án / BĐS quan tâm</label>
                    <input value={form.property_name} onChange={e => set("property_name", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold/50" placeholder="Alize Đà Nẵng - Căn 2PN view biển" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/40 text-xs block mb-1.5">Ngày mong muốn</label>
                    <input type="date" value={form.scheduled_date} onChange={e => set("scheduled_date", e.target.value)} min={new Date().toISOString().split("T")[0]}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold/50" />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs block mb-1.5">Giờ mong muốn</label>
                    <select value={form.scheduled_time} onChange={e => set("scheduled_time", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold/50">
                      <option value="">Chọn giờ</option>
                      {["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-white/40 text-xs block mb-1.5">Ghi chú thêm</label>
                  <textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={3}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold/50 resize-none" placeholder="Yêu cầu đặc biệt hoặc thông tin thêm..." />
                </div>

                {(status === "error" || errorMsg) && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">{errorMsg}</div>
                )}

                <button type="submit" disabled={status === "loading"}
                  className="w-full bg-gold text-jet-black font-semibold py-3.5 rounded-lg text-sm uppercase tracking-widest hover:bg-gold/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {status === "loading" ? <Loader2 size={16} className="animate-spin" /> : null}
                  Gửi Yêu Cầu Đặt Lịch
                </button>

                <p className="text-white/30 text-xs text-center">Chuyên viên sẽ liên hệ xác nhận trong 30 phút làm việc</p>
              </form>
            )}
          </div>
        </div>
      </div>

      <PortalFooter footer={dict.portal.footer} locale={locale} />
    </div>
  );
}
