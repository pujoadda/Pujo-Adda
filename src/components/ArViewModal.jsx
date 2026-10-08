import React, { useState } from 'react';
import { Camera, X, Compass, MapPin, Utensils, AlertCircle } from 'lucide-react';

export default function ArViewModal({ onClose }) {
  const [arSupported, setArSupported] = useState(true);

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 10000 }}>
      <div
        className="glass-panel animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '780px',
          maxWidth: '96vw',
          height: '540px',
          maxHeight: '90vh',
          borderRadius: '28px',
          padding: 0,
          position: 'relative',
          overflow: 'hidden',
          border: '2px solid var(--accent-gold)'
        }}
      >
        {/* Simulated Camera Feed Container */}
        <div style={{ position: 'relative', width: '100%', height: '100%', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Simulated Street Background Canvas */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 70%, #020617 100%)',
            opacity: 0.9
          }} />

          {/* AR Floating Direction Overlays (Section 196) */}
          <div style={{ position: 'absolute', top: '25%', left: '15%', zIndex: 5 }} className="animate-fade-in">
            <div style={{
              background: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid var(--accent-gold)',
              padding: '10px 16px',
              borderRadius: '16px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 0 20px rgba(245,158,11,0.5)'
            }}>
              <span style={{ fontSize: '1.2rem' }}>🪔</span>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--accent-gold)' }}>← Bagbazar Sarbojanin</div>
                <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>180m away • High Wait (~45 mins)</div>
              </div>
            </div>
          </div>

          <div style={{ position: 'absolute', top: '40%', right: '20%', zIndex: 5 }} className="animate-fade-in">
            <div style={{
              background: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid #38bdf8',
              padding: '10px 16px',
              borderRadius: '16px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 0 20px rgba(56,189,248,0.5)'
            }}>
              <span style={{ fontSize: '1.2rem' }}>🚇</span>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#38bdf8' }}>→ Shyambazar Metro Gate 1</div>
                <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>450m away • Open Now</div>
              </div>
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: '30%', left: '35%', zIndex: 5 }} className="animate-fade-in">
            <div style={{
              background: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid #4ade80',
              padding: '10px 16px',
              borderRadius: '16px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 0 20px rgba(74,222,128,0.5)'
            }}>
              <span style={{ fontSize: '1.2rem' }}>🍲</span>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#4ade80' }}>↑ Bhog Stalls</div>
                <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>90m away • ~15 mins queue</div>
              </div>
            </div>
          </div>

          {/* Section 198: EXIT AR Control Header */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15,23,42,0.8)', padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.85rem', fontWeight: '800' }}>
              <Camera size={16} style={{ color: 'var(--accent-gold)' }} />
              <span>AR STREET CAMERA OVERLAY ACTIVE</span>
            </div>

            <button
              onClick={onClose}
              style={{
                padding: '8px 18px',
                borderRadius: '20px',
                background: '#e11d48',
                border: 'none',
                color: '#fff',
                fontWeight: '900',
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(225, 29, 72, 0.4)'
              }}
            >
              EXIT AR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
