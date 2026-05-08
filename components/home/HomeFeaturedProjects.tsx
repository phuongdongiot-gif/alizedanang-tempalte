import React from "react";
import Link from "next/link";

export default function HomeFeaturedProjects({ dynamicProjects, data, locale }: { dynamicProjects: any[], data: any, locale: string }) {
  return (
    <section id="projects" className="py-12 md:py-10 md:py-12">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-24">
          <span className="block text-gold text-[10px] tracking-[0.4em] uppercase font-light mb-4">{data.sectionTag}</span>
          <h2 className="font-serif text-4xl lg:text-5xl font-light mb-6 tracking-tight">{data.title}</h2>
          <p className="text-champagne/60 font-light text-sm max-w-2xl mx-auto">{data.desc}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
          {dynamicProjects && dynamicProjects.length > 0 ? (
            dynamicProjects.slice(0, 3).map((project: any, idx: number) => (
              <div key={idx} className="group flex flex-col bg-charcoal/20 border border-white/5 overflow-hidden rounded transition-all hover:border-gold/30">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10 bg-gold text-jet-black text-[8px] md:text-[10px] uppercase tracking-widest font-bold px-2 md:px-3 py-1 rounded">
                    DỰ ÁN
                  </div>
                  <img loading="lazy" decoding="async" src={project.hero_img || '/images/can-ho-view-bien-my-khe-alize.webp'} alt={project.name} className="w-full h-full object-cover filter brightness-[0.8] transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="p-4 md:p-8 flex flex-col flex-1">
                  <div className="text-[8px] md:text-[10px] text-gold/80 tracking-widest uppercase mb-1 md:mb-2 font-light">RESIDENCE</div>
                  <h3 className="font-serif text-sm md:text-2xl font-light mb-1 md:mb-2 line-clamp-2">{project.name}</h3>
                  <p className="text-[10px] md:text-xs text-champagne/50 mb-4 md:mb-8 font-light flex items-center">
                    <svg className="w-3 h-3 mr-1 md:mr-2 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span className="truncate">{project.location?.name || 'Đà Nẵng'}</span>
                  </p>
                  <div className="mt-auto flex justify-between items-center border-t border-white/5 pt-3 md:pt-6">
                    <span className="text-sm md:text-lg font-light text-white">Liên Hệ</span>
                    <Link href={`/${locale}/projects/${project.slug || 'the-royal-hoi-an'}`} className="text-gold text-[9px] md:text-xs tracking-widest uppercase font-light group-hover:underline">Chi Tiết</Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            data.items.map((project: any, idx: number) => (
              <div key={idx} className="group flex flex-col bg-charcoal/20 border border-white/5 overflow-hidden rounded transition-all hover:border-gold/30">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10 bg-gold text-jet-black text-[8px] md:text-[10px] uppercase tracking-widest font-bold px-2 md:px-3 py-1 rounded">
                    {project.status || 'DỰ ÁN'}
                  </div>
                  <img loading="lazy" decoding="async" src={project.img || '/images/can-ho-view-bien-my-khe-alize.webp'} alt={project.name} className="w-full h-full object-cover filter brightness-[0.8] transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="p-4 md:p-8 flex flex-col flex-1">
                  <div className="text-[8px] md:text-[10px] text-gold/80 tracking-widest uppercase mb-1 md:mb-2 font-light">{project.type || 'RESIDENCE'}</div>
                  <h3 className="font-serif text-sm md:text-2xl font-light mb-1 md:mb-2 line-clamp-2">{project.name}</h3>
                  <p className="text-[10px] md:text-xs text-champagne/50 mb-4 md:mb-8 font-light flex items-center">
                    <svg className="w-3 h-3 mr-1 md:mr-2 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span className="truncate">{project.location || 'Đà Nẵng'}</span>
                  </p>
                  <div className="mt-auto flex justify-between items-center border-t border-white/5 pt-3 md:pt-6">
                    <span className="text-sm md:text-lg font-light text-white">{project.price || 'Liên Hệ'}</span>
                    <Link href={`/${locale}/projects/${project.href || 'alize'}`} className="text-gold text-[9px] md:text-xs tracking-widest uppercase font-light group-hover:underline">{locale === 'vi' ? 'Chi Tiết' : 'Details'}</Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
