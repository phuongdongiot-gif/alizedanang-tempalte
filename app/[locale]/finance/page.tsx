import React from "react";
import PortalHeader from "../../../components/PortalHeader";
import PortalFooter from "../../../components/PortalFooter";
import { getDictionary } from "../../../dictionaries";
import { Metadata } from "next";
import Link from "next/link";
import FinanceHeroCard from "../../../components/finance/FinanceHeroCard";
import BlogCard from "../../../components/BlogCard";
import FinanceSidebar from "../../../components/finance/FinanceSidebar";
import FinanceLatestUpdates from "../../../components/finance/FinanceLatestUpdates";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const seo = dict.finance?.seo || dict.blog.seo;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://alizedanang.net";

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: [{ url: seo.ogImage }],
      url: `${baseUrl}/${locale}/finance`,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/finance`,
    }
  };
}

export default async function FinanceIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const financeDict: any = dict.finance || dict.blog;

  const WP_API = process.env.NEXT_PUBLIC_FINANCE_WP_API_URL || 'https://atservice.com.vn/wp-json/wp/v2';

  let wpPosts: any[] = [];
  let categories: any[] = [];

  try {
    // Gọi song song Posts và Categories
    const [postsRes, catsRes] = await Promise.all([
      fetch(`${WP_API}/posts?_embed=1&per_page=15`, { next: { revalidate: 3600 } }),
      fetch(`${WP_API}/categories?hide_empty=true&per_page=100`, { next: { revalidate: 3600 } })
    ]);

    if (postsRes.ok) wpPosts = await postsRes.json();
    if (catsRes.ok) categories = await catsRes.json();
  } catch (error) {
    console.error("Lỗi kéo tin tức Tài Chính WordPress:", error);
  }

  const hasPosts = Array.isArray(wpPosts) && wpPosts.length > 0;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  // Phân bổ dữ liệu
  const heroPost = hasPosts ? wpPosts[0] : null;
  const topStories = hasPosts ? wpPosts.slice(1, 4) : [];
  
  // Dành 6 bài viết cho Latest Updates để phục vụ Component Pagination
  const latestUpdates = hasPosts ? wpPosts.slice(4, 10) : [];
  
  // Các bài viết còn lại cho Insights
  const investmentInsights = hasPosts ? wpPosts.slice(10, 15) : [];

  return (
    <div className="relative w-full min-h-screen bg-[#070A10] text-pearl-white flex flex-col pt-32">
      <PortalHeader nav={dict.portal.nav} locale={locale} />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8 lg:py-12 w-full flex-1 flex flex-col gap-12">
        
        {/* HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-4">
          <h1 className="text-4xl lg:text-6xl font-serif text-white mb-4 tracking-tight">{financeDict.hero?.title || 'Tài Chính'}</h1>
          <p className="text-champagne/70 text-base lg:text-lg font-light">{financeDict.hero?.subtitle || ''}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full items-start">
          
          {/* SIDEBAR DANH MỤC */}
          <aside className="w-full lg:w-[280px] shrink-0">
            <FinanceSidebar categories={categories} locale={locale} />
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 flex flex-col gap-16 min-w-0">
            {hasPosts ? (
              <>
                {/* HERO SECTION */}
                {heroPost && (
                  <section>
                    <FinanceHeroCard 
                      slug={heroPost.slug}
                      title={heroPost.title.rendered}
                      excerpt={heroPost.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 200) + '...'}
                      date={formatDate(heroPost.date)}
                      imageUrl={heroPost._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/can-ho-view-bien-my-khe-alize.webp'}
                      locale={locale}
                    />
                  </section>
                )}

                {/* TOP STORIES */}
                {topStories.length > 0 && (
                  <section>
                    <h2 className="text-2xl lg:text-3xl font-serif text-white mb-8 border-b border-white/10 pb-4">{financeDict.topStories || 'Tiêu Điểm Đầu Tư'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {topStories.map((post) => (
                        <BlogCard 
                          key={post.id}
                          id={post.id}
                          slug={post.slug}
                          title={post.title.rendered}
                          excerpt={post.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 120) + '...'}
                          date={formatDate(post.date)}
                          imageUrl={post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/can-ho-view-bien-my-khe-alize.webp'}
                          locale={locale}
                          readMoreBtnText={financeDict.readMoreBtn || 'Đọc Thêm'}
                          basePath="finance"
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* TWO COLUMNS: LATEST UPDATES (Client component) & INSIGHTS */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 xl:gap-16">
                  
                  {/* LATEST UPDATES (Pagination handled here) */}
                  <div className="xl:col-span-2">
                    <FinanceLatestUpdates 
                      initialPosts={latestUpdates} 
                      locale={locale} 
                      title={financeDict.latestUpdates || 'Cập Nhật Mới Nhất'} 
                    />
                  </div>

                  {/* INVESTMENT INSIGHTS */}
                  <section className="xl:col-span-1 bg-white/5 border border-white/5 p-6 rounded-xl self-start sticky top-32">
                    <h2 className="text-xl lg:text-2xl font-serif text-gold mb-8 pb-4 border-b border-gold/20">{financeDict.investmentInsights || 'Góc Nhìn Đầu Tư'}</h2>
                    <div className="flex flex-col gap-8">
                      {investmentInsights.map((post) => {
                        const img = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/can-ho-view-bien-my-khe-alize.webp';
                        return (
                          <Link key={post.id} href={`/${locale}/finance/${post.slug}`} className="group flex flex-col gap-3">
                            <div className="w-full aspect-video rounded-lg overflow-hidden relative">
                              <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                            </div>
                            <h3 className="font-serif text-sm text-white group-hover:text-gold transition-colors line-clamp-2 leading-snug" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                            <span className="text-white/50 text-[10px] uppercase tracking-widest">{formatDate(post.date)}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </section>

                </div>
              </>
            ) : (
              <div className="py-20 text-center text-champagne/50 font-light border border-white/5 rounded-xl bg-white/5">
                Chưa có bài viết tài chính nào hoặc đang tải dữ liệu...
              </div>
            )}
          </main>
        </div>
        
      </div>

      <PortalFooter footer={dict.portal.footer} locale={locale} />
    </div>
  );
}
