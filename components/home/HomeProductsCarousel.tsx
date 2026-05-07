import React from "react";
import Link from "next/link";

export default function HomeProductsCarousel({ shopProducts, locale }: { shopProducts: any[], locale: string }) {
  return (
    <section id="shop" className="py-20 border-t border-white/5 bg-[#070A10]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="mb-12 flex justify-between items-end">
          <div>
            <span className="block text-gold text-[10px] tracking-[0.4em] uppercase font-light mb-4">
              {locale === 'vi' ? 'Sản Phẩm Mới' : 'New Products'}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-white font-light tracking-tight">
              {locale === 'vi' ? 'Cửa Hàng Nội Thất' : 'Furniture Shop'}
            </h2>
          </div>
          <Link href={`/${locale}/shop`} className="hidden md:inline-block border-b border-gold/50 text-gold text-sm tracking-widest uppercase pb-1 hover:border-gold transition-colors font-light">
            {locale === 'vi' ? 'Xem Cửa Hàng' : 'View Shop'}
          </Link>
        </div>

        <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory hide-scrollbar pb-6">
          {shopProducts && shopProducts.length > 0 ? (
            shopProducts.map((prop, idx) => {
              const imgUrl = prop.thumbnail || '/images/can-ho-view-bien-my-khe-alize.webp';
              const price = prop.variants?.[0]?.prices?.find((p: any) => p.currency_code === "vnd")?.amount;
              const formattedPrice = price ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price) : "Liên hệ";
              
              return (
                <div key={idx} className="group flex flex-col bg-charcoal/20 border border-white/5 rounded-2xl overflow-hidden hover:border-gold/30 transition-all h-full shadow-lg w-[42vw] sm:w-[40vw] md:w-[30vw] lg:w-[22vw] shrink-0 snap-start">
                  <Link href={`/${locale}/shop/${prop.handle || prop.id}`} className="relative aspect-[4/3] w-full overflow-hidden bg-white/5 block">
                    {prop.categories?.[0] && (
                      <div className="absolute top-2 left-2 z-10 bg-gold text-jet-black text-[8px] md:text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded shadow-lg w-fit">
                        {prop.categories[0].name}
                      </div>
                    )}
                    <img loading="lazy" src={imgUrl} className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-700" alt={prop.title} />
                  </Link>
                  <div className="p-4 md:p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <Link href={`/${locale}/shop/${prop.handle || prop.id}`}>
                        <h3 className="font-serif text-sm md:text-base text-white group-hover:text-gold transition-colors font-light line-clamp-2 leading-snug">{prop.title}</h3>
                      </Link>
                      {prop.description && (
                        <div 
                          className="text-[10px] md:text-xs text-champagne/60 mt-2 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: prop.description }} 
                        />
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                      <div className="text-gold font-semibold text-sm">{formattedPrice}</div>
                      <Link href={`/${locale}/shop/${prop.handle || prop.id}`} className="text-[10px] uppercase text-white/50 group-hover:text-gold transition-colors tracking-widest border border-white/10 px-2 py-1 rounded">Mua ngay</Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full py-10 text-center text-champagne/50 font-light">
              {locale === 'vi' ? 'Cửa hàng đang tải hoặc offline.' : 'Shop is loading or offline.'}
            </div>
          )}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link href={`/${locale}/shop`} className="inline-block border-b-[3px] border-double border-gold/50 text-gold text-[11px] tracking-widest uppercase hover:border-gold hover:text-white transition-colors font-semibold pb-1">
            {locale === 'vi' ? 'Xem Cửa Hàng' : 'View Shop'}
          </Link>
        </div>
      </div>
    </section>
  );
}
