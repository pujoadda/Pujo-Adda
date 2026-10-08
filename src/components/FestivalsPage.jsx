import React, { useState, useMemo } from 'react';
import { Search, Calendar as CalendarIcon, MapPin, Filter, Sparkles, CheckCircle2 } from 'lucide-react';
import { FESTIVALS_LIST, FESTIVAL_CATEGORIES, INDIAN_STATES } from '../data/festivals';

export default function FestivalsPage({ onSelectFestival }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [calendarView, setCalendarView] = useState('month'); // 'today' | 'week' | 'month' | 'year'
  const [selectedYear, setSelectedYear] = useState('2026');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState('near'); // 'near' | 'select'

  const filteredFestivals = useMemo(() => {
    return FESTIVALS_LIST.filter(fest => {
      const matchCat = selectedCategory === 'all' || fest.category === selectedCategory;
      const matchState = selectedState === 'all' || fest.state === selectedState;
      const matchDist = selectedDistrict === 'all' || fest.district === selectedDistrict;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q ||
        fest.name.toLowerCase().includes(q) ||
        fest.bengaliName.toLowerCase().includes(q) ||
        fest.state.toLowerCase().includes(q) ||
        fest.district.toLowerCase().includes(q) ||
        fest.description.toLowerCase().includes(q);

      return matchCat && matchState && matchDist && matchQuery;
    });
  }, [selectedCategory, selectedState, selectedDistrict, searchQuery]);

  const availableDistricts = useMemo(() => {
    if (selectedState === 'all') return [];
    return INDIAN_STATES.find(s => s.name === selectedState)?.districts || [];
  }, [selectedState]);

  return (
    <div className="festivals-page-container animate-fade-in" style={{ padding: '0 20px 40px' }}>
      {/* Header & Title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span> All India Festival Discovery & Calendar</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: '4px 0 0 0' }}>
          Discover religious, cultural, heritage, food and seasonal festivals across all States and Union Territories of India.
        </p>
      </div>

      {/* Option A vs Option B Search Engine (Section 12) */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '20px', marginBottom: '24px', border: '1px solid var(--border-glow)' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <button
            onClick={() => setSearchMode('near')}
            style={{
              padding: '8px 18px',
              borderRadius: '12px',
              border: 'none',
              background: searchMode === 'near' ? 'var(--accent-crimson)' : 'var(--input-bg)',
              color: searchMode === 'near' ? '#fff' : 'var(--text-secondary)',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            📍 OPTION A — Near My Location
          </button>
          <button
            onClick={() => setSearchMode('select')}
            style={{
              padding: '8px 18px',
              borderRadius: '12px',
              border: 'none',
              background: searchMode === 'select' ? 'var(--accent-crimson)' : 'var(--input-bg)',
              color: searchMode === 'select' ? '#fff' : 'var(--text-secondary)',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            🗺️ OPTION B — Select Location Hierarchy
          </button>
        </div>

        {/* Global Search Bar */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search Durga Puja, Kali Puja, Christmas, Kolkata, Shyambazar, Park Street..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '48px', fontSize: '0.95rem' }}
          />
        </div>

        {/* Location Hierarchy Selectors if Option B */}
        {searchMode === 'select' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '700' }}>State / Union Territory</label>
              <select
                className="form-input"
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedDistrict('all');
                }}
                style={{ marginTop: '4px' }}
              >
                <option value="all">All India (All States)</option>
                {INDIAN_STATES.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            {selectedState !== 'all' && (
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '700' }}>District</label>
                <select
                  className="form-input"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  style={{ marginTop: '4px' }}
                >
                  <option value="all">All Districts in {selectedState}</option>
                  {availableDistricts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Category Pills & Calendar Year Switcher */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {FESTIVAL_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: '1px solid var(--border-color)',
                  background: selectedCategory === cat.id ? 'var(--accent-gold)' : 'var(--input-bg)',
                  color: selectedCategory === cat.id ? '#000' : 'var(--text-primary)',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>Year:</span>
            {['2026', '2025', '2024'].map(y => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  background: selectedYear === y ? 'var(--accent-cyan)' : 'var(--input-bg)',
                  color: selectedYear === y ? '#000' : 'var(--text-primary)',
                  fontWeight: '800',
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Festival Cards Grid */}
      {filteredFestivals.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {filteredFestivals.map(fest => (
            <div
              key={fest.id}
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
              <div style={{ position: 'relative', height: '180px' }}>
                <img src={fest.bannerImage} alt={fest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 50%, rgba(15,23,42,0.95) 100%)'
                }} />
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  background: 'rgba(15,23,42,0.8)',
                  backdropFilter: 'blur(10px)',
                  color: '#fbbf24',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  border: '1px solid rgba(245, 158, 11, 0.4)'
                }}>
                  {fest.status}
                </span>
              </div>

              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--accent-gold)', fontWeight: '700', marginBottom: '4px' }}>
                    <MapPin size={14} /> {fest.district}, {fest.state}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                    {fest.name}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                    {fest.description}
                  </p>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} style={{ color: '#4ade80' }} />
                    <span>Verified Source: {fest.verifiedSource}</span>
                  </div>

                  <button
                    onClick={() => onSelectFestival(fest)}
                    className="pill-action-btn"
                    style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
                  >
                    Explore Festival & Pandals
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ABSOLUTE NO DEMO DATA RULE (Section 2) Beautiful Empty State */
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', borderRadius: '24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🏮</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
            No verified festival information is currently available for this selected area/filter.
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
            We adhere to strict verified data guidelines. Try changing your state, district, or search category filters.
          </p>
        </div>
      )}
    </div>
  );
}
