"use client";
import React, { useState, useRef, useMemo, useEffect } from 'react';
import Map, { Marker, Popup, NavigationControl, MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { PortalProperty } from '../types';
import Link from 'next/link';
import useSupercluster from 'use-supercluster';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export default function PropertyMap({ properties, locale }: { properties: PortalProperty[], locale: string }) {
  const mapRef = useRef<MapRef>(null);
  const [popupInfo, setPopupInfo] = useState<PortalProperty | null>(null);

  const initialLongitude = properties.length > 0 && properties[0].coordinates ? properties[0].coordinates.lng : 108.2022;
  const initialLatitude = properties.length > 0 && properties[0].coordinates ? properties[0].coordinates.lat : 16.0544;

  const [viewState, setViewState] = useState({
    longitude: initialLongitude,
    latitude: initialLatitude,
    zoom: 13
  });
  const [bounds, setBounds] = useState<[number, number, number, number] | null>(null);

  // Convert properties to GeoJSON for supercluster
  const points = useMemo(() => {
    return properties
      .filter(p => p.coordinates)
      .map(p => ({
        type: 'Feature' as const,
        properties: { cluster: false, propertyData: p, id: p.id },
        geometry: { type: 'Point' as const, coordinates: [p.coordinates.lng, p.coordinates.lat] }
      }));
  }, [properties]);

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom: viewState.zoom,
    options: { radius: 75, maxZoom: 20 }
  });

  const updateBounds = () => {
    if (mapRef.current) {
      const mapBounds = mapRef.current.getMap().getBounds();
      setBounds([
        mapBounds.getWest(),
        mapBounds.getSouth(),
        mapBounds.getEast(),
        mapBounds.getNorth()
      ]);
    }
  };

  return (
    <div className="w-full h-full min-h-[600px] rounded-lg overflow-hidden border border-white/10 shadow-2xl relative">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        onMoveEnd={updateBounds}
        onLoad={updateBounds}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <NavigationControl position="top-right" />

        {clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const props = cluster.properties as any;
          const { cluster: isCluster, point_count: pointCount } = props;

          if (isCluster) {
            // Dynamic cluster size based on count
            const size = Math.min(40 + (pointCount / points.length) * 30, 70);
            return (
              <Marker key={`cluster-${cluster.id}`} longitude={longitude} latitude={latitude} anchor="center">
                <div
                  className="bg-gold text-jet-black rounded-full flex items-center justify-center font-bold cursor-pointer border-[3px] border-white/30 shadow-[0_0_20px_rgba(212,175,55,0.6)] transition-transform hover:scale-110"
                  style={{ width: `${size}px`, height: `${size}px` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(cluster.id as number), 20);
                    mapRef.current?.flyTo({
                      center: [longitude, latitude],
                      zoom: expansionZoom,
                      duration: 500
                    });
                  }}
                >
                  {pointCount}
                </div>
              </Marker>
            );
          }

          const prop = props.propertyData;
          // Dynamic scale based on zoom for individual markers
          const markerScale = Math.max(0.7, Math.min(1.2, viewState.zoom / 13));
          
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
              <div 
                className="bg-[#E53935] text-white px-2 py-1 rounded text-xs font-bold cursor-pointer hover:bg-white hover:text-[#E53935] transition-colors shadow-lg group relative"
                style={{ transform: `scale(${markerScale})`, transformOrigin: 'bottom center' }}
              >
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
