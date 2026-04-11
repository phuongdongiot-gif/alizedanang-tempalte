import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloorPlans from "@/components/FloorPlans";
import { getDictionary } from "@/dictionaries";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string, projectSlug: string }> }): Promise<Metadata> {
  const { locale, projectSlug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://alizedanang.net";
  return {
    title: "Mặt Bằng Căn Hộ - ALIZE",
    description: "Khám phá mặt bằng tổ hợp căn hộ cao cấp ALIZE Đà Nẵng.",
    alternates: { canonical: `${baseUrl}/\/projects/\/floorplans` }
  };
}

export default async function FloorPlansPage({ params }: { params: Promise<{ locale: string, projectSlug: string }> }) {
  const { locale, projectSlug } = await params;
  const dict = getDictionary(locale);

  return (
    <div className="relative w-full overflow-hidden bg-jet-black text-pearl-white">
      <Header nav={dict.nav} locale={locale} projectSlug={projectSlug} />
      <div className="pt-32">
        <FloorPlans data={dict.floorplans} />
      </div>
      <Footer data={dict.footer} />
    </div>
  );
}
