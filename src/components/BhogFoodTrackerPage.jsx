import React, { useState } from 'react';
import { Utensils, Clock, Send, CheckCircle2 } from 'lucide-react';
import { INITIAL_FOOD_REPORTS } from '../data/socialData';

export default function BhogFoodTrackerPage() {
  const [foodReports, setFoodReports] = useState(INITIAL_FOOD_REPORTS);
  const [selectedSpot, setSelectedSpot] = useState('Bagbazar Sarbojanin Bhog Mandap');
  const [selectedQueue, setSelectedQueue] = useState('Short Queue (~10 mins wait)');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleReportFoodQueue = (e) => {
    e.preventDefault();
    const newRep = {
      id: `food_${Date.now()}`,
      spotName: selectedSpot,
      queueStatus: selectedQueue,
      crowdLevel: selectedQueue.includes('Short') ? 'Low' : 'Moderate',
      reportedBy: 'You',
      reportedTimeAgo: 'Just now',
      source: 'Verified User Report',
      expiresInMins: 60
    };
    setFoodReports([newRep, ...foodReports]);
    setSubmittedSuccess(true);
    setTimeout(() => setSubmittedSuccess(false), 3000);
  };

  return (
    <div className="bhog-food-container animate-fade-in" style={{ padding: '0 20px 40px' }}>
      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)' }}>
          🍲 BHOG & FESTIVAL FOOD TRACKER — Queue Estimator
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: '4px 0 0 0' }}>
          Discover community Bhog distribution schedules, street food stalls, and live queue wait time reports.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Live Queue Reports Board */}
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>
            Live Community Bhog & Food Queue Reports
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {foodReports.length === 0 ? (
              <div className="glass-panel" style={{ padding: '36px 20px', textAlign: 'center', borderRadius: '20px' }}>
                <Utensils size={36} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  No Food Queue Reports Logged Yet
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Be the first to submit a food or bhog stall queue update using the form!
                </div>
              </div>
            ) : (
              foodReports.map(r => (
                <div key={r.id} className="glass-panel" style={{ padding: '18px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>{r.spotName}</h3>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', padding: '2px 8px', borderRadius: '8px', background: 'rgba(245,158,11,0.2)', color: '#fbbf24' }}>
                      {r.queueStatus}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Reported by {r.reportedBy} • {r.reportedTimeAgo} (Expires in {r.expiresInMins} mins)
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Submit Food Queue Report */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-gold)', marginBottom: '16px' }}>
            Submit Food / Bhog Queue Update
          </h2>

          {submittedSuccess && (
            <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(34,197,94,0.15)', color: '#4ade80', fontSize: '0.82rem', marginBottom: '12px' }}>
              ✓ Food queue report logged!
            </div>
          )}

          <form onSubmit={handleReportFoodQueue} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Pandal / Food Spot Name</label>
              <input type="text" className="form-input" value={selectedSpot} onChange={(e) => setSelectedSpot(e.target.value)} required />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Current Queue Status</label>
              <select className="form-input" value={selectedQueue} onChange={(e) => setSelectedQueue(e.target.value)}>
                <option value="No Queue (Instant Entry)">No Queue (Instant Entry)</option>
                <option value="Short Queue (~10 mins wait)">Short Queue (~10 mins wait)</option>
                <option value="Moderate Queue (~20 mins wait)">Moderate Queue (~20 mins wait)</option>
                <option value="Long Queue (~40 mins wait)">Long Queue (~40 mins wait)</option>
              </select>
            </div>

            <button type="submit" className="pill-action-btn" style={{ justifyContent: 'center', padding: '12px' }}>
              <Send size={16} /> Submit Food Queue Report
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
