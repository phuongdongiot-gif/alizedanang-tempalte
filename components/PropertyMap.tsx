"use client";
import React, { useState } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { PortalProperty } from '../types';
import Link from 'next/link';

// You must create an account at mapbox.com and generate a free API key.
// We use a fallback key to ensure it runs out of the box.
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export default function PropertyMap({ properties, locale }: { properties: PortalProperty[], locale: string }) {
  const [popupInfo, setPopupInfo] = useState<PortalProperty | null>(null);

  // Calculate generic center based on first property or default to Da Nang
  const initialLongitude = properties.length > 0 && properties[0].coordinates ? properties[0].coordinates.lng : 108.2022;
  const initialLatitude = properties.length > 0 && properties[0].coordinates ? properties[0].coordinates.lat : 16.0544;

  return (
    <div className="w-full h-full min-h-[600px] rounded-lg overflow-hidden border border-white/10 shadow-2xl relative">
      <Map
        initialViewState={{
          longitude: initialLongitude,
          latitude: initialLatitude,
          zoom: 11
        }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <NavigationControl position="top-right" />

        {properties.map((prop) => {
          if (!prop.coordinates) return null;
          return (
            <Marker
              key={`marker-${prop.id}`}
              longitude={prop.coordinates.lng}
              latitude={prop.coordinates.lat}
              anchor="bottom"
              onClick={e => {
                e.originalEvent.stopPropagation();
                setPopupInfo(prop);
              }}
            >
              <div className="bg-[#E53935] text-white px-2 py-1 rounded text-xs font-bold cursor-pointer hover:bg-white hover:text-[#E53935] transition-colors shadow-lg group relative">
                {prop.price}
                <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-t-[6px] border-t-[#E53935] border-r-[6px] border-r-transparent group-hover:border-t-white transition-colors" />
              </div>
            </Marker>
          );
        })}

        {popupInfo && popupInfo.coordinates && (
          <Popup
            anchor="bottom"
            offset={{ bottom: [0, -35] }}
            longitude={popupInfo.coordinates.lng}
            latitude={popupInfo.coordinates.lat}
            onClose={() => setPopupInfo(null)}
            closeOnClick={false}
            className="text-jet-black min-w-[200px] z-50 property-map-popup"
            maxWidth="300px"
          >
            <div className="p-1">
              <img src={popupInfo.img} alt={popupInfo.name} className="w-full h-24 object-cover rounded mb-2" />
              <div className="font-bold text-sm leading-tight mb-1">{popupInfo.price}</div>
              <p className="text-xs text-gray-700 line-clamp-2">{popupInfo.name}</p>
              <div className="flex gap-2 text-[10px] mt-2 text-gray-500 font-medium">
                <span>{popupInfo.specs.area}</span>
                <span>•</span>
                <span>{popupInfo.specs.beds} PN</span>
              </div>
              <Link href={`/${locale}/apartments/${popupInfo.id}`} className="block text-center mt-3 bg-[#070A10] text-white py-[6px] rounded text-xs hover:bg-gold hover:text-jet-black transition-colors font-medium">
                {locale === 'vi' ? 'Xem Chi Tiết' : 'View Details'}
              </Link>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
