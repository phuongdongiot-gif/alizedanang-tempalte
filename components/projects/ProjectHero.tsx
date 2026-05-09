export default function ProjectHero({
  dynamicTagline,
  dynamicHeroLine1,
  dynamicHeroLine2,
  dynamicHeroDesc,
}: {
  dynamicTagline: string;
  dynamicHeroLine1: string;
  dynamicHeroLine2: string;
  dynamicHeroDesc: string;
}) {
  return (
    <section id="hero" className="relative h-screen min-h-[800px] w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img loading="lazy" decoding="async" src="/images/sky-pool-alize-da-nang.webp" alt="Luxury Real Estate" className="w-full h-[120%] -top-[10%] object-cover absolute" />
        <div className="absolute inset-0 bg-gradient-to-t from-jet-black via-transparent to-transparent"></div>
      </div>
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-10 md:mt-14">
        <span className="block text-gold text-[10px] md:text-xs tracking-[0.5em] font-light uppercase mb-8">{dynamicTagline}</span>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-[6.5rem] font-normal text-pearl-white mb-8 tracking-tighter leading-[1.05]">
          {dynamicHeroLine1} <br /><span className="font-serif italic font-light text-pearl-white/90">{dynamicHeroLine2}</span>
        </h1>
        <p className="text-champagne/80 mb-14 text-base md:text-lg font-light tracking-wide max-w-2xl mx-auto leading-relaxed">{dynamicHeroDesc}</p>
      </div>
    </section>
  );
}
