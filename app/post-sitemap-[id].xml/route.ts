import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://alizedanang.net";
  const locales = ['vi', 'en'];
  const page = parseInt(params.id, 10) || 1;

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/main-sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  try {
    const BLOG_API = process.env.NEXT_PUBLIC_WP_API_URL || 'https://atservice.vn/wp-json/wp/v2';
    const res = await fetch(`${BLOG_API}/posts?per_page=100&page=${page}`, { next: { revalidate: 3600 } });
    
    if (res.ok) {
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
