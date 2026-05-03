"use client";

import React from "react";

interface SinglePropertyMapProps {
  lat: number;
  lng: number;
  title?: string;
  price?: string;
}

export default function SinglePropertyMap({ lat, lng, title, price }: SinglePropertyMapProps) {
  // Use Google Maps iframe embed for 100% compatibility and zero dependency issues
  const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&t=m&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden border border-white/10 group">
      {/* Decorative Overlay */}
      <div className="absolute top-4 left-4 z-10 bg-jet-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded shadow-2xl pointer-events-none">
        <h3 className="text-white font-semibold text-sm">{title || "Vị trí Bất Động Sản"}</h3>
        {price && <p className="text-gold text-xs mt-1">{price}</p>}
      </div>

      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0, filter: 'contrast(1.2) opacity(0.9)' }}
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="grayscale-0 group-hover:grayscale-0 transition-all duration-700"
      ></iframe>
      
      {/* Fallback styling block to blend with Dark Theme */}
      <div className="absolute inset-0 pointer-events-none border border-gold/20 rounded-xl mix-blend-overlay"></div>
    </div>
  );
}
