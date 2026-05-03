import { MetadataRoute } from 'next';
import { getProperties } from '../lib/propertyService';

export const dynamic = 'force-dynamic';
export const revalidate = 86400; // Cache the sitemap for 24 hours (86400 seconds) to ensure high speed & save resources

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://alizedanang.net";
  const locales = ['vi', 'en'];
  
  // 1. Core Static Routes
  const staticRoutes = [
    '', // Portal home
    '/alize',
    '/alize/gallery',
    '/alize/architecture',
    '/alize/amenities',
    '/alize/floorplans',
    '/alize/location',
    '/alize/services',
    '/alize/values',
    '/alize/contact',
    '/properties',
    '/blog',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Generate Base Static Entires
  staticRoutes.forEach((route) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : route === '/alize' ? 0.9 : 0.8,
      });
    });
  });

  // 2. Dynamic Blog Routes from WordPress
  try {
    const res = await fetch('https://atservice.vn/wp-json/wp/v2/posts?per_page=100', { next: { revalidate: 3600 } });
    if (res.ok) {
      const posts = await res.json();
      if (Array.isArray(posts)) {
        posts.forEach((post) => {
          locales.forEach((locale) => {
            sitemapEntries.push({
              url: `${baseUrl}/${locale}/blog/${post.slug}`,
              lastModified: new Date(post.modified || post.date),
              changeFrequency: 'monthly',
              priority: 0.7,
            });
          });
        });
      }
    }
  } catch (error) {
    console.warn("Sitemap: Failed to fetch WP Blogs:", error);
  }

  // 3. Dynamic Property Routes from Backend 
  try {
    // get properties from unified service
    const properties = await getProperties('vi'); 
    
    if (Array.isArray(properties) && properties.length > 0) {
      properties.forEach((prop) => {
        locales.forEach((locale) => {
          sitemapEntries.push({
            url: `${baseUrl}/${locale}/apartments/${prop.id}`, // Detail routing
            lastModified: new Date(), 
            changeFrequency: 'daily',
            priority: 0.8,
          });
        });
      });
    }
  } catch (error) {
    console.warn("Sitemap: Failed to fetch Properties:", error);
  }

  return sitemapEntries;
}
