import React from "react";

export default function PortalFooter({ footer, locale }: { footer: any; locale: string }) {
  return (
    <footer className="w-full bg-[#05070A] pt-24 pb-12 border-t border-white/5 mt-auto">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-24">
        <div className="md:col-span-5">
           <div className="flex items-center gap-2 mb-8">
             <div className="w-8 h-8 bg-gold rounded flex items-center justify-center">
               <span className="text-jet-black font-bold font-serif text-xl">G</span>
             </div>
             <span className="text-pearl-white font-serif text-xl tracking-widest uppercase">Estate</span>
           </div>
           <p className="text-sm text-champagne/60 font-light leading-relaxed max-w-sm">
             {footer.desc}
           </p>
        </div>
        <div className="md:col-span-4">
           <h4 className="text-gold uppercase text-[10px] tracking-widest mb-8 font-light">{footer.addressLabel}</h4>
           <p className="text-sm text-pearl-white font-light max-w-xs">{footer.addressText}</p>
        </div>
        <div className="md:col-span-3">
           <h4 className="text-gold uppercase text-[10px] tracking-widest mb-8 font-light">{footer.emailLabel}</h4>
           <a href="mailto:contact@gestate.com" className="text-sm text-pearl-white hover:text-gold transition-colors font-light block mb-4">contact@gestate.com</a>
           <a href="tel:0799036842" className="text-sm text-pearl-white hover:text-gold transition-colors font-light block">Hotline: 0799.036.842</a>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-champagne/40 font-light">
          <p>© 2026 G-Estate Premium Agency. All Rights Reserved.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
             <a href="#" className="hover:text-pearl-white transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-pearl-white transition-colors">Terms of Service</a>
          </div>
      </div>
    </footer>
  );
}
