import React, { useState } from 'react';
import { Navigation, Train, Footprints, Car, X, ExternalLink, ArrowRight, MapPin, Clock, ArrowUpDown, Bus, Bike } from 'lucide-react';

export default function DirectionsDrawer({
  targetPuja,
  userLocation,
  allRoutes = [],
  activeRouteId = 'shortest',
  onSelectRoute,
  isNavigating = false,
  onStartNavigation,
  onStopNavigation,
  onClose
}) {
  const [travelMode, setTravelMode] = useState('transit'); // 'best' | 'drive' | 'bike' | 'transit' | 'walk'
  const [showDetails, setShowDetails] = useState(false);

  if (!targetPuja) return null;

  // Custom Google Maps style transit/route mock data
  const googleRoutes = [
    {
      id: 'shortest',
      timeRange: '3:10 PM — 3:51 PM',
      duration: '41 min',
      badges: ['🚶', '🚌 214A', '78/1', '214', 'AC-20', 'S-11N', '🚶'],
      departs: '3:16 PM from 11 No. Rathtala Belghoria',
      walk: '19 min',
      freq: 'every 4 min',
      isBest: true,
      tag: 'Best'
    },
    {
      id: 'metro',
      timeRange: '3:23 PM — 4:03 PM',
      duration: '40 min',
      badges: ['🚶', '🚇 Blue Line', '78/1 Howrah Station - Barrackpore More', 'AC-20', 'ACT-32', '🚶'],
      departs: '3:23 PM from Paikpara Uttarpalli Play Ground',
      walk: '12 min',
      freq: 'every 6 min',
      isBest: false,
      tag: 'Fastest'
    },
    {
      id: 'bypass',
      timeRange: '3:16 PM — 4:04 PM',
      duration: '48 min',
      badges: ['🚶', '🚌 234', '234/1', 'S-185', '🚶'],
      departs: '3:16 PM from Shyambazar Metro Station',
      walk: '22 min',
      freq: 'every 8 min',
      isBest: false,
      tag: 'Alternative'
    }
  ];

  const activeRouteObj = googleRoutes.find(r => r.id === activeRouteId) || googleRoutes[0];

  // Full Timeline Details View (Matching Screenshot)
  if (showDetails) {
    return (
      <div className="animate-fade-in" style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        zIndex: 600,
        width: '380px',
        maxHeight: 'calc(100% - 32px)',
        borderRadius: '16px',
        padding: '16px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        background: '#ffffff',
        color: '#202124',
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
        border: '1px solid #dadce0',
        fontFamily: 'Roboto, Arial, sans-serif'
      }}>
        {/* Top Details Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <button
            onClick={() => setShowDetails(false)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', fontSize: '1.2rem', color: '#202124' }}
            title="Back to all routes"
          >
            ←
          </button>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.82rem', color: '#5f6368' }}>
              from <strong style={{ color: '#202124' }}>Your location</strong>
            </p>
            <p style={{ fontSize: '0.82rem', color: '#5f6368', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '280px' }}>
              to <strong style={{ color: '#202124' }}>{targetPuja.name}, {targetPuja.address}</strong>
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#5f6368', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Time Summary Box */}
        <div style={{ borderBottom: '1px solid #e8eaed', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#202124' }}>
              {activeRouteObj.timeRange}
            </h2>
          </div>
          <p style={{ fontSize: '1.15rem', color: '#5f6368', fontWeight: '500', marginTop: '2px' }}>
            ({activeRouteObj.duration})
          </p>

          {/* Sequence Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '10px', flexWrap: 'wrap' }}>
            {activeRouteObj.badges.map((b, bIdx) => (
              <span
                key={bIdx}
                style={{
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: b.startsWith('🚶') ? 'transparent' : '#f1f3f4',
                  color: b.startsWith('🚶') ? '#5f6368' : '#202124',
                  border: b.startsWith('🚶') ? 'none' : '1px solid #dadce0'
                }}
              >
                {b}
              </span>
            ))}
          </div>

          <p style={{ fontSize: '0.78rem', color: '#5f6368', marginTop: '8px' }}>
            {activeRouteObj.departs} • 🚶 {activeRouteObj.walk} • {activeRouteObj.freq}
          </p>

          {/* Add to Calendar & Live Navigation Buttons */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
            <button style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid #ceead6',
              background: '#e6f4ea',
              color: '#137333',
              fontSize: '0.82rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              📅 Add to Calendar
            </button>

            {!isNavigating ? (
              <button
                onClick={onStartNavigation}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  background: '#1a73e8',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(26, 115, 232, 0.3)'
                }}
              >
                <Navigation size={14} /> Start Live Navigation
              </button>
            ) : (
              <button
                onClick={onStopNavigation}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  background: '#e11d48',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <X size={14} /> Stop Navigation
              </button>
            )}
          </div>
        </div>

        {/* Step-by-Step Vertical Timeline (Exact Match to Screenshot) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', marginTop: '4px' }}>
          {/* Timeline Node 1: Origin */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#202124', width: '55px', textAlign: 'right' }}>
              3:10 PM
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2.5px solid #1a73e8', background: '#fff' }} />
            </div>
            <div>
              <p style={{ fontSize: '0.92rem', fontWeight: '700', color: '#202124' }}>Your location</p>
            </div>
          </div>

          {/* Dotted Walking Segment */}
          <div style={{ display: 'flex', gap: '14px', minHeight: '60px' }}>
            <div style={{ width: '55px', textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Footprints size={16} style={{ color: '#5f6368' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', paddingLeft: '5px' }}>
              <div style={{ borderLeft: '3px dotted #1a73e8', height: '100%' }} />
            </div>
            <div style={{ paddingLeft: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ fontSize: '0.88rem', fontWeight: '600', color: '#202124' }}>Walk</p>
              <p style={{ fontSize: '0.75rem', color: '#5f6368' }}>▾ About 6 min, 450 m</p>
            </div>
          </div>

          {/* Timeline Node 2: Bus Stop */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#202124', width: '55px', textAlign: 'right' }}>
              3:16 PM
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2.5px solid #1a73e8', background: '#fff' }} />
            </div>
            <div>
              <p style={{ fontSize: '0.92rem', fontWeight: '700', color: '#202124' }}>11 No. Rathtala Belghoria</p>
            </div>
          </div>

          {/* Solid Bus Ride Segment */}
          <div style={{ display: 'flex', gap: '14px', minHeight: '80px' }}>
            <div style={{ width: '55px', textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Bus size={16} style={{ color: '#1a73e8' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', paddingLeft: '4px' }}>
              <div style={{ borderLeft: '5px solid #1a73e8', height: '100%', borderRadius: '2px' }} />
            </div>
            <div style={{ paddingLeft: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', background: '#f1f3f4', padding: '2px 6px', borderRadius: '4px', border: '1px solid #dadce0' }}>
                  214A
                </span>
                <span style={{ fontSize: '0.88rem', fontWeight: '600', color: '#202124' }}>Esplanade (KC Das)</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#5f6368', marginTop: '4px' }}>▾ 22 min (22 stops)</p>
            </div>
          </div>

          {/* Timeline Node 3: Paikpara Stop */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#202124', width: '55px', textAlign: 'right' }}>
              3:38 PM
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2.5px solid #1a73e8', background: '#fff' }} />
            </div>
            <div>
              <p style={{ fontSize: '0.92rem', fontWeight: '700', color: '#202124' }}>Paikpara Crossing</p>
            </div>
          </div>

          {/* Dotted Walk Segment to Pandal Gate */}
          <div style={{ display: 'flex', gap: '14px', minHeight: '60px' }}>
            <div style={{ width: '55px', textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Footprints size={16} style={{ color: '#5f6368' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', paddingLeft: '5px' }}>
              <div style={{ borderLeft: '3px dotted #1a73e8', height: '100%' }} />
            </div>
            <div style={{ paddingLeft: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ fontSize: '0.88rem', fontWeight: '600', color: '#202124' }}>Walk</p>
              <p style={{ fontSize: '0.75rem', color: '#5f6368' }}>▾ About 13 min, 850 m</p>
            </div>
          </div>

          {/* Timeline Node 4: Destination Pandal */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#ea4335', width: '55px', textAlign: 'right' }}>
              3:51 PM
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <MapPin size={16} style={{ color: '#ea4335' }} />
            </div>
            <div>
              <p style={{ fontSize: '0.92rem', fontWeight: '800', color: '#ea4335' }}>{targetPuja.name}</p>
              <p style={{ fontSize: '0.75rem', color: '#5f6368' }}>Main Pandal Entrance Reached</p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => setShowDetails(false)}
          style={{
            marginTop: '12px',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #dadce0',
            background: '#f8f9fa',
            color: '#1a73e8',
            fontWeight: '700',
            fontSize: '0.85rem',
            cursor: 'pointer',
            textAlign: 'center'
          }}
        >
          ← Back to All Routes
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{
      position: 'absolute',
      top: '16px',
      left: '16px',
      zIndex: 600,
      width: '380px',
      maxHeight: 'calc(100% - 32px)',
      borderRadius: '16px',
      padding: '16px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      background: '#ffffff',
      color: '#202124',
      boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
      border: '1px solid #dadce0',
      fontFamily: 'Roboto, Arial, sans-serif'
    }}>
      {/* Top Mode Switcher Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e8eaed', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflowX: 'auto' }}>
          <button
            onClick={() => setTravelMode('best')}
            style={{
              padding: '6px 10px',
              borderRadius: '20px',
              border: 'none',
              background: travelMode === 'best' ? '#e8f0fe' : 'transparent',
              color: travelMode === 'best' ? '#1a73e8' : '#5f6368',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Best
          </button>

          <button
            onClick={() => setTravelMode('drive')}
            style={{
              padding: '6px 10px',
              borderRadius: '20px',
              border: 'none',
              background: travelMode === 'drive' ? '#e8f0fe' : 'transparent',
              color: travelMode === 'drive' ? '#1a73e8' : '#5f6368',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap'
            }}
          >
            <Car size={14} /> 22 min
          </button>

          <button
            onClick={() => setTravelMode('bike')}
            style={{
              padding: '6px 10px',
              borderRadius: '20px',
              border: 'none',
              background: travelMode === 'bike' ? '#e8f0fe' : 'transparent',
              color: travelMode === 'bike' ? '#1a73e8' : '#5f6368',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap'
            }}
          >
            <Bike size={14} /> 21 min
          </button>

          <button
            onClick={() => setTravelMode('transit')}
            style={{
              padding: '6px 10px',
              borderRadius: '20px',
              border: 'none',
              background: travelMode === 'transit' ? '#c2e7ff' : 'transparent',
              color: travelMode === 'transit' ? '#001d35' : '#5f6368',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap'
            }}
          >
            <Bus size={14} /> 41 min
          </button>

          <button
            onClick={() => setTravelMode('walk')}
            style={{
              padding: '6px 10px',
              borderRadius: '20px',
              border: 'none',
              background: travelMode === 'walk' ? '#e8f0fe' : 'transparent',
              color: travelMode === 'walk' ? '#1a73e8' : '#5f6368',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap'
            }}
          >
            <Footprints size={14} /> 1h 42m
          </button>
        </div>

        <button
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', color: '#5f6368', cursor: 'pointer', padding: '4px', borderRadius: '50%' }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Origin & Destination Inputs Box */}
      <div style={{
        background: '#f8f9fa',
        border: '1px solid #dadce0',
        borderRadius: '12px',
        padding: '10px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        position: 'relative'
      }}>
        {/* Origin */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2.5px solid #1a73e8', background: '#fff', flexShrink: 0 }} />
          <input
            type="text"
            readOnly
            value={userLocation ? userLocation.name || 'Your location' : 'Your location'}
            style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '0.85rem', color: '#202124', fontWeight: '500', outline: 'none' }}
          />
        </div>

        <div style={{ borderTop: '1px solid #e8eaed', margin: '2px 0' }} />

        {/* Destination */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MapPin size={14} style={{ color: '#ea4335', flexShrink: 0 }} />
          <input
            type="text"
            readOnly
            value={`${targetPuja.name}, ${targetPuja.address}`}
            style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '0.85rem', color: '#202124', fontWeight: '600', outline: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          />
        </div>

        {/* Swap Icon */}
        <button style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: '#fff',
          border: '1px solid #dadce0',
          borderRadius: '50%',
          width: '26px',
          height: '26px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#5f6368'
        }}>
          <ArrowUpDown size={13} />
        </button>
      </div>

      {/* Options Dropdown Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#017b77', fontWeight: '600', padding: '0 4px' }}>
        <span>⏱ Leave now ▾</span>
        <span style={{ cursor: 'pointer' }}>Options</span>
      </div>

      {/* Route Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
        {googleRoutes.map((route) => {
          const isSelected = route.id === activeRouteId;
          return (
            <div
              key={route.id}
              onClick={() => onSelectRoute && onSelectRoute(route.id)}
              style={{
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: isSelected ? '#e8f0fe' : '#ffffff',
                border: isSelected ? '2px solid #1a73e8' : '1px solid #e8eaed',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              {/* Card Header: Time Range & Duration */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bus size={16} style={{ color: '#1a73e8' }} />
                  <span style={{ fontSize: '0.92rem', fontWeight: '700', color: '#202124' }}>
                    {route.timeRange}
                  </span>
                </div>
                <span style={{ fontSize: '0.92rem', fontWeight: '800', color: '#202124' }}>
                  {route.duration}
                </span>
              </div>

              {/* Transit Steps Sequence Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                {route.badges.map((b, bIdx) => (
                  <span
                    key={bIdx}
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: b.startsWith('🚶') ? 'transparent' : '#f1f3f4',
                      color: b.startsWith('🚶') ? '#5f6368' : '#202124',
                      border: b.startsWith('🚶') ? 'none' : '1px solid #dadce0'
                    }}
                  >
                    {b}
                  </span>
                ))}
              </div>

              {/* Departs & Frequency Subtext */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: '#5f6368' }}>
                <span>{route.departs} • 🚶 {route.walk} • {route.freq}</span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectRoute) onSelectRoute(route.id);
                    setShowDetails(true);
                  }}
                  style={{ color: '#1a73e8', fontWeight: '700', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Details
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
