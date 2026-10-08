import React from 'react';
import { X, Navigation, Train, Clock, Star, Award, History, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';

export default function PujaDetailModal({ puja, onClose, onDirections }) {
  if (!puja) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(10, 12, 22, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        position: 'relative',
        width: '100%',
        maxWidth: '650px',
        maxHeight: '90vh',
        borderRadius: '24px',
        overflowY: 'auto',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Hero Image */}
        <div style={{ position: 'relative', width: '100%', height: '260px' }}>
          <img
            src={puja.image}
            alt={puja.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, #0a0c16 100%)' }} />
          
          <div style={{ position: 'absolute', bottom: '16px', left: '24px', right: '24px' }}>
            <span className={`badge badge-${puja.zone}`} style={{ marginBottom: '8px' }}>
              {puja.zoneName}
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>
              {puja.name}
            </h2>
            <p className="bengali-title" style={{ fontSize: '1.2rem', color: '#f59e0b', fontWeight: '700' }}>
              {puja.bengaliName}
            </p>
          </div>
        </div>

        {/* Modal Body Content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Quick Metrics Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
            <div style={{ padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>ESTABLISHED</p>
              <p style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fbbf24' }}>{puja.estYear}</p>
            </div>
            <div style={{ padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>RATING</p>
              <p style={{ fontSize: '1.05rem', fontWeight: '700', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={16} fill="#38bdf8" /> {puja.rating} / 5
              </p>
            </div>
            <div style={{ padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>CROWD STATUS</p>
              <p style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f87171' }}>{puja.crowdStatus}</p>
            </div>
          </div>

          {/* Theme & Story */}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Sparkles size={18} /> Theme & Concept
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#e2e8f0', lineHeight: '1.6' }}>
              {puja.description}
            </p>
          </div>

          {/* Key Highlights */}
          {puja.highlights && (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Award size={18} /> Pandal Highlights
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {puja.highlights.map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                    <CheckCircle2 size={15} style={{ color: '#38bdf8', flexShrink: 0 }} />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transit & Best Time */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '14px', borderRadius: '14px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#cbd5e1' }}>
              <Train size={18} style={{ color: '#38bdf8' }} />
              <div>
                <strong style={{ color: '#fff' }}>Nearest Metro:</strong> {puja.nearestMetro}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#cbd5e1' }}>
              <Clock size={18} style={{ color: '#fbbf24' }} />
              <div>
                <strong style={{ color: '#fff' }}>Best Time to Visit:</strong> {puja.bestTimeToVisit}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#cbd5e1' }}>
              <MapPin size={18} style={{ color: '#f43f5e' }} />
              <div>
                <strong style={{ color: '#fff' }}>Full Address:</strong> {puja.address}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => {
              onClose();
              onDirections(puja);
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '14px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #e11d48, #9f1239)',
              border: 'none',
              color: '#fff',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(225, 29, 72, 0.4)',
              transition: 'all 0.2s ease'
            }}
          >
            <Navigation size={18} /> Start Navigation to Pandal
          </button>
        </div>
      </div>
    </div>
  );
}
