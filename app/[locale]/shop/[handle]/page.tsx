import React from "react";
import { getProductByHandle, getProduct } from "../../../../lib/medusa";
import { getDictionary } from "../../../../dictionaries";
import PortalHeader from "../../../../components/PortalHeader";
import PortalFooter from "../../../../components/PortalFooter";
import ProductDetailClient from "./ProductDetailClient";
import { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string, handle: string }> }): Promise<Metadata> {
  const { handle, locale } = await params;
  const product = await getProductByHandle(handle) || await getProduct(handle);
  
  if (!product) {
    return { title: "Sản phẩm không tồn tại" };
  }

  const title = `${product.title} | Alize Đà Nẵng`;
  const description = product.description || "Mua sắm nội thất cao cấp tại Alize Đà Nẵng.";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://alizedanang.net";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.thumbnail ? [{ url: product.thumbnail }] : [],
      url: `${baseUrl}/${locale}/shop/${handle}`,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/shop/${handle}`,
    }
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ locale: string, handle: string }> }) {
  const { locale, handle } = await params;
  const dict = getDictionary(locale);
  const data = dict.portal;

  // Cố gắng tìm theo handle trước, nếu không có thì tìm theo ID
  let product = await getProductByHandle(handle);
  if (!product) {
    try {
      product = await getProduct(handle);
    } catch (e) {}
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#070A10] text-pearl-white flex flex-col">
        <PortalHeader nav={data.nav} locale={locale} />
        <div className="flex-1 flex items-center justify-center pt-32 pb-24">
          <div className="text-center">
            <h1 className="text-3xl font-serif mb-4">Không tìm thấy sản phẩm</h1>
            <a href={`/${locale}/shop`} className="text-gold border-b border-gold/40 pb-1">Quay lại cửa hàng</a>
          </div>
        </div>
        <PortalFooter footer={data.footer} locale={locale} />
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#070A10] text-pearl-white flex flex-col">
      <PortalHeader nav={data.nav} locale={locale} />
      
      <ProductDetailClient product={product} locale={locale} />

      <PortalFooter footer={data.footer} locale={locale} />
    </div>
  );
}
