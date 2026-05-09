import React from "react";
import PortalHeader from "../../../../components/PortalHeader";
import PortalFooter from "../../../../components/PortalFooter";
import { getDictionary } from "../../../../dictionaries";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPropertyById } from "../../../../lib/propertyService";
import SinglePropertyMap from "../../../../components/SinglePropertyMap";
import { TrendingUp, MapPin, Calculator, PieChart, Info } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string, id: string }> }): Promise<Metadata> {
  const { locale, id } = await params;
  const apt = await getPropertyById(id, locale);

  if (!apt) {
    return { title: 'Not Found' };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://alizedanang.net";

  return {
    title: `${apt.name} - G-Estate`,
    description: apt.desc,
    openGraph: {
      title: apt.name,
      description: apt.desc,
      images: [{ url: apt.img }],
      url: `${baseUrl}/${locale}/apartments/${id}`,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/apartments/${id}`,
    }
  };
}

export default async function ApartmentDetailPage({ params }: { params: Promise<{ locale: string, id: string }> }) {
  const { locale, id } = await params;
  const dict = getDictionary(locale);
  const apt = await getPropertyById(id, locale);

  if (!apt) {
    notFound();
  }

  const backLinkText = locale === 'vi' ? 'Quay lại danh sách' : 'Back to list';
  const projectLinkText = locale === 'vi' ? 'Xem thông tin dự án' : 'View project details';
  const bookBtnText = locale === 'vi' ? 'Đặt lịch tư vấn' : 'Book a consultation';

  // Tính toán số liệu phân tích đầu tư
  const priceNum = apt.priceNum || 0;
  const areaNum = apt.specs?.areaNum || 1; // avoid division by zero
  const pricePerM2 = Math.round(priceNum / areaNum).toLocaleString('vi-VN');
  const estRent = Math.round(priceNum * 0.005).toLocaleString('vi-VN');
  const estYield = "6.0";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": apt.name,
    "image": apt.img,
    "description": apt.desc,
    "offers": {
      "@type": "Offer",
      "url": `${process.env.NEXT_PUBLIC_BASE_URL || "https://alizedanang.net"}/${locale}/apartments/${id}`,
      "priceCurrency": "VND",
      "price": apt.priceNum || 0,
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#070A10] text-pearl-white flex flex-col pt-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PortalHeader nav={dict.portal.nav} locale={locale} />

      {/* HERO SECTION */}
      <section className="relative w-full h-[60vh] min-h-[500px]">
        <img loading="eager" src={apt.img} alt={apt.name} className="w-full h-full object-cover filter brightness-[0.5]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070A10] via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-16">
            <Link href={`/${locale}/apartments`} className="text-gold/80 text-xs tracking-widest uppercase hover:text-gold transition-colors block mb-6">
              &larr; {backLinkText}
            </Link>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="bg-gold text-jet-black text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded">
                {apt.price}
              </span>
              <span className="text-champagne/80 text-sm tracking-widest uppercase font-light">
                {apt.type}
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light mb-4 line-clamp-2">{apt.name}</h1>
            <p className="text-xl md:text-2xl font-light text-champagne line-clamp-1">{apt.location}</p>
          </div>
        </div>
      </section>

      {/* CONTENT GRID */}
      <section className="py-24 flex-1 bg-jet-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-16">

          {/* MAIN COLUMN */}
          <div className="lg:col-span-2">
            <h2 className="font-serif text-3xl font-light mb-8 pb-4 border-b border-white/10">Tổng Quan</h2>
            <div 
              className="text-champagne/70 text-base md:text-lg font-light leading-relaxed mb-12 prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: apt.desc }}
            />

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

            {/* PHÂN TÍCH ĐẦU TƯ */}
            <div className="mb-8 md:mb-12">
              <h2 className="font-serif text-3xl font-light mb-8 pb-4 border-b border-white/10 flex items-center gap-3">
                <TrendingUp className="text-gold" size={28} />
                Phân Tích & Đầu Tư
              </h2>
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-champagne/60 text-xs tracking-widest uppercase mb-3">
                      <Calculator size={14} />
                      <span>Đơn Giá Ước Tính</span>
                    </div>
                    <div className="text-2xl font-serif text-white">{pricePerM2} <span className="text-sm font-sans text-white/50">VNĐ/m²</span></div>
                  </div>
                  <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:px-6">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-champagne/60 text-xs tracking-widest uppercase mb-3">
                      <PieChart size={14} />
                      <span>Giá Thuê Đề Xuất</span>
                    </div>
                    <div className="text-2xl font-serif text-white">{estRent} <span className="text-sm font-sans text-white/50">VNĐ/Tháng</span></div>
                  </div>
                  <div className="text-center md:text-left md:pl-6 relative">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-champagne/60 text-xs tracking-widest uppercase mb-3">
                      <TrendingUp size={14} />
                      <span>Tỷ Suất Sinh Lời (ROI)</span>
                      <div className="group cursor-help relative">
                        <Info size={12} className="text-gold" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-jet-black text-[10px] p-2 border border-white/10 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none">
                          Tính toán dựa trên giá thuê trung bình 0.5% giá trị BĐS / tháng.
                        </div>
                      </div>
                    </div>
                    <div className="text-3xl font-serif text-gold">~{estYield}% <span className="text-sm font-sans text-white/50">/Năm</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* BẢN ĐỒ VỊ TRÍ */}
            <div className="mb-8 md:mb-12">
              <h2 className="font-serif text-3xl font-light mb-8 pb-4 border-b border-white/10 flex items-center gap-3">
                <MapPin className="text-gold" size={28} />
                Vị Trí & Bản Đồ
              </h2>
              {apt.coordinates ? (
                <SinglePropertyMap lat={apt.coordinates.lat} lng={apt.coordinates.lng} title={apt.name} price={apt.price} />
              ) : (
                <div className="w-full h-[400px] bg-white/5 flex items-center justify-center rounded-xl border border-white/10">
                  <span className="text-white/40">Chưa có dữ liệu tọa độ bản đồ</span>
                </div>
              )}
            </div>

            <div className="bg-charcoal/30 p-8 rounded border border-gold/20 flex flex-col items-center text-center">
              <h3 className="font-serif text-2xl font-light mb-4">Thuộc Mảng Ghép Dự Án {apt.projectName}</h3>
              <p className="text-sm font-light text-champagne/60 mb-6 max-w-lg">Căn hộ này được phát triển như một phần của dự án {apt.projectName}, thừa hưởng toàn bộ chuỗi tiện ích đẳng cấp 5 sao và không gian sống thượng lưu.</p>
              <Link href={`/${locale}/projects/${apt.projectId}`} className="px-8 py-3 bg-gold text-jet-black text-[11px] uppercase tracking-widest font-semibold hover:bg-white transition-colors">
                {projectLinkText}
              </Link>
            </div>
          </div>

          {/* SIDEBAR COL */}
          <div className="lg:col-span-1">
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

              <button className="w-full text-center border-b-[3px] border-double border-white/30 text-white pb-2 text-[11px] uppercase tracking-widest font-semibold hover:border-white transition-all">
                Tải Brochure
              </button>

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
          </div>

        </div>
      </section>

      <PortalFooter footer={dict.portal.footer} locale={locale} />
    </div>
  );
}
