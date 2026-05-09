import Link from "next/link";
import { PortalProperty } from "../../types";

interface ApartmentHeroProps {
  apt: PortalProperty;
  locale: string;
  backLinkText: string;
}

export default function ApartmentHero({ apt, locale, backLinkText }: ApartmentHeroProps) {
  return (
    <section className="relative w-full h-[60vh] min-h-[500px]">
      <img loading="eager" src={apt.img} alt={apt.name} className="w-full h-full object-cover filter brightness-[0.5]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070A10] via-black/40 to-transparent" />

      <div className="absolute bottom-0 left-0 w-full">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-16">
          <Link href={`/${locale}/apartments`} className="text-gold/80 text-xs tracking-widest uppercase hover:text-gold transition-colors block mb-6">
            &larr; {backLinkText}
          </Link>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="bg-gold text-jet-black text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded">
              {apt.price}
            </span>
            <span className="text-champagne/80 text-sm tracking-widest uppercase font-light">
              {apt.type}
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light mb-4 line-clamp-2">{apt.name}</h1>
          <p className="text-xl md:text-2xl font-light text-champagne line-clamp-1">{apt.location}</p>
        </div>
      </div>
    </section>
  );
}
