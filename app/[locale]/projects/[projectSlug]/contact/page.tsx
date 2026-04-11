import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getDictionary } from "@/dictionaries";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string, projectSlug: string }> }): Promise<Metadata> {
  const { locale, projectSlug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://alizedanang.net";
  return {
    title: "Liên Hệ Đặc Quyền - ALIZE",
    description: "Đăng ký nhận lịch tham quan không gian mô phỏng và trao đổi thông tin đầu tư dự án ALIZE.",
    alternates: { canonical: `${baseUrl}/\/projects/\/contact` }
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string, projectSlug: string }> }) {
  const { locale, projectSlug } = await params;
  const dict = getDictionary(locale);
  const data = dict.subpages.contact;

  return (
    <div className="relative w-full overflow-hidden bg-jet-black text-pearl-white">
      <Header nav={dict.nav} locale={locale} projectSlug={projectSlug} />
      <div className="pt-24 lg:pt-32">
        <section className="pt-40 pb-32 text-pearl-white border-t border-white/5 bg-midnight-blue">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                <div>
                   <span className="text-[10px] text-gold tracking-[0.4em] uppercase font-light mb-6 block opacity-80">{data.tag}</span>
                   <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] font-light tracking-tight mb-8">{data.title1} <br /><span className="italic">{data.title2}</span></h2>
                   <p className="text-champagne/60 font-light text-sm max-w-sm leading-[2] mb-12">
                     {data.desc}
                   </p>
                   
                   <div className="space-y-6">
                     <div className="flex border-b border-light-gray/10 pb-4">
                        <span className="w-32 text-gold uppercase text-[10px] tracking-widest font-bold">{data.hotlineLabel}</span>
                        <a href="tel:0799036842" className="text-base text-pearl-white hover:text-gold transition-colors">0799.036.842</a>
                     </div>
                     <div className="flex border-b border-light-gray/10 pb-4">
                        <span className="w-32 text-gold uppercase text-[10px] tracking-widest font-bold">{data.zaloLabel}</span>
                        <a href="https://zalo.me/0799036842" target="_blank" className="text-base text-pearl-white hover:text-gold transition-colors">{data.zaloText}</a>
                     </div>
                     <div className="flex border-b border-light-gray/10 pb-4">
                        <span className="w-32 text-gold uppercase text-[10px] tracking-widest font-bold">{data.addressLabel}</span>
                        <span className="text-base text-pearl-white">{data.addressText}</span>
                     </div>
                   </div>
                </div>
                
                <div className="bg-charcoal/20 p-8 md:p-12 border border-white/5 relative">
                  <h3 className="font-serif text-2xl font-light mb-8 text-pearl-white">{data.formTitle}</h3>
                  <form className="space-y-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-champagne/50 mb-2">{data.formName}</label>
                      <input type="text" className="w-full bg-transparent border-b border-white/20 pb-2 text-pearl-white focus:outline-none focus:border-gold transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-champagne/50 mb-2">{data.formPhone}</label>
                      <input type="tel" className="w-full bg-transparent border-b border-white/20 pb-2 text-pearl-white focus:outline-none focus:border-gold transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-champagne/50 mb-2">{data.formExtra}</label>
                      <textarea rows={3} className="w-full bg-transparent border-b border-white/20 pb-2 text-pearl-white focus:outline-none focus:border-gold transition-colors resize-none"></textarea>
                    </div>
                    <button type="button" className="mt-8 w-full border border-gold/40 text-gold py-4 text-[11px] uppercase tracking-[0.3em] font-light hover:bg-gold hover:text-jet-black transition-all">{data.formBtn}</button>
                  </form>
                </div>
             </div>
          </div>
        </section>
      </div>
      <Footer data={dict.footer} />
    </div>
  );
}
