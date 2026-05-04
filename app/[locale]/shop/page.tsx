import React from "react";
import PortalHeader from "../../../components/PortalHeader";
import PortalFooter from "../../../components/PortalFooter";
import { getDictionary } from "../../../dictionaries";
import { getProducts } from "../../../lib/medusa";
import ShopClient from "./ShopClient";

export const revalidate = 60; // Refresh data every 60 seconds

export default async function ShopPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  let products: any[] = [];
  let isOffline = false;

  try {
    const res = await getProducts({ limit: 100 });
    products = res.products || [];
  } catch (error) {
    console.warn("Lỗi kéo dữ liệu Shop:", error);
    isOffline = true;
  }

  return (
    <div className="min-h-screen bg-[#070A10] text-pearl-white">
      <PortalHeader nav={dict.portal.nav} locale={locale} />
      <section className="relative pt-32 pb-16 px-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto relative">
          <span className="text-gold text-[10px] tracking-[0.4em] uppercase font-light block mb-4">Alize Đà Nẵng</span>
          <h1 className="font-serif text-4xl md:text-5xl font-light tracking-tight mb-4">Cửa Hàng Nội Thất & Dịch Vụ</h1>
          <p className="text-champagne/60 font-light max-w-xl mx-auto text-sm">Khám phá bộ sưu tập nội thất cao cấp và các gói dịch vụ BĐS chuyên nghiệp</p>
        </div>
      </section>

      <ShopClient initialProducts={products} isOffline={isOffline} locale={locale} />
      
      <PortalFooter footer={dict.portal.footer} locale={locale} />
    </div>
  );
}
