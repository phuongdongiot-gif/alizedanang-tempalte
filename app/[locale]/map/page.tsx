import React from "react";
import PortalHeader from "../../../components/PortalHeader";
import { getDictionary } from "../../../dictionaries";
import { Metadata } from "next";
import MasterMap from "../../../components/MasterMap";
import { fetchGraphQL } from "../../../lib/graphql";

export const metadata: Metadata = {
  title: "Bản Đồ Bất Động Sản - G-Estate",
  description: "Trải nghiệm khám phá các dự án và căn hộ cao cấp qua Bản Đồ Tương Tác Ecosystem."
};

export default async function EcosystemMapPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  // LẤY TOÀN BỘ DỮ LIỆU TỪ GRAPHQL ĐỂ VẼ BẢN ĐỒ
  let projects = [];
  let properties = [];

  const graphqlEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql';

  try {
    const data: any = await fetchGraphQL(`
      query {
        projects {
          id
          name
          hero_data
          lat
          lng
          location {
            name
          }
        }
        properties {
          id
          name
          price
          img_url
          lat
          lng
        }
      }
    `);

    if (data) {
      projects = data.projects || [];
      properties = (data.properties || []).map((p: any) => ({
        ...p,
        coordinates: {
          lat: p.lat || 16.0544,
          lng: p.lng || 108.2022
        }
      }));
    }
  } catch (error) {
    console.warn("Lỗi kéo dữ liệu Ecosystem Map:", error);
  }

  return (
    <div className="relative w-full h-screen bg-[#070A10] text-pearl-white flex flex-col overflow-hidden">
      {/* Absolute Header with Transparent Background */}
      <div className="absolute top-0 left-0 w-full z-10 pointer-events-auto">
        <PortalHeader nav={dict.portal.nav} locale={locale} />
      </div>

      <div className="flex-1 w-full h-full">
        <MasterMap projects={projects} properties={properties} locale={locale} />
      </div>

      {/* Floating Legend / Banner Overlay */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 bg-jet-black/80 backdrop-blur-md border border-white/10 px-8 py-4 rounded-full flex gap-8 items-center shadow-2xl pointer-events-none">
        <div className="flex items-center gap-3">
          <span className="text-xl">⭐</span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-gold text-shadow">Dự Án</span>
        </div>
        <div className="w-[1px] h-4 bg-white/20" />
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-[#E53935] rounded" />
          <span className="text-[10px] uppercase font-bold tracking-widest">Căn Hộ Đơn Bán</span>
        </div>
      </div>
    </div>
  );
}
