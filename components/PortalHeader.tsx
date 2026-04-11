"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavGroup, NavItem } from "../types";

export default function PortalHeader({ nav, locale }: { nav: any; locale: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);
  
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

  const NavDropdown = ({ group, type }: { group: NavGroup, type: "sale" | "rent" }) => (
    <div className="relative group/nav py-4">
      <Link href={`/${locale}/properties?transaction=${type}`} className="text-[11px] uppercase tracking-[0.2em] font-light text-pearl-white group-hover/nav:text-gold transition-colors flex items-center gap-1">
        {group.label}
        <svg className="w-3 h-3 opacity-50 group-hover/nav:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </Link>
      
      {/* Dropdown Menu (Mega style) */}
      <div className="absolute top-full left-0 w-[500px] bg-jet-black/95 backdrop-blur-xl border border-white/10 rounded overflow-hidden shadow-2xl opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-300 translate-y-2 group-hover/nav:translate-y-0 p-6 grid grid-cols-2 gap-x-8 gap-y-4 z-50">
        {group.items.map((item: NavItem, idx: number) => (
          <Link key={idx} href={`/${locale}/properties?transaction=${type}&category=${item.id}`} className="block text-xs font-light text-champagne/80 hover:text-gold hover:translate-x-1 transition-all">
            {item.label}
            {item.isNew && <span className="ml-2 inline-block bg-[#E53935] text-white text-[8px] uppercase tracking-widest px-1 py-0.5 rounded">Mới</span>}
          </Link>
        ))}
      </div>
    </div>
  );

  const toggleMobileAccordion = (section: string) => {
    if (mobileExpandedSection === section) setMobileExpandedSection(null);
    else setMobileExpandedSection(section);
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-jet-black/90 backdrop-blur-md border-b border-white/5 py-3" : "bg-transparent py-6"}`}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex justify-between items-center">
        {/* LOGO */}
        <Link href={`/${locale}`} className="flex items-center gap-2 z-50">
          <div className="w-8 h-8 bg-gold rounded flex items-center justify-center">
            <span className="text-jet-black font-bold font-serif text-xl">G</span>
          </div>
          <span className="text-pearl-white font-serif text-xl tracking-widest uppercase">Estate</span>
        </Link>
        
        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link href={`/${locale}`} className="text-[11px] uppercase tracking-[0.2em] font-light text-pearl-white hover:text-gold transition-colors">{nav.home}</Link>
          <NavDropdown group={nav.sale} type="sale" />
          <NavDropdown group={nav.rent} type="rent" />
          <Link href={`/${locale}#projects`} className="text-[11px] uppercase tracking-[0.2em] font-light text-pearl-white hover:text-gold transition-colors">{nav.projects}</Link>
          <Link href={`/${locale}/blog`} className="text-[11px] uppercase tracking-[0.2em] font-light text-pearl-white hover:text-gold transition-colors">{nav.news}</Link>
        </nav>

        {/* UTILITIES */}
        <div className="hidden lg:flex items-center gap-6">
          <button onClick={toggleLocale} className="text-[11px] uppercase tracking-widest font-light text-champagne/70 hover:text-gold transition-colors">
            {locale === 'vi' ? 'EN' : 'VI'}
          </button>
          <Link href={`/${locale}#contact`} className="px-6 py-3 bg-white/5 border border-gold/40 text-gold text-[10px] uppercase tracking-[0.2em] hover:bg-gold hover:text-jet-black transition-all">
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
      <div className={`fixed inset-0 bg-jet-black/98 backdrop-blur-xl z-40 flex flex-col pt-24 px-6 gap-6 transition-all duration-500 overflow-y-auto pb-10 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <Link onClick={() => setMobileMenuOpen(false)} href={`/${locale}`} className="text-xl uppercase tracking-[0.2em] font-light text-pearl-white border-b border-white/10 pb-4">{nav.home}</Link>
          
          {/* Mobile Accordion Sale */}
          <div className="border-b border-white/10 pb-4">
            <button onClick={() => toggleMobileAccordion('sale')} className="w-full flex justify-between items-center text-xl uppercase tracking-[0.2em] font-light text-pearl-white">
              {nav.sale.label}
              <svg className={`w-5 h-5 transition-transform ${mobileExpandedSection === 'sale' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div className={`flex flex-col gap-4 overflow-hidden transition-all duration-300 ${mobileExpandedSection === 'sale' ? 'max-h-[1000px] mt-6 opacity-100' : 'max-h-0 opacity-0'}`}>
              {nav.sale.items.map((item: NavItem, idx: number) => (
                <Link key={idx} onClick={() => setMobileMenuOpen(false)} href={`/${locale}/properties?transaction=sale&category=${item.id}`} className="text-sm font-light text-champagne/70 pl-4 border-l border-gold/30 block py-1">
                  {item.label}
                  {item.isNew && <span className="ml-2 inline-block bg-[#E53935] text-white text-[8px] uppercase tracking-widest px-1 py-0.5 rounded translate-y-[-2px]">Mới</span>}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Accordion Rent */}
          <div className="border-b border-white/10 pb-4">
            <button onClick={() => toggleMobileAccordion('rent')} className="w-full flex justify-between items-center text-xl uppercase tracking-[0.2em] font-light text-pearl-white">
              {nav.rent.label}
              <svg className={`w-5 h-5 transition-transform ${mobileExpandedSection === 'rent' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div className={`flex flex-col gap-4 overflow-hidden transition-all duration-300 ${mobileExpandedSection === 'rent' ? 'max-h-[1000px] mt-6 opacity-100' : 'max-h-0 opacity-0'}`}>
              {nav.rent.items.map((item: NavItem, idx: number) => (
                <Link key={idx} onClick={() => setMobileMenuOpen(false)} href={`/${locale}/properties?transaction=rent&category=${item.id}`} className="text-sm font-light text-champagne/70 pl-4 border-l border-gold/30 block py-1">
                  {item.label}
                  {item.isNew && <span className="ml-2 inline-block bg-[#E53935] text-white text-[8px] uppercase tracking-widest px-1 py-0.5 rounded translate-y-[-2px]">Mới</span>}
                </Link>
              ))}
            </div>
          </div>

          <Link onClick={() => setMobileMenuOpen(false)} href={`/${locale}#projects`} className="text-xl uppercase tracking-[0.2em] font-light text-pearl-white border-b border-white/10 pb-4">{nav.projects}</Link>
          <Link onClick={() => setMobileMenuOpen(false)} href={`/${locale}/blog`} className="text-xl uppercase tracking-[0.2em] font-light text-pearl-white border-b border-white/10 pb-4">{nav.news}</Link>
          
          <button onClick={toggleLocale} className="text-xl text-left uppercase tracking-[0.2em] font-light text-champagne/70 pt-4">
             {locale === 'vi' ? 'SWITCH TO ENGLISH (EN)' : 'CỔNG TIẾNG VIỆT (VI)'}
          </button>
      </div>
    </header>
  );
}
