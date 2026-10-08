import React from 'react';
import { Search, Map, List, Navigation, Sparkles, Lock } from 'lucide-react';
import { PUJA_ZONES } from '../data/pujas';

export default function Header({
  activeZone,
  setActiveZone,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  onLocateMe,
  isLocating,
  user,
  onPromptAuth
}) {
  const handleSearchFocus = (e) => {
    if (!user) {
      e.target.blur();
      onPromptAuth();
    }
  };

  return (
    <header className="header-bar">
      {/* Zone Pill Tabs */}
      <div className="zone-pills-container" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {PUJA_ZONES.map((zone) => (
          <button
            key={zone.id}
            onClick={() => setActiveZone(zone.id)}
            className={`zone-pill ${activeZone === zone.id ? 'active' : ''}`}
          >
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: zone.color,
              display: 'inline-block'
            }} />
            {zone.name}
            <span style={{
              fontSize: '0.72rem',
              padding: '1px 6px',
              borderRadius: '8px',
              background: activeZone === zone.id ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.1)'
            }}>
              {zone.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Input (Gated by Auth) */}
      <div className="search-wrapper" style={{ position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
        <input
          type="text"
          className="search-input"
          placeholder={user ? "Search pandal, area, metro station..." : "🔒 Log in to search pandals & routes..."}
          value={searchQuery}
          onFocus={handleSearchFocus}
          onChange={(e) => {
            if (!user) {
              onPromptAuth();
            } else {
              setSearchQuery(e.target.value);
            }
          }}
        />
        {!user && (
          <span 
            onClick={onPromptAuth}
            style={{
              position: 'absolute',
              right: '12px',
              fontSize: '0.75rem',
              fontWeight: '700',
              color: '#fbbf24',
              cursor: 'pointer',
              background: 'rgba(245, 158, 11, 0.15)',
              padding: '2px 8px',
              borderRadius: '8px',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}
          >
            Login Required
          </span>
        )}
        {user && searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: '12px',
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Action Controls: Locate Me & Side-by-Side View Switcher */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button
          onClick={onLocateMe}
          disabled={isLocating}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '12px',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            color: '#38bdf8',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title="Detect current location for live map routing"
        >
          <Navigation size={15} style={{ animation: isLocating ? 'spin 1s infinite linear' : 'none' }} />
          {isLocating ? 'Locating...' : 'My Location'}
        </button>

        {/* View Mode Switcher: List View vs Side-by-Side Map View */}
        <div style={{ display: 'flex', gap: '4px', background: 'var(--input-bg)', padding: '4px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setViewMode('list')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '10px',
              border: 'none',
              background: viewMode === 'list' ? 'linear-gradient(135deg, var(--accent-crimson), #be123c)' : 'transparent',
              color: viewMode === 'list' ? '#fff' : 'var(--text-secondary)',
              fontWeight: '700',
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: viewMode === 'list' ? '0 4px 12px rgba(225, 29, 72, 0.35)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <List size={15} /> List View
          </button>

          <button
            onClick={() => setViewMode('map')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '10px',
              border: 'none',
              background: viewMode === 'map' ? 'linear-gradient(135deg, var(--accent-crimson), #be123c)' : 'transparent',
              color: viewMode === 'map' ? '#fff' : 'var(--text-secondary)',
              fontWeight: '700',
              fontSize: '0.82rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: viewMode === 'map' ? '0 4px 12px rgba(225, 29, 72, 0.35)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Map size={15} /> Map View
          </button>
        </div>
      </div>
    </header>
  );
}
