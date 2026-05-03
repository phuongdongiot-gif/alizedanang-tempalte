"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";

interface HoverVideoCardProps {
  project: any;
  dict: any;
  locale: string;
}

export default function HoverVideoCard({ project, dict, locale }: HoverVideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fallback video logic: if hero_img ends with .mp4 it uses it, otherwise uses a placeholder video if hovered.
  // In a real database, you'd add a `video_url` column.
  const isVideoUrl = project.hero_img?.endsWith('.mp4');
  const videoUrl = isVideoUrl ? project.hero_img : "https://cdn.pixabay.com/video/2021/08/04/83893-584742681_tiny.mp4"; // Luxury real estate stock video
  const heroImg = project.hero_img || '/images/can-ho-view-bien-my-khe-alize.webp';

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Video autoplay prevented:", e));
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      // Optional: reset video time
      // videoRef.current.currentTime = 0;
    }
  };

  return (
    <div 
      className="group flex flex-col bg-charcoal/20 border border-white/5 overflow-hidden rounded transition-all hover:border-gold/30 shadow-lg h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Badges */}
        <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20 bg-gold text-jet-black text-[8px] md:text-[10px] uppercase tracking-widest font-bold px-2 md:px-3 py-1 rounded shadow-md">
          {dict.badge}
        </div>
        
        {/* Img Layer (Always beneath video) */}
        <img 
          loading="lazy" 
          decoding="async" 
          src={heroImg} 
          alt={project.name} 
          className={`absolute inset-0 w-full h-full object-cover filter brightness-[0.8] transition-all duration-700 ${isHovered ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`} 
        />

        {/* Video Layer */}
        <div className={`absolute inset-0 z-10 transition-opacity duration-700 bg-jet-black ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <video
            ref={videoRef}
            src={videoUrl}
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-80"
          />
          {/* Subtle overlay gradient to make text readable if any */}
          <div className="absolute inset-0 bg-gradient-to-t from-jet-black/80 via-transparent to-transparent"></div>
        </div>
      </div>
      
      <div className="p-3 md:p-8 flex flex-col flex-1 bg-jet-black/50 backdrop-blur-sm relative z-20">
         <div className="text-[8px] md:text-[10px] text-gold/80 tracking-widest uppercase mb-1 md:mb-2 font-light">RESIDENCE</div>
         <h3 className="font-serif text-sm md:text-2xl font-light mb-1 md:mb-2 text-white group-hover:text-gold transition-colors line-clamp-2">{project.name}</h3>
         <p className="text-[10px] md:text-xs text-champagne/50 mb-4 md:mb-8 font-light flex items-center">
           <svg className="w-3 h-3 mr-1 md:mr-2 opacity-70 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
           <span className="truncate">{project.location?.name || 'Đà Nẵng'}</span>
         </p>
         
         <div className="mt-auto flex justify-between items-center border-t border-white/5 pt-3 md:pt-6">
           <span className="text-sm md:text-lg font-light text-white hover:text-white/80 transition-colors cursor-pointer">{dict.contactBtn}</span>
           <Link href={`/${locale}/projects/${project.slug || 'the-royal-hoi-an'}`} className="text-gold text-[9px] md:text-xs tracking-widest uppercase font-light group-hover:underline flex items-center gap-1">
             {dict.detailBtn}
             <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
           </Link>
         </div>
      </div>
    </div>
  );
}
