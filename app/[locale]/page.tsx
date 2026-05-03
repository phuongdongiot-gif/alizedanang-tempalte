import React from "react";
import PortalHeader from "../../components/PortalHeader";
import PortalFooter from "../../components/PortalFooter";
import { getDictionary } from "../../dictionaries";
import { Metadata } from "next";
import Link from "next/link";
import { fetchGraphQL } from "../../lib/graphql";
import { getProperties } from "../../lib/propertyService";
import PropertyCardList from "../../components/PropertyCardList";

export const revalidate = 60; // Refresh data every 60 seconds

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

  const graphqlEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql';
  let dynamicProjects = [];
  let wpPosts = [];

  // Fetch recent properties for the new section
  const recentProperties = await getProperties(locale);
  const featuredProperties = recentProperties.slice(0, 12); // Fetch up to 12 to enable carousel
  const featuredApartments = recentProperties.filter(p => p.propertyCategory === 'apartments').slice(0, 12);

  try {
    const data: any = await fetchGraphQL(`
      query {
        projects {
          id
          name
          slug
          hero_data
          location {
            name
          }
        }
      }
    `);
    if (data?.projects) dynamicProjects = data.projects;
  } catch (error) {
    console.warn("Lỗi kéo dữ liệu Project:", error);
  }

  try {
    const wpRes = await fetch("https://atservice.vn/wp-json/wp/v2/posts?per_page=2&_embed", { next: { revalidate: 3600 } });
    if (wpRes.ok) wpPosts = await wpRes.json();
  } catch (error) {
    console.warn("Lỗi kéo dữ liệu News:", error);
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#070A10] text-pearl-white flex flex-col">
      <PortalHeader nav={data.nav} locale={locale} />
      
      {/* PORTAL HERO */}
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
            {data.hero.title}
          </h1>
          <p className="text-champagne/80 text-base md:text-lg font-light tracking-wide max-w-2xl mx-auto leading-relaxed mb-16">
            {data.hero.subtitle}
          </p>
          
          <form action={`/${locale}/properties`} method="GET" className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg flex flex-col sm:flex-row gap-2">
            <input 
              type="text" 
              name="q"
              placeholder={data.hero.searchPlaceholder}
              className="flex-1 bg-transparent border-none text-white px-6 py-4 outline-none placeholder:text-white/50 text-sm font-light"
            />
            <button type="submit" className="text-gold border-b-[3px] border-double border-gold pb-1 font-semibold uppercase tracking-widest text-[11px] hover:text-white hover:border-white transition-colors">
              {data.hero.searchBtn}
            </button>
          </form>
        </div>
      </section>

      {/* FEATURED APARTMENTS */}
      <section className="py-24 bg-[#05070A]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-12 flex justify-between items-end">
            <div>
              <span className="block text-gold text-[10px] tracking-[0.4em] uppercase font-light mb-4">
                {locale === 'vi' ? 'Căn hộ cao cấp' : 'Luxury Apartments'}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-white font-light tracking-tight">
                {locale === 'vi' ? 'Căn Hộ Nổi Bật' : 'Featured Apartments'}
              </h2>
            </div>
            <Link href={`/${locale}/apartments`} className="hidden md:inline-block border-b border-gold/50 text-gold text-sm tracking-widest uppercase pb-1 hover:border-gold transition-colors font-light">
              {locale === 'vi' ? 'Xem Tất Cả' : 'View All'}
            </Link>
          </div>

          <style>{`
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 pb-6">
            {featuredApartments && featuredApartments.length > 0 ? (
              featuredApartments.map((prop, idx) => {
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
                {locale === 'vi' ? 'Chưa có căn hộ nào.' : 'No apartments found.'}
              </div>
            )}
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
                data.featuredProjects.items.map((project: any, idx: number) => (
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
      {/* LOCATIONS BENTO GRID */}
      <section className="py-24 bg-[#070A10] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-white font-light tracking-tight">{data.locationsByCity.title}</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-auto md:h-[500px]">
             {/* Left Main Item (HCM) */}
             {data.locationsByCity.items[0] && (
               <Link href={`/${locale}/properties?q=${data.locationsByCity.items[0].query}`} className="group relative col-span-2 md:col-span-2 md:row-span-2 rounded-xl overflow-hidden cursor-pointer h-[200px] md:h-full block border border-white/5">
                 <img loading="lazy" decoding="async" src={data.locationsByCity.items[0].img} alt={data.locationsByCity.items[0].city} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                 <div className="absolute inset-0 bg-gradient-to-t from-jet-black via-jet-black/40 to-transparent opacity-90 transition-opacity group-hover:opacity-100"></div>
                 <div className="absolute bottom-0 left-0 p-4 md:p-8 w-full">
                   <h3 className="text-white text-xl md:text-3xl font-semibold mb-1 md:mb-2 group-hover:text-gold transition-colors">{data.locationsByCity.items[0].city}</h3>
                   <span className="text-champagne/80 text-[11px] md:text-sm font-light flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-[#E53935]"></span>
                     {data.locationsByCity.items[0].count} {locale === 'vi' ? 'tin đăng' : 'listings'}
                   </span>
                 </div>
               </Link>
             )}
             
             {/* The Rest 4 Items */}
             {data.locationsByCity.items.slice(1, 5).map((loc, idx) => (
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

      {/* NEWLY POSTED PROPERTIES */}
      <section className="py-24 bg-[#05070A] border-t border-white/5">
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
          <div className="flex overflow-x-auto gap-4 md:grid md:grid-cols-2 md:gap-12 snap-x snap-mandatory hide-scrollbar pb-4 md:pb-0">
            {wpPosts && wpPosts.length > 0 ? (
              wpPosts.map((post: any, idx: number) => {
                const img = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/can-ho-view-bien-my-khe-alize.webp';
                const title = post.title.rendered.replace(/<[^>]+>/g, '');
                const desc = post.excerpt.rendered.replace(/<[^>]+>/g, '');
                const date = new Date(post.date).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', { day: '2-digit', month: 'long', year: 'numeric' });
                return (
                  <Link href={`/${locale}/blog/${post.slug}`} key={idx} className="flex flex-col sm:flex-row gap-4 md:gap-8 group cursor-pointer border border-transparent hover:bg-white/5 p-2 rounded transition-colors w-[80vw] shrink-0 snap-start md:w-auto">
                    <div className="sm:w-1/2 aspect-[4/3] rounded overflow-hidden relative">
                       <img loading="lazy" decoding="async" src={img} className="w-full h-full object-cover filter brightness-[0.7] group-hover:scale-105 transition-transform duration-700" alt=""/>
                    </div>
                    <div className="sm:w-1/2 flex flex-col justify-center">
                      <span className="text-gold text-[10px] font-bold tracking-widest mb-2 md:mb-4">{date}</span>
                      <h3 className="font-serif text-lg md:text-xl font-light mb-2 md:mb-4 line-clamp-2 group-hover:text-gold transition-colors">{title}</h3>
                      <p className="text-xs md:text-sm font-light text-champagne/60 line-clamp-3 leading-relaxed">{desc}</p>
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

      <PortalFooter footer={data.footer} locale={locale} />
    </div>
  );
}
