import React from 'react';
import Link from 'next/link';

export interface FinanceHeroCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  imageUrl: string;
  locale: string;
  categoryName?: string;
}

export default function FinanceHeroCard({ slug, title, excerpt, date, imageUrl, locale, categoryName = 'Tiêu Điểm' }: FinanceHeroCardProps) {
  return (
    <Link href={`/${locale}/finance/${slug}`} className="relative block w-full h-[500px] lg:h-[600px] rounded-xl overflow-hidden group border border-white/10">
      <div className="absolute inset-0 bg-gradient-to-t from-[#070A10] via-[#070A10]/60 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-90" />
      <img src={imageUrl} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      
      <div className="absolute bottom-0 left-0 w-full p-6 lg:p-12 z-20 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="bg-gold text-jet-black text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded">{categoryName}</span>
          <span className="text-white/70 text-xs font-light">{date}</span>
        </div>
        <h2 className="text-3xl lg:text-5xl font-serif text-white leading-tight line-clamp-3 group-hover:text-gold transition-colors" dangerouslySetInnerHTML={{ __html: title }} />
        <p className="text-white/80 font-light text-sm lg:text-base line-clamp-2 max-w-3xl" dangerouslySetInnerHTML={{ __html: excerpt }} />
      </div>
    </Link>
  );
}
