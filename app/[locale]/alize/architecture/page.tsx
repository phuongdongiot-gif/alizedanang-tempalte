import React from "react";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { getDictionary } from "../../../../dictionaries";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://alizedanang.net";
  return {
    title: "Kiến trúc Độc bản - ALIZE Luxury Real Estate",
    description: "Khám phá kiến trúc độc bản của ALIZE Đà Nẵng. Ngôn ngữ thiết kế của tương lai với tầm nhìn Panorama trực diện biển.",
    openGraph: {
      title: "Kiến trúc Độc bản - ALIZE",
      description: "Ngôn ngữ thiết kế tương lai.",
      images: [{ url: "/images/phoi-canh-can-ho-view-bien-du-an-alize.webp" }],
      url: `${baseUrl}/${locale}/alize/architecture`,
    },
    alternates: { canonical: `${baseUrl}/${locale}/alize/architecture` }
  };
}

export default async function ArchitecturePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const data = dict.subpages.architecture;

  return (
    <div className="relative w-full overflow-hidden bg-jet-black text-pearl-white">
      <Header nav={dict.nav} locale={locale} />
      
      {/* ARCHITECTURE HERO */}
      <section className="relative h-[85vh] min-h-[700px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-jet-black">
          <img src="/images/du-an-alize-dan-nang-doc.webp" alt="Nghệ Thuật Kiến Trúc" className="w-full h-full object-cover filter brightness-[0.4] grayscale-[30%] opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-jet-black/100 via-jet-black/30 to-transparent"></div>
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <span className="block text-gold text-[10px] md:text-xs tracking-[0.5em] font-light uppercase mb-6">{data.hero.tag}</span>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-normal text-pearl-white mb-8 tracking-tighter leading-[1.05]">
            {data.hero.title1}<br /><span className="font-serif italic font-light text-pearl-white/90">{data.hero.title2}</span>
          </h1>
          <p className="text-champagne/80 text-base md:text-lg font-light tracking-wide max-w-2xl mx-auto leading-relaxed">{data.hero.desc}</p>
        </div>
      </section>

      {/* SECTION 1 */}
      <section className="py-24 lg:py-32 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1 relative">
              <span className="text-[10px] text-gold tracking-[0.4em] uppercase font-light mb-8 block opacity-80 border-b border-white/10 pb-4">{data.section1.tag}</span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-10 leading-tight">
                {data.section1.title1} <br /><span className="italic font-serif text-pearl-white/70">{data.section1.title2}</span>
              </h2>
              <p className="text-champagne/70 font-light leading-[2] text-sm md:text-base mb-10">{data.section1.desc1}</p>
              <div className="pl-6 border-l border-gold/40 text-[13px] text-champagne/60 leading-relaxed font-light">{data.section1.desc2}</div>
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col sm:flex-row gap-6 lg:gap-8 justify-center items-center h-auto sm:h-[500px]">
              <div className="rounded-t-[100px] sm:rounded-t-full w-full sm:w-1/2 aspect-[4/5] relative overflow-hidden bg-charcoal/20 border border-white/5 shadow-2xl">
                <img src="/images/phoi-canh-can-ho-view-bien-du-an-alize.webp" alt="Góc Xoay" className="w-full h-full object-cover filter brightness-[0.7]" />
              </div>
              <div className="rounded-b-[100px] sm:rounded-b-full w-full sm:w-1/2 aspect-[4/5] relative overflow-hidden bg-charcoal/20 border border-white/5 sm:mt-16 shadow-2xl">
                <img src="/images/sky-pool-alize-da-nang.webp" alt="Panorama" className="w-full h-full object-cover filter brightness-[0.7]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 */}
      <section className="py-24 lg:py-32 bg-midnight-blue border-t border-white/5">
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          <div className="lg:col-span-7 relative">
            <div className="aspect-[4/3] lg:aspect-[16/9] relative overflow-hidden bg-charcoal/20 shadow-2xl rounded">
              <img src="/images/du-an-alize-dan-nang-doc.webp" alt="Traditional" className="w-full h-full object-cover filter brightness-[0.8] sepia-[20%]" />
            </div>
          </div>
          <div className="lg:col-span-5 mt-12 lg:mt-0">
            <span className="text-[10px] text-gold tracking-[0.4em] uppercase font-light mb-8 block opacity-80 border-b border-white/10 pb-4">{data.section2.tag}</span>
            <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight mb-10 leading-tight">
              {data.section2.title1} <br /><span className="italic font-serif text-pearl-white/70">{data.section2.title2}</span>
            </h2>
            <p className="text-champagne/70 font-light leading-[2] text-sm mb-6">{data.section2.desc1}</p>
            <p className="text-champagne/70 font-light leading-[2] text-sm mb-10">{data.section2.desc2}</p>
          </div>
        </div>
      </section>

      <Footer data={dict.footer} />
    </div>
  );
}
