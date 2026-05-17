import React from 'react';
import Link from 'next/link';

export interface FinanceListCardProps {
  slug: string;
  title: string;
  date: string;
  imageUrl: string;
  locale: string;
}

export default function FinanceListCard({ slug, title, date, imageUrl, locale }: FinanceListCardProps) {
  return (
    <Link href={`/${locale}/finance/${slug}`} className="group flex bg-white/5 border border-white/5 hover:border-gold/30 hover:bg-white/10 transition-all overflow-hidden h-[100px] sm:h-[120px] rounded-lg">
      <div className="w-[120px] sm:w-[160px] h-full shrink-0 relative overflow-hidden">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-700" />
      </div>
      <div className="p-4 flex flex-col justify-center flex-1">
        <h3 className="font-serif text-sm sm:text-base md:text-lg text-white group-hover:text-gold transition-colors line-clamp-2 mb-2 leading-snug" dangerouslySetInnerHTML={{ __html: title }} />
        <span className="text-gold/70 text-[10px] font-bold tracking-widest uppercase">{date}</span>
      </div>
    </Link>
  );
}
