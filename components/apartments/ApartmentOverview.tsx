"use client";

import { PortalProperty } from "../../types";
import Link from "next/link";
import { useState } from "react";

interface ApartmentOverviewProps {
  apt: PortalProperty;
  locale: string;
  projectLinkText: string;
}

export default function ApartmentOverview({ apt, locale, projectLinkText }: ApartmentOverviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <h2 className="font-serif text-3xl font-light mb-8 pb-4 border-b border-white/10">Tổng Quan</h2>
      <div className="mb-12 relative">
        <div 
          className={`text-champagne/70 text-base md:text-lg font-light leading-relaxed prose prose-invert max-w-none transition-all duration-500 overflow-hidden ${isExpanded ? '' : 'max-h-[150px]'}`}
          dangerouslySetInnerHTML={{ __html: apt.desc }}
        />
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 w-full h-[80px] bg-gradient-to-t from-jet-black to-transparent pointer-events-none" />
        )}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 text-gold text-sm font-medium hover:underline flex items-center gap-1 uppercase tracking-widest"
        >
          {isExpanded ? (locale === 'vi' ? 'Thu gọn' : 'Show less') : (locale === 'vi' ? 'Xem thêm' : 'Read more')}
          <span className="text-[10px]">{isExpanded ? '▲' : '▼'}</span>
        </button>
      </div>

      {/* ĐẶC ĐIỂM BẤT ĐỘNG SẢN */}
      {apt.features && Object.values(apt.features).some(v => v !== null && v !== undefined && v !== '') && (
        <div className="mb-12">
          <h2 className="font-serif text-3xl font-light mb-8 pb-4 border-b border-white/10">Đặc Điểm Bất Động Sản</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {apt.features.legal_status && (
              <div><p className="text-champagne/50 text-xs uppercase tracking-widest mb-1">Pháp lý</p><p className="text-white text-sm">{apt.features.legal_status}</p></div>
            )}
            {apt.features.furniture && (
              <div><p className="text-champagne/50 text-xs uppercase tracking-widest mb-1">Nội thất</p><p className="text-white text-sm">{apt.features.furniture}</p></div>
            )}
            {apt.features.house_direction && (
              <div><p className="text-champagne/50 text-xs uppercase tracking-widest mb-1">Hướng nhà</p><p className="text-white text-sm">{apt.features.house_direction}</p></div>
            )}
            {apt.features.balcony_direction && (
              <div><p className="text-champagne/50 text-xs uppercase tracking-widest mb-1">Hướng ban công</p><p className="text-white text-sm">{apt.features.balcony_direction}</p></div>
            )}
            {apt.features.floors && (
              <div><p className="text-champagne/50 text-xs uppercase tracking-widest mb-1">Số tầng</p><p className="text-white text-sm">{apt.features.floors} tầng</p></div>
            )}
            {apt.features.frontage && (
              <div><p className="text-champagne/50 text-xs uppercase tracking-widest mb-1">Mặt tiền</p><p className="text-white text-sm">{apt.features.frontage} m</p></div>
            )}
            {apt.features.entrance_width && (
              <div><p className="text-champagne/50 text-xs uppercase tracking-widest mb-1">Đường vào</p><p className="text-white text-sm">{apt.features.entrance_width} m</p></div>
            )}
          </div>
        </div>
      )}

      <h2 className="font-serif text-3xl font-light mb-8 pb-4 border-b border-white/10">Thư Viện Ảnh</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 md:mb-12">
        {apt.gallery.map((imgUrl, idx) => (
          <div key={idx} className="aspect-[4/3] rounded overflow-hidden">
            <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover filter brightness-90 hover:brightness-110 transition-all duration-500 hover:scale-105" />
          </div>
        ))}
      </div>

      {/* VIDEO & 3D TOUR */}
      {apt.media && (apt.media.video_url || apt.media.tour_3d_url) && (
        <div className="mb-8 md:mb-12 flex flex-wrap gap-4">
          {apt.media.video_url && (
            <a href={apt.media.video_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#CC0000] border-b-[3px] border-double border-[#CC0000]/50 pb-1 text-sm font-semibold hover:border-[#CC0000] transition-colors">
              <span>▶ Xem Video Giới Thiệu</span>
            </a>
          )}
          {apt.media.tour_3d_url && (
            <a href={apt.media.tour_3d_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#0082CB] border-b-[3px] border-double border-[#0082CB]/50 pb-1 text-sm font-semibold hover:border-[#0082CB] transition-colors">
              <span>🌐 Khám Phá 3D Tour</span>
            </a>
          )}
        </div>
      )}

      <div className="bg-charcoal/30 p-8 rounded border border-gold/20 flex flex-col items-center text-center mt-12 mb-12">
        <h3 className="font-serif text-2xl font-light mb-4">Thuộc Mảng Ghép Dự Án {apt.projectName}</h3>
        <p className="text-sm font-light text-champagne/60 mb-6 max-w-lg">Căn hộ này được phát triển như một phần của dự án {apt.projectName}, thừa hưởng toàn bộ chuỗi tiện ích đẳng cấp 5 sao và không gian sống thượng lưu.</p>
        <Link href={`/${locale}/projects/${apt.projectId}`} className="px-8 py-3 bg-gold text-jet-black text-[11px] uppercase tracking-widest font-semibold hover:bg-white transition-colors">
          {projectLinkText}
        </Link>
      </div>
    </>
  );
}
