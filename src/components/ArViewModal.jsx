import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, Compass, MapPin, Utensils, AlertCircle, RefreshCw, Eye, Sparkles } from 'lucide-react';

export default function ArViewModal({ onClose }) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' or 'user'
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pandals' | 'food' | 'metro'
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Start live device camera stream
  const startCamera = async (facing = facingMode) => {
    setCameraError('');
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.warn('Camera access warning:', err);
      setCameraError('Camera access denied or unavailable on this device. Using simulated AR view mode.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const toggleFacingMode = () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    if (isCameraActive) {
      startCamera(nextFacing);
    }
  };

  useEffect(() => {
    // Attempt auto-starting camera on mount
    startCamera('environment');

    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 10000 }}>
      <div
        className="glass-panel animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '850px',
          maxWidth: '96vw',
          height: '580px',
          maxHeight: '92vh',
          borderRadius: '28px',
          padding: 0,
          position: 'relative',
          overflow: 'hidden',
          border: '2px solid var(--accent-gold)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)'
        }}
      >
        {/* Real Camera Feed or Simulated Street Canvas */}
        <div style={{ position: 'relative', width: '100%', height: '100%', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Real HTML5 Live Video Element */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: isCameraActive ? 'block' : 'none',
              filter: 'brightness(0.95) contrast(1.05)'
            }}
          />

          {/* Fallback Simulated Backdrop when camera is off */}
          {!isCameraActive && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 70%, #020617 100%)',
              opacity: 0.95
            }} />
          )}

          {/* AR Target HUD Reticle Overlay */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 4,
            opacity: 0.4
          }}>
            <div style={{
              width: '160px',
              height: '160px',
              border: '1.5px dashed rgba(245, 158, 11, 0.6)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse 2s infinite'
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fbbf24' }} />
            </div>
          </div>

          {/* AR Floating Street Direction Overlays */}
          {(activeTab === 'all' || activeTab === 'pandals') && (
            <div style={{ position: 'absolute', top: '22%', left: '12%', zIndex: 5 }} className="animate-fade-in">
              <div style={{
                background: 'rgba(15, 23, 42, 0.88)',
                backdropFilter: 'blur(14px)',
                border: '1.5px solid var(--accent-gold)',
                padding: '10px 16px',
                borderRadius: '16px',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 0 25px rgba(245,158,11,0.5)'
              }}>
                <span style={{ fontSize: '1.3rem' }}>🪔</span>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '900', color: 'var(--accent-gold)' }}>← Bagbazar Sarbojanin</div>
                  <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>180m away • High Wait (~45 mins)</div>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'metro') && (
            <div style={{ position: 'absolute', top: '38%', right: '12%', zIndex: 5 }} className="animate-fade-in">
              <div style={{
                background: 'rgba(15, 23, 42, 0.88)',
                backdropFilter: 'blur(14px)',
                border: '1.5px solid #38bdf8',
                padding: '10px 16px',
                borderRadius: '16px',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 0 25px rgba(56,189,248,0.5)'
              }}>
                <span style={{ fontSize: '1.3rem' }}>🚇</span>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '900', color: '#38bdf8' }}>→ Shyambazar Metro Gate 1</div>
                  <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>450m away • Open Now</div>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'food') && (
            <div style={{ position: 'absolute', bottom: '26%', left: '30%', zIndex: 5 }} className="animate-fade-in">
              <div style={{
                background: 'rgba(15, 23, 42, 0.88)',
                backdropFilter: 'blur(14px)',
                border: '1.5px solid #4ade80',
                padding: '10px 16px',
                borderRadius: '16px',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 0 25px rgba(74,222,128,0.5)'
              }}>
                <span style={{ fontSize: '1.3rem' }}>🍲</span>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '900', color: '#4ade80' }}>↑ Arsalan Biryani & Bhog Stalls</div>
                  <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>90m away • Verified Business Partner</div>
                </div>
              </div>
            </div>
          )}

          {/* Top Control Bar */}
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            right: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 10
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(12px)',
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              color: '#fff',
              fontSize: '0.82rem',
              fontWeight: '800'
            }}>
              <Camera size={16} style={{ color: isCameraActive ? '#10b981' : 'var(--accent-gold)' }} />
              <span>{isCameraActive ? 'LIVE DEVICE CAMERA AR ACTIVE' : 'SIMULATED AR CAMERA MODE'}</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {!isCameraActive ? (
                <button
                  onClick={() => startCamera()}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    color: '#fff',
                    fontWeight: '800',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  <Camera size={14} /> Open Device Camera
                </button>
              ) : (
                <button
                  onClick={toggleFacingMode}
                  title="Switch Front/Rear Camera"
                  style={{
                    padding: '8px 12px',
                    borderRadius: '20px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <RefreshCw size={14} /> Flip Camera
                </button>
              )}

              <button
                onClick={onClose}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  background: '#e11d48',
                  border: 'none',
                  color: '#fff',
                  fontWeight: '900',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(225, 29, 72, 0.4)'
                }}
              >
                EXIT AR
              </button>
            </div>
          </div>

          {/* Bottom Filter Pills & Camera Status Notice */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            right: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { id: 'all', label: 'All AR Tags' },
                { id: 'pandals', label: '🪔 Pandals' },
                { id: 'food', label: '🍲 Food & Oyo' },
                { id: 'metro', label: '🚇 Metro' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    background: activeTab === t.id ? 'var(--accent-gold)' : 'rgba(15,23,42,0.85)',
                    color: activeTab === t.id ? '#000' : '#fff',
                    fontWeight: '800',
                    fontSize: '0.76rem',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {cameraError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '0.72rem',
                fontWeight: '700'
              }}>
                {cameraError}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

