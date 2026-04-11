import React from "react";
import PortalHeader from "../../../../components/PortalHeader";
import PortalFooter from "../../../../components/PortalFooter";
import { getDictionary } from "../../../../dictionaries";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPropertyById } from "../../../../lib/propertyService";

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

  return (
    <div className="relative w-full min-h-screen bg-[#070A10] text-pearl-white flex flex-col pt-24">
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
            <p className="text-champagne/70 text-base md:text-lg font-light leading-relaxed mb-12">
              {apt.desc}
            </p>

            <h2 className="font-serif text-3xl font-light mb-8 pb-4 border-b border-white/10">Thư Viện Ảnh</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
              {apt.gallery.map((imgUrl, idx) => (
                <div key={idx} className="aspect-[4/3] rounded overflow-hidden">
                  <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover filter brightness-90 hover:brightness-110 transition-all duration-500 hover:scale-105" />
                </div>
              ))}
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

              <button className="w-full bg-transparent border border-gold text-gold py-4 text-[11px] uppercase tracking-widest font-semibold hover:bg-gold hover:text-jet-black transition-all mb-4">
                {bookBtnText}
              </button>

              <button className="w-full bg-white/5 border border-transparent text-white py-4 text-[11px] uppercase tracking-widest hover:bg-white/10 transition-all">
                Tải Brochure
              </button>
            </div>
          </div>

        </div>
      </section>

      <PortalFooter footer={dict.portal.footer} locale={locale} />
    </div>
  );
}
