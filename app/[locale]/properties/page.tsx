import React, { Suspense } from "react";
import PortalHeader from "../../../components/PortalHeader";
import PortalFooter from "../../../components/PortalFooter";
import AdvancedPropertyFilter from "../../../components/AdvancedPropertyFilter";
import PropertyListingsSuspense from "../../../components/properties/PropertyListingsSuspense";
import { getDictionary } from "../../../dictionaries";
import { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const seo = dict.portal.properties.seo;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://alizedanang.net";

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: [{ url: seo.ogImage }],
      url: `${baseUrl}/${locale}/properties`,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/properties`,
    }
  };
}

export default async function PropertiesPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { locale } = await params;
  const sp = await searchParams;

  console.log(`\n🔍 [Frontend] --- BẮT ĐẦU RENDER TRANG BẤT ĐỘNG SẢN (STREAMING) ---`);
  
  const transaction = typeof sp?.transaction === 'string' ? sp.transaction : 'sale';
  const keyword = typeof sp?.q === 'string' ? sp.q.toLowerCase() : '';
  const category = (typeof sp?.category === 'string' && sp.category !== 'all') ? sp.category : '';
  const priceRange = typeof sp?.price === 'string' ? sp.price : 'all';
  const areaRange = typeof sp?.area === 'string' ? sp.area : 'all';
  const viewMode = typeof sp?.view === 'string' ? sp.view : 'list';
  const page = typeof sp?.page === 'string' ? parseInt(sp.page, 10) : 1;
  
  const dict = getDictionary(locale);
  const saleNav = dict.portal.nav.sale;
  const rentNav = (dict.portal.nav as any).rent || { label: '', items: [] };

  const pageTitle = transaction === 'sale' 
      ? (locale === 'vi' ? 'Mua bán nhà đất toàn quốc' : 'Properties for Sale Nationwide')
      : (locale === 'vi' ? 'Cho thuê nhà đất toàn quốc' : 'Properties for Rent Nationwide');
      
  return (
    <div className="relative w-full min-h-screen bg-[#070A10] text-pearl-white flex flex-col pt-24 font-sans">
      <PortalHeader nav={dict.portal.nav} locale={locale} />
      
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 lg:px-12 py-8 mt-4">
        {/* TOP FILTER BAR - RENDERS INSTANTLY */}
        <AdvancedPropertyFilter locale={locale} saleNav={saleNav} rentNav={rentNav} />

        {/* RESULTS HEADER - RENDERS INSTANTLY */}
        <div className="mb-6 border-b border-white/10 pb-4">
           <div className="text-[11px] text-champagne/60 tracking-widest uppercase flex gap-2 items-center mb-2">
              <Link href={`/${locale}/properties`} className="hover:text-gold transition-colors">{locale === 'vi' ? 'Trang chủ' : 'Home'}</Link>
              <span>/</span>
              <span className="text-white">{transaction === 'sale' ? (locale === 'vi' ? 'Nhà đất bán' : 'Properties for Sale') : (locale === 'vi' ? 'Nhà đất cho thuê' : 'Properties for Rent')}</span>
              {category && (
                <>
                  <span>/</span>
                  <span className="text-white">
                    {(transaction === 'sale' ? saleNav.items : rentNav.items).find((i: any) => i.id === category)?.label}
                  </span>
                </>
              )}
           </div>
           <h1 className="text-2xl md:text-3xl font-light mb-2">{pageTitle}</h1>
        </div>

        {/* MAIN CONTENT AREA - SUSPENDED UNTIL DATA FETCH COMPLETE */}
        <Suspense fallback={
          <div className="flex flex-col gap-6 animate-pulse mt-8">
            <div className="h-4 w-48 bg-white/10 rounded mb-4"></div>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-3/4 w-full flex flex-col gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-full h-48 bg-white/5 rounded-lg"></div>
                ))}
              </div>
              <div className="lg:w-1/4 w-full h-96 bg-white/5 rounded-lg"></div>
            </div>
          </div>
        }>
          <PropertyListingsSuspense 
            locale={locale}
            transaction={transaction}
            keyword={keyword}
            category={category}
            priceRange={priceRange}
            areaRange={areaRange}
            viewMode={viewMode}
            page={page}
          />
        </Suspense>

      </main>

      <PortalFooter footer={dict.portal.footer} locale={locale} />
    </div>
  );
}
