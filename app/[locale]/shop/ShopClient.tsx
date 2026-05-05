"use client";
import React, { useState } from "react";
import { useStore } from "../../../lib/store-context";
import { ShoppingBag, Search, Plus } from "lucide-react";

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

  return (
    <div className="group bg-[#0A0C10] border border-white/5 hover:border-gold/30 rounded-2xl overflow-hidden transition-all flex flex-col">
      <a href={`/${locale}/shop/${product.handle || product.id}`} className="relative aspect-[4/3] bg-white/5 block">
        {product.thumbnail ? (
          <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={48} className="text-white/10" /></div>
        )}
        {product.categories?.[0] && (
          <span className="absolute top-3 left-3 bg-gold text-jet-black text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
            {product.categories[0].name}
          </span>
        )}
      </a>
      <div className="p-5 flex flex-col flex-1">
        <a href={`/${locale}/shop/${product.handle || product.id}`}>
          <h3 className="text-white font-medium text-sm line-clamp-2 mb-2 group-hover:text-gold transition-colors">{product.title}</h3>
        </a>
        {product.description && (
          <div 
            className="text-white/40 text-xs line-clamp-2 mb-3"
            dangerouslySetInnerHTML={{ __html: product.description }} 
          />
        )}
        {product.variants?.length > 1 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.variants.map((v: any) => (
              <button key={v.id} onClick={() => setSelectedVariant(v)}
                className={`text-[10px] px-2.5 py-1 rounded border transition-colors ${selectedVariant?.id === v.id ? "border-gold/50 bg-gold/10 text-gold" : "border-white/10 text-white/40 hover:border-white/30"}`}>
                {v.title}
              </button>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/5">
          <span className="text-gold font-semibold">{price ? formatPrice(price.amount) : "Liên hệ"}</span>
          <button onClick={() => onAdd(product, selectedVariant)}
            className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/30 text-gold hover:bg-gold hover:text-jet-black transition-all flex items-center justify-center">
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ShopClient({ initialProducts, isOffline, locale }: { initialProducts: Product[], isOffline: boolean, locale: string }) {
  const [search, setSearch] = useState("");
  const { addToCart } = useStore();

  const filtered = initialProducts.filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = (product: Product, variant: any) => {
    const price = variant?.prices?.find((p: any) => p.currency_code === "vnd");
    addToCart({ title: product.title, thumbnail: product.thumbnail, quantity: 1, unit_price: price?.amount || 0, variant_title: variant?.title || "" });
  };

  return (
    <>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-2 max-w-md">
          <Search size={16} className="text-white/30" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..." className="bg-transparent outline-none text-sm text-white flex-1 placeholder:text-white/25" />
        </div>
      </div>

      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-24">
        {isOffline ? (
          <div className="text-center py-24 border border-white/5 rounded-2xl">
            <ShoppingBag size={56} className="text-white/10 mx-auto mb-4" />
            <h3 className="text-white/50 font-serif text-xl mb-2">Cửa hàng đang offline</h3>
            <p className="text-white/30 text-sm mb-4">Khởi động Medusa để xem sản phẩm</p>
            <code className="bg-white/5 text-green-400 text-xs px-4 py-2 rounded block max-w-sm mx-auto">cd medusa\apps\backend && npx medusa develop</code>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-white/30">Chưa có sản phẩm nào</div>
        ) : (
          <>
            <p className="text-white/40 text-sm mb-6">{filtered.length} sản phẩm</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(p => <ProductCard key={p.id} product={p} onAdd={handleAdd} locale={locale} />)}
            </div>
          </>
        )}
      </section>
    </>
  );
}
