import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, Polyline, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Layers, Compass, ExternalLink, MapPin, Eye } from 'lucide-react';

// Create SVG-based custom Leaflet icons for Pujas based on Zone
const createCustomIcon = (zone, isSelected = false) => {
  let color = '#fbbf24'; // North
  if (zone === 'south') color = '#38bdf8';
  if (zone === 'middle') color = '#f43f5e';

  const size = isSelected ? 42 : 32;
  const glow = isSelected ? `drop-shadow(0 0 12px ${color})` : `drop-shadow(0 4px 6px rgba(0,0,0,0.5))`;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" style="filter: ${glow}; transition: all 0.3s ease;">
      <path fill="${color}" stroke="#ffffff" stroke-width="1.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="3.5" fill="#0f172a" />
      <circle cx="12" cy="9" r="2" fill="${color}" />
    </svg>
  `;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: svg,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size]
  });
};

// User Location Icon
const createUserIcon = () => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" style="filter: drop-shadow(0 0 10px #38bdf8);">
      <circle cx="12" cy="12" r="9" fill="#38bdf8" fill-opacity="0.3" />
      <circle cx="12" cy="12" r="6" fill="#38bdf8" stroke="#ffffff" stroke-width="2" />
      <circle cx="12" cy="12" r="2.5" fill="#ffffff" />
    </svg>
  `;

  return L.divIcon({
    className: 'user-leaflet-marker',
    html: svg,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

// Controller component to smoothly pan/zoom map view
function MapController({ center, zoom, selectedPuja, activeZone }) {
  const map = useMap();
  useEffect(() => {
    if (selectedPuja && selectedPuja.coords && selectedPuja.coords.lat != null && selectedPuja.coords.lng != null) {
      map.flyTo([selectedPuja.coords.lat, selectedPuja.coords.lng], 15, {
        duration: 1.2
      });
    } else if (center && Array.isArray(center) && center.length === 2 && center[0] != null && center[1] != null) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [selectedPuja?.id, activeZone, center?.[0], center?.[1], zoom, map]);
  return null;
}

export default function InteractiveMap({
  pujas,
  activeZone = 'all',
  userLocation,
  selectedPuja,
  onSelectPuja,
  onDirections,
  allRoutes = [],
  activeRouteId = 'shortest',
  theme = 'dark'
}) {
  const [mapStyle, setMapStyle] = useState('street');

  const centerCoords = useMemo(() => {
    if (selectedPuja?.coords) {
      return [selectedPuja.coords.lat, selectedPuja.coords.lng];
    }
    if (activeZone === 'north') {
      return [22.5985, 88.3680]; // North Kolkata Center
    }
    if (activeZone === 'middle') {
      return [22.5680, 88.3610]; // Middle Kolkata Center
    }
    if (activeZone === 'south') {
      return [22.5180, 88.3580]; // South Kolkata Center
    }
    if (userLocation?.lat && userLocation?.lng) {
      return [userLocation.lat, userLocation.lng];
    }
    return [22.5626, 88.3630];
  }, [selectedPuja?.id, activeZone, userLocation?.lat, userLocation?.lng]);

  // Map Tile Layer URLs matching reference screenshot
  const tileUrls = {
    street: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  };

  const tileAttributions = {
    street: '&copy; OpenStreetMap contributors',
    satellite: 'Tiles &copy; Esri &mdash; Source: Esri'
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
      {/* Map Container */}
      <MapContainer
        center={centerCoords}
        zoom={12}
        zoomControl={false}
        style={{ width: '100%', height: '100%' }}
      >
        <MapController center={centerCoords} zoom={13} selectedPuja={selectedPuja} activeZone={activeZone} />
        
        {/* Map Tile Layer */}
        <TileLayer
          url={tileUrls[mapStyle] || tileUrls.street}
          attribution={tileAttributions[mapStyle] || tileAttributions.street}
          maxZoom={19}
        />

        <ZoomControl position="bottomright" />

        {/* User Location Marker */}
        {userLocation && userLocation.lat != null && userLocation.lng != null && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={createUserIcon()}>
            <Popup>
              <div style={{ padding: '6px' }}>
                <h4 style={{ color: '#38bdf8', fontWeight: '700', fontSize: '0.9rem', marginBottom: '2px' }}>📍 Your Current Location</h4>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{userLocation.name || 'Kolkata Central Hub'}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Multi-Route Polylines & Map Badges (Google Maps Style) */}
        {allRoutes && allRoutes.length > 0 && allRoutes.map((route) => {
          const isActive = route.id === activeRouteId;
          const midPoint = route.path ? (route.path[1] || route.path[0]) : null;
          return (
            <React.Fragment key={route.id}>
              {route.path && (
                <Polyline
                  positions={route.path}
                  pathOptions={{
                    color: isActive ? '#1a73e8' : '#8ab4f8',
                    weight: isActive ? 7 : 5,
                    opacity: isActive ? 0.95 : 0.65,
                    lineCap: 'round',
                    lineJoin: 'round'
                  }}
                />
              )}
              {/* Route Duration Badge directly on Map Path */}
              {midPoint && (
                <Marker
                  position={midPoint}
                  icon={L.divIcon({
                    className: 'map-route-badge',
                    html: `
                      <div style="
                        background: ${isActive ? '#ffffff' : '#f8f9fa'};
                        border: 1px solid ${isActive ? '#1a73e8' : '#dadce0'};
                        color: #202124;
                        font-weight: 700;
                        font-size: 11px;
                        padding: 3px 8px;
                        border-radius: 12px;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.25);
                        white-space: nowrap;
                        display: flex;
                        align-items: center;
                        gap: 4px;
                      ">
                        🚌 ${route.time || ''}
                      </div>
                    `,
                    iconSize: [60, 24],
                    iconAnchor: [30, 12]
                  })}
                />
              )}
            </React.Fragment>
          );
        })}

        {/* Pandal Markers */}
        {pujas && pujas.map((puja) => {
          if (!puja || !puja.coords || puja.coords.lat == null || puja.coords.lng == null) return null;
          const isSelected = selectedPuja && selectedPuja.id === puja.id;
          return (
            <Marker
              key={puja.id}
              position={[puja.coords.lat, puja.coords.lng]}
              icon={createCustomIcon(puja.zone, isSelected)}
              eventHandlers={{
                click: () => onSelectPuja(puja)
              }}
            >
              <Tooltip direction="top" offset={[0, -28]} opacity={0.95}>
                <div style={{ fontWeight: '700', fontSize: '0.82rem', padding: '2px 4px', whiteSpace: 'nowrap' }}>
                  🏰 {puja.name} <span style={{ color: '#f59e0b', fontWeight: '600' }}>({puja.bengaliName})</span>
                </div>
              </Tooltip>

              <Popup>
                <div style={{ width: '220px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>
                    <span className={`badge badge-${puja.zone}`} style={{ fontSize: '0.65rem' }}>
                      {puja.zoneName}
                    </span>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', marginTop: '4px', lineHeight: '1.2' }}>
                      {puja.name}
                    </h4>
                    <p className="bengali-title" style={{ fontSize: '0.88rem', color: '#fbbf24', fontWeight: '700', marginTop: '2px' }}>
                      {puja.bengaliName}
                    </p>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.3', fontWeight: '600' }}>
                    🚇 {puja.nearestMetro}
                  </p>

                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    <button
                      onClick={() => onDirections(puja)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        padding: '6px',
                        borderRadius: '6px',
                        background: '#e11d48',
                        border: 'none',
                        color: '#fff',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      <Navigation size={12} /> Directions
                    </button>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${puja.coords?.lat || 0},${puja.coords?.lng || 0}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        background: 'rgba(66, 133, 244, 0.2)',
                        border: '1px solid rgba(66, 133, 244, 0.4)',
                        color: '#38bdf8',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        textDecoration: 'none'
                      }}
                    >
                      <ExternalLink size={12} /> Open Maps
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Layer Controls Switcher (Street & Satellite View Only) */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: 500,
        display: 'flex',
        gap: '4px',
        background: 'rgba(10, 12, 22, 0.85)',
        backdropFilter: 'blur(12px)',
        padding: '4px',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.15)'
      }}>
        <button
          onClick={() => setMapStyle('street')}
          style={{
            padding: '5px 12px',
            borderRadius: '16px',
            border: 'none',
            background: mapStyle === 'street' || !mapStyle ? '#f59e0b' : 'transparent',
            color: mapStyle === 'street' || !mapStyle ? '#000' : '#fff',
            fontWeight: '700',
            fontSize: '0.75rem',
            cursor: 'pointer'
          }}
        >
          🟡 Street
        </button>
        <button
          onClick={() => setMapStyle('satellite')}
          style={{
            padding: '5px 12px',
            borderRadius: '16px',
            border: 'none',
            background: mapStyle === 'satellite' ? '#f59e0b' : 'transparent',
            color: mapStyle === 'satellite' ? '#000' : '#fff',
            fontWeight: '700',
            fontSize: '0.75rem',
            cursor: 'pointer'
          }}
        >
          🛰️ Satellite
        </button>
      </div>

      {/* Map Legend */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        zIndex: 500,
        background: 'rgba(10, 12, 22, 0.88)',
        backdropFilter: 'blur(12px)',
        padding: '8px 14px',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'flex',
        gap: '14px',
        alignItems: 'center',
        fontSize: '0.78rem',
        color: '#ffffff',
        fontWeight: '600'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#fbbf24' }} />
          <span>North Kolkata</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#38bdf8' }} />
          <span>South Kolkata</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f43f5e' }} />
          <span>Middle Kolkata</span>
        </div>
      </div>
    </div>
  );
}
