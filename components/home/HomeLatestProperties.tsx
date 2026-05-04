import React from "react";
import Link from "next/link";

export default function HomeLatestProperties({ featuredProperties, locale }: { featuredProperties: any[], locale: string }) {
  return (
    <section className="py-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="mb-12 flex justify-between items-end">
          <div>
            <span className="block text-gold text-[10px] tracking-[0.4em] uppercase font-light mb-4">
              {locale === 'vi' ? 'Bất động sản nổi bật' : 'Featured Properties'}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-white font-light tracking-tight">
              {locale === 'vi' ? 'Khám Phá Mới Nhất' : 'Latest Explorations'}
            </h2>
          </div>
          <Link href={`/${locale}/properties`} className="hidden md:inline-block border-b border-gold/50 text-gold text-sm tracking-widest uppercase pb-1 hover:border-gold transition-colors font-light">
            {locale === 'vi' ? 'Xem Tất Cả' : 'View All'}
          </Link>
        </div>

        <style>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 pb-6">
          {featuredProperties && featuredProperties.length > 0 ? (
            featuredProperties.map((prop, idx) => {
              const imgUrl = prop.img || (prop.gallery && prop.gallery.length > 0 ? prop.gallery[0] : '/images/can-ho-view-bien-my-khe-alize.webp');
              return (
                <Link href={`/${locale}/apartments/${prop.id}`} key={idx} className="group flex flex-col bg-charcoal/20 border border-white/5 rounded-md overflow-hidden hover:border-gold/30 transition-all h-full shadow-lg">
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10 flex flex-col gap-1 md:gap-2">
                      <div className="bg-[#4CAF50] text-white text-[8px] md:text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded shadow-lg w-fit">XÁC THỰC</div>
                      {prop.isNew && <div className="bg-[#E53935] text-white text-[8px] md:text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded shadow-lg w-fit">MỚI</div>}
                    </div>
                    <img loading="lazy" src={imgUrl} className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-700" alt={prop.name} />
                  </div>
                  <div className="p-3 md:p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-serif text-sm md:text-lg text-white group-hover:text-gold transition-colors font-light line-clamp-2 leading-snug">{prop.name}</h3>
                      <p className="text-[10px] md:text-[11px] text-champagne/60 mt-1 md:mt-2 truncate">{prop.location}</p>
                    </div>
                    <div className="flex flex-col gap-2 md:gap-3 mt-3 md:mt-4 border-t border-white/5 pt-3 md:pt-4">
                      <div className="text-[#E53935] font-bold text-sm md:text-base line-clamp-1">{prop.price}</div>
                      <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-xs text-white/80 flex-wrap">
                        <span>{prop.specs?.area}</span>
                        <span className="flex items-center"><span className="text-champagne/50 mr-1 text-[8px] md:text-[9px]">PN</span> {prop.specs?.beds}</span>
                        <span className="flex items-center"><span className="text-champagne/50 mr-1 text-[8px] md:text-[9px]">WC</span> {prop.specs?.baths}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full py-10 text-center text-champagne/50 font-light">
              {locale === 'vi' ? 'Chưa có bất động sản nào.' : 'No properties found.'}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
