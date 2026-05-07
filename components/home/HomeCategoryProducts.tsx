"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function HomeCategoryProducts({ categories, products, locale }: { categories: any[], products: any[], locale: string }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(categories?.[0]?.id || null);

  // Filter products by active category
  const filteredProducts = activeCategory 
    ? products.filter(p => p.categories?.some((c: any) => c.id === activeCategory))
    : products;

  return (
    <section className="py-16 bg-[#0A0C10] border-t border-white/5 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl text-white font-light tracking-tight mb-6">
            {locale === 'vi' ? 'Khám Phá Theo Danh Mục' : 'Explore Categories'}
          </h2>
          
          {/* Category Tabs Carousel */}
          <div className="flex overflow-x-auto gap-3 snap-x snap-mandatory hide-scrollbar justify-start md:justify-center pb-2">
            {categories.map((cat, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveCategory(cat.id)}
                className={`snap-center flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                  activeCategory === cat.id 
                    ? "bg-gold border-gold text-jet-black shadow-[0_0_15px_rgba(212,175,55,0.3)]" 
                    : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/30"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Carousel for the active category */}
        <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory hide-scrollbar pb-6 mt-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((prop, idx) => {
              const imgUrl = prop.thumbnail || '/images/can-ho-view-bien-my-khe-alize.webp';
              const price = prop.variants?.[0]?.prices?.find((p: any) => p.currency_code === "vnd")?.amount;
              const formattedPrice = price ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price) : "Liên hệ";
              
              return (
                <div key={idx} className="group flex flex-col bg-[#070A10] border border-white/5 rounded-2xl overflow-hidden hover:border-gold/30 transition-all h-full shadow-lg w-[65vw] sm:w-[40vw] md:w-[28vw] lg:w-[22vw] shrink-0 snap-start">
                  <Link href={`/${locale}/shop/${prop.handle || prop.id}`} className="relative aspect-[4/3] w-full overflow-hidden bg-white/5 block">
                    <img loading="lazy" src={imgUrl} className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-700" alt={prop.title} />
                  </Link>
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <Link href={`/${locale}/shop/${prop.handle || prop.id}`}>
                        <h3 className="font-serif text-sm md:text-base text-white group-hover:text-gold transition-colors font-light line-clamp-2 leading-snug">{prop.title}</h3>
                      </Link>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                      <div className="text-gold font-semibold text-sm">{formattedPrice}</div>
                      <Link href={`/${locale}/shop/${prop.handle || prop.id}`} className="text-[10px] uppercase text-white/50 group-hover:text-gold transition-colors tracking-widest border border-white/10 px-2 py-1 rounded">Mua ngay</Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full py-10 text-center text-champagne/50 font-light text-sm">
              {locale === 'vi' ? 'Chưa có sản phẩm nào trong danh mục này.' : 'No products found in this category.'}
            </div>
          )}
        </div>
        
        <div className="mt-6 text-center">
          <Link href={`/${locale}/shop`} className="inline-block px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors text-xs uppercase tracking-widest font-semibold">
            {locale === 'vi' ? 'Xem Tất Cả' : 'View All'}
          </Link>
        </div>
      </div>
    </section>
  );
}
