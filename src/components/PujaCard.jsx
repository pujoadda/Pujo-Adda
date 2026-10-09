import React from 'react';
import { Navigation, Star, Train, MapPin, Clock, Flame, Users } from 'lucide-react';

export default function PujaCard({ puja, onDirections, isSelected }) {
  if (!puja) return null;
  // Helper for crowd status badges
  const getCrowdBadge = (level, statusText) => {
    let badgeClass = 'badge-crowd-moderate';
    let icon = <Users size={11} />;

    if (level === 'Peak' || level === 'High') {
      badgeClass = 'badge-crowd-peak';
      icon = <Flame size={11} />;
    } else if (level === 'Heavy' || level === 'Busy') {
      badgeClass = 'badge-crowd-heavy';
      icon = <Flame size={11} />;
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem' }}>
        <span className={`badge ${badgeClass}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '2px 6px', fontSize: '0.68rem' }}>
          {icon} {level} Crowd
        </span>
        <span style={{ color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.72rem' }}>
          ⏱️ {statusText}
        </span>
      </div>
    );
  };

  // Helper for Zone Badges
  const getZoneBadge = (zone) => {
    switch (zone) {
      case 'north':
        return <span className="badge badge-north" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>North Kolkata</span>;
      case 'south':
        return <span className="badge badge-south" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>South Kolkata</span>;
      default:
        return <span className="badge badge-middle" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>Middle Kolkata</span>;
    }
  };

  return (
    <div
      className={`glass-card animate-fade-in ${isSelected ? 'glowing-border' : ''}`}
      style={{
        padding: '10px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        position: 'relative',
        background: isSelected ? 'rgba(225, 29, 72, 0.1)' : undefined,
        borderColor: isSelected ? 'var(--accent-crimson)' : undefined,
        borderRadius: '12px'
      }}
    >
      {/* Top Badge & Rating Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {getZoneBadge(puja.zone)}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          background: 'rgba(245, 158, 11, 0.15)',
          padding: '1px 6px',
          borderRadius: '8px',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          color: '#fbbf24',
          fontSize: '0.74rem',
          fontWeight: '800'
        }}>
          <Star size={11} fill="#fbbf24" />
          {puja.rating}
        </div>
      </div>

      {/* Pandal Name & Bengali Title */}
      <div>
        <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1.2' }}>
          {puja.name}
        </h3>
        <p className="bengali-title" style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: '700', marginTop: '1px' }}>
          {puja.bengaliName}
        </p>
      </div>

      {/* Live Crowd Summary */}
      {getCrowdBadge(puja.crowdLevel, puja.crowdStatus)}

      {/* Nearest Metro Access & Address */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Train size={12} style={{ color: 'var(--accent-cyan)' }} />
          <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>{puja.nearestMetro}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <MapPin size={12} style={{ color: 'var(--accent-crimson)' }} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{puja.address}</span>
        </div>
      </div>

      {/* Ultra-Compact Primary Button */}
      <button
        onClick={() => onDirections(puja)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          padding: '7px 10px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, var(--accent-crimson), #be123c)',
          border: 'none',
          color: '#fff',
          fontWeight: '700',
          fontSize: '0.78rem',
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(225, 29, 72, 0.3)',
          transition: 'all 0.2s ease',
          marginTop: '2px'
        }}
      >
        <Navigation size={13} /> Get Direction & View Map
      </button>
    </div>
  );
}
