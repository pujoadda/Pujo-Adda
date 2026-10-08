import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { FESTIVALS_LIST } from '../data/festivals';

export default function HeroCarousel({ onSelectFestival }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);

  // Auto slide every 4 seconds unless paused
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FESTIVALS_LIST.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % FESTIVALS_LIST.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + FESTIVALS_LIST.length) % FESTIVALS_LIST.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (diffX > 50) handleNext();
    else if (diffX < -50) handlePrev();
  };

  const activeFest = FESTIVALS_LIST[currentIndex];

  return (
    <div
      className="hero-carousel-container animate-fade-in"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'relative',
        width: '100%',
        height: '420px',
        borderRadius: '28px',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        border: '1.5px solid var(--border-glow)'
      }}
    >
      {/* Background Hero Image with Gradient Overlay */}
      <img
        src={activeFest.bannerImage}
        alt={activeFest.name}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isPaused ? 'scale(1.03)' : 'scale(1)'
        }}
      />

      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.85) 65%, rgba(15,23,42,0.98) 100%)'
      }} />

      {/* Decorative Festivity Glow */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(15,23,42,0.7)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(245, 158, 11, 0.4)',
        padding: '6px 14px',
        borderRadius: '20px',
        color: '#fbbf24',
        fontSize: '0.8rem',
        fontWeight: '800'
      }}>
        <Sparkles size={14} />
        <span>{activeFest.status}</span>
      </div>

      {/* Carousel Card Content Overlay */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '30px',
        right: '30px',
        color: '#ffffff',
        zIndex: 2
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{
            fontSize: '0.78rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #e11d48, #f59e0b)',
            padding: '4px 12px',
            borderRadius: '12px',
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {activeFest.season} • {activeFest.state}
          </span>

          <span style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={14} /> {activeFest.startDate} to {activeFest.endDate}
          </span>
        </div>

        <h2 style={{
          fontSize: '2.2rem',
          fontWeight: '900',
          margin: '0 0 6px 0',
          textShadow: '0 4px 15px rgba(0,0,0,0.8)',
          letterSpacing: '-0.5px',
          color: '#ffffff'
        }}>
          {activeFest.name} <span style={{ fontSize: '1.4rem', opacity: 0.85, fontWeight: '700' }}>({activeFest.bengaliName})</span>
        </h2>

        <p style={{
          fontSize: '0.95rem',
          color: '#e2e8f0',
          maxWidth: '780px',
          margin: '0 0 16px 0',
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {activeFest.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => onSelectFestival(activeFest)}
            style={{
              padding: '12px 24px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--accent-gold), #d97706)',
              border: 'none',
              color: '#000000',
              fontWeight: '800',
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 25px rgba(245, 158, 11, 0.4)'
            }}
          >
            <span>Explore {activeFest.name}</span>
            <ArrowRight size={18} />
          </button>

          <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontStyle: 'italic' }}>
            Verified Source: {activeFest.verifiedSource}
          </span>
        </div>
      </div>

      {/* Navigation Arrow Controls */}
      <button
        onClick={handlePrev}
        aria-label="Previous Festival"
        style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(15,23,42,0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 3
        }}
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next Festival"
        style={{
          position: 'absolute',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(15,23,42,0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 3
        }}
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicator Dots */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        display: 'flex',
        gap: '6px',
        zIndex: 3
      }}>
        {FESTIVALS_LIST.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            style={{
              width: idx === currentIndex ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: idx === currentIndex ? 'var(--accent-gold)' : 'rgba(255,255,255,0.4)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
}
