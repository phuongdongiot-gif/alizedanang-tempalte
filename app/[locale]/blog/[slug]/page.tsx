import React from "react";
import PortalHeader from "../../../../components/PortalHeader";
import PortalFooter from "../../../../components/PortalFooter";
import { getDictionary } from "../../../../dictionaries";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const dict = getDictionary(locale);
  const article = dict.blog.articles.find(a => a.slug === slug);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://alizedanang.net";

  if (!article) return { title: "Not Found" };

  return {
    title: `${article.title} - G-Estate`,
    description: article.desc,
    openGraph: {
      title: article.title,
      description: article.desc,
      images: [{ url: article.img }],
      url: `${baseUrl}/${locale}/blog/${slug}`,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/blog/${slug}`,
    }
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  const dict = getDictionary(locale);
  const article = dict.blog.articles.find(a => a.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="relative w-full min-h-screen bg-[#070A10] text-pearl-white flex flex-col pt-32">
      <PortalHeader nav={dict.portal.nav} locale={locale} />
      
      <div className="max-w-[800px] mx-auto px-6 py-16 w-full flex-1">
        <span className="text-gold text-[10px] uppercase font-bold tracking-widest mb-6 block text-center">{article.date}</span>
        <h1 className="font-serif text-3xl md:text-5xl font-light mb-12 tracking-tight text-center leading-tight">
          {article.title}
        </h1>
        
        <div className="w-full aspect-[16/9] mb-16 overflow-hidden rounded border border-white/5 bg-charcoal/20">
          <img src={article.img} className="w-full h-full object-cover filter brightness-[0.8]" alt={article.title} />
        </div>

        {/* CONTENT */}
        <div className="mt-12 text-champagne/80 font-light leading-loose text-lg flex flex-col gap-6">
          <div dangerouslySetInnerHTML={{ __html: article.content }} className="blog-content" />
        </div>
      </div>

      <PortalFooter footer={dict.portal.footer} locale={locale} />
    </div>
  );
}
