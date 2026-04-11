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

  // FETCH BÀI VIẾT (POSTS) CÙNG BỘ LỌC CATEGORY
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
        <div className="mb-20 text-center">
           <h1 className="font-serif text-5xl md:text-6xl font-light mb-6 tracking-tight">{data.hero.title}</h1>
           <p className="text-champagne/60 max-w-2xl mx-auto font-light">{data.hero.subtitle}</p>
        </div>

        {/* --- WP CATEGORY MENU TABS --- */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mb-16 border-b border-white/10 pb-6">
            <Link 
              href={`/${locale}/blog`}
              className={`px-6 py-2 text-[11px] uppercase tracking-[0.2em] font-light transition-all rounded-full border ${currentCategorySlug === 'all' ? 'border-gold text-gold bg-gold/5' : 'border-white/10 text-champagne/50 hover:text-pearl-white hover:border-white/30'}`}
            >
              Tất Cả Tin Tức
            </Link>
            {categories.map((c: any) => (
              <Link 
                key={c.id} 
                href={`/${locale}/blog?category=${c.slug}`}
                className={`px-6 py-2 text-[11px] uppercase tracking-[0.2em] font-light transition-all rounded-full border ${currentCategorySlug === c.slug ? 'border-gold text-gold bg-gold/5' : 'border-white/10 text-champagne/50 hover:text-pearl-white hover:border-white/30'}`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
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
