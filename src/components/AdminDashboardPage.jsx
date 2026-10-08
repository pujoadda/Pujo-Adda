import React, { useState } from 'react';
import { ShieldCheck, UserCheck, AlertTriangle, FileText, CheckCircle2, XCircle, Sliders, Database } from 'lucide-react';
import { PUJAS_DATA } from '../data/pujas';

export default function AdminDashboardPage({ user }) {
  const [activeTab, setActiveTab] = useState('verification'); // 'verification' | 'reports' | 'data' | 'logs'
  const [pendingVerifs, setPendingVerifs] = useState([
    { id: 'v1', userName: 'Sayan Roy', email: 'sayan@example.com', submittedAt: '10 mins ago', status: 'PENDING_REVIEW' },
    { id: 'v2', userName: 'Ankita Banerjee', email: 'ankita@example.com', submittedAt: '2 hours ago', status: 'VERIFIED' }
  ]);

  const handleApprove = (id) => {
    setPendingVerifs(pendingVerifs.map(v => v.id === id ? { ...v, status: 'VERIFIED' } : v));
  };

  const handleReject = (id) => {
    setPendingVerifs(pendingVerifs.map(v => v.id === id ? { ...v, status: 'REJECTED' } : v));
  };

  return (
    <div className="admin-dashboard-container animate-fade-in" style={{ padding: '0 20px 40px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🛡️ PUJO ADDA ADMIN DASHBOARD & AUDIT CENTER</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: '4px 0 0 0' }}>
          Manage verified festival sources, Trust Check packages, reported road roadblocks, user reports, and audit logs.
        </p>
      </div>

      {/* Sub Navigation */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {[
          { id: 'verification', label: 'User Verification Review' },
          { id: 'reports', label: 'User Abuse & Content Reports' },
          { id: 'data', label: 'Festival Data & Sources Audit' },
          { id: 'logs', label: 'Admin Audit Logs' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '10px 18px',
              borderRadius: '14px',
              border: 'none',
              background: activeTab === t.id ? 'var(--accent-crimson)' : 'var(--input-bg)',
              color: activeTab === t.id ? '#fff' : 'var(--text-secondary)',
              fontWeight: '800',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: TRUST VERIFICATION REVIEW (Section 184) */}
      {activeTab === 'verification' && (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-gold)', marginBottom: '16px' }}>
            Pending User Verification Submissions ({pendingVerifs.length})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pendingVerifs.map(v => (
              <div key={v.id} style={{ background: 'var(--input-bg)', padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)' }}>{v.userName} ({v.email})</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Submitted: {v.submittedAt}</div>
                  <div style={{ fontSize: '0.78rem', color: v.status === 'VERIFIED' ? '#4ade80' : v.status === 'REJECTED' ? '#f87171' : '#fbbf24', fontWeight: '800', marginTop: '4px' }}>
                    Status: {v.status}
                  </div>
                </div>

                {v.status === 'PENDING_REVIEW' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleApprove(v.id)} style={{ padding: '8px 14px', borderRadius: '10px', background: '#22c55e', border: 'none', color: '#fff', fontWeight: '800', cursor: 'pointer' }}>
                      Approve Badge
                    </button>
                    <button onClick={() => handleReject(v.id)} style={{ padding: '8px 14px', borderRadius: '10px', background: '#ef4444', border: 'none', color: '#fff', fontWeight: '800', cursor: 'pointer' }}>
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FESTIVAL DATA & SOURCES (Section 32 & 62) */}
      {activeTab === 'data' && (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>
            Verified Festival & Pandal Database Records ({PUJAS_DATA.length})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {PUJAS_DATA.slice(0, 5).map(p => (
              <div key={p.id} style={{ background: 'var(--input-bg)', padding: '14px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-primary)' }}>{p.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{p.address}</div>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: '800', padding: '4px 10px', borderRadius: '10px', background: 'rgba(34,197,94,0.15)' }}>
                  VERIFIED RECORD ✓
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
