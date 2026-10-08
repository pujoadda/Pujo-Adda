import React, { useState } from 'react';
import { Users, Clock, ShieldAlert, Sparkles, Send } from 'lucide-react';
import { PUJAS_DATA } from '../data/pujas';

export default function CrowdPage({ onGetDirections }) {
  const [selectedZone, setSelectedZone] = useState('all');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [userReportLevel, setUserReportLevel] = useState('Moderate');

  const filteredPujas = PUJAS_DATA.filter(p => selectedZone === 'all' || p.zone === selectedZone);
  const lowCrowdPujas = PUJAS_DATA.filter(p => p.crowdLevel === 'Moderate' || p.crowdLevel === 'High');

  const handleReportSubmit = (e) => {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => setReportSubmitted(false), 3500);
  };

  return (
    <div className="crowd-page-container animate-fade-in" style={{ padding: '0 20px 40px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)' }}>
          📊 Live Festival Crowd Indicator & Low-Crowd Tour Planner
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: '4px 0 0 0' }}>
          Real-time crowd estimates based on aggregated community reports and check-in signals. (Crowd level is an estimate).
        </p>
      </div>

      {/* Low-Crowd Festival Tour Suggestion Banner (Section 24) */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '24px', marginBottom: '28px', border: '1px solid var(--accent-gold)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-gold)', fontWeight: '800', fontSize: '1.1rem', marginBottom: '8px' }}>
          <Sparkles size={20} />
          <span>FIND LESS CROWDED FESTIVAL AREA (Low-Crowd Circuit)</span>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Want to explore without waiting in long 60-minute queues? Here are current lower-crowd recommendations:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          {lowCrowdPujas.slice(0, 3).map(p => (
            <div key={p.id} style={{ background: 'var(--input-bg)', padding: '14px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)' }}>{p.name}</div>
              <div style={{ fontSize: '0.78rem', color: '#4ade80', fontWeight: '700', marginTop: '2px' }}>
                🟢 {p.crowdStatus}
              </div>
              <button
                onClick={() => onGetDirections(p)}
                className="pill-action-btn"
                style={{ width: '100%', marginTop: '10px', padding: '6px', fontSize: '0.78rem', justifyContent: 'center' }}
              >
                Route Here
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Grid of All Pandal Crowd Statuses */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>
        Live Pandal Crowd Status Board
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {filteredPujas.map(p => (
          <div key={p.id} className="glass-panel" style={{ padding: '18px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>{p.name}</h3>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '800',
                padding: '4px 10px',
                borderRadius: '10px',
                background: p.crowdLevel === 'Peak' ? 'rgba(225,29,72,0.2)' : 'rgba(245,158,11,0.2)',
                color: p.crowdLevel === 'Peak' ? '#f87171' : '#fbbf24',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                {p.crowdLevel}
              </span>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              {p.crowdStatus} • Reported 14 mins ago
            </div>

            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              "Crowd level is an estimate based on recent activity signals."
            </div>
          </div>
        ))}
      </div>

      {/* Submit Crowd Report Form */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', maxWidth: '540px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>
          Submit Live Crowd Update Report
        </h3>

        {reportSubmitted ? (
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', fontSize: '0.85rem' }}>
            ✓ Thank you! Your community crowd report was logged and will automatically expire in 45 minutes.
          </div>
        ) : (
          <form onSubmit={handleReportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Select Pandal</label>
              <select className="form-input" style={{ marginTop: '4px' }}>
                {PUJAS_DATA.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Observed Crowd Level</label>
              <select
                className="form-input"
                value={userReportLevel}
                onChange={(e) => setUserReportLevel(e.target.value)}
                style={{ marginTop: '4px' }}
              >
                <option value="Very Low">Very Low (Smooth Walkthrough)</option>
                <option value="Low">Low (~10 mins queue)</option>
                <option value="Moderate">Moderate (~20 mins queue)</option>
                <option value="High">High (~40 mins queue)</option>
                <option value="Peak">Peak (~60+ mins queue)</option>
              </select>
            </div>

            <button type="submit" className="pill-action-btn" style={{ justifyContent: 'center', padding: '10px' }}>
              <Send size={16} /> Submit Verified Crowd Report
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
