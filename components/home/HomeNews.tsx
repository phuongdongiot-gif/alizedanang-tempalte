import React from "react";
import Link from "next/link";

export default function HomeNews({ wpPosts, data, locale }: { wpPosts: any[], data: any, locale: string }) {
  return (
    <section id="news" className="py-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="mb-20 flex justify-between items-end">
          <div>
            <span className="block text-gold text-[10px] tracking-[0.4em] uppercase font-light mb-4">{data.sectionTag}</span>
            <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">{data.title}</h2>
          </div>
          <Link href={`/${locale}/blog`} className="hidden md:inline-block border-b border-gold/50 text-gold text-sm tracking-widest uppercase pb-1 hover:border-gold transition-colors font-light">Xem Tất Cả</Link>
        </div>
        <div className="flex overflow-x-auto gap-4 md:grid md:grid-cols-2 md:gap-12 snap-x snap-mandatory hide-scrollbar pb-4 md:pb-0">
          {wpPosts && wpPosts.length > 0 ? (
            wpPosts.map((post: any, idx: number) => {
              const img = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/can-ho-view-bien-my-khe-alize.webp';
              const title = post.title.rendered.replace(/<[^>]+>/g, '');
              const desc = post.excerpt.rendered.replace(/<[^>]+>/g, '');
              const date = new Date(post.date).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', { day: '2-digit', month: 'long', year: 'numeric' });
              return (
                <Link href={`/${locale}/blog/${post.slug}`} key={idx} className="flex flex-col sm:flex-row gap-4 md:gap-8 group cursor-pointer border border-transparent hover:bg-white/5 p-2 rounded transition-colors w-[42vw] shrink-0 snap-start md:w-auto">
                  <div className="sm:w-1/2 aspect-[4/3] rounded overflow-hidden relative">
                    <img loading="lazy" decoding="async" src={img} className="w-full h-full object-cover filter brightness-[0.7] group-hover:scale-105 transition-transform duration-700" alt="" />
                  </div>
                  <div className="sm:w-1/2 flex flex-col justify-center mt-2 sm:mt-0">
                    <span className="text-gold text-[10px] font-bold tracking-widest mb-1 md:mb-4">{date}</span>
                    <h3 className="font-serif text-sm md:text-xl font-light mb-1 md:mb-4 line-clamp-2 group-hover:text-gold transition-colors">{title}</h3>
                    <p className="text-[10px] md:text-sm font-light text-champagne/60 line-clamp-2 md:line-clamp-3 leading-relaxed">{desc}</p>
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
