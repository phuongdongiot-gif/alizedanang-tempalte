"use client";
import React, { useState, useRef, useMemo } from 'react';
import Map, { Marker, Popup, NavigationControl, MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import Link from 'next/link';
import useSupercluster from 'use-supercluster';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export default function MasterMap({ properties, projects, locale }: { properties: any[], projects: any[], locale: string }) {
  const mapRef = useRef<MapRef>(null);
  const [popupInfo, setPopupInfo] = useState<any>(null);

  const initialLong = projects.length > 0 && projects[0].lng ? projects[0].lng : 108.2022;
  const initialLat = projects.length > 0 && projects[0].lat ? projects[0].lat : 16.0544;

  const [viewState, setViewState] = useState({
    longitude: initialLong,
    latitude: initialLat,
    zoom: 5.5
  });
  const [bounds, setBounds] = useState<[number, number, number, number] | null>(null);

  // Lọc và format dữ liệu cho properties (Chỉ cluster properties nhỏ, projects lớn giữ nguyên)
  const points = useMemo(() => {
    return (properties || [])
      .filter(p => p.coordinates)
      .map(p => ({
        type: 'Feature' as const,
        properties: { cluster: false, data: p, id: `prop-${p.id}`, itemType: 'property' },
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
    <div className="w-full h-screen relative">
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

        {/* 1. MAPPING MEGA PROJECTS (Luôn hiển thị, điều chỉnh scale theo zoom) */}
        {projects.map((proj) => {
          if (!proj.lat || !proj.lng) return null;
          const projectScale = Math.max(0.8, Math.min(1.5, viewState.zoom / 6));
          return (
            <Marker
              key={`proj-${proj.id}`}
              longitude={proj.lng}
              latitude={proj.lat}
              anchor="bottom"
              onClick={e => {
                e.originalEvent.stopPropagation();
                setPopupInfo({ ...proj, type: 'project' });
              }}
            >
              <div 
                className="bg-gold text-jet-black px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer hover:bg-white transition-colors shadow-lg shadow-gold/50 flex items-center gap-2 border-2 border-white/20 whitespace-nowrap"
                style={{ transform: `scale(${projectScale})`, transformOrigin: 'bottom center' }}
              >
                <span>⭐</span> {proj.name}
              </div>
            </Marker>
          );
        })}

        {/* 2. CLUSTERING INDIVIDUAL PROPERTIES */}
        {clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const props = cluster.properties as any;
          const { cluster: isCluster, point_count: pointCount, data } = props;

          if (isCluster) {
            const size = Math.min(40 + (pointCount / points.length) * 30, 70);
            return (
              <Marker key={`cluster-${cluster.id}`} longitude={longitude} latitude={latitude} anchor="center">
                <div
                  className="bg-[#E53935] text-white rounded-full flex items-center justify-center font-bold cursor-pointer border-2 border-white/30 shadow-[0_0_20px_rgba(229,57,53,0.6)] transition-transform hover:scale-110"
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

          const prop = data;
          const markerScale = Math.max(0.6, Math.min(1.2, viewState.zoom / 10));
          return (
            <Marker
              key={cluster.properties.id}
              longitude={prop.coordinates.lng}
              latitude={prop.coordinates.lat}
              anchor="bottom"
              onClick={e => {
                e.originalEvent.stopPropagation();
                setPopupInfo({ ...prop, type: 'property' });
              }}
            >
              <div 
                className="bg-[#E53935] text-white px-2 py-1 rounded text-[10px] font-bold cursor-pointer hover:bg-white hover:text-[#E53935] transition-colors shadow-lg"
                style={{ transform: `scale(${markerScale})`, transformOrigin: 'bottom center' }}
              >
                {prop.price}
              </div>
            </Marker>
          );
        })}

        {/* 3. POPUP MODAL */}
        {popupInfo && (
          <Popup
            anchor="bottom"
            offset={{ bottom: [0, -35] }}
            longitude={popupInfo.type === 'project' ? popupInfo.lng : popupInfo.coordinates.lng}
            latitude={popupInfo.type === 'project' ? popupInfo.lat : popupInfo.coordinates.lat}
            onClose={() => setPopupInfo(null)}
            closeOnClick={false}
            className="text-jet-black z-50 property-map-popup min-w-[240px]"
          >
            <div className="p-1">
              {popupInfo.type === 'project' ? (
                <>
                  <div className="font-bold text-sm leading-tight mb-2 text-gold tracking-widest uppercase text-center bg-jet-black py-1 rounded">SIÊU DỰ ÁN</div>
                  <h3 className="font-serif text-lg font-bold mb-1">{popupInfo.name}</h3>
                  <p className="text-xs text-gray-700 line-clamp-3 mb-3">{popupInfo.hero_data?.description}</p>
                  <Link href={`/${locale}/alize`} className="block text-center mt-3 bg-jet-black text-gold py-1.5 rounded text-xs hover:bg-gold hover:text-jet-black transition-colors font-bold uppercase tracking-wider">
                    Khám Phá Dự Án
                  </Link>
                </>
              ) : (
                <>
                  <img src={popupInfo.img_url || '/images/can-ho-view-bien-my-khe-alize.webp'} alt={popupInfo.name} className="w-full h-24 object-cover rounded mb-2" />
                  <div className="font-bold text-sm leading-tight mb-1">{popupInfo.price}</div>
                  <p className="text-xs text-gray-700 line-clamp-2">{popupInfo.name}</p>
                  <Link href={`/${locale}/apartments/${popupInfo.id}`} className="block text-center mt-3 bg-[#070A10] text-white py-[6px] rounded text-xs hover:bg-gold hover:text-jet-black transition-colors font-medium">
                    Xem Chi Tiết
                  </Link>
                </>
              )}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
