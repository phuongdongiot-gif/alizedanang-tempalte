"use client";
import React, { useState } from "react";
import { useStore } from "../../../../lib/store-context";
import { ChevronRight, Heart, Minus, Plus, ShoppingBag, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";

interface ProductDetailClientProps {
  product: any;
  locale: string;
}

export default function ProductDetailClient({ product, locale }: ProductDetailClientProps) {
  const { addToCart } = useStore();
  const [selectedImage, setSelectedImage] = useState(product.thumbnail || product.images?.[0]?.url || "");
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]);
  const [quantity, setQuantity] = useState(1);

  const price = selectedVariant?.prices?.find((p: any) => p.currency_code === "vnd");
  const formattedPrice = price 
    ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price.amount) 
    : "Liên hệ";

  const handleAddToCart = () => {
    addToCart({
      title: product.title,
      thumbnail: product.thumbnail || product.images?.[0]?.url,
      quantity,
      unit_price: price?.amount || 0,
      variant_title: selectedVariant?.title || ""
    });
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 pb-24 text-pearl-white">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-white/40 mb-8 font-light">
        <Link href={`/${locale}`} className="hover:text-gold transition-colors">Trang chủ</Link>
        <ChevronRight size={12} />
        <Link href={`/${locale}/shop`} className="hover:text-gold transition-colors">Cửa hàng</Link>
        <ChevronRight size={12} />
        <span className="text-white truncate">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Left Column: Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-white/5 border border-white/5 flex items-center justify-center relative">
            {selectedImage ? (
              <img src={selectedImage} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <ShoppingBag size={64} className="text-white/10" />
            )}
            {product.categories?.[0] && (
              <span className="absolute top-4 left-4 bg-gold text-jet-black text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded shadow-lg">
                {product.categories[0].name}
              </span>
            )}
          </div>
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
              {product.images.map((img: any) => (
                <button 
                  key={img.id} 
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === img.url ? 'border-gold opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  <img src={img.url} className="w-full h-full object-cover" alt="thumbnail" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info */}
        <div className="flex flex-col">
          <h1 className="font-serif text-3xl md:text-4xl text-white font-light tracking-tight mb-4">
            {product.title}
          </h1>
          <p className="text-gold text-2xl font-serif mb-6">{formattedPrice}</p>
          
          <div className="prose prose-invert prose-sm text-white/50 mb-8">
            {product.description && (
              <div 
                className="prose prose-sm prose-invert max-w-none text-white/60"
                dangerouslySetInnerHTML={{ __html: product.description }} 
              />
            )}
          </div>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-8 border-t border-white/5 pt-6">
              <h3 className="text-white text-sm font-medium mb-3">Tùy chọn:</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: any) => (
                  <button 
                    key={v.id} 
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 text-sm rounded-lg border transition-all ${selectedVariant?.id === v.id ? 'border-gold bg-gold/10 text-gold' : 'border-white/10 text-white/50 hover:border-white/30'}`}
                  >
                    {v.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            {/* Quantity */}
            <div className="flex items-center border border-white/10 rounded-lg p-1 bg-white/5 w-fit">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center text-white text-sm">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-gold text-jet-black py-3 px-8 rounded-lg font-bold text-sm tracking-widest uppercase hover:bg-gold/90 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag size={18} /> Thêm Vào Giỏ
            </button>
            
            <button className="w-14 h-14 flex items-center justify-center rounded-lg border border-white/10 text-white/50 hover:text-gold hover:border-gold transition-all">
              <Heart size={20} />
            </button>
          </div>

          {/* Highlights */}
          <div className="space-y-4 border-t border-white/5 pt-8">
            <div className="flex items-center gap-3 text-sm text-white/50">
              <ShieldCheck size={18} className="text-gold" /> Bảo hành chính hãng 12 tháng
            </div>
            <div className="flex items-center gap-3 text-sm text-white/50">
              <Truck size={18} className="text-gold" /> Miễn phí vận chuyển toàn quốc
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
