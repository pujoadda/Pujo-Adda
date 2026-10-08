import React, { useState, useEffect, useRef } from 'react';
import { Footprints, MapPin, Sparkles, Navigation, ShieldAlert, Award, ChevronRight, Zap, Search, AlertCircle, Compass, Radio } from 'lucide-react';
import { PUJAS_DATA } from '../data/pujas';
import { addPassportStamp } from '../services/firebaseService';

export default function PujoWalkMode({ user, onExitWalk }) {
  const [avatarGender, setAvatarGender] = useState('male'); // 'male' | 'female' | 'dhaki'
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [discoveredPandal, setDiscoveredPandal] = useState(null);
  const [exploredCount, setExploredCount] = useState(2);
  const [isLocationEnabled, setIsLocationEnabled] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(4.2); // km/h (Walking default)
  const [manualSearch, setManualSearch] = useState('');
  const [showManualBox, setShowManualBox] = useState(false);
  const [heading, setHeading] = useState(45); // Degrees orientation
  const [zoomScale, setZoomScale] = useState(1.2); // Map zoom scale multiplier

  const walkRoute = PUJAS_DATA.slice(0, 8);
  const currentPandal = walkRoute[currentStepIndex];

  // Dynamic Movement Mode based on Speed
  const isRunningMode = currentSpeed > 7.0; // >7 km/h triggers fast running/transit mode

  // Simulate GPS Speed & Orientation updates
  useEffect(() => {
    if (!isLocationEnabled) return;
    const interval = setInterval(() => {
      // Small random fluctuation in speed
      setCurrentSpeed((prev) => {
        const delta = (Math.random() - 0.48) * 1.5;
        const newSpeed = Math.max(0, prev + delta);
        return parseFloat(newSpeed.toFixed(1));
      });
      // Rotation orientation
      setHeading((prev) => (prev + (Math.random() * 6 - 3)) % 360);
    }, 3000);
    return () => clearInterval(interval);
  }, [isLocationEnabled]);

  const handleWalkStep = () => {
    if (currentStepIndex < walkRoute.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      const newlyDiscovered = walkRoute[nextIdx];
      setDiscoveredPandal(newlyDiscovered);
      setExploredCount((prev) => prev + 1);

      if (user) {
        addPassportStamp({
          userId: user.uid,
          pandalId: newlyDiscovered.id,
          pandalName: newlyDiscovered.name,
          area: newlyDiscovered.zoneName,
          year: 2026
        });
      }
    }
  };

  const triggerGpsLocate = () => {
    setIsLocating(true);
    if ('geolocation' in navigator && isLocationEnabled) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setIsLocating(false);
          setShowManualBox(false);
        },
        () => {
          setIsLocating(false);
          setShowManualBox(true); // Fallback to manual location input
        }
      );
    } else {
      setIsLocating(false);
      setShowManualBox(true);
    }
  };

  return (
    <div className="pujo-walk-container animate-fade-in" style={{ padding: '0 20px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Location Access Banner (Requirement 1: Permission Switcher) */}
      {!isLocationEnabled && (
        <div style={{
          padding: '12px 18px',
          borderRadius: '16px',
          background: 'rgba(239, 68, 68, 0.18)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          color: '#f87171',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} />
            <span style={{ fontSize: '0.88rem', fontWeight: '700' }}>
              Location Access Off. Tap to Enable Location Services for 3D Walk Navigation.
            </span>
          </div>
          <button
            onClick={() => setIsLocationEnabled(true)}
            className="pill-action-btn"
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
          >
            Enable Location
          </button>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <span>🏃 3D PUJO WALK & AVATAR ENGINE</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
            Location-Aware Pokémon GO Style Pandal Hop & Speed-Based 3D Animation
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Location Toggle Switch */}
          <button
            onClick={() => setIsLocationEnabled(!isLocationEnabled)}
            style={{
              padding: '8px 14px',
              borderRadius: '20px',
              background: isLocationEnabled ? 'rgba(34, 197, 94, 0.15)' : 'var(--input-bg)',
              border: isLocationEnabled ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid var(--border-color)',
              color: isLocationEnabled ? '#4ade80' : 'var(--text-secondary)',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Radio size={14} /> GPS: {isLocationEnabled ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={onExitWalk}
            style={{
              padding: '8px 16px',
              borderRadius: '14px',
              background: 'var(--input-bg)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Exit Pujo Walk
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Left Control Panel */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', border: '1px solid var(--border-glow)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 1. Avatar Selector */}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>
              1. Select 3D Exploration Avatar
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <button
                onClick={() => setAvatarGender('male')}
                style={{
                  padding: '10px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  background: avatarGender === 'male' ? 'linear-gradient(135deg, var(--accent-crimson), #be123c)' : 'var(--input-bg)',
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                🧔 Explorer
              </button>
              <button
                onClick={() => setAvatarGender('female')}
                style={{
                  padding: '10px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  background: avatarGender === 'female' ? 'linear-gradient(135deg, var(--accent-crimson), #be123c)' : 'var(--input-bg)',
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                👩 Dhunuchi Dancer
              </button>
              <button
                onClick={() => setAvatarGender('dhaki')}
                style={{
                  padding: '10px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  background: avatarGender === 'dhaki' ? 'linear-gradient(135deg, var(--accent-gold), #d97706)' : 'var(--input-bg)',
                  color: avatarGender === 'dhaki' ? '#000' : '#fff',
                  fontWeight: '800',
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                🥁 Dhaki Master
              </button>
            </div>
          </div>

          {/* 2. Speed Telemetry & Mode Indicator */}
          <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Active Velocity</span>
              <span style={{ fontSize: '1.1rem', fontWeight: '900', color: isRunningMode ? '#f43f5e' : '#38bdf8' }}>
                {currentSpeed} km/h
              </span>
            </div>

            <div style={{
              padding: '8px 12px',
              borderRadius: '10px',
              background: isRunningMode ? 'rgba(225, 29, 72, 0.2)' : 'rgba(56, 189, 248, 0.15)',
              border: isRunningMode ? '1px solid rgba(225, 29, 72, 0.4)' : '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: isRunningMode ? '#f43f5e' : '#38bdf8',
              fontSize: '0.8rem',
              fontWeight: '700'
            }}>
              {isRunningMode ? <Zap size={16} /> : <Footprints size={16} />}
              <span>
                {isRunningMode ? 'TRANSIT SPEED (>7 km/h) — Wind Particle Effect Active' : 'WALKING SPEED (<7 km/h) — Normal Pandal Stroll'}
              </span>
            </div>

            {/* Velocity Slider Control */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Simulate Travel Speed (km/h)
              </label>
              <input
                type="range"
                min="1"
                max="35"
                step="0.5"
                value={currentSpeed}
                onChange={(e) => setCurrentSpeed(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-crimson)', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* 3. Location Positioning FAB & Manual Fallback */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={triggerGpsLocate}
              disabled={isLocating}
              className="pill-action-btn under-shadow-glow"
              style={{
                padding: '12px',
                justifyContent: 'center',
                fontSize: '0.9rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, var(--accent-cyan), #0284c7)',
                color: '#fff',
                boxShadow: '0 8px 20px rgba(56, 189, 248, 0.3)'
              }}
            >
              <Navigation size={18} style={{ animation: isLocating ? 'spin 1s infinite linear' : 'none' }} />
              {isLocating ? 'Acquiring Satellite GPS...' : 'Your Location (FAB Target)'}
            </button>

            {showManualBox && (
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  placeholder="Type your current location manually..."
                  value={manualSearch}
                  onChange={(e) => setManualSearch(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: 'var(--input-bg)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    fontSize: '0.8rem'
                  }}
                />
                <button
                  onClick={() => setShowManualBox(false)}
                  style={{ padding: '8px 12px', borderRadius: '10px', background: 'var(--accent-crimson)', color: '#fff', border: 'none', fontWeight: '700' }}
                >
                  Set
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right 3D Avatar Map Canvas Simulation */}
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '24px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          minHeight: '380px',
          overflow: 'hidden',
          background: 'radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.95), rgba(3, 7, 18, 0.98))'
        }}>
          {/* Map Grid Background Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(to right, rgba(56, 189, 248, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.08) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
            pointerEvents: 'none'
          }} />

          {/* Compass Orientation Indicator */}
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0,0,0,0.6)',
            padding: '6px 12px',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'var(--accent-gold)',
            fontSize: '0.75rem',
            fontWeight: '700'
          }}>
            <Compass size={14} style={{ transform: `rotate(${heading}deg)`, transition: 'transform 0.5s' }} />
            Heading: {Math.round(heading)}°
          </div>

          {/* 3D Animated Avatar Model */}
          <div style={{
            transform: `scale(${zoomScale}) rotate(${heading}deg)`,
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
          }}>
            {/* Speed Wind Particles (When Speed > 7km/h) */}
            {isRunningMode && (
              <div style={{
                position: 'absolute',
                top: '-20px',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: '2px dashed rgba(244, 63, 94, 0.6)',
                animation: 'spin 1s infinite linear',
                pointerEvents: 'none'
              }} />
            )}

            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: isRunningMode
                ? 'linear-gradient(135deg, #e11d48, #be123c)'
                : 'linear-gradient(135deg, var(--accent-gold), #d97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              boxShadow: isRunningMode
                ? '0 0 35px rgba(225, 29, 72, 0.7)'
                : '0 0 25px rgba(245, 158, 11, 0.5)'
            }}>
              {avatarGender === 'male' ? '🧔' : avatarGender === 'female' ? '💃' : '🥁'}
            </div>

            <div style={{
              marginTop: '10px',
              padding: '4px 12px',
              borderRadius: '20px',
              background: 'rgba(0,0,0,0.85)',
              border: '1px solid var(--border-color)',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: '800',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}>
              {currentPandal.name}
            </div>
          </div>

          {/* Step Controls */}
          <div style={{ position: 'absolute', bottom: '20px', display: 'flex', gap: '12px' }}>
            <button
              onClick={handleWalkStep}
              className="pill-action-btn under-shadow-glow"
              style={{ padding: '10px 20px', fontSize: '0.85rem' }}
            >
              Step Forward to Next Pandal ({currentStepIndex + 1}/{walkRoute.length}) →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
