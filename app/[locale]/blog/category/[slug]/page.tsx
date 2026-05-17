import React from "react";
import PortalHeader from "../../../../../components/PortalHeader";
import PortalFooter from "../../../../../components/PortalFooter";
import { getDictionary } from "../../../../../dictionaries";
import { Metadata } from "next";
import Link from "next/link";
import Pagination from "../../../../../components/Pagination";
import { getBlogCategoryData } from "../../../../../lib/blogService";

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const dict = getDictionary(locale);
  const seo = dict.blog.seo;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://alizedanang.net";

  return {
    title: `${slug.toUpperCase()} - ${seo.title}`,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: `${slug.toUpperCase()} - ${seo.title}`,
      description: seo.description,
      images: [{ url: seo.ogImage }],
      url: `${baseUrl}/${locale}/blog/category/${slug}`,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/blog/category/${slug}`,
    }
  };
}

export default async function BlogCategoryPage({ params, searchParams }: { params: Promise<{ locale: string, slug: string }>, searchParams: Promise<{ page?: string }> }) {
  const { locale, slug } = await params;
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || '1', 10);
  const dict = getDictionary(locale);

  const { categories, currentCategory, posts: wpPosts, totalPages } = await getBlogCategoryData(slug, currentPage);
  
  const categoryId = currentCategory ? currentCategory.id : null;
  const categoryName = currentCategory ? currentCategory.name : slug;

  const hasPosts = Array.isArray(wpPosts) && wpPosts.length > 0;

  // HÀM HELPER FORMAT NGÀY
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="relative w-full min-h-screen bg-[#070A10] text-pearl-white flex flex-col pt-32">
      <PortalHeader nav={dict.portal.nav} locale={locale} />
      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8 lg:py-10 md:py-12 w-full flex-1">
        
        {/* Tiêu đề danh mục */}
        <div className="mb-12 border-b border-white/10 pb-6 text-center">
          <Link href={`/${locale}/blog`} className="text-gold text-xs uppercase tracking-widest hover:underline mb-4 inline-block">
            ← Quay lại trang chủ tin tức
          </Link>
          <h1 className="font-serif text-4xl lg:text-5xl font-light tracking-tight text-white capitalize">
            Chuyên mục: <span className="text-gold font-medium">{categoryName}</span>
          </h1>
          <p className="text-champagne/60 mt-4 text-sm max-w-2xl mx-auto">
            Khám phá các bài viết mới nhất thuộc chuyên mục {categoryName}.
          </p>
        </div>

        {/* MOST SEARCH TAGS (cho phép chuyển đổi nhanh danh mục) */}
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8 md:mb-12">
            <div className="flex flex-wrap gap-2">
              <Link 
                href={`/${locale}/blog`}
                className="text-[10px] md:text-xs text-white/70 hover:text-white px-3 py-1.5 border-b-[3px] border-double border-white/20 hover:border-white/50 transition-colors"
              >
                #All
              </Link>
              {categories.map((c: any) => (
                <Link 
                  key={c.id} 
                  href={`/${locale}/blog/category/${c.slug}`}
                  className={`text-[10px] md:text-xs px-3 py-1.5 transition-colors ${
                    c.slug === slug 
                    ? "text-gold border-b-[3px] border-double border-gold font-bold shadow-[0_0_10px_rgba(212,175,55,0.3)]" 
                    : "text-white/70 border-b-[3px] border-double border-white/10 hover:text-white hover:border-white/50"
                  }`}
                >
                  #{c.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* --- DANH SÁCH BÀI VIẾT --- */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hasPosts ? (
               wpPosts.map((post: any) => {
                 const img = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/can-ho-view-bien-my-khe-alize.webp';
                 const title = post.title.rendered.replace(/<[^>]+>/g, '');
                 const date = formatDate(post.date);
                 
                 return (
                   <Link key={post.id} href={`/${locale}/blog/${post.slug}`} className="group flex flex-col bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all overflow-hidden h-full shadow-lg">
                     <div className="w-full aspect-[4/3] relative overflow-hidden">
                       <img src={img} alt="" className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-700" />
                       <div className="absolute top-4 left-4 bg-gold text-jet-black text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 w-fit border-b-[3px] border-double border-jet-black/20">
                         {categoryName}
                       </div>
                     </div>
                     <div className="p-5 flex flex-col flex-1 justify-between">
                       <h3 className="font-serif text-lg text-white group-hover:text-gold transition-colors line-clamp-2 mb-3 leading-snug">{title}</h3>
                       <div className="flex items-center justify-between text-xs text-white/50 border-t border-white/10 pt-3">
                         <span>Alize Editor</span>
                         <span>{date}</span>
                       </div>
                     </div>
                   </Link>
                 );
               })
            ) : (
               <div className="col-span-full py-12 md:py-10 md:py-12 text-center flex flex-col items-center">
                 <div className="text-4xl mb-4">📭</div>
                 <h3 className="text-xl font-serif text-white mb-2">Chưa có bài viết nào</h3>
                 <p className="text-champagne/60 font-light">
                   {categoryId ? "Chuyên mục này hiện chưa có nội dung. Vui lòng quay lại sau." : "Không tìm thấy chuyên mục này trên hệ thống."}
                 </p>
                 <Link href={`/${locale}/blog`} className="mt-6 text-gold text-sm uppercase tracking-widest hover:underline">
                   Xem bài viết mới nhất
                 </Link>
               </div>
            )}
          </div>

          {/* Phân trang */}
          {hasPosts && <Pagination totalPages={totalPages} currentPage={currentPage} />}
        </div>
      </div>

      <PortalFooter footer={dict.portal.footer} locale={locale} />
    </div>
  );
}
