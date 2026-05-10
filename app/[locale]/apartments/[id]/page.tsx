import React from "react";
import PortalHeader from "../../../../components/PortalHeader";
import PortalFooter from "../../../../components/PortalFooter";
import { getDictionary } from "../../../../dictionaries";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPropertyById } from "../../../../lib/propertyService";
import SinglePropertyMap from "../../../../components/SinglePropertyMap";
import { MapPin } from "lucide-react";

import ApartmentHero from "../../../../components/apartments/ApartmentHero";
import ApartmentOverview from "../../../../components/apartments/ApartmentOverview";
import ApartmentInvestment from "../../../../components/apartments/ApartmentInvestment";
import ApartmentSpecsSidebar from "../../../../components/apartments/ApartmentSpecsSidebar";
import HomeTools from "../../../../components/home/HomeTools";

export async function generateMetadata({ params }: { params: Promise<{ locale: string, id: string }> }): Promise<Metadata> {
  const { locale, id } = await params;
  const apt = await getPropertyById(id, locale);

  if (!apt) {
    return { title: 'Not Found' };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://alizedanang.net";

  return {
    title: `${apt.name} - G-Estate`,
    description: apt.desc,
    openGraph: {
      title: apt.name,
      description: apt.desc,
      images: [{ url: apt.img }],
      url: `${baseUrl}/${locale}/apartments/${id}`,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/apartments/${id}`,
    }
  };
}

export default async function ApartmentDetailPage({ params }: { params: Promise<{ locale: string, id: string }> }) {
  const { locale, id } = await params;
  const dict = getDictionary(locale);
  const apt = await getPropertyById(id, locale);

  if (!apt) {
    notFound();
  }

  const backLinkText = locale === 'vi' ? 'Quay lại danh sách' : 'Back to list';
  const projectLinkText = locale === 'vi' ? 'Xem thông tin dự án' : 'View project details';
  const bookBtnText = locale === 'vi' ? 'Đặt lịch tư vấn' : 'Book a consultation';

  // Tính toán số liệu phân tích đầu tư
  const priceNum = apt.priceNum || 0;
  const areaNum = apt.specs?.areaNum || 1; // avoid division by zero
  const pricePerM2 = Math.round(priceNum / areaNum).toLocaleString('vi-VN');
  const estRent = Math.round(priceNum * 0.005).toLocaleString('vi-VN');
  const estYield = "6.0";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": apt.name,
    "image": apt.img,
    "description": apt.desc,
    "offers": {
      "@type": "Offer",
      "url": `${process.env.NEXT_PUBLIC_BASE_URL || "https://alizedanang.net"}/${locale}/apartments/${id}`,
      "priceCurrency": "VND",
      "price": apt.priceNum || 0,
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <div className="relative w-full min-h-screen text-pearl-white flex flex-col pt-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PortalHeader nav={dict.portal.nav} locale={locale} />

      <ApartmentHero apt={apt} locale={locale} backLinkText={backLinkText} />

      <section className="py-12 flex-1 bg-jet-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-16">

          <div className="lg:col-span-2">
            <ApartmentOverview apt={apt} locale={locale} projectLinkText={projectLinkText} />

            <ApartmentInvestment pricePerM2={pricePerM2} estRent={estRent} estYield={estYield} />

            <div className="mb-8 md:mb-12">
              <h2 className="font-serif text-3xl font-light mb-8 pb-4 border-b border-white/10 flex items-center gap-3">
                <MapPin className="text-gold" size={28} />
                Vị Trí & Bản Đồ
              </h2>
              {apt.coordinates ? (
                <SinglePropertyMap lat={apt.coordinates.lat} lng={apt.coordinates.lng} title={apt.name} price={apt.price} />
              ) : (
                <div className="w-full h-[400px] bg-white/5 flex items-center justify-center rounded-xl border border-white/10">
                  <span className="text-white/40">Chưa có dữ liệu tọa độ bản đồ</span>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <ApartmentSpecsSidebar apt={apt} locale={locale} bookBtnText={bookBtnText} />
          </div>

        </div>
      </section>

      <HomeTools data={dict.portal.tools} locale={locale} />

      <PortalFooter footer={dict.portal.footer} locale={locale} />
    </div>
  );
}
