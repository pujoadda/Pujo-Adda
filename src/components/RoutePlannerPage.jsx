import React, { useState } from 'react';
import { Route, MapPin, Navigation, Download, FileText, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { PUJAS_DATA } from '../data/pujas';
import { optimizeMultiStopRoute } from '../services/routeService';

export default function RoutePlannerPage({ userLocation, onStartPujoWalk }) {
  const [selectedZone, setSelectedZone] = useState('north');
  const [transportMode, setTransportMode] = useState('walking'); // 'walking' | 'car' | 'transit'
  const [selectedPandalIds, setSelectedPandalIds] = useState([
    'bagbazar-sarbojanin',
    'sovabazar-rajbari',
    'kumartuli-park',
    'ahiritola-sarbojanin'
  ]);

  const availablePujas = PUJAS_DATA.filter(p => p.zone === selectedZone);

  const togglePandalSelection = (id) => {
    if (selectedPandalIds.includes(id)) {
      setSelectedPandalIds(selectedPandalIds.filter(item => item !== id));
    } else {
      setSelectedPandalIds([...selectedPandalIds, id]);
    }
  };

  // Calculate optimized route
  const selectedObjList = PUJAS_DATA.filter(p => selectedPandalIds.includes(p.id));
  const routeCalculation = optimizeMultiStopRoute(userLocation || { lat: 22.5626, lng: 88.3630 }, selectedObjList, transportMode);

  // Section 117: PDF Export Generator
  const handleExportPdf = () => {
    const content = `
=== PUJO ADDA TOUR PLAN ===
Festival: Durga Puja 2026
Start Point: ${userLocation?.name || 'Kolkata Center'}
Transport Mode: ${transportMode.toUpperCase()}
Total Distance: ${routeCalculation.totalKm} km
Estimated Time: ${routeCalculation.totalMins} mins
Number of Stops: ${routeCalculation.stops.length}

STOPS IN ORDER:
${routeCalculation.stops.map((s, idx) => `${idx + 1}. ${s.name} (${s.legDistanceKm} km leg) - Metro: ${s.nearestMetro}`).join('\n')}

Emergency Contacts: Police 100 | Ambulance 102 | Pujo Adda Helpline 112
Downloaded for offline tour view.
    `;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Pujo_Adda_Tour_Plan_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="route-planner-container animate-fade-in" style={{ padding: '0 20px 40px' }}>
      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)' }}>
          🗺️ Festival-Hopping Route Planner & "Complete the Area" Engine
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: '4px 0 0 0' }}>
          Calculate optimized multi-stop pandal routes, bypass road closures, and export offline PDF tour itineraries.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left Control Panel */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', border: '1px solid var(--border-glow)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>
            1. Configure Your Festival Circuit
          </h2>

          {/* Zone Selector */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Select Zone</label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              {['north', 'south', 'middle'].map(z => (
                <button
                  key={z}
                  onClick={() => setSelectedZone(z)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: selectedZone === z ? 'var(--accent-crimson)' : 'var(--input-bg)',
                    color: selectedZone === z ? '#fff' : 'var(--text-primary)',
                    fontWeight: '700',
                    fontSize: '0.8rem',
                    textTransform: 'capitalize',
                    cursor: 'pointer'
                  }}
                >
                  {z} Kolkata
                </button>
              ))}
            </div>
          </div>

          {/* Transport Mode */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Travel Mode</label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              {[
                { id: 'walking', label: '🚶 Walking' },
                { id: 'transit', label: '🚇 Metro / Transit' },
                { id: 'car', label: '🚗 Car / Bike' }
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setTransportMode(m.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: transportMode === m.id ? 'var(--accent-gold)' : 'var(--input-bg)',
                    color: transportMode === m.id ? '#000' : 'var(--text-primary)',
                    fontWeight: '800',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pandals Selection Checklist */}
          <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
            Select Pandals to Include in Circuit:
          </label>
          <div style={{ maxHeight: '260px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
            {availablePujas.map(p => {
              const isChecked = selectedPandalIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => togglePandalSelection(p.id)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: isChecked ? 'rgba(245, 158, 11, 0.15)' : 'var(--input-bg)',
                    border: isChecked ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-color)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-primary)' }}>{p.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{p.nearestMetro}</div>
                  </div>
                  {isChecked && <CheckCircle2 size={18} style={{ color: '#fbbf24' }} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Output Calculation Panel */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', border: '1px solid var(--border-glow)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-gold)', marginBottom: '16px' }}>
            2. Optimized Route Itinerary
          </h2>

          <div style={{ background: 'var(--input-bg)', padding: '16px', borderRadius: '16px', marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL DISTANCE</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--text-primary)' }}>{routeCalculation.totalKm} km</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ESTIMATED TIME</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--accent-cyan)' }}>{routeCalculation.totalMins} mins</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL STOPS</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#4ade80' }}>{routeCalculation.stops.length} Pandals</div>
            </div>
          </div>

          {/* Ordered Stops List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {routeCalculation.stops.map((stop, idx) => (
              <div
                key={stop.id}
                style={{
                  padding: '12px 16px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #e11d48, #f59e0b)',
                  color: '#fff',
                  fontWeight: '800',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {idx + 1}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-primary)' }}>{stop.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Leg Distance: {stop.legDistanceKm} km • {stop.nearestMetro}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onStartPujoWalk}
              className="pill-action-btn"
              style={{ flex: 1, justifyContent: 'center', padding: '12px' }}
            >
              🚶 Start Pujo Walk (Gamified Mode)
            </button>

            <button
              onClick={handleExportPdf}
              style={{
                padding: '12px 18px',
                borderRadius: '14px',
                background: 'var(--input-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontWeight: '700',
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Download size={16} /> Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
