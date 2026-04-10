import React from "react";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { getDictionary } from "../../../../dictionaries";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://alizedanang.net";
  return {
    title: "Tiện Ích Đặc Quyền - ALIZE",
    description: "Khám phá chuỗi tiện ích đỉnh cao chuẩn 5 sao.",
    alternates: { canonical: `${baseUrl}/${locale}/alize/amenities` }
  };
}

export default async function AmenitiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const data = dict.subpages.amenities;

  return (
    <div className="relative w-full overflow-hidden bg-jet-black text-pearl-white">
      <Header nav={dict.nav} locale={locale} />
      
      {/* AMENITIES HERO */}
      <section className="relative h-[85vh] min-h-[700px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-jet-black">
          <img loading="lazy" decoding="async" src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070" className="w-full h-full object-cover filter brightness-[0.5]" alt="Hero" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <span className="block text-gold text-[10px] md:text-xs tracking-[0.5em] font-light uppercase mb-6">{data.hero.tag}</span>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-normal text-pearl-white mb-8 tracking-tighter leading-[1.05]">
            {data.hero.title1} <br /><span className="font-serif italic font-light text-pearl-white/90">{data.hero.title2}</span>
          </h1>
          <p className="text-champagne/80 text-base md:text-lg font-light tracking-wide max-w-2xl mx-auto leading-relaxed">{data.hero.desc}</p>
        </div>
      </section>

      {/* SEC 1 */}
      <section className="py-32 border-t border-white/5 relative">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1 relative">
            <span className="text-[10px] text-gold tracking-[0.4em] uppercase font-light mb-8 block opacity-80 border-b border-white/10 pb-4">{data.sec1.tag}</span>
            <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-10 leading-tight">{data.sec1.title1}<br/><span className="italic font-serif text-pearl-white/70">{data.sec1.title2}</span></h2>
            <p className="text-champagne/70 font-light leading-[2] text-sm md:text-base mb-10">{data.sec1.desc1}</p>
            <div className="pl-6 border-l border-gold/40 text-[13px] text-champagne/60 leading-relaxed font-light">{data.sec1.desc2}</div>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2">
             <div className="aspect-[16/9] lg:aspect-[4/3] rounded-tl-[100px] rounded-br-[100px] relative overflow-hidden bg-charcoal/20 border border-white/5">
                <img loading="lazy" decoding="async" src="/images/sky-pool-alize-da-nang.webp" alt="Sky Pool" className="w-full h-full object-cover filter brightness-[0.8]" />
             </div>
          </div>
        </div>
      </section>

      {/* SEC 2 */}
      <section className="py-32 bg-midnight-blue border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          <div className="lg:col-span-7 relative">
             <div className="aspect-square relative overflow-hidden bg-charcoal/20 rounded">
                <img loading="lazy" decoding="async" src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120" alt="Yoga Element" className="w-full h-full object-cover filter brightness-[0.7]" />
             </div>
          </div>
          <div className="lg:col-span-5">
            <span className="text-[10px] text-gold tracking-[0.4em] uppercase font-light mb-8 block opacity-80 border-b border-white/10 pb-4">{data.sec2.tag}</span>
            <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-10 leading-tight">{data.sec2.title1} <br/><span className="italic font-serif text-pearl-white/70">{data.sec2.title2}</span></h2>
            <p className="text-champagne/70 font-light leading-[2] text-sm mb-6">{data.sec2.desc1}</p>
            <ul className="space-y-6 mt-10 text-sm font-light text-champagne/60">
               {data.sec2.list.map((item, idx) => (
                 <li key={idx} className="flex items-center border-b border-white/5 pb-4"><div className="w-1.5 h-1.5 bg-gold rounded-full mr-4"></div> {item}</li>
               ))}
            </ul>
          </div>
        </div>
      </section>

      <Footer data={dict.footer} />
    </div>
  );
}
