import React from "react";
import Link from "next/link";
import PropertyCardList from "../PropertyCardList";
import PropertyMap from "../PropertyMap";
import { getProperties } from "../../lib/propertyService";
import { PortalProperty } from "../../types";

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

const removeAccents = (str: string) => {
  return str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D') : '';
};

export default async function PropertyListingsSuspense({
  locale,
  transaction,
  keyword,
  category,
  priceRange,
  areaRange,
  viewMode,
  page
}: {
  locale: string;
  transaction: string;
  keyword: string;
  category: string;
  priceRange: string;
  areaRange: string;
  viewMode: string;
  page: number;
}) {
  const ITEMS_PER_PAGE = 16;
  
  // Fetch from GraphQL or Mock Database
  const allProperties = await getProperties(locale);

  // Filter Logic
  let filteredItems = allProperties.filter((item: PortalProperty) => {
    if (item.transactionType !== transaction) return false;
    if (category && item.propertyCategory !== category) return false;
    if (keyword) {
      const searchKw = removeAccents(keyword.toLowerCase());
      const nameStr = removeAccents((item.name || '').toLowerCase());
      const locStr = removeAccents((item.location || '').toLowerCase());
      const projStr = removeAccents((item.projectName || '').toLowerCase());
      if (!nameStr.includes(searchKw) && !locStr.includes(searchKw) && !projStr.includes(searchKw)) {
        return false;
      }
    }
    if (!filterByRange(item.priceNum, priceRange)) return false;
    if (!filterByRange(item.specs.areaNum, areaRange)) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <>
      <div className="mb-6">
        <p className="text-sm text-champagne/50">Hiện có <strong className="text-gold font-medium">{filteredItems.length}</strong> bất động sản.</p>
      </div>

      {viewMode === 'map' ? (
        <div className="w-full animate-in fade-in duration-500 min-h-[600px]">
          <PropertyMap properties={filteredItems} locale={locale} />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
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
              <>
                {paginatedItems.map(apt => (
                  <PropertyCardList key={apt.id} property={apt} locale={locale} />
                ))}
                
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8 mb-4">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <Link
                        key={i}
                        href={`/${locale}/properties?transaction=${transaction}&category=${category}&q=${keyword}&price=${priceRange}&area=${areaRange}&view=${viewMode}&page=${i + 1}`}
                        className={`w-10 h-10 flex items-center justify-center text-sm rounded transition-colors ${page === i + 1 ? 'bg-gold text-jet-black font-medium' : 'bg-jet-black/50 text-white/70 hover:bg-white/10 border border-white/5'}`}
                      >
                        {i + 1}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

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
    </>
  );
}
