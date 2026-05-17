import React from "react";
import PortalHeader from "../../../../../components/PortalHeader";
import PortalFooter from "../../../../../components/PortalFooter";
import { getDictionary } from "../../../../../dictionaries";
import { Metadata } from "next";
import FinanceSidebar from "../../../../../components/finance/FinanceSidebar";
import FinanceLatestUpdates from "../../../../../components/finance/FinanceLatestUpdates";
import { notFound } from "next/navigation";
import { getFinanceCategoryData } from "../../../../../lib/financeService";

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const dict = getDictionary(locale);
  const seo = dict.finance?.seo || dict.blog.seo;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://alizedanang.net";

  return {
    title: `${slug.replace(/-/g, ' ').toUpperCase()} | Finance | Alize Da Nang`,
    description: seo.description,
    openGraph: {
      title: `${slug.replace(/-/g, ' ').toUpperCase()} | Finance | Alize Da Nang`,
      description: seo.description,
      images: [{ url: seo.ogImage }],
      url: `${baseUrl}/${locale}/finance/category/${slug}`,
    },
  };
}

export default async function FinanceCategoryPage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  const dict = getDictionary(locale);
  const financeDict: any = dict.finance || dict.blog;

  const { wpPosts, categories, currentCategory } = await getFinanceCategoryData(slug);

  if (!currentCategory) {
    return notFound();
  }

  return (
    <div className="relative w-full min-h-screen bg-[#070A10] text-pearl-white flex flex-col pt-32">
      <PortalHeader nav={dict.portal.nav} locale={locale} />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8 lg:py-12 w-full flex-1 flex flex-col gap-12">
        
        {/* HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-4">
          <h1 className="text-4xl lg:text-6xl font-serif text-white mb-4 tracking-tight" dangerouslySetInnerHTML={{ __html: currentCategory?.name || slug }} />
          <p className="text-champagne/70 text-base lg:text-lg font-light">
            {locale === 'vi' ? 'Danh mục tin tức tài chính' : 'Finance News Category'}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full items-stretch">
          
          {/* SIDEBAR DANH MỤC */}
          <aside className="w-full lg:w-[280px] shrink-0">
            <FinanceSidebar categories={categories} locale={locale} />
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 min-w-0">
            <FinanceLatestUpdates 
              initialPosts={wpPosts} 
              categoryId={currentCategory?.id}
              locale={locale} 
              title={financeDict.latestUpdates || 'Cập Nhật Mới Nhất'} 
            />
          </main>
        </div>
        
      </div>

      <PortalFooter footer={dict.portal.footer} locale={locale} />
    </div>
  );
}
