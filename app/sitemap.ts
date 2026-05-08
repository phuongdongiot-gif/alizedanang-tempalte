import { MetadataRoute } from 'next';
import { getProperties } from '../lib/propertyService';
import { getProducts } from '../lib/medusa';
import { fetchGraphQL } from '../lib/graphql';

export const dynamic = 'force-dynamic';
export const revalidate = 86400; // Cache 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://alizedanang.net";
  const locales = ['vi', 'en'];
  
  // 1. Core Static Routes
  const staticRoutes = [
    '', '/alize', '/alize/gallery', '/alize/architecture', '/alize/amenities', 
    '/alize/floorplans', '/alize/location', '/alize/services', '/alize/values', 
    '/alize/contact', '/properties', '/blog', '/shop', '/account', '/checkout', '/post-listing'
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Generate Base Static Entries
  staticRoutes.forEach((route) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : 0.8,
      });
    });
  });

  // 2. Dynamic Blog Posts & Categories from WordPress
  try {
    // Categories
    const catRes = await fetch('https://atservice.vn/wp-json/wp/v2/categories?hide_empty=true', { next: { revalidate: 3600 } });
    if (catRes.ok) {
      const categories = await catRes.json();
      if (Array.isArray(categories)) {
        categories.forEach((cat) => {
          locales.forEach((locale) => {
            sitemapEntries.push({
              url: `${baseUrl}/${locale}/blog/category/${cat.slug}`,
              lastModified: new Date(),
              changeFrequency: 'weekly',
              priority: 0.7,
            });
          });
        });
      }
    }

    // Posts
    const postRes = await fetch('https://atservice.vn/wp-json/wp/v2/posts?per_page=100', { next: { revalidate: 3600 } });
    if (postRes.ok) {
      const posts = await postRes.json();
      if (Array.isArray(posts)) {
        posts.forEach((post) => {
          locales.forEach((locale) => {
            sitemapEntries.push({
              url: `${baseUrl}/${locale}/blog/${post.slug}`,
              lastModified: new Date(post.modified || post.date),
              changeFrequency: 'monthly',
              priority: 0.8,
            });
          });
        });
      }
    }
  } catch (error) {
    console.warn("Sitemap: Failed to fetch WP Blogs/Categories:", error);
  }

  // 3. Dynamic Products from Medusa
  try {
    const medusaData = await getProducts({ limit: 100 });
    if (medusaData && Array.isArray(medusaData.products)) {
      medusaData.products.forEach((product: any) => {
        locales.forEach((locale) => {
          sitemapEntries.push({
            url: `${baseUrl}/${locale}/shop/${product.handle}`,
            lastModified: new Date(product.updated_at || new Date()),
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        });
      });
    }
  } catch (error) {
    console.warn("Sitemap: Failed to fetch Medusa Products:", error);
  }

  // 4. Dynamic Properties & Projects from Backend GraphQL
  try {
    const properties = await getProperties('vi'); 
    const uniqueProjectIds = new Set<string>();

    if (Array.isArray(properties) && properties.length > 0) {
      properties.forEach((prop) => {
        if (prop.projectId) uniqueProjectIds.add(prop.projectId);
        locales.forEach((locale) => {
          sitemapEntries.push({
            url: `${baseUrl}/${locale}/apartments/${prop.id}`,
            lastModified: new Date(), 
            changeFrequency: 'daily',
            priority: 0.8,
          });
        });
      });
    }

    // Projects
    uniqueProjectIds.forEach((projectId) => {
      // Bỏ qua 'alize' vì đã khai báo tĩnh
      if (projectId === 'alize') return; 
      locales.forEach((locale) => {
        sitemapEntries.push({
          url: `${baseUrl}/${locale}/projects/${projectId}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.9,
        });
      });
    });
  } catch (error) {
    console.warn("Sitemap: Failed to fetch Properties:", error);
  }

  return sitemapEntries;
}
