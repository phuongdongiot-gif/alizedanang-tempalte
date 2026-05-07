import React from "react";
import PortalHeader from "../../../components/PortalHeader";
import PortalFooter from "../../../components/PortalFooter";
import { getDictionary } from "../../../dictionaries";
import { Metadata } from "next";
import Link from "next/link";
import BlogCard from "../../../components/BlogCard";

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

export default async function BlogIndexPage({ params, searchParams }: { params: Promise<{ locale: string }>, searchParams: Promise<{ category?: string }> }) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const currentCategorySlug = resolvedSearchParams.category || 'all';
  const dict = getDictionary(locale);
  const data = dict.blog;

  // FETCH DANH MỤC (CATEGORIES) TỪ WORDPRESS
  let categories = [];
  try {
    const catRes = await fetch('https://atservice.vn/wp-json/wp/v2/categories?hide_empty=true', { next: { revalidate: 3600 } });
    categories = await catRes.json();
  } catch(e) {
    console.error("Lỗi kéo danh mục WP", e);
  }

  // TÌM ID CỦA DANH MỤC ĐANG TRUY CẬP
  let categoryFilterStr = '';
  if (currentCategorySlug !== 'all' && Array.isArray(categories)) {
    const matchedCat = categories.find((c: any) => c.slug === currentCategorySlug);
    if (matchedCat) {
      categoryFilterStr = `&categories=${matchedCat.id}`;
    }
  }

  // FETCH BÀI VIẾT TỔNG (DÙNG CHO BENTO GRID)
  let globalPosts = [];
  try {
    const resGlobal = await fetch('https://atservice.vn/wp-json/wp/v2/posts?_embed=1&per_page=5', {
      next: { revalidate: 3600 } 
    });
    globalPosts = await resGlobal.json();
  } catch (error) {
    console.error("Lỗi kéo tin tức Global WordPress:", error);
  }

  // FETCH BÀI VIẾT (POSTS) CÙNG BỘ LỌC CATEGORY (DÙNG CHO GRID DƯỚI)
  let wpPosts = [];
  try {
    const API_URL = `https://atservice.vn/wp-json/wp/v2/posts?_embed=1&per_page=12${categoryFilterStr}`;
    const res = await fetch(API_URL, {
      next: { revalidate: 3600 } 
    });
    wpPosts = await res.json();
  } catch (error) {
    console.error("Lỗi kéo tin tức WordPress:", error);
  }

  const hasPosts = Array.isArray(wpPosts) && wpPosts.length > 0;

  return (
    <div className="relative w-full min-h-screen bg-[#070A10] text-pearl-white flex flex-col pt-32">
      <PortalHeader nav={dict.portal.nav} locale={locale} />
      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 w-full flex-1">
        <div className="mb-16 text-center">
           <h1 className="font-serif text-5xl md:text-6xl font-light mb-6 tracking-tight">{data.hero.title}</h1>
           <p className="text-champagne/60 max-w-2xl mx-auto font-light">{data.hero.subtitle}</p>
        </div>

        {/* --- BENTO GRID HEADER (Luôn hiển thị bài mới nhất) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-20 w-full auto-rows-[250px] lg:auto-rows-[280px]">
          {/* Block 1: Left Featured (Col 2, Row 2) */}
          {(() => {
            const post = globalPosts[0];
            const title = post?.title?.rendered || 'BEST FULL-BODY HOME GYM MACHINES !';
            const img = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2000';
            const date = post ? new Date(post.date).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', { day: '2-digit', month: 'long', year: 'numeric' }) : '22 Feb';
            const link = post ? `/${locale}/blog/${post.slug}` : '#';
              
              return (
                <Link href={link} className="col-span-1 md:col-span-2 row-span-2 relative rounded-[32px] overflow-hidden group">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                  <img src={img} alt="featured" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-6 left-6 z-20 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-xl shadow-lg border border-white/20">
                    🔥
                  </div>
                  
                  {/* Bottom Text */}
                  <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-20">
                    <div className="flex items-center gap-2 text-white/80 text-xs font-medium uppercase tracking-wider mb-3">
                      <span>Category . Featured</span>
                      <span className="w-1 h-1 rounded-full bg-white/50" />
                      <span>{date}</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight uppercase font-sans tracking-tight line-clamp-2">
                      {title}
                    </h2>
                  </div>
                </Link>
              );
            })()}

          {/* Block 2: Top Right Lime Green (Col 2, Row 1) */}
          {(() => {
            const post = globalPosts[1];
            const title = post?.title?.rendered || 'READY, SET, GO! HOW TO START RUNNING TO STAY FIT';
            const excerpt = post?.excerpt?.rendered?.replace(/<[^>]+>/g, '').substring(0, 100) + '...' || 'Walking is recognized as a safe and effective mode of exercise when the goal is to improve fitness...';
            const link = post ? `/${locale}/blog/${post.slug}` : '#';
            
            const link1 = globalPosts[2] ? `/${locale}/blog/${globalPosts[2].slug}` : '#';
            const title1 = globalPosts[2]?.title?.rendered || 'HOW TO READ GOLF GREEN GRAIN LIKE A PRO';
            
            const link2 = globalPosts[3] ? `/${locale}/blog/${globalPosts[3].slug}` : '#';
            const title2 = globalPosts[3]?.title?.rendered || 'HOW TO WORK OUT IN A LIMITED SPACE';

              return (
                <div className="col-span-1 md:col-span-2 row-span-1 bg-[#E6F8B2] rounded-[32px] p-8 relative flex flex-col justify-between group overflow-hidden">
                  {/* Decorative circles */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-lime-300/30 rounded-full blur-2xl" />
                  
                  <div className="flex justify-between items-start z-10 relative">
                    <div className="text-jet-black/60 text-[10px] font-bold uppercase tracking-wider">
                      Category . Lifestyle
                    </div>
                    <Link href={link} className="w-10 h-10 bg-[#E6F8B2] rounded-full border border-jet-black/10 flex items-center justify-center text-jet-black hover:bg-jet-black hover:text-[#E6F8B2] transition-colors shadow-sm -mt-2 -mr-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                    </Link>
                  </div>
                  
                  <Link href={link} className="z-10 relative mt-2 group-hover:opacity-80 transition-opacity">
                    <h3 className="text-[22px] lg:text-[26px] font-black text-jet-black uppercase leading-none tracking-tighter mb-2 line-clamp-2">
                      {title}
                    </h3>
                    <p className="text-jet-black/70 text-[11px] font-medium leading-relaxed line-clamp-2 pr-4">
                      {excerpt}
                    </p>
                  </Link>

                  <div className="mt-4 border-t border-jet-black/10 pt-3 z-10 relative flex flex-col gap-2">
                    <Link href={link1} className="flex justify-between items-center text-[11px] font-bold text-jet-black uppercase hover:opacity-70 transition-opacity group/link">
                      <span className="truncate pr-4">{title1}</span>
                      <span className="transform group-hover/link:translate-x-1 transition-transform">→</span>
                    </Link>
                    <div className="w-full h-[1px] bg-jet-black/5" />
                    <Link href={link2} className="flex justify-between items-center text-[11px] font-bold text-jet-black uppercase hover:opacity-70 transition-opacity group/link">
                      <span className="truncate pr-4">{title2}</span>
                      <span className="transform group-hover/link:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              );
            })()}

          {/* Block 3: Bottom Middle Video (Col 1, Row 1) */}
          {(() => {
            const post = globalPosts[4];
            const title = post?.title?.rendered || 'ATHLETIC TRAINING | SOFT AND HARD STYLES';
            const img = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2000';
            const date = post ? new Date(post.date).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', { day: '2-digit', month: 'long', year: 'numeric' }) : '5 Min . 22 Feb';
            const link = post ? `/${locale}/blog/${post.slug}` : '#';

              return (
                <Link href={link} className="col-span-1 row-span-1 relative rounded-[32px] overflow-hidden group">
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors z-10" />
                  <img src={img} alt="video" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="w-12 h-12 bg-white/30 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center text-white transform group-hover:scale-110 transition-transform">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>

                  <div className="absolute top-5 left-5 z-20 text-white/90 text-[10px] font-bold uppercase tracking-wider">
                    Category . Tutorial
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 z-20">
                    <div className="text-white/70 text-[10px] font-medium mb-1">{date}</div>
                    <h3 className="text-xs font-bold text-white uppercase leading-tight line-clamp-2">
                      {title}
                    </h3>
                  </div>
                </Link>
              );
            })()}

          {/* Block 4: Bottom Right Categories (Col 1, Row 1) */}
          <div className="col-span-1 row-span-1 bg-[#E0C3FC] rounded-[32px] p-6 relative flex flex-col justify-between overflow-hidden group">
            <div className="flex flex-wrap gap-2 z-10">
              {categories.slice(0, 6).map((c: any) => (
                <Link 
                  key={c.id}
                  href={`/${locale}/blog?category=${c.slug}`}
                  className="px-3 py-1.5 bg-[#FFF07C] text-jet-black text-[10px] font-bold rounded-full hover:scale-105 transition-transform whitespace-nowrap shadow-sm"
                >
                  {c.name}
                </Link>
              ))}
              {categories.length === 0 && (
                <>
                  <span className="px-3 py-1.5 bg-[#FFF07C] text-jet-black text-[10px] font-bold rounded-full">Medical Knowledge</span>
                  <span className="px-3 py-1.5 bg-[#FFF07C] text-jet-black text-[10px] font-bold rounded-full">Bodybuilding</span>
                  <span className="px-3 py-1.5 bg-[#FFF07C] text-jet-black text-[10px] font-bold rounded-full">Reggie Food</span>
                  <span className="px-3 py-1.5 bg-[#FFF07C] text-jet-black text-[10px] font-bold rounded-full">Sickness</span>
                  <span className="px-3 py-1.5 bg-[#FFF07C] text-jet-black text-[10px] font-bold rounded-full">Diet</span>
                </>
              )}
            </div>
            
            <div className="flex justify-between items-end mt-4 z-10">
              <span className="text-jet-black font-black text-lg tracking-tight leading-none uppercase">View All<br/>Categories</span>
              <Link href={`/${locale}/blog`} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-jet-black hover:bg-jet-black hover:text-white transition-colors shadow-md">
                →
              </Link>
            </div>
          </div>
        </div>

        {/* --- WP CATEGORY MENU TABS --- */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mb-16 border-b border-white/10 pb-6">
            <Link 
              href={`/${locale}/blog`}
              className={`px-6 pb-2 text-[11px] uppercase tracking-[0.2em] font-light transition-all border-b-[3px] border-double ${currentCategorySlug === 'all' ? 'border-gold text-gold' : 'border-transparent text-champagne/50 hover:text-pearl-white hover:border-white/30'}`}
            >
              Tất Cả Tin Tức
            </Link>
            {categories.map((c: any) => (
              <Link 
                key={c.id} 
                href={`/${locale}/blog?category=${c.slug}`}
                className={`px-6 pb-2 text-[11px] uppercase tracking-[0.2em] font-light transition-all border-b-[3px] border-double ${currentCategorySlug === c.slug ? 'border-gold text-gold' : 'border-transparent text-champagne/50 hover:text-pearl-white hover:border-white/30'}`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-12">
          {hasPosts ? (
             wpPosts.map((post: any) => {
               const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/can-ho-view-bien-my-khe-alize.webp';
               const title = post.title.rendered;
               const excerpt = post.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 150) + '...';
               const date = new Date(post.date).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', { day: '2-digit', month: 'long', year: 'numeric' });
               
               return (
                 <BlogCard 
                   key={post.id.toString()}
                   id={post.id}
                   slug={post.slug}
                   title={title}
                   excerpt={excerpt}
                   date={date}
                   imageUrl={featuredMedia}
                   locale={locale}
                   readMoreBtnText={data.readMoreBtn}
                 />
               );
             })
          ) : Array.isArray(wpPosts) && wpPosts.length === 0 && currentCategorySlug !== 'all' ? (
             <div className="col-span-full py-10 text-center text-champagne/50 font-light">
               Chưa có bài viết nào trong chuyên mục này.
             </div>
          ) : (
             <div className="col-span-full py-10 text-center text-champagne/50 font-light">
               Hệ thống đang cập nhật dữ liệu báo chí từ máy chủ...
             </div>
          )}
        </div>
      </div>

      <PortalFooter footer={dict.portal.footer} locale={locale} />
    </div>
  );
}
