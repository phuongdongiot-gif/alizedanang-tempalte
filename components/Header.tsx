"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { NavigationData } from "../types";

export default function Header({ nav, locale }: { nav: NavigationData; locale: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed w-full z-50 transition-all duration-500 text-pearl-white border-b ${scrolled ? "bg-jet-black/90 backdrop-blur-md py-4 border-white/5 shadow-lg" : "bg-transparent py-6 border-transparent"}`}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex justify-between items-center">
        <div className="flex-shrink-0">
          <Link href={`/${locale}/alize`} className="font-serif text-2xl lg:text-3xl font-normal tracking-[0.25em] text-pearl-white hover:text-gold transition-colors duration-500">
            ALIZE<span className="text-gold">.</span>
          </Link>
        </div>

        <nav className="hidden 2xl:flex space-x-10">
          <Link href={`/${locale}/alize#overview`} className="text-[10px] font-light tracking-[0.2em] hover:text-gold transition-colors duration-500 uppercase">{nav.overview}</Link>
          <Link href={`/${locale}/alize/values`} className="text-[10px] font-light tracking-[0.2em] hover:text-gold transition-colors duration-500 uppercase">{nav.values}</Link>
          <Link href={`/${locale}/alize/location`} className="text-[10px] font-light tracking-[0.2em] hover:text-gold transition-colors duration-500 uppercase">{nav.location}</Link>
          <Link href={`/${locale}/alize/architecture`} className="text-[10px] font-light tracking-[0.2em] hover:text-gold transition-colors duration-500 uppercase">{nav.architecture}</Link>
          <Link href={`/${locale}/alize/amenities`} className="text-[10px] font-light tracking-[0.2em] hover:text-gold transition-colors duration-500 uppercase">{nav.amenities}</Link>
          <Link href={`/${locale}/alize/services`} className="text-[10px] font-light tracking-[0.2em] hover:text-gold transition-colors duration-500 uppercase">{nav.services}</Link>
          <Link href={`/${locale}/alize/floorplans`} className="text-[10px] font-light tracking-[0.2em] hover:text-gold transition-colors duration-500 uppercase">{nav.floorplans}</Link>
          <Link href={`/${locale}/alize/gallery`} className="text-[10px] font-light tracking-[0.2em] hover:text-gold transition-colors duration-500 uppercase">{nav.gallery}</Link>
        </nav>

        <div className="hidden lg:flex items-center">
          <Link href={`/${locale}/alize#contact`} className="px-8 py-3 border border-pearl-white/30 text-pearl-white hover:bg-pearl-white hover:text-jet-black transition-all duration-500 text-[11px] font-light uppercase tracking-[0.2em] whitespace-nowrap">
            {nav.contactBtn}
          </Link>
          <div className="relative group ml-6 flex items-center">
            <button className="flex items-center space-x-1.5 text-[11px] font-light uppercase tracking-[0.2em] text-pearl-white/80 hover:text-gold transition-colors duration-500 focus:outline-none cursor-pointer">
              <span>{locale.toUpperCase()}</span>
            </button>
            <div className="absolute top-full right-0 mt-4 w-36 bg-jet-black/98 backdrop-blur-xl border border-white/10 rounded-sm overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 translate-y-2 group-hover:translate-y-0 shadow-2xl z-[999]">
              <Link href={`/vi/alize`} className="block px-6 py-4 text-[10px] text-pearl-white hover:text-jet-black hover:bg-gold transition-colors duration-300 tracking-[0.2em] uppercase border-b border-white/5">Tiếng Việt</Link>
              <Link href={`/en/alize`} className="block px-6 py-4 text-[10px] text-pearl-white/70 hover:text-jet-black hover:bg-gold transition-colors duration-300 tracking-[0.2em] uppercase">English</Link>
            </div>
          </div>
        </div>

        <div className="2xl:hidden flex items-center">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-pearl-white hover:text-gold focus:outline-none">
            <svg className="h-6 w-6 stroke-1 border-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-jet-black/98 backdrop-blur-xl border-t border-white/5 max-h-[80vh] overflow-y-auto">
          <div className="px-6 py-10 space-y-6 flex flex-col">
            <Link onClick={() => setMobileMenuOpen(false)} href={`/${locale}/alize#overview`} className="block text-sm font-light tracking-[0.2em] uppercase text-center">{nav.overview}</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href={`/${locale}/alize/amenities`} className="block text-sm font-light tracking-[0.2em] uppercase text-center">{nav.amenities}</Link>
            {/* Thêm các link sub-page theo chuẩn mockup */}
          </div>
        </div>
      )}
    </header>
  );
}
