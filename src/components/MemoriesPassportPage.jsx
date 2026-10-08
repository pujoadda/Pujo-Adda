import React, { useState, useEffect } from 'react';
import { BookOpen, Lock, Globe, Plus, Award, Calendar, Sparkles, CheckCircle2, Trash2 } from 'lucide-react';
import { saveFestivalMemory, getUserMemories, getUserPassportStamps } from '../services/firebaseService';

export default function MemoriesPassportPage({ user, onOpenAuth }) {
  const [subTab, setSubTab] = useState('memories'); // 'memories' | 'passport'
  const [memoriesList, setMemoriesList] = useState([]);
  const [stampsList, setStampsList] = useState([]);
  const [selectedYear, setSelectedYear] = useState('2026');

  // Form State for New Memory
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [memTitle, setMemTitle] = useState('');
  const [memNotes, setMemNotes] = useState('');
  const [memVisibility, setMemVisibility] = useState('PRIVATE'); // MANDATORY PRIVATE BY DEFAULT (Section 49)

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    const mems = await getUserMemories(user.uid);
    const stmps = await getUserPassportStamps(user.uid);
    setMemoriesList(mems);
    setStampsList(stmps);
  };

  const handleSaveMemory = async (e) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }
    const res = await saveFestivalMemory({
      userId: user.uid,
      title: memTitle,
      notes: memNotes,
      visibility: memVisibility,
      year: parseInt(selectedYear),
      date: new Date().toLocaleDateString()
    });

    if (res.success) {
      setShowCreateModal(false);
      setMemTitle('');
      setMemNotes('');
      loadUserData();
    }
  };

  return (
    <div className="memories-passport-container animate-fade-in" style={{ padding: '0 20px 40px' }}>
      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)' }}>
          📖 MY FESTIVAL MEMORIES & DIGITAL PUJO PASSPORT
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: '4px 0 0 0' }}>
          Personal travel diary (Private by default) and verified geofenced Pandal Passport stamp collection.
        </p>
      </div>

      {!user && (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', marginBottom: '24px', border: '1px solid var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              🔒 Account Sign-In Required
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              Sign in to record your private festival memories, photos, and collect verified geofenced Pandal Passport stamps!
            </p>
          </div>
          <button
            onClick={onOpenAuth}
            style={{
              padding: '10px 20px',
              borderRadius: '28px',
              background: 'linear-gradient(135deg, #e11d48, #f59e0b)',
              border: 'none',
              color: '#fff',
              fontWeight: '800',
              fontSize: '0.86rem',
              cursor: 'pointer'
            }}
          >
            Sign In / Register Now
          </button>
        </div>
      )}

      {/* Sub Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setSubTab('memories')}
            style={{
              padding: '10px 18px',
              borderRadius: '14px',
              border: 'none',
              background: subTab === 'memories' ? 'var(--accent-crimson)' : 'var(--input-bg)',
              color: subTab === 'memories' ? '#fff' : 'var(--text-secondary)',
              fontWeight: '800',
              fontSize: '0.86rem',
              cursor: 'pointer'
            }}
          >
            🔒 Personal Memories ({memoriesList.length})
          </button>
          <button
            onClick={() => setSubTab('passport')}
            style={{
              padding: '10px 18px',
              borderRadius: '14px',
              border: 'none',
              background: subTab === 'passport' ? 'var(--accent-crimson)' : 'var(--input-bg)',
              color: subTab === 'passport' ? '#fff' : 'var(--text-secondary)',
              fontWeight: '800',
              fontSize: '0.86rem',
              cursor: 'pointer'
            }}
          >
            📕 Pujo Passport ({stampsList.length} Stamps)
          </button>
        </div>

        {/* Year Selector */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {['2026', '2025', '2024'].map(y => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              style={{
                padding: '6px 12px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                background: selectedYear === y ? 'var(--accent-gold)' : 'var(--input-bg)',
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

      {/* SUB TAB 1: FESTIVAL MEMORIES */}
      {subTab === 'memories' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              How did I spend my Puja last year? (Memories are <strong>PRIVATE by default</strong>).
            </span>

            <button
              onClick={() => {
                if (!user) onOpenAuth();
                else setShowCreateModal(true);
              }}
              className="pill-action-btn"
              style={{ padding: '8px 16px', fontSize: '0.82rem' }}
            >
              <Plus size={16} /> Record New Memory
            </button>
          </div>

          {memoriesList.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {memoriesList.map(mem => (
                <div key={mem.id} className="glass-panel" style={{ padding: '20px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>{mem.title}</h3>
                    <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '8px', background: mem.visibility === 'PRIVATE' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(34, 197, 94, 0.15)', color: mem.visibility === 'PRIVATE' ? '#38bdf8' : '#4ade80', fontWeight: '800' }}>
                      {mem.visibility === 'PRIVATE' ? '🔒 PRIVATE' : '🌐 PUBLIC'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    {mem.date || 'Puja 2026'} • Year {mem.year || 2026}
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {mem.notes}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '50px 20px', textAlign: 'center', borderRadius: '24px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🔒</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                No saved memories for {selectedYear} yet.
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 16px' }}>
                Record your pandal hopping experiences, photos, and personal highlights safely.
              </p>
            </div>
          )}
        </div>
      )}

      {/* SUB TAB 2: PUJO PASSPORT (Sections 199-204) */}
      {subTab === 'passport' && (
        <div>
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '24px', marginBottom: '24px', border: '1px solid var(--accent-gold)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontWeight: '800', textTransform: 'uppercase' }}>
                  EXPLORER LEVEL (Section 203)
                </span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff', margin: '2px 0 0 0' }}>
                  {stampsList.length >= 10 ? '👑 PUJO HOPPING PRO' : stampsList.length >= 5 ? '🏅 PANDAL HOPPER' : '🌱 FESTIVAL EXPLORER'}
                </h2>
              </div>

              <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--accent-gold)' }}>
                {stampsList.length} STAMPS UNLOCKED
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {stampsList.map(stamp => (
              <div key={stamp.id} style={{ background: 'var(--input-bg)', padding: '16px', borderRadius: '20px', border: '2px solid var(--accent-gold)', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '6px' }}>🪔</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-primary)' }}>{stamp.pandalName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: '600', marginTop: '2px' }}>{stamp.area}</div>
                <div style={{ fontSize: '0.7rem', color: '#4ade80', marginTop: '6px' }}>✓ Verified Geofenced Check-In</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Memory Modal */}
      {showCreateModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="glass-panel animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ width: '460px', maxWidth: '92vw', borderRadius: '24px', padding: '28px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>
              Record Festival Memory
            </h2>

            <form onSubmit={handleSaveMemory} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '700' }}>Memory Title</label>
                <input type="text" className="form-input" placeholder="e.g. Saptami Night North Kolkata Walk" value={memTitle} onChange={(e) => setMemTitle(e.target.value)} required />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '700' }}>Personal Experience & Notes</label>
                <textarea className="form-input" rows={4} placeholder="Describe the pandals, food, companions..." value={memNotes} onChange={(e) => setMemNotes(e.target.value)} required />
              </div>

              {/* Section 49: MANDATORY PRIVATE DEFAULT WITH SWITCH */}
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '700', marginBottom: '4px', display: 'block' }}>
                  Privacy Visibility (Default: PRIVATE)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setMemVisibility('PRIVATE')}
                    style={{
                      padding: '8px',
                      borderRadius: '10px',
                      border: 'none',
                      background: memVisibility === 'PRIVATE' ? 'var(--accent-cyan)' : 'var(--input-bg)',
                      color: memVisibility === 'PRIVATE' ? '#000' : 'var(--text-secondary)',
                      fontWeight: '800',
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    🔒 PRIVATE (Owner Only)
                  </button>

                  <button
                    type="button"
                    onClick={() => setMemVisibility('PUBLIC')}
                    style={{
                      padding: '8px',
                      borderRadius: '10px',
                      border: 'none',
                      background: memVisibility === 'PUBLIC' ? 'var(--accent-crimson)' : 'var(--input-bg)',
                      color: memVisibility === 'PUBLIC' ? '#fff' : 'var(--text-secondary)',
                      fontWeight: '800',
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    🌐 PUBLIC (Community Feed)
                  </button>
                </div>
              </div>

              <button type="submit" className="pill-action-btn" style={{ justifyContent: 'center', padding: '12px' }}>
                Save Memory to Database
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
