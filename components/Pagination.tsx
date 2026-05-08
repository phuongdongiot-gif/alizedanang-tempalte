"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pagination({ totalPages, currentPage }: { totalPages: number, currentPage: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12 pb-8">
      {/* Prev Button */}
      <Link 
        href={createPageURL(currentPage - 1)}
        className={`w-10 h-10 flex items-center justify-center rounded-full border border-white/10 transition-colors ${currentPage <= 1 ? 'pointer-events-none opacity-50' : 'hover:bg-white/10 hover:border-white/30 text-white'}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      </Link>

      {/* Page Numbers */}
      {getPageNumbers().map((page, idx) => {
        if (page === '...') {
          return <span key={`dots-${idx}`} className="px-2 text-white/50">...</span>;
        }
        return (
          <Link
            key={page}
            href={createPageURL(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all ${
              page === currentPage
                ? "bg-gold text-jet-black shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                : "border border-transparent hover:bg-white/10 text-white/70 hover:text-white"
            }`}
          >
            {page}
          </Link>
        );
      })}

      {/* Next Button */}
      <Link 
        href={createPageURL(currentPage + 1)}
        className={`w-10 h-10 flex items-center justify-center rounded-full border border-white/10 transition-colors ${currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-white/10 hover:border-white/30 text-white'}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </Link>
    </div>
  );
}
