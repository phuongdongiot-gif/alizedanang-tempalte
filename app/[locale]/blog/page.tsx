import React from "react";
import PortalHeader from "../../../components/PortalHeader";
import PortalFooter from "../../../components/PortalFooter";
import { getDictionary } from "../../../dictionaries";
import { Metadata } from "next";
import Link from "next/link";
import Pagination from "../../../components/Pagination";
import { getBlogHomeData } from "../../../lib/blogService";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const seo = dict.blog.seo;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://alizedanang.net";

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: [{ url: seo.ogImage }],
      url: `${baseUrl}/${locale}/blog`,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/blog`,
    }
  };
}

export default async function BlogIndexPage({ params, searchParams }: { params: Promise<{ locale: string }>, searchParams: Promise<{ page?: string }> }) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || '1', 10);
  const dict = getDictionary(locale);

  const { categories, heroPosts, trendingPosts, wpPosts, totalPages } = await getBlogHomeData(currentPage);
  const hasPosts = Array.isArray(wpPosts) && wpPosts.length > 0;

  // HÀM HELPER FORMAT NGÀY
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="relative w-full min-h-screen bg-[#070A10] text-pearl-white flex flex-col pt-32">
      <PortalHeader nav={dict.portal.nav} locale={locale} />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8 lg:py-10 md:py-12 w-full flex-1">

        {/* CHỈ HIỂN THỊ HERO, TAGS VÀ TRENDING Ở TRANG 1 */}
        {currentPage === 1 && (
          <>
            {/* --- HERO SECTION --- */}
            {heroPosts.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-12 h-auto lg:h-[600px]">
                {/* Cột trái - 1 Bài to */}
                {(() => {
                  const post = heroPosts[0];
                  const img = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/can-ho-view-bien-my-khe-alize.webp';
                  const cat = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'News';
                  return (
                    <Link href={`/${locale}/blog/${post.slug}`} className="relative overflow-hidden group h-[400px] lg:h-full border border-white/5">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                      <img src={img} alt="featured" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute bottom-0 left-0 w-full p-8 z-20 flex flex-col gap-3">
                        <span className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 w-fit border-b-[3px] border-double border-white/40">{cat}</span>
                        <h2 className="text-3xl lg:text-4xl font-serif text-white leading-tight line-clamp-3">{post.title.rendered.replace(/<[^>]+>/g, '')}</h2>
                        <div className="flex items-center gap-3 mt-2 text-white/70 text-xs font-light">
                          <span>Alize Editor</span>
                          <span className="w-1 h-1 rounded-full bg-white/50" />
                          <span>{formatDate(post.date)}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })()}

                {/* Cột phải - Grid 2x2 (4 bài nhỏ) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                  {heroPosts.slice(1, 5).map((post) => {
                    const img = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/can-ho-view-bien-my-khe-alize.webp';
                    const cat = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'News';
                    return (
                      <Link key={post.id} href={`/${locale}/blog/${post.slug}`} className="relative overflow-hidden group h-[250px] lg:h-auto border border-white/5">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />
                        <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute bottom-0 left-0 w-full p-5 z-20 flex flex-col gap-2">
                          <span className="bg-blue-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 w-fit border-b-[3px] border-double border-white/40">{cat}</span>
                          <h3 className="text-base lg:text-lg font-serif text-white leading-snug line-clamp-2">{post.title.rendered.replace(/<[^>]+>/g, '')}</h3>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* --- MOST SEARCH TAGS --- */}
            {categories.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-4 mb-8 md:mb-12 border-y border-white/10 py-6 bg-white/5">
                <span className="text-xs font-bold uppercase tracking-widest text-champagne">Danh mục:</span>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c: any) => (
                    <Link
                      key={c.id}
                      href={`/${locale}/blog/category/${c.slug}`}
                      className="text-[10px] md:text-xs text-white/70 hover:text-white px-3 py-1.5 border-b-[3px] border-double border-white/20 hover:border-white/50 transition-colors"
                    >
                      #{c.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* --- TRENDING SECTION --- */}
            {trendingPosts.length > 0 && (
              <div className="mb-10 md:mb-14">
                <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
                  <h2 className="text-2xl lg:text-3xl font-serif text-white">Trending</h2>
                  <Link href={`/${locale}/blog?page=2`} className="text-[10px] uppercase tracking-widest text-white/50 hover:text-white transition-colors border border-white/10 px-4 py-2 rounded">
                    Xem tất cả
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {trendingPosts.map((post) => {
                    const img = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/can-ho-view-bien-my-khe-alize.webp';
                    const cat = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Trending';
                    return (
                      <Link key={post.id} href={`/${locale}/blog/${post.slug}`} className="relative overflow-hidden group h-[300px] border border-white/5">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                        <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute bottom-0 left-0 w-full p-5 z-20 flex flex-col gap-2">
                          <span className="bg-blue-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 w-fit border-b-[3px] border-double border-white/40">{cat}</span>
                          <h3 className="text-sm font-serif text-white leading-snug line-clamp-3">{post.title.rendered.replace(/<[^>]+>/g, '')}</h3>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* --- EDITOR PICK / MAIN LIST SECTION --- */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {hasPosts ? (
              wpPosts.map((post: any) => {
                const img = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/can-ho-view-bien-my-khe-alize.webp';
                const title = post.title.rendered.replace(/<[^>]+>/g, '');
                const date = formatDate(post.date);

                return (
                  <Link key={post.id} href={`/${locale}/blog/${post.slug}`} className="group flex bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all overflow-hidden h-[120px] sm:h-[140px]">
                    <div className="w-[120px] sm:w-[160px] h-full shrink-0 relative overflow-hidden">
                      <img src={img} alt="" className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-4 flex flex-col justify-center flex-1">
                      <h3 className="font-serif text-sm sm:text-base md:text-lg text-white group-hover:text-gold transition-colors line-clamp-2 mb-2 leading-snug">{title}</h3>
                      <span className="text-xs text-white/50">{date}</span>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full py-10 text-center text-champagne/50 font-light">
                Chưa có bài viết nào hoặc đang tải dữ liệu...
              </div>
            )}
          </div>

          {/* Phân trang */}
          <Pagination totalPages={totalPages} currentPage={currentPage} />
        </div>
      </div>

      <PortalFooter footer={dict.portal.footer} locale={locale} />
    </div>
  );
}
