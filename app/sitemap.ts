import { MetadataRoute } from 'next';
import { getProperties } from '../lib/propertyService';
import { getProducts } from '../lib/medusa';

export const dynamic = 'force-dynamic';
export const revalidate = 86400; // Cache 24 hours

export async function generateSitemaps() {
  // Chia nhỏ sitemap thành 4 sitemap con để tránh timeout và tối ưu SEO (Sitemap Index)
  return [
    { id: 'static' },
    { id: 'blog' },
    { id: 'shop' },
    { id: 'properties' }
  ];
}

export default async function sitemap({ id }: { id: string }): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://alizedanang.net";
  const locales = ['vi', 'en'];
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. SITEMAP CHỨA CÁC TRANG TĨNH
  if (id === 'static') {
    const staticRoutes = [
      '', '/alize', '/alize/gallery', '/alize/architecture', '/alize/amenities', 
      '/alize/floorplans', '/alize/location', '/alize/services', '/alize/values', 
      '/alize/contact', '/properties', '/blog', '/shop', '/account', '/checkout', '/post-listing', '/tools', '/map', '/projects'
    ];
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
    return sitemapEntries;
  }

  // 2. SITEMAP CHỨA TIN TỨC WORDPRESS
  if (id === 'blog') {
    try {
      const WP_API = process.env.NEXT_PUBLIC_WP_API_URL || 'https://atservice.vn/wp-json/wp/v2';
      // Categories
      let catPage = 1;
      let hasMoreCats = true;
      while (hasMoreCats) {
        const catRes = await fetch(`${WP_API}/categories?hide_empty=true&per_page=100&page=${catPage}`, { next: { revalidate: 3600 } });
        if (catRes.ok) {
          const totalPages = parseInt(catRes.headers.get('x-wp-totalpages') || '1', 10);
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
          if (catPage >= totalPages) {
            hasMoreCats = false;
          } else {
            catPage++;
          }
        } else {
          hasMoreCats = false;
        }
      }

      // Posts
      let postPage = 1;
      let hasMorePosts = true;
      while (hasMorePosts) {
        const postRes = await fetch(`${WP_API}/posts?per_page=100&page=${postPage}`, { next: { revalidate: 3600 } });
        if (postRes.ok) {
          const totalPages = parseInt(postRes.headers.get('x-wp-totalpages') || '1', 10);
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
          if (postPage >= totalPages) {
            hasMorePosts = false;
          } else {
            postPage++;
          }
        } else {
          hasMorePosts = false;
        }
      }
    } catch (error) {
      console.warn("Sitemap: Failed to fetch WP Blogs:", error);
    }
    return sitemapEntries;
  }

  // 3. SITEMAP CHỨA SẢN PHẨM MEDUSA
  if (id === 'shop') {
    try {
      let offset = 0;
      const limit = 100;
      let hasMoreProducts = true;

      while (hasMoreProducts) {
        const medusaData = await getProducts({ limit, offset });
        if (medusaData && Array.isArray(medusaData.products) && medusaData.products.length > 0) {
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
          
          if (medusaData.products.length < limit) {
            hasMoreProducts = false;
          } else {
            offset += limit;
          }
        } else {
          hasMoreProducts = false;
        }
      }
    } catch (error) {
      console.warn("Sitemap: Failed to fetch Medusa Products:", error);
    }
    return sitemapEntries;
  }

  // 4. SITEMAP CHỨA BẤT ĐỘNG SẢN & DỰ ÁN
  if (id === 'properties') {
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
      const projectSubRoutes = ['', '/gallery', '/architecture', '/amenities', '/floorplans', '/location', '/services', '/values', '/contact'];
      uniqueProjectIds.forEach((projectId) => {
        if (projectId === 'alize') return; 
        
        projectSubRoutes.forEach(subRoute => {
          locales.forEach((locale) => {
            sitemapEntries.push({
              url: `${baseUrl}/${locale}/projects/${projectId}${subRoute}`,
              lastModified: new Date(),
              changeFrequency: 'weekly',
              priority: subRoute === '' ? 0.9 : 0.7,
            });
          });
        });
      });
    } catch (error) {
      console.warn("Sitemap: Failed to fetch Properties:", error);
    }
    return sitemapEntries;
  }

  return sitemapEntries;
}
