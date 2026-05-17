"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
}

interface FinanceSidebarProps {
  categories: Category[];
  locale: string;
}

export default function FinanceSidebar({ categories, locale }: FinanceSidebarProps) {
  const pathname = usePathname();

  // Mặc định "Tất cả" sáng lên nếu đang ở trang /finance (chứ không phải /finance/category/...)
  const isAllActive = pathname === `/${locale}/finance` || pathname === `/${locale}/finance/`;

  return (
    <div className="w-full flex flex-col bg-white/5 border border-white/5 rounded-xl p-6 sticky top-32 max-h-[80vh] overflow-y-auto hidden-scrollbar">
      <h3 className="text-xl font-serif text-gold mb-6 pb-4 border-b border-gold/20">
        {locale === 'vi' ? 'Danh mục Tài chính' : 'Finance Categories'}
      </h3>
      
      <ul className="flex flex-col gap-3">
        <li>
          <Link 
            href={`/${locale}/finance`}
            className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
              isAllActive 
                ? 'bg-gold text-jet-black font-semibold' 
                : 'text-pearl-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="text-sm uppercase tracking-wider">{locale === 'vi' ? 'Tất cả tin tức' : 'All Updates'}</span>
          </Link>
        </li>

        {categories.map((cat) => {
          // Bỏ qua Uncategorized (nếu cần) hoặc kiểm tra id
          if (cat.slug === 'uncategorized' || cat.count === 0) return null;

          const catPath = `/${locale}/finance/category/${cat.slug}`;
          const isActive = pathname === catPath || pathname === `${catPath}/`;

          return (
            <li key={cat.id}>
              <Link 
                href={catPath}
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-gold text-jet-black font-semibold' 
                    : 'text-pearl-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-sm uppercase tracking-wider line-clamp-1" dangerouslySetInnerHTML={{ __html: cat.name }} />
                <span className={`text-xs ${isActive ? 'text-jet-black/60' : 'text-white/30'}`}>
                  {cat.count}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      
      <style jsx>{`
        .hidden-scrollbar::-webkit-scrollbar {
          width: 0px;
          background: transparent; /* Chrome/Safari/Webkit */
        }
        .hidden-scrollbar {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none;  /* IE and Edge */
        }
      `}</style>
    </div>
  );
}
