"use client";
import React from "react";
import { useStore } from "../lib/store-context";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import Link from "next/link";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

export default function CartDrawer({ locale }: { locale: string }) {
  const { cart, cartOpen, setCartOpen, cartTotal, removeFromCart, updateQuantity, clearCart } = useStore();

  return (
    <>
      {/* Backdrop */}
      {cartOpen && <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)} />}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-[#0D0D0D] border-l border-white/10 z-[160] flex flex-col transform transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${cartOpen ? "translate-x-0" : "translate-x-full"}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-gold" />
            <h2 className="text-white font-serif text-xl">Danh Sách Tư Vấn</h2>
            {cart.length > 0 && (
              <span className="bg-gold text-jet-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {cart.length > 0 && (
              <button onClick={clearCart} className="text-white/30 hover:text-red-400 text-xs transition-colors">Xóa tất cả</button>
            )}
            <button onClick={() => setCartOpen(false)} className="text-white/40 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 md:py-10 md:py-12">
              <ShoppingBag size={56} className="text-white/10 mb-4" />
              <p className="text-white/40 font-light">Danh sách tư vấn đang trống</p>
              <p className="text-white/25 text-sm mt-1">Khám phá sản phẩm & dịch vụ của chúng tôi</p>
              <Link href={`/${locale}/shop`} onClick={() => setCartOpen(false)}
                className="mt-6 px-6 py-3 border border-gold/40 text-gold text-sm tracking-widest uppercase hover:bg-gold hover:text-jet-black transition-all">
                Xem Sản Phẩm
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 bg-white/3 border border-white/5 rounded-xl p-4 group">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20">
                        <ShoppingBag size={24} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium line-clamp-2 leading-snug">{item.title}</h4>
                    <p className="text-white/40 text-xs mt-0.5">{item.variant_title}</p>
                    <p className="text-gold text-sm font-semibold mt-1">{formatPrice(item.unit_price)}</p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-white/50 hover:bg-white/10 transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="px-3 text-sm text-white">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-white/50 hover:bg-white/10 transition-colors">
                          <Plus size={12} />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)}
                        className="text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-white text-sm font-medium">{formatPrice(item.unit_price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-6 border-t border-white/5 bg-[#0A0A0A]">
            <div className="flex justify-between mb-4">
              <span className="text-white/60 font-light">Tổng cộng</span>
              <span className="text-gold font-semibold text-lg">{formatPrice(cartTotal)}</span>
            </div>
            <p className="text-white/30 text-xs mb-4 text-center">Đặt hàng sẽ được xác nhận qua điện thoại</p>
            <Link href={`/${locale}/checkout`} onClick={() => setCartOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-gold text-jet-black py-4 font-semibold uppercase tracking-widest text-sm hover:bg-gold/90 transition-colors rounded-lg">
              Gửi Yêu Cầu Tư Vấn <ArrowRight size={16} />
            </Link>
            <button onClick={() => setCartOpen(false)}
              className="w-full text-center text-white/40 text-sm mt-3 hover:text-white transition-colors">
              Tiếp Tục Mua Sắm
            </button>
          </div>
        )}
      </div>
    </>
  );
}
