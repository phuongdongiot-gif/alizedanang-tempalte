import React, { Suspense } from "react";
import PortalHeader from "../../../components/PortalHeader";
import PortalFooter from "../../../components/PortalFooter";
import AdvancedPropertyFilter from "../../../components/AdvancedPropertyFilter";
import PropertyCardList from "../../../components/PropertyCardList";
import PropertyMap from "../../../components/PropertyMap";
import { getDictionary } from "../../../dictionaries";
import { Metadata } from "next";
import Link from "next/link";
import { PortalProperty } from "../../../types";
import { getProperties } from "../../../lib/propertyService";

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

const filterByRange = (value: number, query: string) => {
  if (query === 'all' || !query) return true;
  const parts = query.split('-');
  if (parts.length === 2) {
    const min = parseFloat(parts[0]);
    const max = parseFloat(parts[1]);
    return value >= min && value <= max;
  }
  return true;
};

export default async function PropertiesPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { locale } = await params;
  const sp = await searchParams;

  console.log(`\n🔍 [Frontend] --- BẮTẦU RENDER TRANG BẤT ĐỘNG SẢN ---`);
  
  const transaction = typeof sp?.transaction === 'string' ? sp.transaction : 'sale';
  const keyword = typeof sp?.q === 'string' ? sp.q.toLowerCase() : '';
  const category = (typeof sp?.category === 'string' && sp.category !== 'all') ? sp.category : '';
  const priceRange = typeof sp?.price === 'string' ? sp.price : 'all';
  const areaRange = typeof sp?.area === 'string' ? sp.area : 'all';
  const viewMode = typeof sp?.view === 'string' ? sp.view : 'list';
  
  const dict = getDictionary(locale);
  const data = dict.portal.properties;
  const saleNav = dict.portal.nav.sale;
  const rentNav = dict.portal.nav.rent;

  // Fetch properties from the mock service
  const allProperties = await getProperties(locale);

  // Filter Logic
  let filteredItems = allProperties.filter((item: PortalProperty) => {
    // Transaction matching
    if (item.transactionType !== transaction) return false;
    // Category matching
    if (category && item.propertyCategory !== category) return false;
    // Keyword matching
    if (keyword) {
      const nameStr = (item.name || '').toLowerCase();
      const locStr = (item.location || '').toLowerCase();
      const projStr = (item.projectName || '').toLowerCase();
      if (!nameStr.includes(keyword) && !locStr.includes(keyword) && !projStr.includes(keyword)) {
        return false;
      }
    }
    // Price matching
    if (!filterByRange(item.priceNum, priceRange)) return false;
    // Area matching
    if (!filterByRange(item.specs.areaNum, areaRange)) return false;
    
    return true;
  });

  const pageTitle = transaction === 'sale' 
      ? (locale === 'vi' ? 'Mua bán nhà đất toàn quốc' : 'Properties for Sale Nationwide')
      : (locale === 'vi' ? 'Cho thuê nhà đất toàn quốc' : 'Properties for Rent Nationwide');
      
  return (
    <div className="relative w-full min-h-screen bg-[#070A10] text-pearl-white flex flex-col pt-24 font-sans">
      <PortalHeader nav={dict.portal.nav} locale={locale} />
      
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 lg:px-12 py-8 mt-4">
        {/* TOP FILTER BAR */}
        <Suspense fallback={<div className="h-24 bg-jet-black/50 animate-pulse rounded mb-8 rounded-lg" />}>
           <AdvancedPropertyFilter locale={locale} saleNav={saleNav} rentNav={rentNav} />
        </Suspense>

        {/* RESULTS HEADER */}
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
           <p className="text-sm text-champagne/50">Hiện có <strong className="text-gold font-medium">{filteredItems.length}</strong> bất động sản.</p>
        </div>

        {/* MAIN CONTENT AREA */}
        {viewMode === 'map' ? (
           <div className="w-full mt-4 animate-in fade-in duration-500 min-h-[600px]">
             <PropertyMap properties={filteredItems} locale={locale} />
           </div>
        ) : (
           <div className="flex flex-col lg:flex-row gap-8 items-start">
             
             {/* LEFT CONTENT: Property List */}
             <div className="lg:w-3/4 w-full">
                {filteredItems.length === 0 ? (
                 <div className="py-24 text-center bg-jet-black/30 rounded border border-white/5">
                   <svg className="w-16 h-16 mx-auto mb-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                   <p className="text-lg font-light text-champagne/70">{locale === 'vi' ? 'Không tìm thấy bất động sản nào khớp với yêu cầu.' : 'No properties found matching your criteria.'}</p>
                   <Link href={`/${locale}/properties`} className="inline-block mt-4 text-gold border border-gold px-6 py-2 rounded hover:bg-gold hover:text-jet-black transition-colors text-sm">
                     {locale === 'vi' ? 'XÓA BỘ LỌC' : 'CLEAR FILTERS'}
                   </Link>
                 </div>
              ) : (
                filteredItems.map(apt => (
                  <PropertyCardList key={apt.id} property={apt} locale={locale} />
                ))
              )}
           </div>

           {/* RIGHT CONTENT: Quick Links Sidebar */}
           <aside className="lg:w-1/4 w-full sticky top-32 flex flex-col gap-6">
              
              <div className="bg-jet-black/50 p-6 border border-white/5 rounded-lg shadow-xl">
                 <h3 className="font-medium text-lg mb-4 text-white">{locale === 'vi' ? 'Lọc theo khoảng giá' : 'Filter by price'}</h3>
                 <ul className="flex flex-col gap-3 text-sm font-light text-champagne/80">
                    <li><Link href={`/${locale}/properties?transaction=${transaction}&price=0-5000000000`} className="hover:text-gold hover:translate-x-1 inline-block transition-transform">{locale === 'vi' ? 'Dưới 5 Tỷ' : 'Under 5 Billion'}</Link></li>
                    <li><Link href={`/${locale}/properties?transaction=${transaction}&price=5000000000-10000000000`} className="hover:text-gold hover:translate-x-1 inline-block transition-transform">5 - 10 {locale === 'vi' ? 'Tỷ' : 'Billion'}</Link></li>
                    <li><Link href={`/${locale}/properties?transaction=${transaction}&price=10000000000-20000000000`} className="hover:text-gold hover:translate-x-1 inline-block transition-transform">10 - 20 {locale === 'vi' ? 'Tỷ' : 'Billion'}</Link></li>
                    <li><Link href={`/${locale}/properties?transaction=${transaction}&price=20000000000-9999000000000`} className="hover:text-gold hover:translate-x-1 inline-block transition-transform">{locale === 'vi' ? 'Trên 20 Tỷ' : 'Over 20 Billion'}</Link></li>
                 </ul>
              </div>

              <div className="bg-jet-black/50 p-6 border border-white/5 rounded-lg shadow-xl">
                 <h3 className="font-medium text-lg mb-4 text-white">{locale === 'vi' ? 'Lọc theo diện tích' : 'Filter by area'}</h3>
                 <ul className="flex flex-col gap-3 text-sm font-light text-champagne/80">
                    <li><Link href={`/${locale}/properties?transaction=${transaction}&area=0-50`} className="hover:text-gold hover:translate-x-1 inline-block transition-transform">{locale === 'vi' ? 'Dưới' : 'Under'} 50 m²</Link></li>
                    <li><Link href={`/${locale}/properties?transaction=${transaction}&area=50-100`} className="hover:text-gold hover:translate-x-1 inline-block transition-transform">50 - 100 m²</Link></li>
                    <li><Link href={`/${locale}/properties?transaction=${transaction}&area=100-200`} className="hover:text-gold hover:translate-x-1 inline-block transition-transform">100 - 200 m²</Link></li>
                    <li><Link href={`/${locale}/properties?transaction=${transaction}&area=200-99999`} className="hover:text-gold hover:translate-x-1 inline-block transition-transform">{locale === 'vi' ? 'Trên' : 'Over'} 200 m²</Link></li>
                 </ul>
              </div>

           </aside>
          </div>
        )}
      </main>

      <PortalFooter footer={dict.portal.footer} locale={locale} />
    </div>
  );
}
