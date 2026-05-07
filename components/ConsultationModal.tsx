"use client";
import React, { useState } from "react";
import { X, Send, CheckCircle } from "lucide-react";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
}

export default function ConsultationModal({ isOpen, onClose, productTitle }: ConsultationModalProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [form, setForm] = useState({ name: "", phone: "", notes: "" });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    // Giả lập API gọi backend để ghi nhận yêu cầu tư vấn
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0D0D0D] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
          <X size={20} />
        </button>

        {status === "success" ? (
          <div className="text-center py-8">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
            <h3 className="text-2xl font-serif text-white mb-2">Đăng ký thành công!</h3>
            <p className="text-white/60 text-sm mb-6">Chuyên viên tư vấn của Alize Đà Nẵng sẽ sớm liên hệ với bạn qua số điện thoại đã cung cấp.</p>
            <button onClick={onClose} className="bg-white/10 text-white px-6 py-2 rounded-lg hover:bg-white/20 transition-colors text-sm uppercase tracking-widest font-semibold">Đóng</button>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-serif text-white mb-2">Nhận Tư Vấn Miễn Phí</h3>
            <p className="text-white/60 text-sm mb-6">Vui lòng để lại thông tin, chúng tôi sẽ gọi lại tư vấn chi tiết về sản phẩm <strong className="text-gold">{productTitle}</strong>.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input required type="text" placeholder="Họ và tên *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-gold/50 text-sm" />
              </div>
              <div>
                <input required type="tel" placeholder="Số điện thoại *" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-gold/50 text-sm" />
              </div>
              <div>
                <textarea placeholder="Ghi chú thêm (thời gian gọi mong muốn, thắc mắc...)" rows={3} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-gold/50 text-sm resize-none" />
              </div>
              <button disabled={status === "loading"} type="submit" className="w-full bg-gold text-jet-black font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 hover:bg-gold/90 transition-colors uppercase tracking-widest text-sm disabled:opacity-50">
                {status === "loading" ? "Đang gửi..." : <><Send size={16} /> Gửi Yêu Cầu</>}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
