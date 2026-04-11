"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NavGroup } from "../types";

export default function AdvancedPropertyFilter({ locale, saleNav, rentNav }: { locale: string, saleNav: NavGroup, rentNav: NavGroup }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialTransaction = searchParams.get('transaction') || 'sale';
  const initialKeyword = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';
  const initialPrice = searchParams.get('price') || 'all';
  const initialArea = searchParams.get('area') || 'all';
  const initialVerified = searchParams.get('verified') === 'true';
  const initialView = searchParams.get('view') || 'list';

  const [transaction, setTransaction] = useState(initialTransaction);
  const [keyword, setKeyword] = useState(initialKeyword);
  const [category, setCategory] = useState(initialCategory);
  const [price, setPrice] = useState(initialPrice);
  const [area, setArea] = useState(initialArea);
  const [verified, setVerified] = useState(initialVerified);
  const [view, setView] = useState(initialView);

  // Sync state when URL params change
  useEffect(() => {
    setTransaction(searchParams.get('transaction') || 'sale');
    setKeyword(searchParams.get('q') || '');
    setCategory(searchParams.get('category') || 'all');
    setPrice(searchParams.get('price') || 'all');
    setArea(searchParams.get('area') || 'all');
    setVerified(searchParams.get('verified') === 'true');
    setView(searchParams.get('view') || 'list');
  }, [searchParams]);

  // Execute Search
  const handleSearch = (newView?: string) => {
    const params = new URLSearchParams();
    if (transaction !== 'sale') params.set('transaction', transaction);
    if (keyword) params.set('q', keyword);
    if (category !== 'all') params.set('category', category);
    if (price !== 'all') params.set('price', price);
    if (area !== 'all') params.set('area', area);
    if (verified) params.set('verified', 'true');
    const targetView = newView || view;
    if (targetView === 'map') params.set('view', 'map');
    
    router.push(`/${locale}/properties?${params.toString()}`);
  };

  const navSource = transaction === 'sale' ? saleNav : rentNav;

  return (
    <div className="bg-jet-black/50 p-4 rounded-lg border border-white/10 mb-8 shadow-xl">
      {/* Top Bar: Search Input */}
      <div className="flex bg-white/5 rounded-md border border-white/10 overflow-hidden mb-4">
        <div className="px-4 py-3 text-champagne/70 flex items-center bg-black/40 border-r border-white/10">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input 
          type="text" 
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={locale === 'vi' ? "Nhập địa điểm, dự án hoặc từ khóa..." : "Enter location, project or keyword..."}
          className="bg-transparent flex-1 px-4 py-3 text-white outline-none placeholder:text-white/30 text-sm"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={() => handleSearch()} className="bg-[#D32F2F] text-white px-8 py-3 text-sm font-medium hover:bg-red-700 transition-colors">
          {locale === 'vi' ? 'Tìm kiếm' : 'Search'}
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Toggle Transaction */}
        <div className="flex bg-black/50 border border-white/10 rounded-md overflow-hidden">
           <button onClick={() => setTransaction('sale')} className={`px-4 py-2 text-xs transition-colors ${transaction === 'sale' ? 'bg-gold text-jet-black font-semibold' : 'text-champagne/70 hover:text-white'}`}>
             {locale === 'vi' ? 'Bán' : 'Sale'}
           </button>
           <button onClick={() => setTransaction('rent')} className={`px-4 py-2 text-xs transition-colors ${transaction === 'rent' ? 'bg-gold text-jet-black font-semibold' : 'text-champagne/70 hover:text-white'}`}>
             {locale === 'vi' ? 'Cho Thuê' : 'Rent'}
           </button>
        </div>

        {/* Filter Toggle */}
        <button className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-md text-xs text-champagne/90 hover:bg-white/5 transition-all hidden md:flex">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
          {locale === 'vi' ? 'Lọc nâng cao' : 'Advanced Filter'}
        </button>

        {/* Verified News Toggle */}
        <label className="flex items-center gap-2 px-3 py-2 border border-[#4CAF50]/30 bg-[#4CAF50]/10 rounded-md cursor-pointer text-xs text-[#4CAF50] transition-all hover:bg-[#4CAF50]/20 hidden md:flex">
          <input type="checkbox" className="sr-only" checked={verified} onChange={(e) => setVerified(e.target.checked)} />
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
          {locale === 'vi' ? 'Tin xác thực' : 'Verified Listings'}
        </label>

        {/* Category Dropdown */}
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-black/40 border border-white/10 text-champagne/90 text-xs px-4 py-[0.6rem] rounded-md outline-none cursor-pointer hover:bg-white/5 transition-all w-36 overflow-hidden text-ellipsis">
          <option value="all" className="bg-jet-black">{locale === 'vi' ? 'Loại nhà đất' : 'Property Type'}</option>
          {navSource.items.map((it: any) => (
            <option key={it.id} value={it.id} className="bg-jet-black">{it.label}</option>
          ))}
        </select>

        {/* Price Dropdown */}
        <select value={price} onChange={(e) => setPrice(e.target.value)} className="bg-black/40 border border-white/10 text-champagne/90 text-xs px-4 py-[0.6rem] rounded-md outline-none cursor-pointer hover:bg-white/5 transition-all">
          <option value="all" className="bg-jet-black">{locale === 'vi' ? 'Khoảng giá' : 'Price Range'}</option>
          <option value="0-5000000000" className="bg-jet-black">{locale === 'vi' ? 'Dưới 5 Tỷ' : 'Under 5 Billion'}</option>
          <option value="5000000000-10000000000" className="bg-jet-black">5 - 10 {locale === 'vi' ? 'Tỷ' : 'Billion'}</option>
          <option value="10000000000-20000000000" className="bg-jet-black">10 - 20 {locale === 'vi' ? 'Tỷ' : 'Billion'}</option>
          <option value="20000000000-9999000000000" className="bg-jet-black">{locale === 'vi' ? 'Trên 20 Tỷ' : 'Over 20 Billion'}</option>
          <option disabled className="bg-jet-black font-bold border-y border-white/10">--- {locale === 'vi' ? 'Cho Thuê' : 'Rent'} ---</option>
          <option value="0-50000000" className="bg-jet-black">{locale === 'vi' ? 'Dưới 50 Triệu' : 'Under 50M'}</option>
          <option value="50000000-100000000" className="bg-jet-black">50 - 100 {locale === 'vi' ? 'Triệu' : 'M'}</option>
          <option value="100000000-999900000000" className="bg-jet-black">{locale === 'vi' ? 'Trên 100 Triệu' : 'Over 100M'}</option>
        </select>

        {/* Area Dropdown */}
        <select value={area} onChange={(e) => setArea(e.target.value)} className="bg-black/40 border border-white/10 text-champagne/90 text-xs px-4 py-[0.6rem] rounded-md outline-none cursor-pointer hover:bg-white/5 transition-all">
          <option value="all" className="bg-jet-black">{locale === 'vi' ? 'Diện tích' : 'Area'}</option>
          <option value="0-50" className="bg-jet-black">{locale === 'vi' ? 'Dưới' : 'Under'} 50 m²</option>
          <option value="50-100" className="bg-jet-black">50 - 100 m²</option>
          <option value="100-200" className="bg-jet-black">100 - 200 m²</option>
          <option value="200-99999" className="bg-jet-black">{locale === 'vi' ? 'Trên' : 'Over'} 200 m²</option>
        </select>

        {/* Map Toggle Button */}
        <div className="flex-1"></div>
        <div className="flex items-center bg-black/40 border border-white/10 rounded-md overflow-hidden">
           <button 
             onClick={() => { setView('list'); handleSearch('list'); }} 
             className={`px-4 py-[0.6rem] text-xs transition-colors border-r border-white/10 ${view === 'list' ? 'bg-gold text-jet-black font-semibold' : 'text-champagne/70 hover:bg-white/5'}`}
           >
             <div className="flex items-center gap-1.5">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
               {locale === 'vi' ? 'Danh Sách' : 'List'}
             </div>
           </button>
           <button 
             onClick={() => { setView('map'); handleSearch('map'); }} 
             className={`px-4 py-[0.6rem] text-xs transition-colors flex gap-1.5 items-center ${view === 'map' ? 'bg-[#1E88E5] text-white font-semibold' : 'text-[#1E88E5] hover:bg-white/5'}`}
           >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
             {locale === 'vi' ? 'Xem Bản Đồ' : 'Map View'}
           </button>
        </div>

      </div>
    </div>
  );
}
