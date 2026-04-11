import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#070A10] flex flex-col items-center justify-center min-h-screen">
      {/* GLOWING LOGO */}
      <div className="relative">
        <div className="absolute inset-0 bg-gold/30 blur-[40px] rounded-full animate-pulse"></div>
        <div className="w-20 h-20 bg-gold rounded flex items-center justify-center relative shadow-[0_0_50px_rgba(212,175,55,0.4)] animate-pulse">
           <span className="text-jet-black font-bold font-serif text-5xl">G</span>
        </div>
      </div>
      
      {/* LOADING TEXT & DOTS */}
      <div className="mt-12 flex flex-col items-center">
         <span className="text-gold tracking-[0.4em] text-xs uppercase font-light animate-pulse mb-3 block">
           Đang đồng bộ dữ liệu
         </span>
         
         <div className="flex gap-2">
           <div className="w-1.5 h-1.5 bg-gold rounded-full animate-[bounce_1s_infinite_0ms]"></div>
           <div className="w-1.5 h-1.5 bg-gold rounded-full animate-[bounce_1s_infinite_200ms]"></div>
           <div className="w-1.5 h-1.5 bg-gold rounded-full animate-[bounce_1s_infinite_400ms]"></div>
         </div>
      </div>
      
      {/* DECORATIVE LINE */}
      <div className="absolute bottom-20 w-32 h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-50"></div>
    </div>
  );
}
