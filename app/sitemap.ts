import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://alizedanang.net";
  const locales = ['vi', 'en'];
  
  const routes = [
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
    '/blog',
    '/blog/thi-truong-bds-da-nang-don-song-dau-tu-moi',
    '/blog/le-ra-mat-du-an-alize-residence'
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  routes.forEach((route) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route.includes('/blog/') ? 'yearly' : 'weekly',
        priority: route === '' ? 1 : route === '/alize' ? 0.9 : 0.8,
      });
    });
  });

  return sitemapEntries;
}
