import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getDictionary } from "@/dictionaries";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string, projectSlug: string }> }): Promise<Metadata> {
  const { locale, projectSlug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://alizedanang.net";
  return {
    title: "Giá Trị Đầu Tư - ALIZE",
    description: "Tìm hiểu giá trị đầu tư và di sản truyền đời tại dự án cao cấp ALIZE.",
    alternates: { canonical: `${baseUrl}/\/projects/\/values` }
  };
}

export default async function ValuesPage({ params }: { params: Promise<{ locale: string, projectSlug: string }> }) {
  const { locale, projectSlug } = await params;
  const dict = getDictionary(locale);

  return (
    <div className="relative w-full overflow-hidden bg-jet-black text-pearl-white">
      <Header nav={dict.nav} locale={locale} projectSlug={projectSlug} />
      <div className="pt-24 lg:pt-32">
        <section id="values" className="pt-40 pb-32 bg-jet-black text-pearl-white border-t border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-24">
              <span className="text-[10px] text-gold tracking-[0.4em] uppercase font-light mb-6 block opacity-80">{dict.values.sectionTag}</span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-[4rem] font-light tracking-tight">{dict.values.titleLine1}<br /><span className="italic font-serif text-pearl-white/70">{dict.values.titleLine2}</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
              {dict.values.items.map((v, i) => (
                <div key={i} className="border-t border-gold/30 pt-8 mt-12 bg-charcoal/10 p-6 rounded hover:bg-charcoal/30 transition-colors">
                  <span className="text-gold font-serif text-3xl font-light mb-6 block">{v.number}</span>
                  <h3 className="text-xl font-light mb-4 tracking-wide">{v.title}</h3>
                  <p className="text-[13px] text-champagne/60 leading-relaxed font-light">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer data={dict.footer} />
    </div>
  );
}
