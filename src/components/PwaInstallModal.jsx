import React, { useState, useEffect } from 'react';
import { Download, Sparkles, X, CheckCircle, Smartphone } from 'lucide-react';

export default function PwaInstallModal() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if user already dismissed or installed PWA in session
    const isDismissed = localStorage.getItem('pujo_pwa_dismissed');
    
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isDismissed) {
        setShowModal(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Auto-prompt after 2.5 seconds on first visit
    const timer = setTimeout(() => {
      if (!isDismissed && !isInstalled) {
        setShowModal(true);
      }
    }, 2500);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        localStorage.setItem('pujo_pwa_dismissed', 'installed');
      }
      setDeferredPrompt(null);
      setShowModal(false);
    } else {
      // Direct Web App approve fallback simulation
      setIsInstalled(true);
      localStorage.setItem('pujo_pwa_dismissed', 'approved');
      setShowModal(false);
    }
  };

  const handleClose = () => {
    localStorage.setItem('pujo_pwa_dismissed', 'true');
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      background: 'rgba(3, 7, 18, 0.82)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }} className="animate-fade-in">
      <div className="glass-panel under-shadow-glow" style={{
        width: '100%',
        maxWidth: '420px',
        borderRadius: '28px',
        padding: '32px 28px',
        border: '1.5px solid var(--border-glow)',
        background: 'rgba(15, 15, 24, 0.95)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 35px rgba(225, 29, 72, 0.35)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255,255,255,0.08)',
            border: 'none',
            color: 'var(--text-secondary)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={16} />
        </button>

        {/* Pujo Adda Custom Logo */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <img
            src="/logo.png"
            alt="Pujo Adda Logo"
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '24px',
              objectFit: 'cover',
              boxShadow: '0 12px 30px rgba(225, 29, 72, 0.5)',
              border: '2px solid rgba(245, 158, 11, 0.6)'
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: '-6px',
            right: '-6px',
            background: 'var(--accent-crimson)',
            color: '#fff',
            borderRadius: '50%',
            width: '26px',
            height: '26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 10px rgba(225, 29, 72, 0.8)'
          }}>
            <Sparkles size={14} />
          </div>
        </div>

        {/* Title */}
        <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>
          Install Pujo Adda App
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: '700', margin: '0 0 20px 0' }}>
          Connecting Devotion, Culture & Joy
        </p>

        {/* Feature Highlights */}
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '24px',
          textAlign: 'left',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '16px',
          borderRadius: '16px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle size={18} style={{ color: '#4ade80', flexShrink: 0 }} />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: '600' }}>
              Instant Offline Maps & Pandal Routes
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle size={18} style={{ color: '#4ade80', flexShrink: 0 }} />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: '600' }}>
              85+ Pandals, Archives & Live Crowd Radar
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle size={18} style={{ color: '#4ade80', flexShrink: 0 }} />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: '600' }}>
              Fast Native App Experience (PWA Approved)
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={handleInstallClick}
            className="pill-action-btn under-shadow-glow"
            style={{
              width: '100%',
              padding: '14px',
              justifyContent: 'center',
              fontSize: '0.95rem',
              fontWeight: '800',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, var(--accent-crimson), #be123c)',
              color: '#fff',
              border: 'none',
              boxShadow: '0 12px 30px rgba(225, 29, 72, 0.5)'
            }}
          >
            <Download size={18} /> Approve & Install PWA
          </button>

          <button
            onClick={handleClose}
            style={{
              width: '100%',
              padding: '10px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.82rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Continue in Web Browser
          </button>
        </div>
      </div>
    </div>
  );
}
