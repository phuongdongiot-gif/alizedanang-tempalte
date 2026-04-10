import React from "react";
import PortalHeader from "../../components/PortalHeader";
import PortalFooter from "../../components/PortalFooter";
import { getDictionary } from "../../dictionaries";
import { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const portalSeo = dict.portal.seo;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://alizedanang.net";

  return {
    title: portalSeo.title,
    description: portalSeo.description,
    keywords: portalSeo.keywords,
    openGraph: {
      title: portalSeo.title,
      description: portalSeo.description,
      images: [{ url: portalSeo.ogImage }],
      url: `${baseUrl}/${locale}`,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
    }
  };
}

export default async function PortalHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const data = dict.portal;

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#070A10] text-pearl-white flex flex-col">
      <PortalHeader nav={data.nav} locale={locale} />
      
      {/* PORTAL HERO */}
      <section className="relative h-[90vh] min-h-[700px] w-full flex items-center justify-center">
        <div className="absolute inset-0 z-0 bg-jet-black">
          <img src="https://images.unsplash.com/photo-1628624747186-a941c476b7ef?q=80&w=2070" className="w-full h-full object-cover filter brightness-[0.4] grayscale-[20%]" alt="G-Estate Hero" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070A10] via-black/30 to-transparent" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto w-full pt-16">
          <div className="w-16 h-16 bg-gold/90 rounded flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(212,175,55,0.3)]">
             <span className="text-jet-black font-bold font-serif text-4xl">G</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light mb-8 tracking-tighter leading-[1.1] text-white">
            {data.hero.title}
          </h1>
          <p className="text-champagne/80 text-base md:text-lg font-light tracking-wide max-w-2xl mx-auto leading-relaxed mb-16">
            {data.hero.subtitle}
          </p>
          
          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg flex flex-col sm:flex-row gap-2">
            <input 
              type="text" 
              placeholder={data.hero.searchPlaceholder}
              className="flex-1 bg-transparent border-none text-white px-6 py-4 outline-none placeholder:text-white/50 text-sm font-light"
            />
            <button className="bg-gold text-jet-black px-10 py-4 font-semibold uppercase tracking-widest text-[11px] rounded transition-transform hover:scale-105">
              {data.hero.searchBtn}
            </button>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section id="projects" className="py-32 bg-[#070A10]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-24">
             <span className="block text-gold text-[10px] tracking-[0.4em] uppercase font-light mb-4">{data.featuredProjects.sectionTag}</span>
             <h2 className="font-serif text-4xl lg:text-5xl font-light mb-6 tracking-tight">{data.featuredProjects.title}</h2>
             <p className="text-champagne/60 font-light text-sm max-w-2xl mx-auto">{data.featuredProjects.desc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.featuredProjects.items.map((project, idx) => (
              <div key={idx} className="group flex flex-col bg-charcoal/20 border border-white/5 overflow-hidden rounded transition-all hover:border-gold/30">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div className="absolute top-4 left-4 z-10 bg-gold text-jet-black text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded">
                    {project.status}
                  </div>
                  <img src={project.img} alt={project.name} className="w-full h-full object-cover filter brightness-[0.8] transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="p-8 flex flex-col flex-1">
                   <div className="text-[10px] text-gold/80 tracking-widest uppercase mb-2 font-light">{project.type}</div>
                   <h3 className="font-serif text-2xl font-light mb-2">{project.name}</h3>
                   <p className="text-xs text-champagne/50 mb-8 font-light flex items-center">
                     <svg className="w-3 h-3 mr-2 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                     {project.location}
                   </p>
                   <div className="mt-auto flex justify-between items-center border-t border-white/5 pt-6">
                     <span className="text-lg font-light text-white">{project.price}</span>
                     <Link href={`/${locale}/${project.href}`} className="text-gold text-xs tracking-widest uppercase font-light group-hover:underline">Chi Tiết</Link>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section id="news" className="py-32 border-t border-white/5 bg-[#05070A]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-20 flex justify-between items-end">
             <div>
               <span className="block text-gold text-[10px] tracking-[0.4em] uppercase font-light mb-4">{data.news.sectionTag}</span>
               <h2 className="font-serif text-4xl lg:text-5xl font-light tracking-tight">{data.news.title}</h2>
             </div>
             <Link href={`/${locale}/blog`} className="hidden md:inline-block border-b border-gold/50 text-gold text-sm tracking-widest uppercase pb-1 hover:border-gold transition-colors font-light">Xem Tất Cả</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {dict.blog.articles.slice(0, 2).map((article, idx) => (
              <Link href={`/${locale}/blog/${article.slug}`} key={idx} className="flex flex-col sm:flex-row gap-8 group cursor-pointer">
                <div className="sm:w-1/2 aspect-[4/3] rounded overflow-hidden relative">
                   <img src={article.img} className="w-full h-full object-cover filter brightness-[0.7] group-hover:scale-105 transition-transform duration-700" alt=""/>
                </div>
                <div className="sm:w-1/2 flex flex-col justify-center">
                  <span className="text-gold text-[10px] font-bold tracking-widest mb-4">{article.date}</span>
                  <h3 className="font-serif text-xl font-light mb-4 line-clamp-2 group-hover:text-gold transition-colors">{article.title}</h3>
                  <p className="text-sm font-light text-champagne/60 line-clamp-3 leading-relaxed">{article.desc}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-12 text-center md:hidden">
            <Link href={`/${locale}/blog`} className="inline-block border border-gold/40 px-8 py-3 text-gold text-[10px] tracking-widest uppercase hover:bg-gold hover:text-jet-black transition-colors font-light">Xem Tất Cả</Link>
          </div>
        </div>
      </section>

      <PortalFooter footer={data.footer} locale={locale} />
    </div>
  );
}
