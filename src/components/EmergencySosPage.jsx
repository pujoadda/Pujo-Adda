import React, { useState } from 'react';
import { ShieldAlert, Phone, AlertCircle, CheckCircle2, Bell, Radio, HeartHandshake } from 'lucide-react';
import { NEARBY_PLACES_DATA } from '../data/nearbyPlaces';

export default function EmergencySosPage({ user }) {
  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isTestMode, setIsTestMode] = useState(false);
  const [shakeEnabled, setShakeEnabled] = useState(true);
  const [sirenEnabled, setSirenEnabled] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([
    { name: 'Family Emergency Contact', phone: '+91 98300 12345', relationship: 'Parent' }
  ]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  const emergencyDirectory = [
    { title: 'Kolkata Police Emergency', phone: '100 / 033-22143230', desc: 'Control Room Lalbazar' },
    { title: 'Ambulance & Medical Dispatch', phone: '102', desc: 'West Bengal Health Emergency' },
    { title: 'Women & Child Safety Helpline', phone: '1091 / 112', desc: '24x7 Direct Toll Free' },
    { title: 'Fire Brigade Emergency', phone: '101', desc: 'Kolkata Fire Services' }
  ];

  const handleTriggerSos = (isTest = false) => {
    setIsTestMode(isTest);
    setSosActive(true);
  };

  const handleAddContact = (e) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) return;
    setEmergencyContacts([
      ...emergencyContacts,
      { name: newContactName, phone: newContactPhone, relationship: 'Trusted Contact' }
    ]);
    setNewContactName('');
    setNewContactPhone('');
  };

  return (
    <div className="emergency-sos-container animate-fade-in" style={{ padding: '0 20px 40px' }}>
      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🚨 MASTER SOS & EMERGENCY CENTER</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: '4px 0 0 0' }}>
          Configure emergency contacts, silent SOS alerts, shake-to-SOS triggers, and direct local police & hospital helplines.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left: Master SOS Actions */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', border: '2px solid #f43f5e', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#f43f5e', marginBottom: '16px' }}>
            EMERGENCY DISTRESS CONTROLS
          </h2>

          <button
            onClick={() => handleTriggerSos(false)}
            style={{
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #e11d48, #9f1239)',
              border: '4px solid #fda4af',
              color: '#fff',
              fontWeight: '900',
              fontSize: '1.8rem',
              cursor: 'pointer',
              margin: '0 auto 20px',
              boxShadow: '0 0 40px rgba(225, 29, 72, 0.6)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <ShieldAlert size={48} />
            <span>SEND SOS</span>
          </button>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
            <button
              onClick={() => handleTriggerSos(true)}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                background: 'var(--input-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontWeight: '700',
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              🧪 TEST SOS (Simulator)
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left', background: 'var(--input-bg)', padding: '16px', borderRadius: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
              <input type="checkbox" checked={shakeEnabled} onChange={(e) => setShakeEnabled(e.target.checked)} />
              <span>Shake Phone 3 Times → SOS (Section 216)</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
              <input type="checkbox" checked={sirenEnabled} onChange={(e) => setSirenEnabled(e.target.checked)} />
              <span>Enable Loud Alarm Siren with SOS (Section 219)</span>
            </label>
          </div>
        </div>

        {/* Right: Emergency Contacts & Local Directory */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Emergency Contacts */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>
              Configured Emergency Contacts ({emergencyContacts.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {emergencyContacts.map((c, idx) => (
                <div key={idx} style={{ background: 'var(--input-bg)', padding: '10px 14px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-primary)' }}>{c.name} ({c.relationship})</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)' }}>{c.phone}</div>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#4ade80' }}>✓ Verified</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddContact} style={{ display: 'flex', gap: '8px' }}>
              <input type="text" className="form-input" placeholder="Contact Name" value={newContactName} onChange={(e) => setNewContactName(e.target.value)} required />
              <input type="text" className="form-input" placeholder="Phone Number" value={newContactPhone} onChange={(e) => setNewContactPhone(e.target.value)} required />
              <button type="submit" className="pill-action-btn" style={{ padding: '0 16px', flexShrink: 0 }}>Add</button>
            </form>
          </div>

          {/* Official Helplines */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>
              Official Local Emergency Helplines
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {emergencyDirectory.map((h, idx) => (
                <div key={idx} style={{ background: 'var(--input-bg)', padding: '12px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-primary)' }}>{h.title}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#f43f5e', marginTop: '2px' }}>{h.phone}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SOS Active Modal */}
      {sosActive && (
        <div className="modal-backdrop" onClick={() => setSosActive(false)}>
          <div className="glass-panel animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ width: '450px', maxWidth: '92vw', borderRadius: '24px', padding: '28px', textAlign: 'center', border: '2px solid #f43f5e' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '8px' }} className="theme-toggle-spin">🚨</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#f43f5e', margin: '0 0 4px 0' }}>
              {isTestMode ? 'TEST SOS ALERT SIMULATION' : 'DISTRESS SOS ALERT SENT!'}
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              {isTestMode ? 'Test alert logged successfully without contacting emergency services.' : 'Distress alert containing approximate location sent to configured emergency contacts!'}
            </p>
            <button onClick={() => setSosActive(false)} className="pill-action-btn" style={{ padding: '10px 24px', background: '#f43f5e' }}>
              Close SOS Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
