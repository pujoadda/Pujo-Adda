import React, { useState } from 'react';
import { Search, MapPin, Phone, Star, CheckCircle2, Sliders, Building2, Sparkles } from 'lucide-react';
import { NEARBY_CATEGORIES, NEARBY_PLACES_DATA } from '../data/nearbyPlaces';
import { getRegisteredBusinesses } from '../services/authService';

export default function NearbyPlacesPage() {
  const [selectedCat, setSelectedCat] = useState('restaurant');
  const [searchQuery, setSearchQuery] = useState('');

  // Combine default verified places + user registered merchant businesses!
  const userRegistered = getRegisteredBusinesses();
  const allPlaces = [...userRegistered, ...NEARBY_PLACES_DATA];

  const filteredPlaces = allPlaces.filter(place => {
    const matchCat = place.category === selectedCat;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery = !q ||
      place.name.toLowerCase().includes(q) ||
      place.address.toLowerCase().includes(q) ||
      (place.cuisine && place.cuisine.toLowerCase().includes(q));
    return matchCat && matchQuery;
  });

  return (
    <div className="nearby-page-container animate-fade-in" style={{ padding: '0 20px 40px' }}>
      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)' }}>
          🏪 Nearby Facilities, Restaurants, Hotels & Emergency Hub
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: '4px 0 0 0' }}>
          Discover real verified nearby places including registered food stalls, OYO lodging, metro/train stations, ATMs, toilets, and police help desks.
        </p>
      </div>

      {/* Category Pills Slider */}
      <div className="glass-panel" style={{ padding: '16px', borderRadius: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
          {NEARBY_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '14px',
                border: '1px solid var(--border-color)',
                background: selectedCat === cat.id ? 'var(--accent-gold)' : 'var(--input-bg)',
                color: selectedCat === cat.id ? '#000' : 'var(--text-primary)',
                fontWeight: '800',
                fontSize: '0.82rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginTop: '12px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search nearby places by name or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '38px', fontSize: '0.88rem' }}
          />
        </div>
      </div>

      {/* Places Cards Grid */}
      {filteredPlaces.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredPlaces.map(place => (
            <div
              key={place.id}
              className="glass-panel"
              style={{
                padding: '20px',
                borderRadius: '20px',
                border: place.isPartner ? '2px solid #38bdf8' : '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: place.isPartner ? '0 0 20px rgba(56, 189, 248, 0.25)' : 'none'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    {place.isPartner && (
                      <span style={{
                        fontSize: '0.62rem',
                        fontWeight: '900',
                        color: '#38bdf8',
                        background: 'rgba(56, 189, 248, 0.15)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        display: 'inline-block',
                        marginBottom: '4px'
                      }}>
                        🌟 VERIFIED BUSINESS PARTNER
                      </span>
                    )}
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                      {place.name}
                    </h3>
                  </div>
                  {place.rating && (
                    <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#fbbf24', background: 'rgba(245,158,11,0.15)', padding: '2px 8px', borderRadius: '8px' }}>
                      ★ {place.rating}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} style={{ color: 'var(--accent-crimson)', shrink: 0 }} />
                  <span>{place.address}</span>
                </div>

                {place.cuisine && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: '600', marginBottom: '6px' }}>
                    🍽️ {place.cuisine} ({place.pricing})
                  </div>
                )}

                {place.line && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: '600', marginBottom: '6px' }}>
                    🚆 {place.line}
                  </div>
                )}

                {place.phone && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} /> Call: <a href={`tel:${place.phone}`} style={{ color: 'var(--accent-gold)', textDecoration: 'none' }}>{place.phone}</a>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={12} /> {place.source}
                </span>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${place.coords?.lat},${place.coords?.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-action-btn"
                  style={{ padding: '6px 12px', fontSize: '0.78rem', textDecoration: 'none' }}
                >
                  Directions
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', borderRadius: '24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🏢</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
            No verified listings found for this category in your area.
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '450px', margin: '0 auto' }}>
            We only display real verified business listings. Select another category or expand your search.
          </p>
        </div>
      )}
    </div>
  );
}

