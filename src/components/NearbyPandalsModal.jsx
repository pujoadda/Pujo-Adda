import React, { useState } from 'react';
import { X, MapPin, Navigation, Sparkles, Compass, Clock, Search, ExternalLink } from 'lucide-react';

// Haversine formula to compute distance in km
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 999;
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function NearbyPandalsModal({ userLocation, pujas = [], onClose, onDirections }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('all');

  const userLat = userLocation?.lat || 22.5626;
  const userLng = userLocation?.lng || 88.3630;

  // Compute distance for all pujas & sort by closest!
  const sortedPujas = pujas.map(puja => {
    const distKm = calculateDistanceKm(userLat, userLng, puja.coords.lat, puja.coords.lng);
    const distFormatted = distKm < 1 ? `${Math.round(distKm * 1000)} meters` : `${distKm.toFixed(1)} km`;
    const walkMins = Math.round(distKm * 12); // ~12 mins per km
    return {
      ...puja,
      distKm,
      distFormatted,
      walkMins
    };
  }).sort((a, b) => a.distKm - b.distKm);

  const filteredPujas = sortedPujas.filter(p => {
    const matchZone = selectedZone === 'all' || p.zone === selectedZone;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery = !q || p.name.toLowerCase().includes(q) || p.bengaliName.toLowerCase().includes(q) || p.address.toLowerCase().includes(q);
    return matchZone && matchQuery;
  });

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose} style={{ zIndex: 10010 }}>
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '780px',
          maxWidth: '94vw',
          height: '620px',
          maxHeight: '90vh',
          borderRadius: '28px',
          padding: '24px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          border: '2px solid var(--accent-gold)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #e11d48, #f59e0b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '1.3rem',
              boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)'
            }}>
              🪔
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                ⚡ Find Nearby Pandals & Easy Routes
              </h2>
              <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: '700' }}>
                📍 GPS Auto-Locate Active • Sorted by Proximity
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'var(--input-bg)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Filter & Search Controls */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search nearby pandal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '36px', fontSize: '0.82rem', height: '36px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '4px' }}>
            {[
              { id: 'all', label: 'All Kolkata' },
              { id: 'north', label: 'North' },
              { id: 'middle', label: 'Central' },
              { id: 'south', label: 'South' }
            ].map(z => (
              <button
                key={z.id}
                onClick={() => setSelectedZone(z.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  background: selectedZone === z.id ? 'var(--accent-gold)' : 'var(--input-bg)',
                  color: selectedZone === z.id ? '#000' : 'var(--text-primary)',
                  fontWeight: '700',
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                {z.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Nearby List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          paddingRight: '4px'
        }}>
          {filteredPujas.map((puja, index) => (
            <div
              key={puja.id}
              style={{
                padding: '14px 18px',
                borderRadius: '16px',
                background: index === 0 ? 'rgba(245, 158, 11, 0.08)' : 'var(--input-bg)',
                border: index === 0 ? '1.5px solid var(--accent-gold)' : '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.66rem',
                    fontWeight: '900',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: 'rgba(225, 29, 72, 0.2)',
                    color: '#f87171',
                    border: '1px solid rgba(225, 29, 72, 0.4)'
                  }}>
                    #{index + 1} CLOSEST PANDAL
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: '900', color: '#10b981' }}>
                    📍 {puja.distFormatted} away
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    • ~{puja.walkMins} min walk
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', margin: '4px 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {puja.name} <span style={{ color: 'var(--accent-gold)', fontWeight: '700' }}>({puja.bengaliName})</span>
                </h3>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                  🚇 Near {puja.nearestMetro} • {puja.address}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                <button
                  onClick={() => {
                    onDirections(puja);
                    onClose();
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #e11d48, #f59e0b)',
                    border: 'none',
                    color: '#fff',
                    fontWeight: '800',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 14px rgba(225, 29, 72, 0.3)'
                  }}
                >
                  <Navigation size={14} /> Easy Route
                </button>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${puja.coords.lat},${puja.coords.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '8px 10px',
                    borderRadius: '12px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none'
                  }}
                  title="Open in Google Maps"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
