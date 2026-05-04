import React from "react";
import Link from "next/link";

export default function HomeLocations({ data, locale }: { data: any, locale: string }) {
  return (
    <section className="py-24 bg-[#070A10] border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-white font-light tracking-tight">{data.title}</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-auto md:h-[500px]">
          {/* Left Main Item (HCM) */}
          {data.items[0] && (
            <Link href={`/${locale}/properties?q=${data.items[0].query}`} className="group relative col-span-2 md:col-span-2 md:row-span-2 rounded-xl overflow-hidden cursor-pointer h-[200px] md:h-full block border border-white/5">
              <img loading="lazy" decoding="async" src={data.items[0].img} alt={data.items[0].city} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-jet-black via-jet-black/40 to-transparent opacity-90 transition-opacity group-hover:opacity-100"></div>
              <div className="absolute bottom-0 left-0 p-4 md:p-8 w-full">
                <h3 className="text-white text-xl md:text-3xl font-semibold mb-1 md:mb-2 group-hover:text-gold transition-colors">{data.items[0].city}</h3>
                <span className="text-champagne/80 text-[11px] md:text-sm font-light flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E53935]"></span>
                  {data.items[0].count} {locale === 'vi' ? 'tin đăng' : 'listings'}
                </span>
              </div>
            </Link>
          )}

          {/* The Rest 4 Items */}
          {data.items.slice(1, 5).map((loc: any, idx: number) => (
            <Link key={idx} href={`/${locale}/properties?q=${loc.query}`} className="group relative col-span-1 border border-white/5 rounded-xl overflow-hidden cursor-pointer h-[140px] md:h-full block">
              <img loading="lazy" decoding="async" src={loc.img} alt={loc.city} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-jet-black via-black/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100"></div>
              <div className="absolute bottom-0 left-0 p-3 md:p-5 w-full">
                <h3 className="text-white text-sm md:text-xl font-semibold mb-1 group-hover:text-gold transition-colors line-clamp-1">{loc.city}</h3>
                <span className="text-champagne/80 text-[9px] md:text-xs font-light flex items-center gap-1 md:gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#E53935]"></span>
                  {loc.count} {locale === 'vi' ? 'tin' : 'listings'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
