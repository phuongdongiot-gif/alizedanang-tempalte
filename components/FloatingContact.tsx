"use client";
import React, { useState } from "react";
import { MessageCircle, Phone, X, Mail } from "lucide-react";

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col items-start gap-3">
      {isOpen && (
        <div className="flex flex-col gap-3 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <a href="tel:0901234567" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gold text-jet-black rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <Phone size={20} className="fill-current" />
            </div>
            <span className="bg-white/10 backdrop-blur text-white text-xs px-3 py-1.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">Gọi Hotline</span>
          </a>
          <a href="https://zalo.me/0901234567" target="_blank" rel="noreferrer" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-[#0068FF] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform font-bold text-sm">
              Zalo
            </div>
            <span className="bg-white/10 backdrop-blur text-white text-xs px-3 py-1.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">Chat Zalo</span>
          </a>
          <a href="https://m.me/alizedanang" target="_blank" rel="noreferrer" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-[#0084FF] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <MessageCircle size={24} className="fill-current" />
            </div>
            <span className="bg-white/10 backdrop-blur text-white text-xs px-3 py-1.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">Messenger</span>
          </a>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${isOpen ? 'bg-white/10 text-white' : 'bg-gold text-jet-black hover:scale-105 animate-bounce'}`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
}
