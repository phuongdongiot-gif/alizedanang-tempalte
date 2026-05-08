import React from "react";
import Link from "next/link";

export default function HomeNews({ wpPosts, data, locale }: { wpPosts: any[], data: any, locale: string }) {
  return (
    <section id="news" className="py-12 md:py-10 md:py-12">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="mb-10 md:mb-14 flex justify-between items-end">
          <div>
            <span className="block text-gold text-[10px] tracking-[0.4em] uppercase font-light mb-4">{data.sectionTag}</span>
            <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">{data.title}</h2>
          </div>
          <Link href={`/${locale}/blog`} className="hidden md:inline-block border-b border-gold/50 text-gold text-sm tracking-widest uppercase pb-1 hover:border-gold transition-colors font-light">Xem Tất Cả</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 pb-4 md:pb-0">
          {wpPosts && wpPosts.length > 0 ? (
            wpPosts.map((post: any, idx: number) => {
              const img = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/can-ho-view-bien-my-khe-alize.webp';
              const title = post.title.rendered.replace(/<[^>]+>/g, '');
              const desc = post.excerpt.rendered.replace(/<[^>]+>/g, '');
              const date = new Date(post.date).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', { day: '2-digit', month: 'long', year: 'numeric' });
              return (
                <Link href={`/${locale}/blog/${post.slug}`} key={idx} className="flex flex-col gap-3 group cursor-pointer border border-transparent hover:border-white/5 hover:bg-charcoal/20 p-3 md:p-4 transition-all shadow-sm w-full">
                  <div className="w-full aspect-[4/3] overflow-hidden relative">
                    <img loading="lazy" decoding="async" src={img} className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-700" alt="" />
                  </div>
                  <div className="w-full flex flex-col justify-start mt-2">
                    <span className="text-gold text-[9px] md:text-[10px] font-bold tracking-widest mb-2 w-fit border-b-[3px] border-double border-gold/40 pb-0.5">{date}</span>
                    <h3 className="font-serif text-base md:text-xl font-light mb-2 line-clamp-2 group-hover:text-gold transition-colors">{title}</h3>
                    <p className="text-[11px] md:text-sm font-light text-champagne/60 line-clamp-3 leading-relaxed">{desc}</p>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full py-10 text-center text-champagne/50 font-light">Hệ thống đang tải bản tin mới nhất...</div>
          )}
        </div>
        <div className="mt-12 text-center md:hidden">
          <Link href={`/${locale}/blog`} className="inline-block border-b-[3px] border-double border-gold/50 text-gold text-[11px] tracking-widest uppercase hover:border-gold hover:text-white transition-colors font-semibold pb-1">Xem Tất Cả</Link>
        </div>
      </div>
    </section>
  );
}
