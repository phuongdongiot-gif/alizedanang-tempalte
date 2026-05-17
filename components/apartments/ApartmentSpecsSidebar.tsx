import Link from "next/link";
import { PortalProperty } from "../../types";
import { PurchaseButton } from "../web3/PurchaseButton";

interface ApartmentSpecsSidebarProps {
  apt: PortalProperty;
  locale: string;
  bookBtnText: string;
}

export default function ApartmentSpecsSidebar({ apt, locale, bookBtnText }: ApartmentSpecsSidebarProps) {
  return (
    <div className="sticky top-32 bg-[#05070a] border border-white/10 p-8 rounded">
      <h3 className="font-serif text-2xl font-light mb-6 border-b border-white/10 pb-4">Thông Số Kỹ Thuật</h3>

      <ul className="mb-10 space-y-6">
        <li className="flex justify-between items-center text-sm">
          <span className="text-champagne/60 font-light tracking-widest uppercase">Mã Căn</span>
          <span className="text-white font-medium">{apt.id.split('-')[0].toUpperCase()}-...</span>
        </li>
        <li className="flex justify-between items-center text-sm">
          <span className="text-champagne/60 font-light tracking-widest uppercase">Diện Tích</span>
          <span className="text-white font-medium">{apt.specs.area}</span>
        </li>
        <li className="flex justify-between items-center text-sm">
          <span className="text-champagne/60 font-light tracking-widest uppercase">Phòng Ngủ</span>
          <span className="text-white font-medium">{apt.specs.beds} PN</span>
        </li>
        <li className="flex justify-between items-center text-sm">
          <span className="text-champagne/60 font-light tracking-widest uppercase">Phòng Tắm</span>
          <span className="text-white font-medium">{apt.specs.baths} WC</span>
        </li>
        <li className="flex justify-between items-center text-sm">
          <span className="text-champagne/60 font-light tracking-widest uppercase">Dự Án</span>
          <Link href={`/${locale}/projects/${apt.projectId}`} className="text-gold font-medium hover:underline">{apt.projectName}</Link>
        </li>
      </ul>

      <button className="w-full text-center border-b-[3px] border-double border-gold text-gold pb-2 text-[11px] uppercase tracking-widest font-semibold hover:text-white hover:border-white transition-all mb-6">
        {bookBtnText}
      </button>

      <button className="w-full text-center border-b-[3px] border-double border-white/30 text-white pb-2 text-[11px] uppercase tracking-widest font-semibold hover:border-white transition-all mb-8">
        Tải Brochure
      </button>

      {/* WEB3 FRACTIONAL OWNERSHIP BUTTON */}
      <div className="pt-6 border-t border-white/10">
        <h3 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-widest mb-4">
          {locale === 'vi' ? 'Đầu tư Token Hóa (Web3)' : 'Fractional Investment (Web3)'}
        </h3>
        <PurchaseButton 
          propertyId={apt.id.split('-')[0].replace(/\D/g, '') || 1} 
          amount={1} 
          priceNative={Math.max((apt.priceNum || 1000000000) / 10000000000, 0.01).toFixed(2)} 
          locale={locale} 
        />
      </div>

      {/* AGENT INFO */}
      {apt.agent && apt.agent.name && (
        <div className="mt-8 pt-8 border-t border-white/10">
          <h3 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-widest mb-4">Thông tin môi giới</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-white/10 flex-shrink-0 border border-white/20">
              {apt.agent.avatar ? (
                <img src={apt.agent.avatar} alt={apt.agent.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/50 text-2xl font-serif">
                  {apt.agent.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h4 className="text-white font-medium">{apt.agent.name}</h4>
              {apt.agent.phone && <p className="text-white/70 text-sm mt-1">{apt.agent.phone}</p>}
            </div>
          </div>
          {apt.agent.zalo && (
            <a href={`https://zalo.me/${apt.agent.zalo.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="block w-full text-center bg-[#0068FF] hover:bg-[#0055D4] text-white py-3 rounded text-sm font-medium transition-colors">
              Chat Zalo Ngay
            </a>
          )}
        </div>
      )}
    </div>
  );
}
