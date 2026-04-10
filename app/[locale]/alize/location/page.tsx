import React from "react";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { getDictionary } from "../../../../dictionaries";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://alizedanang.net";
  return {
    title: "Vị Trí Độc Tôn - ALIZE",
    description: "Khám phá vị trí đắc địa của dự án ALIZE Đà Nẵng trên trục đường ven biển Võ Nguyên Giáp.",
    alternates: { canonical: `${baseUrl}/${locale}/alize/location` }
  };
}

export default async function LocationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <div className="relative w-full overflow-hidden bg-jet-black text-pearl-white">
      <Header nav={dict.nav} locale={locale} />
      <div className="pt-24 lg:pt-32">
        <section id="location" className="pt-40 pb-32 text-pearl-white bg-[#070A10] border-t border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-24">
              <span className="text-[10px] text-gold tracking-[0.4em] uppercase font-light mb-6 block opacity-80">{dict.location.sectionTag}</span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-[4rem] font-light tracking-tight">{dict.location.title}</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
              <div className="lg:col-span-7">
                <div className="aspect-square relative overflow-hidden rounded">
                  <img src="/images/vi-tri-du-an-alize-da-nang.webp" alt="Location Map" className="w-full h-full object-cover filter contrast-[1.2] brightness-75" />
                </div>
              </div>
              <div className="lg:col-span-5 space-y-16">
                {dict.location.items.map((img, i) => (
                  <div key={i} className="flex items-start">
                    <span className="text-gold/40 font-serif text-3xl font-light mr-8">{img.num}</span>
                    <div>
                      <h3 className="text-xl font-light mb-4 tracking-wide text-pearl-white">{img.title}</h3>
                      <p className="text-[13px] text-champagne/60 leading-relaxed font-light">{img.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer data={dict.footer} />
    </div>
  );
}
