"use client";
import React, { useState, useMemo } from "react";
import { useStore } from "../../../lib/store-context";
import { ShoppingBag, Search, Plus, SlidersHorizontal, X, Star } from "lucide-react";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

interface Product {
  id: string;
  title: string;
  handle?: string;
  description: string;
  thumbnail: string | null;
  variants: { id: string; title: string; prices: { amount: number; currency_code: string }[] }[];
  categories: { id: string; name: string }[];
}

function ProductCard({ product, onAdd, locale }: { product: Product; onAdd: (product: Product, variant: any) => void; locale: string }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]);
  const price = selectedVariant?.prices?.find((p: any) => p.currency_code === "vnd");
  
  // Mockup rating & best seller based on ID for demo purposes
  const isBestSeller = product.id.charCodeAt(product.id.length - 1) % 3 === 0;

  return (
    <div className="group bg-[#0A0C10] border border-white/5 hover:border-gold/30 rounded-2xl overflow-hidden transition-all flex flex-col h-full relative">
      {isBestSeller && (
        <div className="absolute top-3 left-3 z-10 bg-gold text-jet-black text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded shadow-lg">
          Bán Chạy
        </div>
      )}
      <a href={`/${locale}/shop/${product.handle || product.id}`} className="relative aspect-[4/3] bg-white/5 block overflow-hidden">
        {product.thumbnail ? (
          <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={48} className="text-white/10" /></div>
        )}
      </a>
      <div className="p-3 sm:p-5 flex flex-col flex-1">
        {/* Rating Mock */}
        <div className="flex items-center gap-1 mb-2">
          {[1,2,3,4,5].map(i => <Star key={i} size={10} className={`sm:w-3 sm:h-3 ${i <= 4 ? "text-gold fill-gold" : "text-white/20"}`} />)}
          <span className="text-[9px] sm:text-[10px] text-white/40 ml-1">(12)</span>
        </div>

        <a href={`/${locale}/shop/${product.handle || product.id}`}>
          <h3 className="text-white font-medium text-xs sm:text-sm line-clamp-2 mb-2 group-hover:text-gold transition-colors">{product.title}</h3>
        </a>
        
        {product.categories?.[0] && (
          <p className="text-[9px] sm:text-[10px] text-champagne/60 uppercase tracking-widest mb-2 sm:mb-3">
            {product.categories[0].name}
          </p>
        )}

        {product.variants?.length > 1 && (
          <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2 sm:mb-3">
            {product.variants.map((v: any) => (
              <button key={v.id} onClick={() => setSelectedVariant(v)}
                className={`text-[9px] sm:text-[10px] px-2 py-1 sm:px-2.5 rounded border transition-colors ${selectedVariant?.id === v.id ? "border-gold/50 bg-gold/10 text-gold" : "border-white/10 text-white/40 hover:border-white/30"}`}>
                {v.title}
              </button>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between pt-3 sm:pt-4 border-t border-white/5">
          <span className="text-gold font-semibold text-xs sm:text-base">{price ? formatPrice(price.amount) : "Liên hệ"}</span>
          <button onClick={() => onAdd(product, selectedVariant)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gold/10 border border-gold/30 text-gold hover:bg-gold hover:text-jet-black transition-all flex items-center justify-center">
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ShopClient({ initialProducts, categories, isOffline, locale }: { initialProducts: Product[], categories?: any[], isOffline: boolean, locale: string }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const { addToCart } = useStore();

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, sortOrder]);

  const handleAdd = (product: Product, variant: any) => {
    if (!variant) variant = product.variants?.[0];
    if (!variant) return;
    const price = variant?.prices?.find((p: any) => p.currency_code === "vnd");
    addToCart(variant.id, 1, { 
      title: product.title, 
      thumbnail: product.thumbnail, 
      unit_price: price?.amount || 0, 
      variant_title: variant?.title || "" 
    });
  };

  const filteredAndSorted = useMemo(() => {
    let result = initialProducts.filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()));
    
    if (selectedCategory) {
      result = result.filter(p => p.categories?.some(c => c.id === selectedCategory));
    }

    if (sortOrder === "price_asc") {
      result.sort((a, b) => {
        const pA = a.variants?.[0]?.prices?.find(p => p.currency_code === "vnd")?.amount || 0;
        const pB = b.variants?.[0]?.prices?.find(p => p.currency_code === "vnd")?.amount || 0;
        return pA - pB;
      });
    } else if (sortOrder === "price_desc") {
      result.sort((a, b) => {
        const pA = a.variants?.[0]?.prices?.find(p => p.currency_code === "vnd")?.amount || 0;
        const pB = b.variants?.[0]?.prices?.find(p => p.currency_code === "vnd")?.amount || 0;
        return pB - pA;
      });
    }

    return result;
  }, [initialProducts, search, selectedCategory, sortOrder]);

  return (
    <>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 w-full md:max-w-md bg-black/20 rounded-lg px-4 py-2">
            <Search size={16} className="text-white/30" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..." className="bg-transparent outline-none text-sm text-white flex-1 placeholder:text-white/25" />
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={() => setIsFilterOpen(true)} className="md:hidden flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-lg py-2 text-sm text-white">
              <SlidersHorizontal size={16} /> Lọc & Sắp xếp
            </button>
            <div className="hidden md:flex items-center gap-3">
              <span className="text-xs text-white/40 uppercase tracking-widest">Sắp xếp:</span>
              <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="bg-black/20 border border-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-gold/50">
                <option value="newest">Mới nhất</option>
                <option value="price_asc">Giá: Thấp đến Cao</option>
                <option value="price_desc">Giá: Cao đến Thấp</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-24 flex gap-10">
        {/* Desktop Sidebar Filter */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-32">
            <h3 className="text-lg font-serif text-white mb-6 border-b border-white/10 pb-4">Danh mục</h3>
            <ul className="space-y-3">
              <li>
                <button onClick={() => setSelectedCategory(null)} className={`text-sm transition-colors ${!selectedCategory ? 'text-gold font-medium' : 'text-white/50 hover:text-white'}`}>
                  Tất cả sản phẩm
                </button>
              </li>
              {categories?.map(c => (
                <li key={c.id}>
                  <button onClick={() => setSelectedCategory(c.id)} className={`text-sm transition-colors ${selectedCategory === c.id ? 'text-gold font-medium' : 'text-white/50 hover:text-white'}`}>
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile Filter Drawer (Bottom Sheet) */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-[150] md:hidden">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
            <div className="absolute bottom-0 left-0 w-full bg-[#0D0D0D] border-t border-white/10 rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-serif text-white">Lọc & Sắp xếp</h3>
                <button onClick={() => setIsFilterOpen(false)} className="text-white/40 hover:text-white"><X size={24} /></button>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-white/60 mb-3 uppercase tracking-widest">Sắp xếp</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setSortOrder("newest")} className={`py-2 text-sm rounded-lg border ${sortOrder === "newest" ? "bg-gold/10 border-gold/50 text-gold" : "bg-white/5 border-white/10 text-white/50"}`}>Mới nhất</button>
                  <button onClick={() => setSortOrder("price_asc")} className={`py-2 text-sm rounded-lg border ${sortOrder === "price_asc" ? "bg-gold/10 border-gold/50 text-gold" : "bg-white/5 border-white/10 text-white/50"}`}>Giá tăng dần</button>
                  <button onClick={() => setSortOrder("price_desc")} className={`py-2 text-sm rounded-lg border ${sortOrder === "price_desc" ? "bg-gold/10 border-gold/50 text-gold" : "bg-white/5 border-white/10 text-white/50"}`}>Giá giảm dần</button>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-white/60 mb-3 uppercase tracking-widest">Danh mục</h4>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setSelectedCategory(null)} className={`px-4 py-2 text-sm rounded-full border ${!selectedCategory ? "bg-white text-black border-white" : "bg-white/5 border-white/10 text-white/60"}`}>
                    Tất cả
                  </button>
                  {categories?.map(c => (
                    <button key={c.id} onClick={() => setSelectedCategory(c.id)} className={`px-4 py-2 text-sm rounded-full border ${selectedCategory === c.id ? "bg-white text-black border-white" : "bg-white/5 border-white/10 text-white/60"}`}>
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => setIsFilterOpen(false)} className="w-full bg-gold text-jet-black py-4 rounded-xl font-bold uppercase tracking-widest text-sm">
                Xem {filteredAndSorted.length} kết quả
              </button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          {isOffline ? (
            <div className="text-center py-24 border border-white/5 rounded-2xl w-full">
              <ShoppingBag size={56} className="text-white/10 mx-auto mb-4" />
              <h3 className="text-white/50 font-serif text-xl mb-2">Cửa hàng đang offline</h3>
              <p className="text-white/30 text-sm mb-4">Khởi động Medusa để xem sản phẩm</p>
              <code className="bg-white/5 text-green-400 text-xs px-4 py-2 rounded block max-w-sm mx-auto">cd medusa\apps\backend && npx medusa develop</code>
            </div>
          ) : filteredAndSorted.length === 0 ? (
            <div className="text-center py-12 md:py-10 md:py-12 text-white/30 w-full border border-dashed border-white/10 rounded-2xl">
              Chưa tìm thấy sản phẩm nào phù hợp.
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-white/40 text-sm">{filteredAndSorted.length} sản phẩm</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                {filteredAndSorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(p => <ProductCard key={p.id} product={p} onAdd={handleAdd} locale={locale} />)}
              </div>
              
              {/* Pagination */}
              {Math.ceil(filteredAndSorted.length / itemsPerPage) > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/5 hover:text-white disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                  >
                    &lt;
                  </button>
                  
                  {Array.from({ length: Math.ceil(filteredAndSorted.length / itemsPerPage) }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`w-10 h-10 rounded-full text-sm transition-colors ${
                        currentPage === idx + 1 
                          ? "bg-gold text-jet-black font-bold" 
                          : "border border-white/10 text-white/60 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredAndSorted.length / itemsPerPage)))}
                    disabled={currentPage === Math.ceil(filteredAndSorted.length / itemsPerPage)}
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/5 hover:text-white disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                  >
                    &gt;
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
