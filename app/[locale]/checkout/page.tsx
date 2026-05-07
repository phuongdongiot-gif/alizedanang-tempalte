"use client";
import React, { useState, useEffect } from "react";
import { useStore } from "../../../lib/store-context";
import PortalHeader from "../../../components/PortalHeader";
import PortalFooter from "../../../components/PortalFooter";
import { getDictionary } from "../../../dictionaries";
import { ArrowLeft, CheckCircle2, ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";
import { MEDUSA_URL } from "../../../lib/medusa";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

export default function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = React.useState("vi");
  const { cart, cartTotal, customer, clearCart, cartId } = useStore();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    name: customer?.first_name ? `${customer.first_name} ${customer.last_name || ""}` : "",
    phone: customer?.phone || "",
    email: customer?.email || "",
    address: "",
    notes: ""
  });

  React.useEffect(() => { params.then(({ locale: l }) => setLocale(l)); }, [params]);
  const dict = getDictionary(locale);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      if (cartId && !cartId.startsWith("local_")) {
        // Step 1: Update cart with shipping address and email
        const updateRes = await fetch(`/api/medusa/store/carts/${cartId}`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
          },
          body: JSON.stringify({
            email: form.email || "guest@alizedanang.com",
            shipping_address: {
              first_name: form.name,
              last_name: "",
              phone: form.phone,
              address_1: form.address,
              city: "Đà Nẵng",
              country_code: "vn",
            }
          })
        });

        if (!updateRes.ok) throw new Error("Lỗi cập nhật địa chỉ giao hàng");

        // Step 2: Complete the cart
        const completeRes = await fetch(`/api/medusa/store/carts/${cartId}/complete`, {
          method: "POST",
          headers: { 
            "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
          }
        });

        if (!completeRes.ok) throw new Error("Lỗi xác nhận đơn hàng");
      } else {
        // Fallback for local cart mock
        await new Promise(r => setTimeout(r, 1500));
      }

      setStatus("success");
      clearCart();
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Lỗi xử lý đơn hàng");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#070A10] text-pearl-white">
        <PortalHeader nav={dict.portal.nav} locale={locale} />
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
          <CheckCircle2 size={80} className="text-green-400 mb-6" />
          <h1 className="font-serif text-3xl md:text-4xl font-light mb-4">Đặt Hàng Thành Công!</h1>
          <p className="text-champagne/60 text-sm max-w-md mx-auto mb-8">
            Cảm ơn bạn đã tin tưởng Alize Đà Nẵng. Chuyên viên của chúng tôi sẽ sớm liên hệ theo số điện thoại bạn cung cấp để xác nhận đơn hàng và thời gian giao hàng.
          </p>
          <div className="flex gap-4">
            <Link href={`/${locale}/shop`} className="px-8 py-3 bg-white/5 border border-white/20 text-white text-sm uppercase tracking-widest hover:bg-white/10 transition-all">
              Tiếp Tục Mua Sắm
            </Link>
            <Link href={`/${locale}/account`} className="px-8 py-3 bg-gold text-jet-black text-sm font-bold uppercase tracking-widest hover:bg-gold/90 transition-all">
              Xem Tài Khoản
            </Link>
          </div>
        </div>
        <PortalFooter footer={dict.portal.footer} locale={locale} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070A10] text-pearl-white">
      <PortalHeader nav={dict.portal.nav} locale={locale} />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 pt-32 pb-24">
        <div className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 cursor-pointer w-fit" onClick={() => window.history.back()}>
          <ArrowLeft size={16} /> <span className="text-sm uppercase tracking-widest">Quay Lại</span>
        </div>

        <h1 className="font-serif text-4xl font-light mb-10">Thanh Toán</h1>

        {cart.length === 0 ? (
          <div className="text-center py-24 bg-[#0A0C10] border border-white/5 rounded-2xl">
            <ShoppingBag size={56} className="text-white/10 mx-auto mb-4" />
            <p className="text-white/40 text-lg mb-4">Giỏ hàng của bạn đang trống</p>
            <Link href={`/${locale}/shop`} className="text-gold border-b border-gold/40 hover:border-gold pb-1 text-sm">
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-[#0A0C10] border border-white/5 rounded-2xl p-6 md:p-8">
                <h2 className="text-xl font-serif mb-6 border-b border-white/10 pb-4">Thông tin giao hàng</h2>
                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-white/40 text-xs block mb-2">Họ và tên *</label>
                      <input required value={form.name} onChange={e => set("name", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-gold/50" placeholder="Nhập họ tên" />
                    </div>
                    <div>
                      <label className="text-white/40 text-xs block mb-2">Số điện thoại *</label>
                      <input required value={form.phone} onChange={e => set("phone", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-gold/50" placeholder="090..." />
                    </div>
                  </div>
                  <div>
                    <label className="text-white/40 text-xs block mb-2">Email (tùy chọn)</label>
                    <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-gold/50" placeholder="email@example.com" />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs block mb-2">Địa chỉ giao hàng *</label>
                    <input required value={form.address} onChange={e => set("address", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-gold/50" placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/TP" />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs block mb-2">Ghi chú đơn hàng</label>
                    <textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={3}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-gold/50 resize-none" placeholder="Yêu cầu đặc biệt..." />
                  </div>

                  {errorMsg && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">{errorMsg}</div>
                  )}
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-[#0A0C10] border border-white/5 rounded-2xl p-6 md:p-8 sticky top-32">
                <h2 className="text-xl font-serif mb-6 border-b border-white/10 pb-4">Tóm tắt đơn hàng</h2>
                
                <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 rounded bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                        {item.thumbnail ? (
                          <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={20} className="text-white/20" /></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm text-white line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-white/40 mt-1">{item.variant_title} x {item.quantity}</p>
                        <p className="text-gold text-sm font-medium mt-1">{formatPrice(item.unit_price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-white/60 text-sm">
                    <span>Tạm tính</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-white/60 text-sm">
                    <span>Phí giao hàng</span>
                    <span>Miễn phí</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-white/5 pt-4">
                    <span className="text-white font-medium">Tổng cộng</span>
                    <span className="text-gold text-xl font-semibold">{formatPrice(cartTotal)}</span>
                  </div>
                </div>

                <div className="bg-gold/10 border border-gold/20 rounded-lg p-4 mb-6">
                  <h4 className="text-gold text-xs uppercase tracking-widest font-semibold mb-2">Phương thức thanh toán</h4>
                  <p className="text-white/60 text-xs leading-relaxed">
                    Đơn hàng sẽ được nhân viên của chúng tôi liên hệ xác nhận. Bạn có thể thanh toán qua hình thức chuyển khoản hoặc tiền mặt khi nhận hàng (COD).
                  </p>
                </div>

                <button type="submit" form="checkout-form" disabled={status === "loading"}
                  className="w-full bg-gold text-jet-black font-bold py-4 rounded-xl text-sm uppercase tracking-widest hover:bg-gold/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {status === "loading" ? <Loader2 size={18} className="animate-spin" /> : null}
                  Xác Nhận Đặt Hàng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <PortalFooter footer={dict.portal.footer} locale={locale} />
    </div>
  );
}
