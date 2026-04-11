import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getDictionary } from "@/dictionaries";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string, projectSlug: string }> }): Promise<Metadata> {
  const { locale, projectSlug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://alizedanang.net";
  return {
    title: "Tuyệt Tác Không Gian - ALIZE Luxury Real Estate",
    description: "Thư viện hình ảnh thiết kế ấn tượng của dự án ALIZE Đà Nẵng. Góc nhìn thượng lưu mang lại không gian sống đẳng cấp.",
    openGraph: {
      title: "Tuyệt Tác Không Gian - ALIZE Luxury Real Estate",
      description: "Thư viện hình ảnh thiết kế ấn tượng của dự án ALIZE Đà Nẵng.",
      images: [{ url: "/images/sky-pool-alize-da-nang.webp" }],
      url: `${baseUrl}/\/projects/\/gallery`,
    },
    alternates: {
      canonical: `${baseUrl}/\/projects/\/gallery`,
    }
  };
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: string, projectSlug: string }> }) {
  const { locale, projectSlug } = await params;
  const dict = getDictionary(locale);
  const data = dict.subpages.gallery;

  return (
    <div className="relative w-full overflow-hidden bg-jet-black text-pearl-white">
      <Header nav={dict.nav} locale={locale} projectSlug={projectSlug} />
      
      {/* GALLERY HERO */}
      <section className="relative h-[85vh] min-h-[700px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-jet-black">
          <img loading="lazy" decoding="async" src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053" alt="Không Gian Nghệ Thuật" className="w-full h-full object-cover filter brightness-[0.5] contrast-[1.1] grayscale-[20%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-jet-black/100 via-jet-black/40 to-transparent"></div>
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <span className="block text-gold text-[10px] md:text-xs tracking-[0.5em] font-light uppercase mb-6">{data.hero.tag}</span>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-normal text-pearl-white mb-8 tracking-tighter leading-[1.05]">
            {data.hero.title1} <br /><span className="font-serif italic font-light text-pearl-white/90">{data.hero.title2}</span>
          </h1>
          <p className="text-champagne/80 text-base md:text-lg font-light tracking-wide max-w-2xl mx-auto leading-relaxed">{data.hero.desc}</p>
        </div>
      </section>

      {/* CATEGORY 1 */}
      <section className="py-24 lg:py-32 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-light-gray/10 pb-8">
            <div>
              <span className="text-[10px] text-gold tracking-[0.4em] uppercase font-light mb-4 block opacity-80">{data.cat1.tag}</span>
              <h2 className="font-serif text-4xl lg:text-5xl font-light text-pearl-white tracking-tight">{data.cat1.title}</h2>
            </div>
            <p className="text-[13px] text-champagne/60 font-light mt-6 md:mt-0 max-w-sm text-left md:text-right">{data.cat1.desc}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 overflow-hidden group relative aspect-[16/9] md:aspect-auto h-[400px] sm:h-[500px] lg:h-[700px] bg-charcoal/20">
              <img loading="lazy" decoding="async" src={data.cat1.images[0]} className="w-full h-full object-cover filter brightness-[0.7] transition-transform duration-700 hover:scale-105" alt="Ngoại Thất" />
            </div>
            <div className="md:col-span-4 flex flex-col gap-6">
              <div className="overflow-hidden relative aspect-[4/3] h-1/2 bg-charcoal/20">
                <img loading="lazy" decoding="async" src={data.cat1.images[1]} className="w-full h-full object-cover filter brightness-[0.7] transition-transform duration-700 hover:scale-105" alt="" />
              </div>
              <div className="overflow-hidden relative aspect-[4/3] h-1/2 bg-charcoal/20">
                <img loading="lazy" decoding="async" src={data.cat1.images[2]} className="w-full h-full object-cover filter brightness-[0.7] transition-transform duration-700 hover:scale-105" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY 2 */}
      <section className="py-24 lg:py-32 bg-midnight-blue border-t border-white/5">
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-16 text-center">
            <span className="text-[10px] text-gold tracking-[0.4em] uppercase font-light mb-4 block opacity-80">{data.cat2.tag}</span>
            <h2 className="font-serif text-4xl lg:text-5xl font-light text-pearl-white tracking-tight mb-6">{data.cat2.title}</h2>
            <p className="text-[13px] text-champagne/60 font-light max-w-xl mx-auto">{data.cat2.desc}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="overflow-hidden relative aspect-square sm:col-span-1 lg:col-span-1 border border-white/5 bg-charcoal/20">
              <img loading="lazy" decoding="async" src={data.cat2.images[0]} className="w-full h-full object-cover filter brightness-[0.7] transition-transform duration-700 hover:scale-105" alt="" />
            </div>
            <div className="overflow-hidden relative aspect-[4/5] sm:col-span-1 lg:col-span-2 border border-white/5 bg-charcoal/20">
              <img loading="lazy" decoding="async" src={data.cat2.images[1]} className="w-full h-full object-cover filter brightness-[0.7] transition-transform duration-700 hover:scale-105" alt="" />
            </div>
            <div className="overflow-hidden relative aspect-[16/9] sm:col-span-2 lg:col-span-3 border border-white/5 bg-charcoal/20">
              <img loading="lazy" decoding="async" src={data.cat2.images[2]} className="w-full h-[120%] -top-[10%] object-cover filter brightness-[0.6]" alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY 3 */}
      <section className="py-24 lg:py-32 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-light-gray/10 pb-8">
            <div>
              <span className="text-[10px] text-gold tracking-[0.4em] uppercase font-light mb-4 block opacity-80">{data.cat3.tag}</span>
              <h2 className="font-serif text-4xl lg:text-5xl font-light text-pearl-white tracking-tight">{data.cat3.title}</h2>
            </div>
            <p className="text-[13px] text-champagne/60 font-light mt-6 md:mt-0 max-w-sm text-left md:text-right">{data.cat3.desc}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col gap-6">
              <div className="overflow-hidden relative aspect-[4/3] bg-charcoal/20">
                <img loading="lazy" decoding="async" src={data.cat3.images[0]} className="w-full h-full object-cover filter brightness-[0.7] transition-transform duration-700 hover:scale-105" alt="" />
              </div>
              <div className="overflow-hidden relative aspect-square bg-charcoal/20">
                <img loading="lazy" decoding="async" src={data.cat3.images[1]} className="w-full h-full object-cover filter brightness-[0.7] transition-transform duration-700 hover:scale-105" alt="" />
              </div>
            </div>
            <div className="overflow-hidden relative h-full min-h-[500px] lg:min-h-full bg-charcoal/20">
              <img loading="lazy" decoding="async" src={data.cat3.images[2]} className="w-full h-full object-cover filter brightness-[0.7] transition-transform duration-700 hover:scale-105" alt="" />
            </div>
          </div>
        </div>
      </section>

      <Footer data={dict.footer} />
    </div>
  );
}
