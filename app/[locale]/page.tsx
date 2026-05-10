import React from "react";
import PortalHeader from "../../components/PortalHeader";
import PortalFooter from "../../components/PortalFooter";
import { getDictionary } from "../../dictionaries";
import { Metadata } from "next";
import { fetchGraphQL } from "../../lib/graphql";
import { getProperties } from "../../lib/propertyService";

import HomeHero from "../../components/home/HomeHero";
import HomeFeaturedApartments from "../../components/home/HomeFeaturedApartments";
import HomeFeaturedProjects from "../../components/home/HomeFeaturedProjects";
import HomeLocations from "../../components/home/HomeLocations";
import HomeLatestProperties from "../../components/home/HomeLatestProperties";
import HomeProductsCarousel from "../../components/home/HomeProductsCarousel";
import HomeCategoryProducts from "../../components/home/HomeCategoryProducts";
import HomeTools from "../../components/home/HomeTools";
import HomeNews from "../../components/home/HomeNews";

export const revalidate = 10; // Refresh data every 10 seconds

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const portalSeo = dict.portal.seo;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://alizedanang.net";

  return {
    title: portalSeo.title,
    description: portalSeo.description,
    keywords: portalSeo.keywords,
    openGraph: {
      title: portalSeo.title,
      description: portalSeo.description,
      images: [{ url: portalSeo.ogImage }],
      url: `${baseUrl}/${locale}`,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
    }
  };
}

export default async function PortalHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const data = dict.portal;

  let dynamicProjects = [];
  let wpPosts = [];

  // Fetch recent properties for the new section
  const recentProperties = await getProperties(locale);
  const featuredProperties = recentProperties.slice(0, 12); // Fetch up to 12 to enable carousel
  const featuredApartments = recentProperties.filter(p => p.propertyCategory === 'apartments').slice(0, 12);

  let shopProducts: any[] = [];
  let shopCategories: any[] = [];
  try {
    const { getProducts, getProductCategories } = await import('../../lib/medusa');
    const [prodRes, catRes] = await Promise.all([
      getProducts({ limit: 20 }), // Tăng limit để có đủ cho filter
      getProductCategories()
    ]);
    shopProducts = prodRes.products || [];
    shopCategories = catRes.product_categories || [];

    if (shopCategories.length > 0) {
      await Promise.all(shopCategories.map(async (cat) => {
        try {
          const cpRes = await getProducts({ category_id: [cat.id], limit: 20 });
          if (cpRes.products) {
            cpRes.products.forEach((cp: any) => {
              const p = shopProducts.find(prod => prod.id === cp.id);
              if (p) {
                if (!p.categories) p.categories = [];
                if (!p.categories.some((existing: any) => existing.id === cat.id)) {
                  p.categories.push({ id: cat.id, name: cat.name });
                }
              }
            });
          }
        } catch (e) {}
      }));
    }

  } catch (error) {
    console.warn("Lỗi kéo dữ liệu Shop:", error);
  }

  try {
    const graphData: any = await fetchGraphQL(`
      query {
        projects {
          id
          name
          slug
          hero_data
          location {
            name
          }
        }
      }
    `);
    if (graphData?.projects) dynamicProjects = graphData.projects;
  } catch (error) {
    console.warn("Lỗi kéo dữ liệu Project:", error);
  }

  try {
    const WP_API = process.env.NEXT_PUBLIC_WP_API_URL || 'https://atservice.vn/wp-json/wp/v2';
    const wpRes = await fetch(`${WP_API}/posts?per_page=3&_embed`, { next: { revalidate: 3600 } });
    if (wpRes.ok) wpPosts = await wpRes.json();
  } catch (error) {
    console.warn("Lỗi kéo dữ liệu News:", error);
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#070A10] text-pearl-white flex flex-col">
      <PortalHeader nav={data.nav} locale={locale} />
      
      <HomeHero data={data.hero} locale={locale} />
      
      <HomeFeaturedApartments featuredApartments={featuredApartments} locale={locale} />
      
      <HomeFeaturedProjects dynamicProjects={dynamicProjects} data={data.featuredProjects} locale={locale} />
      
      <HomeLocations data={data.locationsByCity} locale={locale} />
      
      <HomeLatestProperties featuredProperties={featuredProperties} locale={locale} />
      
      <HomeProductsCarousel shopProducts={shopProducts.slice(0, 8)} locale={locale} />
      
      <HomeCategoryProducts categories={shopCategories} products={shopProducts} locale={locale} />

      <HomeNews wpPosts={wpPosts} data={data.news} locale={locale} />

      <HomeTools data={data.tools} locale={locale} />

      <PortalFooter footer={data.footer} locale={locale} />
    </div>
  );
}
