import React, { useEffect, useState, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, Polyline, Circle, useMap, ZoomControl, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Layers, Compass, ExternalLink, MapPin, Eye, LocateFixed, Sparkles, Building2, Search, X, Star, Phone, Share2, CheckCircle2, ShieldCheck, TrafficCone } from 'lucide-react';
import { getRegisteredBusinesses } from '../services/authService';
import { fetchRealOSRMRoute } from '../services/routeService';
import NearbyPandalsModal from './NearbyPandalsModal';

// Kolkata Metro Lines Coordinates
const METRO_LINE_BLUE = [
  [22.6534, 88.3608], // Dakshineswar
  [22.6200, 88.3700], // Dum Dum
  [22.5985, 88.3680], // Shyambazar
  [22.5830, 88.3650], // Shobhabazar
  [22.5680, 88.3610], // Central
  [22.5520, 88.3520], // Park Street
  [22.5250, 88.3460], // Kalighat
  [22.4700, 88.3900]  // Kavi Subhash
];

const METRO_LINE_GREEN = [
  [22.5850, 88.3400], // Howrah Maidan
  [22.5680, 88.3500], // Esplanade
  [22.5660, 88.3850], // Sealdah
  [22.5750, 88.4300]  // Salt Lake Sector V
];

// Mock Traffic Congestion Polylines (Green = Smooth, Yellow = Moderate, Red = Heavy Pandal Traffic)
const TRAFFIC_CORRIDORS = [
  { path: [[22.6200, 88.3700], [22.5985, 88.3680], [22.5830, 88.3650]], color: '#ef4444', label: 'Heavy Pandal Crowding' },
  { path: [[22.5830, 88.3650], [22.5680, 88.3610], [22.5520, 88.3520]], color: '#f59e0b', label: 'Moderate Traffic' },
  { path: [[22.5520, 88.3520], [22.5250, 88.3460], [22.4700, 88.3900]], color: '#10b981', label: 'Clear Route' },
  { path: [[22.6100, 88.4020], [22.5650, 88.3980], [22.5200, 88.3920]], color: '#10b981', label: 'EM Bypass Clear' },
  { path: [[22.5680, 88.3500], [22.5750, 88.4300]], color: '#f59e0b', label: 'Salt Lake Flow' }
];

// Create SVG-based custom Leaflet icons for Pujas based on Zone
const createCustomIcon = (zone, isSelected = false) => {
  let color = '#fbbf24'; // North
  if (zone === 'south') color = '#38bdf8';
  if (zone === 'middle') color = '#f43f5e';

  const size = isSelected ? 44 : 32;
  const glow = isSelected ? `drop-shadow(0 0 14px ${color})` : `drop-shadow(0 4px 6px rgba(0,0,0,0.5))`;

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

// User Location Icon (Google Maps Style Pulsing Radar Marker)
const createUserIcon = () => {
  const svg = `
    <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
      <div style="
        position: absolute;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: rgba(56, 189, 248, 0.3);
        animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
      <div style="
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: #1a73e8;
        border: 3px solid #ffffff;
        box-shadow: 0 0 12px rgba(26, 115, 232, 0.8);
        z-index: 2;
      "></div>
    </div>
  `;

  return L.divIcon({
    className: 'google-user-location-marker',
    html: svg,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22]
  });
};

// Business Partner Icon for Registered Restaurants, OYOs, Pubs
const createBusinessIcon = (category) => {
  let iconEmoji = '🍴';
  let color = '#38bdf8';
  if (category === 'hotel') { iconEmoji = '🏨'; color = '#a855f7'; }
  if (category === 'pub') { iconEmoji = '🍺'; color = '#fbbf24'; }
  if (category === 'hospital') { iconEmoji = '🏥'; color = '#ef4444'; }

  const svg = `
    <div style="
      background: #0f172a;
      border: 2px solid ${color};
      color: #ffffff;
      border-radius: 50%;
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      box-shadow: 0 0 14px ${color};
    ">
      ${iconEmoji}
    </div>
  `;

  return L.divIcon({
    className: 'business-partner-marker',
    html: svg,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17]
  });
};

// Map Click Listener component for setting custom location pin
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng);
      }
    }
  });
  return null;
}

// Controller component to smoothly pan/zoom map view
function MapController({ center, zoom, selectedPuja, activeZone, locateSeq, effectiveUserLocation, searchTarget }) {
  const map = useMap();

  // Explicitly fly to searchTarget or selected target if provided
  useEffect(() => {
    const target = searchTarget || selectedPuja;
    if (target && target.coords && typeof target.coords.lat === 'number' && typeof target.coords.lng === 'number') {
      try {
        map.flyTo([target.coords.lat, target.coords.lng], 16, {
          duration: 1.2
        });
      } catch (err) {
        console.warn('Map flyTo target error:', err);
      }
    } else if (center && Array.isArray(center) && center.length === 2 && center[0] != null && center[1] != null) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [searchTarget, selectedPuja, center, zoom, map]);

  // Explicitly fly to user location when locate button is triggered!
  useEffect(() => {
    if (locateSeq > 0 && effectiveUserLocation?.lat && effectiveUserLocation?.lng && typeof effectiveUserLocation.lat === 'number' && typeof effectiveUserLocation.lng === 'number') {
      try {
        map.flyTo([effectiveUserLocation.lat, effectiveUserLocation.lng], 16, {
          duration: 1.2
        });
      } catch (err) {
        console.warn('Map flyTo userLocation error:', err);
      }
    }
  }, [locateSeq, map]);

  useEffect(() => {
    if (selectedPuja && selectedPuja.coords && typeof selectedPuja.coords.lat === 'number' && typeof selectedPuja.coords.lng === 'number') {
      try {
        map.flyTo([selectedPuja.coords.lat, selectedPuja.coords.lng], 16, {
          duration: 1.2
        });
      } catch (err) {
        console.warn('Map flyTo selectedPuja error:', err);
      }
    } else if (center && Array.isArray(center) && center.length === 2 && typeof center[0] === 'number' && typeof center[1] === 'number' && !isNaN(center[0]) && !isNaN(center[1]) && !searchTarget) {
      try {
        map.flyTo(center, zoom, { duration: 1.2 });
      } catch (err) {
        console.warn('Map flyTo center error:', err);
      }
    }
  }, [selectedPuja?.id, activeZone, center?.[0], center?.[1], zoom, map]);

  return null;
}

export default function InteractiveMap({
  pujas = [],
  activeZone = 'all',
  userLocation: propUserLocation,
  selectedPuja,
  onSelectPuja,
  onDirections,
  allRoutes = [],
  activeRouteId = 'shortest',
  theme = 'dark',
  locateSeq: propLocateSeq = 0,
  locationStatus = 'idle',
  isNavigating = false,
  onStartNavigation,
  onStopNavigation
}) {
  const [mapStyle, setMapStyle] = useState('street'); // 'street' | 'satellite' | 'terrain' | 'dark'
  const [showTraffic, setShowTraffic] = useState(false);
  const [showMetro, setShowMetro] = useState(false);
  const [showBusinesses, setShowBusinesses] = useState(true);

  const [showNearbyModal, setShowNearbyModal] = useState(false);
  const [liveUserLoc, setLiveUserLoc] = useState(propUserLocation);
  const [isLocating, setIsLocating] = useState(false);
  const [internalLocateSeq, setInternalLocateSeq] = useState(0);
  const [locateToastMsg, setLocateToastMsg] = useState('');

  // Map Search State
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [searchTarget, setSearchTarget] = useState(null);
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  const registeredBusinesses = useMemo(() => getRegisteredBusinesses(), []);
  const effectiveLocateSeq = propLocateSeq + internalLocateSeq;

  // Sync state when parent prop updates
  useEffect(() => {
    if (propUserLocation) {
      setLiveUserLoc(propUserLocation);
    }
  }, [propUserLocation?.lat, propUserLocation?.lng, propUserLocation?.name]);

  const effectiveUserLocation = liveUserLoc || propUserLocation;

  // Real OSRM Road Routing Engine State
  const [osrmRoutePath, setOsrmRoutePath] = useState(null);
  const [osrmRouteInfo, setOsrmRouteInfo] = useState(null);

  // Fetch real OSRM road polylines when a destination pandal is selected
  useEffect(() => {
    const target = selectedPuja || searchTarget;
    if (target && target.coords && effectiveUserLocation) {
      fetchRealOSRMRoute(effectiveUserLocation, target.coords)
        .then((res) => {
          if (res && res.path) {
            setOsrmRoutePath(res.path);
            setOsrmRouteInfo(res);
          } else {
            setOsrmRoutePath(null);
            setOsrmRouteInfo(null);
          }
        });
    } else {
      setOsrmRoutePath(null);
      setOsrmRouteInfo(null);
    }
  }, [selectedPuja?.id, searchTarget?.id, effectiveUserLocation?.lat, effectiveUserLocation?.lng]);

  const handleLocateMe = () => {
    setIsLocating(true);
    setInternalLocateSeq((prev) => prev + 1);
    if (onSelectPuja) onSelectPuja(null);
    setSearchTarget(null);

    const setSuccess = (lat, lng, name) => {
      setLiveUserLoc({ lat, lng, name });
      setIsLocating(false);
      setLocateToastMsg(`📍 Centered: ${name}`);
      setTimeout(() => setLocateToastMsg(''), 4000);
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setSuccess(pos.coords.latitude, pos.coords.longitude, 'Your Device Hardware GPS Location');
        },
        (err) => {
          console.warn('GPS position error or denied:', err.message);
          setIsLocating(false);
          setLocateToastMsg('⚠️ GPS permission denied or unavailable. Please enable device location permissions.');
          setTimeout(() => setLocateToastMsg(''), 5000);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
      setIsLocating(false);
      setLocateToastMsg('⚠️ Geolocation not supported on this browser context.');
      setTimeout(() => setLocateToastMsg(''), 4000);
    }
  };

  const handleMapClick = (latlng) => {
    // Clicking on the map sets a Dropped Destination Pin.
    // Live User GPS location is IMMUTABLE and NEVER changed by clicking on the map!
    const droppedPin = {
      id: 'dropped_pin_' + Date.now(),
      name: '📍 Dropped Destination Pin',
      coords: { lat: latlng.lat, lng: latlng.lng },
      address: `Lat: ${latlng.lat.toFixed(4)}, Lng: ${latlng.lng.toFixed(4)}`,
      type: 'dropped_pin'
    };
    if (onSelectPuja) onSelectPuja(null);
    setSearchTarget(droppedPin);
  };

  // Search Results Filter
  const mapSearchResults = useMemo(() => {
    const q = mapSearchQuery.toLowerCase().trim();
    if (!q) return [];
    
    // Search Pujas
    const matchedPujas = pujas.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.bengaliName.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q)
    ).slice(0, 4);

    // Search Registered Businesses
    const matchedBiz = registeredBusinesses.filter((b) =>
      b.name.toLowerCase().includes(q) ||
      b.address.toLowerCase().includes(q)
    ).slice(0, 3);

    return [
      ...matchedPujas.map(p => ({ ...p, type: 'pandal' })),
      ...matchedBiz.map(b => ({ ...b, type: 'business' }))
    ];
  }, [mapSearchQuery, pujas, registeredBusinesses]);

  const centerCoords = useMemo(() => {
    if (searchTarget?.coords) {
      return [searchTarget.coords.lat, searchTarget.coords.lng];
    }
    if (selectedPuja?.coords) {
      return [selectedPuja.coords.lat, selectedPuja.coords.lng];
    }
    if (effectiveUserLocation?.lat && effectiveUserLocation?.lng && (!activeZone || activeZone === 'all')) {
      return [effectiveUserLocation.lat, effectiveUserLocation.lng];
    }
    if (activeZone === 'north') return [22.5985, 88.3680];
    if (activeZone === 'middle') return [22.5680, 88.3610];
    if (activeZone === 'south') return [22.5180, 88.3580];
    return [22.5626, 88.3630];
  }, [searchTarget, selectedPuja?.id, activeZone, effectiveUserLocation?.lat, effectiveUserLocation?.lng]);

  const tileUrls = {
    street: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
  };

  const tileAttributions = {
    street: '&copy; OpenStreetMap contributors',
    satellite: 'Tiles &copy; Esri',
    terrain: 'Map data: &copy; OpenStreetMap, SRTM | Map style: &copy; OpenTopoMap',
    dark: '&copy; OpenStreetMap contributors &copy; CARTO'
  };

  const currentFocusedPlace = selectedPuja || searchTarget;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '600px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)', background: '#0f172a' }}>
      
      {/* 🔍 Google Maps Style Top Floating Search Bar */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        zIndex: 600,
        width: '340px',
        maxWidth: 'calc(100% - 140px)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: '#ffffff',
          borderRadius: '24px',
          padding: '8px 16px',
          boxShadow: '0 4px 18px rgba(0,0,0,0.25)',
          border: '1px solid #dadce0'
        }}>
          <Search size={18} style={{ color: '#1a73e8', shrink: 0 }} />
          <input
            type="text"
            placeholder="Search Google Maps places, pandals..."
            value={mapSearchQuery}
            onChange={(e) => setMapSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '0.88rem',
              fontWeight: '500',
              color: '#202124',
              background: 'transparent'
            }}
          />
          {mapSearchQuery && (
            <button
              onClick={() => { setMapSearchQuery(''); setSearchTarget(null); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5f6368', padding: '2px' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Auto-suggest Search Dropdown */}
        {mapSearchResults.length > 0 && (
          <div style={{
            marginTop: '6px',
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            border: '1px solid #dadce0'
          }}>
            {mapSearchResults.map((res) => (
              <div
                key={res.id}
                onClick={() => {
                  setSearchTarget(res);
                  setMapSearchQuery(res.name);
                  if (res.type === 'pandal' && onSelectPuja) onSelectPuja(res);
                }}
                style={{
                  padding: '10px 14px',
                  borderBottom: '1px solid #f1f3f4',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
              >
                <MapPin size={16} style={{ color: res.type === 'pandal' ? '#e11d48' : '#38bdf8' }} />
                <div style={{ overflow: 'hidden' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#202124', margin: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {res.name}
                  </p>
                  <p style={{ fontSize: '0.74rem', color: '#5f6368', margin: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    📍 {res.address}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🚀 Locate Toast Overlay */}
      {locateToastMsg && (
        <div style={{
          position: 'absolute',
          top: '70px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 650,
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid #38bdf8',
          color: '#38bdf8',
          padding: '8px 20px',
          borderRadius: '24px',
          fontSize: '0.82rem',
          fontWeight: '700',
          boxShadow: '0 8px 24px rgba(56, 189, 248, 0.35)',
          animation: 'fade-in 0.3s ease'
        }}>
          {locateToastMsg}
        </div>
      )}

      {/* 🗺️ Leaflet Map Container */}
      <MapContainer
        center={centerCoords}
        zoom={13}
        zoomControl={false}
        style={{ width: '100%', height: '100%' }}
      >
        <MapController
          center={centerCoords}
          zoom={14}
          selectedPuja={selectedPuja}
          activeZone={activeZone}
          locateSeq={effectiveLocateSeq}
          effectiveUserLocation={effectiveUserLocation}
          searchTarget={searchTarget}
        />
        <MapClickHandler onMapClick={handleMapClick} />
        
        {/* Tile Layer */}
        <TileLayer
          url={tileUrls[mapStyle] || tileUrls.street}
          attribution={tileAttributions[mapStyle] || tileAttributions.street}
          maxZoom={19}
        />

        {/* Location Accuracy Circle */}
        {effectiveUserLocation && (
          <Circle
            center={[effectiveUserLocation.lat, effectiveUserLocation.lng]}
            radius={effectiveUserLocation.accuracy || 150}
            pathOptions={{
              color: effectiveUserLocation.isRealGps !== false ? '#38bdf8' : '#f59e0b',
              fillColor: effectiveUserLocation.isRealGps !== false ? '#38bdf8' : '#f59e0b',
              fillOpacity: 0.18,
              weight: 1.5,
              dashArray: effectiveUserLocation.isRealGps !== false ? undefined : '4 4'
            }}
          />
        )}

        {/* User GPS / Default Marker */}
        {effectiveUserLocation && effectiveUserLocation.lat != null && effectiveUserLocation.lng != null && (
          <Marker position={[effectiveUserLocation.lat, effectiveUserLocation.lng]} icon={createUserIcon()}>
            <Popup>
              <div style={{ padding: '6px' }}>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: '900',
                  color: effectiveUserLocation.isRealGps !== false ? '#1a73e8' : '#d97706',
                  background: effectiveUserLocation.isRealGps !== false ? 'rgba(26, 115, 232, 0.12)' : 'rgba(217, 119, 6, 0.12)',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>
                  {effectiveUserLocation.isRealGps !== false ? '🎯 LIVE GPS POSITION' : '📍 DEFAULT MAP CENTER (KOLKATA)'}
                </span>
                <h4 style={{ color: '#0f172a', fontWeight: '800', fontSize: '0.9rem', marginTop: '4px', marginBottom: '2px' }}>
                  {effectiveUserLocation.name || 'Location Coordinates'}
                </h4>
                {effectiveUserLocation.accuracy && (
                  <p style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: '700', margin: '2px 0' }}>
                    GPS Accuracy: ±{Math.round(effectiveUserLocation.accuracy)}m
                  </p>
                )}
                <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                  Lat: {effectiveUserLocation.lat.toFixed(4)}, Lng: {effectiveUserLocation.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Metro Lines Overlay */}
        {showMetro && (
          <>
            <Polyline positions={METRO_LINE_BLUE} pathOptions={{ color: '#1a73e8', weight: 6, opacity: 0.85 }} />
            <Polyline positions={METRO_LINE_GREEN} pathOptions={{ color: '#10b981', weight: 6, opacity: 0.85 }} />
          </>
        )}

        {/* Live Traffic Overlay */}
        {showTraffic && TRAFFIC_CORRIDORS.map((corridor, idx) => (
          <Polyline key={idx} positions={corridor.path} pathOptions={{ color: corridor.color, weight: 7, opacity: 0.8 }} />
        ))}

        {/* Real OSRM Road Route Polyline */}
        {osrmRoutePath && osrmRoutePath.length > 0 && (
          <Polyline
            positions={osrmRoutePath}
            pathOptions={{
              color: '#38bdf8',
              weight: 6,
              opacity: 0.9,
              lineCap: 'round',
              lineJoin: 'round'
            }}
          />
        )}

        {/* Dropped Destination Pin Marker */}
        {searchTarget && searchTarget.type === 'dropped_pin' && searchTarget.coords && (
          <Marker
            position={[searchTarget.coords.lat, searchTarget.coords.lng]}
            icon={L.divIcon({
              className: 'dropped-pin-marker',
              html: `
                <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
                  <div style="width: 32px; height: 32px; border-radius: 50%; background: #e11d48; border: 2.5px solid #ffffff; box-shadow: 0 0 14px rgba(225,29,72,0.8); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 16px;">
                    📍
                  </div>
                </div>
              `,
              iconSize: [36, 36],
              iconAnchor: [18, 36],
              popupAnchor: [0, -36]
            })}
          >
            <Popup>
              <div style={{ padding: '4px' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: '900', color: '#e11d48', background: 'rgba(225, 29, 72, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                  📍 DROPPED DESTINATION PIN
                </span>
                <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#ffffff', marginTop: '4px', marginBottom: '2px' }}>
                  {searchTarget.name}
                </h4>
                <p style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>
                  {searchTarget.address}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Registered Business Partner Markers */}
        {showBusinesses && registeredBusinesses.map((biz) => (
          <Marker key={biz.id} position={[biz.coords.lat, biz.coords.lng]} icon={createBusinessIcon(biz.category)}>
            <Popup>
              <div style={{ padding: '4px' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: '900', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                  🌟 VERIFIED BUSINESS PARTNER
                </span>
                <h4 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#ffffff', marginTop: '4px' }}>
                  {biz.name}
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '2px' }}>
                  📍 {biz.address}
                </p>
                <p style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: '700', marginTop: '2px' }}>
                  {biz.pricing} • Phone: {biz.phone}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Multi-Route Polylines */}
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

      {/* 🔮 Top Trigger Pill: Find Nearby Pandals */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 500
      }}>
        <button
          onClick={() => setShowNearbyModal(true)}
          style={{
            padding: '9px 18px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #e11d48, #f59e0b)',
            border: '1.5px solid rgba(255, 255, 255, 0.3)',
            color: '#ffffff',
            fontWeight: '900',
            fontSize: '0.84rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 6px 20px rgba(225, 29, 72, 0.4)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Sparkles size={16} />
          <span>Find Nearby Pandals & Easy Routes</span>
        </button>
      </div>

      {/* ⚙️ Google Maps Layers Switcher Box (Top Right) */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '6px'
      }}>
        <button
          onClick={() => setShowLayerMenu((prev) => !prev)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '20px',
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            fontWeight: '700',
            fontSize: '0.78rem',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
          }}
        >
          <Layers size={16} style={{ color: '#fbbf24' }} />
          <span>Map Types & Layers</span>
        </button>

        {showLayerMenu && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(16px)',
            padding: '12px 14px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            width: '210px',
            color: '#fff',
            fontSize: '0.8rem'
          }}>
            <p style={{ fontWeight: '800', fontSize: '0.72rem', color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>
              MAP TYPES
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {[
                { id: 'street', label: '🟡 Default' },
                { id: 'satellite', label: '🛰️ Satellite' },
                { id: 'terrain', label: '⛰️ Terrain' },
                { id: 'dark', label: '🌙 Dark' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMapStyle(m.id)}
                  style={{
                    padding: '6px 8px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: mapStyle === m.id ? '#fbbf24' : 'rgba(255,255,255,0.1)',
                    background: mapStyle === m.id ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                    color: mapStyle === m.id ? '#fbbf24' : '#cbd5e1',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <p style={{ fontWeight: '800', fontSize: '0.72rem', color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: '6px', margin: 0 }}>
              TRAFFIC & TRANSIT OVERLAYS
            </p>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.78rem' }}>
              <input type="checkbox" checked={showTraffic} onChange={(e) => setShowTraffic(e.target.checked)} />
              <span>🚥 Live Traffic Overlay</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.78rem' }}>
              <input type="checkbox" checked={showMetro} onChange={(e) => setShowMetro(e.target.checked)} />
              <span>🚇 Kolkata Metro Lines</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.78rem' }}>
              <input type="checkbox" checked={showBusinesses} onChange={(e) => setShowBusinesses(e.target.checked)} />
              <span>🍴 Merchant Partners</span>
            </label>
          </div>
        )}
      </div>

      {/* 🎯 Google Maps Floating Control Stack (Bottom Right) */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        right: '16px',
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <button
          onClick={handleLocateMe}
          title="Center on Live Location"
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: '#ffffff',
            border: '2px solid #1a73e8',
            color: '#1a73e8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.35)',
            transition: 'all 0.2s ease'
          }}
        >
          <LocateFixed size={22} className={isLocating ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* 🏰 Google Maps Bottom Floating Place Card (When Puja or Search Result Selected) */}
      {currentFocusedPlace && (
        <div className="animate-fade-in" style={{
          position: 'absolute',
          bottom: '24px',
          left: '16px',
          zIndex: 550,
          width: '320px',
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          padding: '14px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
          color: '#ffffff'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className={`badge badge-${currentFocusedPlace.zone || 'middle'}`} style={{ fontSize: '0.62rem' }}>
                {currentFocusedPlace.zoneName || 'Kolkata'}
              </span>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginTop: '4px', margin: 0, color: '#fff' }}>
                {currentFocusedPlace.name}
              </h3>
              {currentFocusedPlace.bengaliName && (
                <p style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: '700', marginTop: '2px', margin: 0 }}>
                  {currentFocusedPlace.bengaliName}
                </p>
              )}
            </div>
            <button
              onClick={() => { if (onSelectPuja) onSelectPuja(null); setSearchTarget(null); }}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
            >
              <X size={18} />
            </button>
          </div>

          <p style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '8px', lineHeight: '1.3' }}>
            📍 {currentFocusedPlace.address}
          </p>

          {currentFocusedPlace.nearestMetro && (
            <p style={{ fontSize: '0.78rem', color: '#38bdf8', marginTop: '4px', fontWeight: '600' }}>
              🚇 {currentFocusedPlace.nearestMetro}
            </p>
          )}

          {osrmRouteInfo && (
            <div style={{
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '8px',
              padding: '6px 10px',
              marginTop: '6px',
              fontSize: '0.75rem',
              color: '#38bdf8',
              fontWeight: '700'
            }}>
              🚗 Real OSRM Road Distance: {osrmRouteInfo.distanceKm} km • ~{osrmRouteInfo.durationMins} mins travel
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button
              onClick={() => onDirections(currentFocusedPlace)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px',
                borderRadius: '10px',
                background: '#e11d48',
                border: 'none',
                color: '#fff',
                fontWeight: '700',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              <Navigation size={14} /> Directions
            </button>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${currentFocusedPlace.coords?.lat},${currentFocusedPlace.coords?.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '10px',
                background: 'rgba(66, 133, 244, 0.2)',
                border: '1px solid rgba(66, 133, 244, 0.4)',
                color: '#38bdf8',
                fontWeight: '700',
                fontSize: '0.8rem',
                textDecoration: 'none'
              }}
            >
              <ExternalLink size={14} /> Google Maps
            </a>
          </div>
        </div>
      )}

      {/* Nearby Pandals Pop-Up Modal */}
      {showNearbyModal && (
        <NearbyPandalsModal
          userLocation={effectiveUserLocation}
          pujas={pujas}
          onClose={() => setShowNearbyModal(false)}
          onDirections={onDirections}
        />
      )}
    </div>
  );
}
