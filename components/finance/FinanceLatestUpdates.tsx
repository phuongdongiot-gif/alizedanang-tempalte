"use client";

import React, { useState } from "react";
import FinanceListCard from "./FinanceListCard";
import { Loader2 } from "lucide-react";

interface FinanceLatestUpdatesProps {
  initialPosts: any[];
  categoryId?: number;
  locale: string;
  title: string;
}

export default function FinanceLatestUpdates({ initialPosts, categoryId, locale, title }: FinanceLatestUpdatesProps) {
  const [posts, setPosts] = useState<any[]>(initialPosts);
  const [page, setPage] = useState(1);
  // Assume there's more pages initially if we got at least some posts. We check exactly when fetching.
  const [hasMore, setHasMore] = useState(initialPosts.length >= 6); // Assuming 6 per page initially
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    
    try {
      const nextPage = page + 1;
      let url = `/api/finance/posts?page=${nextPage}&per_page=6`;
      if (categoryId) {
        url += `&category=${categoryId}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const newPosts = data.posts || [];
        
        if (newPosts.length > 0) {
          setPosts((prev) => [...prev, ...newPosts]);
          setPage(nextPage);
          if (nextPage >= data.totalPages) {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more posts:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <section>
      <h2 className="text-2xl lg:text-3xl font-serif text-white mb-8 border-b border-white/10 pb-4">{title}</h2>
      
      {posts.length > 0 ? (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <FinanceListCard 
              key={post.id}
              slug={post.slug}
              title={post.title.rendered}
              date={formatDate(post.date)}
              imageUrl={post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/can-ho-view-bien-my-khe-alize.webp'}
              locale={locale}
            />
          ))}
        </div>
      ) : (
        <div className="py-10 text-center text-champagne/50 italic border border-white/5 rounded-xl bg-white/5">
          {locale === 'vi' ? 'Không có tin tức nào trong danh mục này.' : 'No updates found in this category.'}
        </div>
      )}

      {hasMore && (
        <div className="mt-10 text-center flex justify-center">
          <button 
            onClick={loadMore}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-white/5 border border-gold/30 text-gold text-xs uppercase tracking-widest hover:bg-gold hover:text-jet-black disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? (locale === 'vi' ? 'Đang tải...' : 'Loading...') : (locale === 'vi' ? 'Xem thêm tin tức' : 'Load More Updates')}
          </button>
        </div>
      )}
    </section>
  );
}
