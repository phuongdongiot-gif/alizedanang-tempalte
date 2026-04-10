import React from "react";
import PortalHeader from "../../../components/PortalHeader";
import PortalFooter from "../../../components/PortalFooter";
import { getDictionary } from "../../../dictionaries";
import { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const seo = dict.blog.seo;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://alizedanang.net";

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: [{ url: seo.ogImage }],
      url: `${baseUrl}/${locale}/blog`,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/blog`,
    }
  };
}

export default async function BlogIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const data = dict.blog;

  return (
    <div className="relative w-full min-h-screen bg-[#070A10] text-pearl-white flex flex-col pt-32">
      <PortalHeader nav={dict.portal.nav} locale={locale} />
      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 w-full flex-1">
        <div className="mb-20 text-center">
           <h1 className="font-serif text-5xl md:text-6xl font-light mb-6 tracking-tight">{data.hero.title}</h1>
           <p className="text-champagne/60 max-w-2xl mx-auto font-light">{data.hero.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {data.articles.map((article, idx) => (
            <div key={idx} className="group border border-white/5 bg-charcoal/20 overflow-hidden rounded flex flex-col hover:border-gold/30 transition-colors">
               <Link href={`/${locale}/blog/${article.slug}`} className="block relative aspect-[4/3] overflow-hidden">
                 <img src={article.img} className="w-full h-full object-cover filter brightness-[0.7] group-hover:scale-105 transition-transform duration-700" alt={article.title} />
               </Link>
               <div className="p-8 flex flex-col flex-1">
                 <span className="text-gold text-[10px] uppercase font-bold tracking-widest mb-4">{article.date}</span>
                 <Link href={`/${locale}/blog/${article.slug}`} className="font-serif text-2xl font-light mb-4 line-clamp-2 hover:text-gold transition-colors">{article.title}</Link>
                 <p className="text-sm font-light text-champagne/60 line-clamp-3 mb-8">{article.desc}</p>
                 <Link href={`/${locale}/blog/${article.slug}`} className="mt-auto border border-gold/40 text-center py-4 text-gold text-[10px] uppercase tracking-widest hover:bg-gold hover:text-jet-black transition-colors">
                   {data.readMoreBtn}
                 </Link>
               </div>
            </div>
          ))}
        </div>
      </div>

      <PortalFooter footer={dict.portal.footer} locale={locale} />
    </div>
  );
}
