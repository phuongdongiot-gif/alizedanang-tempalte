import React from "react";
import PortalHeader from "../../../../components/PortalHeader";
import PortalFooter from "../../../../components/PortalFooter";
import { getDictionary } from "../../../../dictionaries";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://alizedanang.net";

  try {
    const res = await fetch(`https://atservice.vn/wp-json/wp/v2/posts?slug=${slug}&_embed=1`);
    const posts = await res.json();
    if (posts && posts.length > 0) {
      const p = posts[0];
      const title = p.title.rendered.replace(/<[^>]+>/g, '');
      const desc = p.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 150);
      const img = p._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/can-ho-view-bien-my-khe-alize.webp';
      return {
        title: `${title} - G-Estate`,
        description: desc,
        openGraph: { title, description: desc, images: [{ url: img }], url: `${baseUrl}/${locale}/blog/${slug}` },
        alternates: { canonical: `${baseUrl}/${locale}/blog/${slug}` }
      };
    }
  } catch (err) {}
  return { title: "Not Found" };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  const dict = getDictionary(locale);

  let post = null;
  try {
    const res = await fetch(`https://atservice.vn/wp-json/wp/v2/posts?slug=${slug}&_embed=1`, {
      next: { revalidate: 3600 }
    });
    const posts = await res.json();
    if (posts && posts.length > 0) {
      post = posts[0];
    }
  } catch (error) {
    console.error("Lỗi kéo tin tức chi tiết WP:", error);
  }

  if (!post) {
    notFound();
  }

  const title = post.title.rendered;
  const content = post.content.rendered;
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/can-ho-view-bien-my-khe-alize.webp';
  const date = new Date(post.date).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="relative w-full min-h-screen bg-[#070A10] text-pearl-white flex flex-col pt-32">
      <PortalHeader nav={dict.portal.nav} locale={locale} />
      
      <div className="max-w-[800px] mx-auto px-6 py-16 w-full flex-1">
        <span className="text-gold text-[10px] uppercase font-bold tracking-widest mb-6 block text-center">{date}</span>
        <h1 className="font-serif text-3xl md:text-5xl font-light mb-12 tracking-tight text-center leading-tight" dangerouslySetInnerHTML={{ __html: title }} />
        
        <div className="w-full aspect-[16/9] mb-16 overflow-hidden rounded border border-white/5 bg-charcoal/20">
          {/* LCP Optimization with fetchPriority */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img fetchPriority="high" loading="eager" decoding="sync" src={featuredMedia} className="w-full h-full object-cover filter brightness-[0.8]" alt={title.replace(/<[^>]+>/g, '')} />
        </div>

        {/* CONTENT */}
        <div className="mt-12 text-champagne/80 font-light leading-loose text-lg flex flex-col gap-6 blog-content wp-content" dangerouslySetInnerHTML={{ __html: content }} />
      </div>

      {/* JSON-LD FOR SEO AND AIO (Bing & Google) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": title.replace(/<[^>]+>/g, ''),
            "image": [featuredMedia],
            "datePublished": post.date,
            "dateModified": post.modified || post.date,
            "author": {
              "@type": "Organization",
              "name": "G-Estate",
              "url": "https://alizedanang.net"
            },
            "publisher": {
              "@type": "Organization",
              "name": "G-Estate",
              "logo": {
                "@type": "ImageObject",
                "url": "https://alizedanang.net/images/sky-pool-alize-da-nang.webp"
              }
            },
            "description": post.excerpt?.rendered?.replace(/<[^>]+>/g, '').substring(0, 150)
          })
        }}
      />

      <PortalFooter footer={dict.portal.footer} locale={locale} />
    </div>
  );
}
