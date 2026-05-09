export default function ProjectAmenities({
  dict,
  dynamicAmenities,
}: {
  dict: any;
  dynamicAmenities: any[];
}) {
  return (
    <section id="amenities" className="pt-40 pb-32 text-pearl-white border-t border-white/5 bg-midnight-blue">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-24">
          <div className="max-w-3xl">
            <span className="text-[10px] text-gold tracking-[0.4em] uppercase font-light mb-6 block opacity-80">{dict.amenities.sectionTag}</span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-[4rem] leading-[1.1] font-light tracking-tight">{dict.amenities.title}</h2>
            <p className="mt-6 text-champagne/60 font-light text-sm max-w-2xl leading-[2]">{dict.amenities.description}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {dynamicAmenities.map((b: any, i: number) => (
            <div key={i} className="border border-white/5 bg-charcoal/20 p-6">
              <div className="aspect-[4/3] overflow-hidden relative mb-8 rounded">
                <img loading="lazy" decoding="async" src={b.image_url || b.img || '/images/can-ho-view-bien-my-khe-alize.webp'} className="w-full h-full object-cover filter brightness-75" alt={b.title} />
              </div>
              <div>
                <span className="text-gold/80 text-[10px] tracking-[0.3em] font-light uppercase mb-3 block">{b.tag || 'NEW AMENITY'}</span>
                <h3 className="font-serif text-2xl font-light mb-4 text-pearl-white">{b.title}</h3>
                <p className="text-champagne/50 text-[13px] font-light leading-relaxed">{b.description || b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
