import React from "react";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { getDictionary } from "../../../../dictionaries";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://alizedanang.net";
  return {
    title: "Dịch Vụ - ALIZE",
    description: "Các dịch vụ đẳng cấp chuẩn khách sạn 5 sao dành riêng cho cư dân ALIZE.",
    alternates: { canonical: `${baseUrl}/${locale}/alize/services` }
  };
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const data = dict.subpages.services;

  return (
    <div className="relative w-full overflow-hidden bg-jet-black text-pearl-white">
      <Header nav={dict.nav} locale={locale} />
      <div className="pt-24 lg:pt-32">
        <section className="pt-40 pb-32 bg-jet-black text-pearl-white border-t border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
              <div className="lg:col-span-6 border-l border-gold/40 pl-10 h-full flex flex-col justify-center">
                <span className="text-[10px] text-gold tracking-[0.4em] uppercase font-light mb-8 block opacity-80">{data.tag}</span>
                <h2 className="font-serif text-4xl md:text-5xl lg:text-[4rem] font-light mb-12 tracking-tight leading-[1.1]">{data.title1} <span className="italic">{data.title2}</span></h2>
                <p className="text-champagne/70 font-light leading-[2] text-sm md:text-base mb-8">{data.desc}</p>
                <div className="space-y-4">
                  {data.items.map((item, idx) => (
                    <div key={idx} className="p-6 bg-charcoal/30 border border-white/5">
                      <h3 className="text-xl font-light text-gold mb-2">{item.title}</h3>
                      <p className="text-sm font-light text-champagne/60">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-6">
                <div className="aspect-[4/5] md:aspect-square relative overflow-hidden bg-charcoal/20 rounded">
                  <img src="https://images.unsplash.com/photo-1551882547-ff40c0d13c11?q=80&w=1974&auto=format&fit=crop" alt="Dịch Vụ" className="w-full h-full object-cover filter brightness-[0.7]" />
                </div>
              </div>
          </div>
        </section>
      </div>
      <Footer data={dict.footer} />
    </div>
  );
}
