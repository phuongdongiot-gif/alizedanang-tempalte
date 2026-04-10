import { Inter, Playfair_Display } from "next/font/google";
import "../globals.css";
import { getDictionary } from '../../dictionaries';
import { Metadata } from 'next';

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ["latin", "vietnamese"], variable: '--font-serif', style: ['normal', 'italic'] });

export function generateStaticParams() {
  return [{ locale: 'vi' }, { locale: 'en' }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  // Lấy ra URL base
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://alizedanang.net';
  
  return {
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'vi': `${baseUrl}/vi`,
        'en': `${baseUrl}/en`,
        'x-default': `${baseUrl}/vi`
      }
    }
  }
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <html lang={locale} className={`scroll-smooth ${inter.variable} ${playfair.variable}`}>
      <body className="bg-jet-black text-pearl-white font-sans antialiased selection:bg-gold selection:text-jet-black overflow-x-hidden min-h-screen">
        {children}
      </body>
    </html>
  );
}
