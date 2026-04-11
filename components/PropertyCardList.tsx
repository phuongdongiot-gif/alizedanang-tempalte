import React from 'react';
import Link from 'next/link';
import { PortalProperty } from '../types';

export default function PropertyCardList({ property, locale }: { property: PortalProperty, locale: string }) {
  // Take up to 4 images (1 main, 3 side)
  const images = property.gallery && property.gallery.length > 0 ? property.gallery : [property.img || '/images/can-ho-view-bien-my-khe-alize.webp'];
  const mainImage = images[0];
  const sideImages = images.slice(1, 4);

  return (
    <div className="flex flex-col md:flex-row bg-charcoal/20 border border-white/5 rounded-md overflow-hidden hover:border-gold/30 transition-all group shadow-lg mb-6">
      
      {/* IMAGES LEFT (Collage) */}
      <div className="md:w-[40%] relative aspect-[4/3] md:aspect-auto flex min-h-[220px]">
        {/* Main Image */}
        <div className={`relative ${sideImages.length > 0 ? 'w-2/3' : 'w-full'} h-full overflow-hidden`}>
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
             <div className="bg-[#4CAF50] text-white text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1 w-fit">
               <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
               XÁC THỰC
             </div>
             {property.isNew && (
                <div className="bg-[#E53935] text-white text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded shadow-lg w-fit">
                  MỚI
                </div>
             )}
          </div>
          <Link href={`/${locale}/apartments/${property.id}`} className="block w-full h-full">
            <img src={mainImage} className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-700" alt={property.name} />
          </Link>
        </div>

        {/* Small Images */}
        {sideImages.length > 0 && (
          <div className="w-1/3 flex flex-col h-full border-l border-black/50">
            {sideImages.map((img, idx) => (
              <div key={idx} className={`relative flex-1 overflow-hidden ${idx < sideImages.length - 1 ? 'border-b border-black/50' : ''}`}>
                <img src={img} className="w-full h-full object-cover filter brightness-[0.7] hover:brightness-100 hover:scale-110 transition-all duration-300 cursor-pointer" alt={`${property.name} - ${idx}`} />
                {idx === 2 && images.length > 4 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs z-10 cursor-pointer pointer-events-none font-medium">
                    +{images.length - 4}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* INFO RIGHT */}
      <div className="md:w-[60%] p-5 flex flex-col justify-between">
        <div>
           <Link href={`/${locale}/apartments/${property.id}`} className="block font-serif text-lg md:text-xl text-white hover:text-gold transition-colors font-light line-clamp-2 leading-snug">
             {property.name}
           </Link>
           <div className="text-xs text-champagne/60 flex items-center mt-2">
              <span className="truncate">{property.location}</span>
           </div>
        </div>
        
        <div className="flex flex-col mt-4">
           {/* SPECS ROW */}
           <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm max-w-full">
              <span className="text-[#E53935] font-bold text-base whitespace-nowrap">{property.price}</span>
              <span className="text-white/80 font-medium whitespace-nowrap">{property.specs.area}</span>
              <span className="text-white/80 font-medium flex items-center whitespace-nowrap border-l border-white/20 pl-4">
                <span className="text-champagne/50 mr-2 text-[10px] uppercase">PN</span> {property.specs.beds}
              </span>
              <span className="text-white/80 font-medium flex items-center whitespace-nowrap border-l border-white/20 pl-4">
                <span className="text-champagne/50 mr-2 text-[10px] uppercase">WC</span> {property.specs.baths}
              </span>
           </div>
           
           <p className="text-sm text-champagne/60 font-light mt-3 line-clamp-2 leading-relaxed hidden md:block">
              {property.desc}
           </p>
           
           <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-jet-black border border-white/10 flex items-center justify-center text-[10px] font-bold font-serif text-champagne">G-E</div>
                 <div className="hidden sm:block">
                    <div className="text-[11px] text-white/90">G-Estate Broker</div>
                    <div className="text-[9px] text-champagne/40 tracking-wider">CHUYÊN GIA</div>
                 </div>
              </div>
              <div className="flex gap-2">
                 <button className="px-4 py-2 border border-gold border-opacity-50 text-gold text-xs rounded hover:bg-gold hover:text-jet-black transition-colors">
                    Zalo
                 </button>
                 <button className="px-4 py-2 bg-white/10 text-white text-xs rounded hover:bg-white/20 transition-colors">
                    Gọi: 090 123 4567
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
