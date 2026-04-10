import React from "react";
import { FooterData } from "../types";

export default function Footer({ data }: { data: FooterData }) {
  return (
    <footer className="bg-jet-black pt-32 pb-12 border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          <div className="md:col-span-5">
            <span className="font-serif text-3xl font-light tracking-[0.2em] text-pearl-white inline-block mb-8">ALIZE<span className="text-gold">.</span></span>
            <p className="text-sm text-champagne/40 font-light leading-relaxed max-w-md">{data.description}</p>
          </div>
        </div>
        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center text-[11px] tracking-widest text-champagne/30 font-light uppercase">
          <p>{data.copyright}</p>
          <div className="space-x-8 mt-6 md:mt-0">
            <a href="#" className="hover:text-gold transition-colors">{data.privacy}</a>
            <a href="#" className="hover:text-gold transition-colors">{data.terms}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
