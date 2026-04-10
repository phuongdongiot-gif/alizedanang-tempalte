"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PortalHeader({ nav, locale }: { nav: any; locale: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLocale = () => {
    const newLocale = locale === "vi" ? "en" : "vi";
    const pathWithoutLocale = pathname.replace(`/${locale}`, "");
    window.location.href = `/${newLocale}${pathWithoutLocale}`;
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-jet-black/90 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-6"}`}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex justify-between items-center">
        {/* LOGO */}
        <Link href={`/${locale}`} className="flex items-center gap-2 z-50">
          <div className="w-8 h-8 bg-gold rounded flex items-center justify-center">
            <span className="text-jet-black font-bold font-serif text-xl">G</span>
          </div>
          <span className="text-pearl-white font-serif text-xl tracking-widest uppercase">Estate</span>
        </Link>
        
        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-10">
          <Link href={`/${locale}`} className="text-[11px] uppercase tracking-[0.2em] font-light text-pearl-white hover:text-gold transition-colors">{nav.home}</Link>
          <Link href={`/${locale}#projects`} className="text-[11px] uppercase tracking-[0.2em] font-light text-pearl-white hover:text-gold transition-colors">{nav.projects}</Link>
          <Link href={`/${locale}/blog`} className="text-[11px] uppercase tracking-[0.2em] font-light text-pearl-white hover:text-gold transition-colors">{nav.news}</Link>
          <Link href={`/${locale}#about`} className="text-[11px] uppercase tracking-[0.2em] font-light text-pearl-white hover:text-gold transition-colors">{nav.about}</Link>
        </nav>

        {/* UTILITIES */}
        <div className="hidden lg:flex items-center gap-6">
          <button onClick={toggleLocale} className="text-[11px] uppercase tracking-widest font-light text-champagne/70 hover:text-gold transition-colors">
            {locale === 'vi' ? 'EN' : 'VI'}
          </button>
          <Link href={`/${locale}#contact`} className="px-6 py-3 border border-gold/40 text-gold text-[10px] uppercase tracking-[0.2em] hover:bg-gold hover:text-jet-black transition-all">
            {nav.postPropertyBtn}
          </Link>
        </div>

        {/* MOBILE MENU BTN */}
        <button className="lg:hidden z-50 text-pearl-white relative w-8 h-8" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span className={`absolute left-0 w-8 h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'top-4 rotate-45' : 'top-2'}`} />
          <span className={`absolute left-0 w-8 h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'top-4 -rotate-45' : 'top-6'}`} />
        </button>
      </div>

      {/* MOBILE POPUP */}
      <div className={`fixed inset-0 bg-jet-black/95 backdrop-blur-xl z-40 flex flex-col justify-center items-center gap-10 transition-all duration-500 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <Link href={`/${locale}`} className="text-xl uppercase tracking-[0.2em] font-light text-pearl-white hover:text-gold">{nav.home}</Link>
          <Link onClick={() => setMobileMenuOpen(false)} href={`/${locale}#projects`} className="text-xl uppercase tracking-[0.2em] font-light text-pearl-white hover:text-gold">{nav.projects}</Link>
          <Link onClick={() => setMobileMenuOpen(false)} href={`/${locale}/blog`} className="text-xl uppercase tracking-[0.2em] font-light text-pearl-white hover:text-gold">{nav.news}</Link>
          <button onClick={toggleLocale} className="text-xl uppercase tracking-[0.2em] font-light text-champagne/70">{locale === 'vi' ? 'ENGLISH (EN)' : 'VIETNAMESE (VI)'}</button>
      </div>
    </header>
  );
}
