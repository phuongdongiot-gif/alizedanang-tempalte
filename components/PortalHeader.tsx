"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavGroup, NavItem } from "../types";
import { useStore } from "../lib/store-context";
import { ShoppingBag, User, LogOut, ChevronDown, Plus } from "lucide-react";

export default function PortalHeader({ nav, locale }: { nav: any; locale: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const pathname = usePathname();
  const { customer, logout, setAuthModalOpen, setAuthMode, cartCount, setCartOpen } = useStore();

  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 50); };
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
    setMobileExpandedSection(prev => prev === section ? null : section);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-[110] transition-all duration-300 ${scrolled || mobileMenuOpen ? "bg-jet-black/90 backdrop-blur-md border-b border-white/5 py-3" : "bg-transparent py-6"}`}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex justify-between items-center">
          {/* LOGO */}
          <Link href={`/${locale}`} className="flex items-center gap-2 z-50">
            <div className="w-8 h-8 bg-gold rounded flex items-center justify-center">
              <span className="text-jet-black font-bold font-serif text-xl">G</span>
            </div>
            <span className="text-pearl-white font-serif text-xl tracking-widest uppercase">Estate</span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-7">
            <NavDropdown group={nav.sale} type="sale" />
            <NavDropdown group={nav.rent} type="rent" />
            <Link href={`/${locale}/projects`} className="text-[11px] uppercase tracking-[0.2em] font-light text-pearl-white hover:text-gold transition-colors">{nav.projects}</Link>
            <Link href={`/${locale}/map`} className="text-[11px] uppercase tracking-[0.2em] font-light text-pearl-white hover:text-gold transition-colors">{locale === 'vi' ? 'Bản Đồ' : 'Map'}</Link>
            <Link href={`/${locale}/shop`} className="text-[11px] uppercase tracking-[0.2em] font-light text-pearl-white hover:text-gold transition-colors">{locale === 'vi' ? 'Cửa Hàng' : 'Shop'}</Link>
            <Link href={`/${locale}/blog`} className="text-[11px] uppercase tracking-[0.2em] font-light text-pearl-white hover:text-gold transition-colors">{nav.news}</Link>
            <Link href={`/${locale}/finance`} className="text-[11px] uppercase tracking-[0.2em] font-light text-pearl-white hover:text-gold transition-colors">{nav.finance}</Link>
            <Link href={`/${locale}/services`} className="text-[11px] uppercase tracking-[0.2em] font-light text-pearl-white hover:text-gold transition-colors">{locale === 'vi' ? 'Dịch Vụ' : 'Services'}</Link>
          </nav>

          {/* UTILITIES */}
          <div className="hidden lg:flex items-center gap-4">
            <button onClick={toggleLocale} className="text-[11px] uppercase tracking-widest font-light text-champagne/70 hover:text-gold transition-colors">
              {locale === 'vi' ? 'EN' : 'VI'}
            </button>

            {/* Cart */}
            <button onClick={() => setCartOpen(true)} className="relative text-pearl-white/70 hover:text-gold transition-colors p-1.5">
              <ShoppingBag size={19} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gold text-jet-black text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            {/* Auth */}
            {customer ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-light text-champagne/80 hover:text-gold transition-colors">
                  <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center">
                    <span className="text-gold text-xs font-bold">{customer.first_name?.charAt(0)}</span>
                  </div>
                  <span className="hidden xl:inline">{customer.first_name}</span>
                  <ChevronDown size={12} className={`transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>
                {userMenuOpen && (
                  <div className="absolute top-full right-0 mt-3 w-52 bg-jet-black/98 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-[999]">
                    <div className="px-5 py-3 border-b border-white/5">
                      <p className="text-white text-xs font-medium">{customer.first_name} {customer.last_name}</p>
                      <p className="text-white/40 text-[11px]">{customer.email}</p>
                    </div>
                    <Link href={`/${locale}/account`} onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-xs text-pearl-white hover:bg-white/5 transition-colors border-b border-white/5">
                      <User size={13} className="text-gold" /> Tài Khoản
                    </Link>
                    <Link href={`/${locale}/post-listing`} onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-xs text-pearl-white hover:bg-white/5 transition-colors border-b border-white/5">
                      <Plus size={13} className="text-gold" /> Đăng Tin BĐS
                    </Link>
                    <button onClick={() => { logout(); setUserMenuOpen(false); }}
                      className="flex items-center gap-3 w-full px-5 py-3 text-xs text-red-400 hover:bg-red-500/10 transition-colors">
                      <LogOut size={13} /> Đăng Xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => { setAuthMode("login"); setAuthModalOpen(true); }}
                className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-light text-champagne/70 hover:text-gold transition-colors">
                <User size={15} /> {locale === 'vi' ? 'Đăng Nhập' : 'Sign In'}
              </button>
            )}

            <Link href={`/${locale}/post-listing`} className="px-4 py-2.5 bg-white/5 border border-gold/40 text-gold text-[10px] uppercase tracking-[0.2em] hover:bg-gold hover:text-jet-black transition-all flex items-center gap-1.5">
              <Plus size={11} /> {nav.postPropertyBtn || "Đăng Tin"}
            </Link>
          </div>

          {/* MOBILE */}
          <div className="lg:hidden flex items-center gap-3 z-50">
            <button onClick={() => setCartOpen(true)} className="relative text-pearl-white/70 p-1">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gold text-jet-black text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{cartCount}</span>
              )}
            </button>
            <button className="text-pearl-white relative w-8 h-8" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <span className={`absolute left-0 w-8 h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'top-4 rotate-45' : 'top-2'}`} />
              <span className={`absolute left-0 w-8 h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'top-4 -rotate-45' : 'top-6'}`} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 bg-jet-black/98 backdrop-blur-xl z-[100] flex flex-col pt-24 px-6 gap-5 transition-all duration-500 overflow-y-auto pb-10 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        {/* Mobile Auth */}
        {customer ? (
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center">
                <span className="text-gold font-bold text-lg">{customer.first_name?.charAt(0)}</span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">{customer.first_name} {customer.last_name}</p>
                <p className="text-white/40 text-xs">{customer.email}</p>
              </div>
            </div>
            <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-red-400 text-sm flex items-center gap-1">
              <LogOut size={14} /> Đăng xuất
            </button>
          </div>
        ) : (
          <div className="flex gap-3 border-b border-white/10 pb-5">
            <button onClick={() => { setAuthMode("login"); setAuthModalOpen(true); setMobileMenuOpen(false); }}
              className="flex-1 py-3 border border-gold/40 text-gold text-sm uppercase tracking-widest text-center rounded">Đăng Nhập</button>
            <button onClick={() => { setAuthMode("register"); setAuthModalOpen(true); setMobileMenuOpen(false); }}
              className="flex-1 py-3 bg-gold text-jet-black text-sm font-bold uppercase tracking-widest text-center rounded">Đăng Ký</button>
          </div>
        )}

        {[{ key: "sale", label: nav.sale.label, items: nav.sale.items, txn: "sale" }, { key: "rent", label: nav.rent.label, items: nav.rent.items, txn: "rent" }].map(grp => (
          <div key={grp.key} className="border-b border-white/10 pb-4">
            <button onClick={() => toggleMobileAccordion(grp.key)} className="w-full flex justify-between items-center text-xl uppercase tracking-[0.2em] font-light text-pearl-white">
              {grp.label}
              <ChevronDown className={`w-5 h-5 transition-transform ${mobileExpandedSection === grp.key ? 'rotate-180' : ''}`} />
            </button>
            <div className={`flex flex-col gap-4 overflow-hidden transition-all duration-300 ${mobileExpandedSection === grp.key ? 'max-h-[1000px] mt-6 opacity-100' : 'max-h-0 opacity-0'}`}>
              {grp.items.map((item: NavItem, idx: number) => (
                <Link key={idx} onClick={() => setMobileMenuOpen(false)} href={`/${locale}/properties?transaction=${grp.txn}&category=${item.id}`}
                  className="text-sm font-light text-champagne/70 pl-4 border-l border-gold/30 block py-1">{item.label}</Link>
              ))}
            </div>
          </div>
        ))}

        {[
          { href: `/${locale}/projects`, label: nav.projects },
          { href: `/${locale}/map`, label: locale === 'vi' ? 'BẢN ĐỒ' : 'MAP' },
          { href: `/${locale}/shop`, label: locale === 'vi' ? 'CỬA HÀNG' : 'SHOP' },
          { href: `/${locale}/blog`, label: nav.news },
          { href: `/${locale}/finance`, label: nav.finance },
          { href: `/${locale}/services`, label: locale === 'vi' ? 'DỊCH VỤ' : 'SERVICES' },
        ].map(item => (
          <Link key={item.href} onClick={() => setMobileMenuOpen(false)} href={item.href}
            className="text-xl uppercase tracking-[0.2em] font-light text-pearl-white border-b border-white/10 pb-4">{item.label}</Link>
        ))}

        <Link onClick={() => setMobileMenuOpen(false)} href={`/${locale}/post-listing`}
          className="text-xl uppercase tracking-[0.2em] font-semibold text-gold border-b border-white/10 pb-4">+ ĐĂNG TIN BĐS</Link>

        <button onClick={toggleLocale} className="text-xl text-left uppercase tracking-[0.2em] font-light text-champagne/70 pt-2">
          {locale === 'vi' ? 'SWITCH TO ENGLISH (EN)' : 'CỔNG TIẾNG VIỆT (VI)'}
        </button>
      </div>
    </>
  );
}
