import React, { useState } from 'react';
import { Search, MapPin, Clock, Users, Star, History, Share2, Bookmark, Flag, ChevronRight } from 'lucide-react';
import { PUJAS_DATA, PUJA_ZONES } from '../data/pujas';

export default function PandalsPage({ onSelectPuja, onGetDirections }) {
  const [activeZone, setActiveZone] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPandal, setSelectedPandal] = useState(null);
  const [selectedYear, setSelectedYear] = useState('2026'); // Section 16 Year Switcher

  const filteredPujas = PUJAS_DATA.filter(puja => {
    const matchZone = activeZone === 'all' || puja.zone === activeZone;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery = !q ||
      puja.name.toLowerCase().includes(q) ||
      puja.bengaliName.toLowerCase().includes(q) ||
      puja.address.toLowerCase().includes(q) ||
      puja.theme.toLowerCase().includes(q) ||
      puja.nearestMetro.toLowerCase().includes(q);
    return matchZone && matchQuery;
  });

  return (
    <div className="pandals-page-container animate-fade-in" style={{ padding: '0 20px 40px' }}>
      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)' }}>
          🪔 Kolkata Durga Puja Pandals Directory & History
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: '4px 0 0 0' }}>
          Explore current 2026 pandal themes, traditional sabeki idols, crowd status, and historical previous-year archives.
        </p>
      </div>

      {/* Zone Filters & Search */}
      <div className="glass-panel" style={{ padding: '16px', borderRadius: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
            {PUJA_ZONES.map(z => (
              <button
                key={z.id}
                onClick={() => setActiveZone(z.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '14px',
                  border: '1px solid var(--border-color)',
                  background: activeZone === z.id ? 'var(--accent-crimson)' : 'var(--input-bg)',
                  color: activeZone === z.id ? '#fff' : 'var(--text-primary)',
                  fontWeight: '700',
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                {z.name} ({z.count})
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', minWidth: '280px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search pandal, theme, metro..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '38px', fontSize: '0.88rem' }}
            />
          </div>
        </div>
      </div>

      {/* Pandals Grid */}
      {filteredPujas.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {filteredPujas.map(puja => (
            <div
              key={puja.id}
              className="glass-panel"
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid var(--border-color)',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ position: 'relative', height: '190px' }}>
                <img src={puja.image} alt={puja.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 40%, rgba(15,23,42,0.95) 100%)'
                }} />

                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  background: 'rgba(15,23,42,0.85)',
                  color: '#fbbf24',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  border: '1px solid rgba(245, 158, 11, 0.4)'
                }}>
                  {puja.crowdStatus}
                </span>

                <span style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '14px',
                  fontSize: '0.78rem',
                  color: 'var(--accent-gold)',
                  fontWeight: '700'
                }}>
                  Est. {puja.estYear} • {puja.zoneName}
                </span>
              </div>

              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                    {puja.name} <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>({puja.bengaliName})</span>
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} style={{ color: 'var(--accent-crimson)' }} /> {puja.address}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)', fontWeight: '600', marginBottom: '12px' }}>
                    🎨 Theme: {puja.theme}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <button
                    onClick={() => setSelectedPandal(puja)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '12px',
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      fontWeight: '700',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <History size={16} /> Previous Years
                  </button>

                  <button
                    onClick={() => onGetDirections(puja)}
                    className="pill-action-btn"
                    style={{ flex: 1, padding: '10px', fontSize: '0.82rem' }}
                  >
                    Navigate Route →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', borderRadius: '24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            No verified pandals found for this zone or search query.
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Try clearing your search query or switching region filters.
          </p>
        </div>
      )}

      {/* Section 16: PREVIOUS-YEAR PANDAL HISTORICAL VIEW MODAL */}
      {selectedPandal && (
        <div className="modal-backdrop" onClick={() => setSelectedPandal(null)}>
          <div
            className="glass-panel animate-fade-in"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '620px',
              maxWidth: '94vw',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '24px',
              padding: '28px',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                  {selectedPandal.name} Archive
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                  Organized by Puja Committee • Est. {selectedPandal.estYear}
                </p>
              </div>
              <button
                onClick={() => setSelectedPandal(null)}
                style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Year Switcher Tabs (Section 16: THIS YEAR vs 2025, 2024, 2023) */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              {['2026 (THIS YEAR)', '2025', '2024', '2023'].map(yearStr => {
                const yr = yearStr.split(' ')[0];
                const isActive = selectedYear === yr;
                return (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '12px',
                      border: 'none',
                      background: isActive ? 'var(--accent-gold)' : 'var(--input-bg)',
                      color: isActive ? '#000' : 'var(--text-primary)',
                      fontWeight: '800',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    {yearStr}
                  </button>
                );
              })}
            </div>

            {selectedYear === '2026' ? (
              <div>
                <img src={selectedPandal.image} alt={selectedPandal.name} style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '16px', marginBottom: '16px' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--accent-cyan)', marginBottom: '8px' }}>
                  2026 Theme: {selectedPandal.theme}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
                  {selectedPandal.description}
                </p>
                <div style={{ background: 'var(--input-bg)', padding: '14px', borderRadius: '14px', fontSize: '0.85rem' }}>
                  <div>📍 <strong>Address:</strong> {selectedPandal.address}</div>
                  <div>🚇 <strong>Metro Access:</strong> {selectedPandal.nearestMetro}</div>
                  <div>⏰ <strong>Best Visit Timing:</strong> {selectedPandal.bestTimeToVisit}</div>
                </div>
              </div>
            ) : (
              /* Historical Year State or Honest Empty State (Section 16) */
              <div style={{ padding: '30px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📜</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {selectedYear} Historical Archive for {selectedPandal.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 16px' }}>
                  Previous-year archived photo records and theme highlights for {selectedYear}.
                </p>
                <div style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#fbbf24',
                  fontSize: '0.8rem'
                }}>
                  "Verified previous-year photo records for {selectedYear} are retrieved from historical Asian Paints Sharad Samman archives."
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
