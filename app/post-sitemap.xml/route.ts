import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://alizedanang.net";
  const locales = ['vi', 'en'];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/main-sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  try {
    // 1. Fetch Blog Posts
    const BLOG_API = process.env.NEXT_PUBLIC_WP_API_URL || 'https://atservice.vn/wp-json/wp/v2';
    let blogPage = 1;
    let hasMoreBlogs = true;

    while (hasMoreBlogs) {
      const res = await fetch(`${BLOG_API}/posts?per_page=100&page=${blogPage}`, { next: { revalidate: 3600 } });
      if (res.ok) {
        const totalPages = parseInt(res.headers.get('x-wp-totalpages') || '1', 10);
        const posts = await res.json();
        if (Array.isArray(posts)) {
          posts.forEach((post) => {
            const lastMod = new Date(post.modified || post.date).toISOString();
            locales.forEach((locale) => {
              xml += `
  <url>
    <loc>${baseUrl}/${locale}/blog/${post.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
            });
          });
        }
        if (blogPage >= totalPages) hasMoreBlogs = false;
        else blogPage++;
      } else {
        hasMoreBlogs = false;
      }
    }

    // 2. Fetch Finance Posts
    const FINANCE_API = process.env.NEXT_PUBLIC_FINANCE_WP_API_URL || 'https://atservice.com.vn/wp-json/wp/v2';
    let financePage = 1;
    let hasMoreFinance = true;

    while (hasMoreFinance) {
      const res = await fetch(`${FINANCE_API}/posts?per_page=100&page=${financePage}`, { next: { revalidate: 3600 } });
      if (res.ok) {
        const totalPages = parseInt(res.headers.get('x-wp-totalpages') || '1', 10);
        const posts = await res.json();
        if (Array.isArray(posts)) {
          posts.forEach((post) => {
            const lastMod = new Date(post.modified || post.date).toISOString();
            locales.forEach((locale) => {
              xml += `
  <url>
    <loc>${baseUrl}/${locale}/finance/${post.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
            });
          });
        }
        if (financePage >= totalPages) hasMoreFinance = false;
        else financePage++;
      } else {
        hasMoreFinance = false;
      }
    }

  } catch (error) {
    console.warn("Failed to fetch Posts for sitemap", error);
  }

  xml += `\n</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate',
    },
  });
}
