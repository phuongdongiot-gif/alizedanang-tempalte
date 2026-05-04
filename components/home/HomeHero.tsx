import React from "react";

export default function HomeHero({ data, locale }: { data: any, locale: string }) {
  return (
    <section className="relative h-[90vh] min-h-[700px] w-full flex items-center justify-center">
      <div className="absolute inset-0 z-0 bg-jet-black">
        <img loading="lazy" decoding="async" src="https://images.unsplash.com/photo-1628624747186-a941c476b7ef?q=80&w=2070" className="w-full h-full object-cover filter brightness-[0.4] grayscale-[20%]" alt="G-Estate Hero" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070A10] via-black/30 to-transparent" />
      </div>
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto w-full pt-16">
        <div className="w-16 h-16 bg-gold/90 rounded flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(212,175,55,0.3)]">
          <span className="text-jet-black font-bold font-serif text-4xl">G</span>
        </div>
        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light mb-8 tracking-tighter leading-[1.1] text-white">
          {data.title}
        </h1>
        <p className="text-champagne/80 text-base md:text-lg font-light tracking-wide max-w-2xl mx-auto leading-relaxed mb-16">
          {data.subtitle}
        </p>

        <form action={`/${locale}/properties`} method="GET" className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            name="q"
            placeholder={data.searchPlaceholder}
            className="flex-1 bg-transparent border-none text-white px-6 py-4 outline-none placeholder:text-white/50 text-sm font-light"
          />
          <button type="submit" className="text-gold border-b-[3px] border-double border-gold pb-1 font-semibold uppercase tracking-widest text-[11px] hover:text-white hover:border-white transition-colors">
            {data.searchBtn}
          </button>
        </form>
      </div>
    </section>
  );
}
