import React from 'react';
import Link from 'next/link';

export interface BlogCardProps {
  id: string | number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  imageUrl: string;
  locale: string;
  readMoreBtnText: string;
}

export default function BlogCard({ id, slug, title, excerpt, date, imageUrl, locale, readMoreBtnText }: BlogCardProps) {
  return (
    <div className="group border border-white/5 bg-charcoal/20 overflow-hidden rounded flex flex-col hover:border-gold/30 transition-colors">
      <Link href={`/${locale}/blog/${slug}`} className="block relative aspect-[4/3] overflow-hidden">
        <img loading="lazy" decoding="async" src={imageUrl} className="w-full h-full object-cover filter brightness-[0.7] group-hover:scale-105 transition-transform duration-700" alt={title} />
      </Link>
      <div className="p-3 sm:p-4 md:p-8 flex flex-col flex-1">
        <span className="text-gold text-[8px] sm:text-[10px] uppercase font-bold tracking-widest mb-2 md:mb-4">{date}</span>
        <Link href={`/${locale}/blog/${slug}`} dangerouslySetInnerHTML={{ __html: title }} className="font-serif text-sm sm:text-base md:text-2xl font-light mb-2 md:mb-4 line-clamp-2 hover:text-gold transition-colors" />
        <p className="text-[10px] sm:text-xs md:text-sm font-light text-champagne/60 line-clamp-2 sm:line-clamp-3 mb-4 md:mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: excerpt }}></p>
        <Link href={`/${locale}/blog/${slug}`} className="mt-auto border-b-[3px] border-double border-gold/40 text-center pb-2 pt-2 md:pt-4 text-gold text-[9px] sm:text-[10px] uppercase tracking-widest hover:border-gold hover:text-white transition-colors">
          {readMoreBtnText}
        </Link>
      </div>
    </div>
  );
}
