import React from 'react';
import { Compass, Calendar, Route, Users, Sparkles, Utensils, BookOpen, Bot, ShieldAlert, Footprints, Camera, ArrowRight, UserPlus, MapPin, Navigation } from 'lucide-react';
import { PUJAS_DATA } from '../data/pujas';

export default function HomePage({ onNavigateTab, onSelectFestival, onOpenAuth, user }) {
  // 5 user-provided hero images for the 3D fan display
  const fanImages = [
    { title: 'Golden Sabeki Artistry', tag: '@NorthlinePujas', img: '/hero/durga_gold.png' },
    { title: 'Silver Filigree Heritage', tag: '@BonediBari', img: '/hero/durga_silver.png' },
    { title: 'Shyama Kali Mahotsav', tag: '@ThemePandals', img: '/hero/kali_maa.png', isCenter: true },
    { title: 'Park Street Lights', tag: '@ChandanNagarLights', img: '/hero/park_street.png' },
    { title: 'International Book Fair', tag: '@KolkataFairs', img: '/hero/book_fair.png' }
  ];

  return (
    <div id="home-section" className="animate-fade-in" style={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px 20px 80px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '44px'
    }}>
      {/* Hero Headline Section matching Screenshots 1, 4, 5 */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <h1 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
          fontWeight: '900',
          color: 'var(--text-primary)',
          letterSpacing: '-1.5px',
          lineHeight: 1.15,
          margin: 0
        }}>
          Discover Kolkata’s Durga Puja,
          <br />
          <span style={{
            display: 'inline-block',
            marginTop: '8px',
            padding: '4px 28px',
            borderRadius: '40px',
            background: 'var(--text-primary)',
            color: 'var(--bg-primary)',
            fontWeight: '900',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            one pandal at a time.
          </span>
        </h1>
      </div>

      {/* 5-Card 3D Fan Carousel Container (Screenshot 1, 4, 5) */}
      <div className="cards-fan-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '-20px',
        width: '100%',
        maxWidth: '900px',
        padding: '20px 0',
        perspective: '1000px'
      }}>
        {fanImages.map((card, idx) => {
          // Calculate rotation offsets for fan effect
          const rotations = [-16, -8, 0, 8, 16];
          const yOffsets = [20, 8, 0, 8, 20];
          const rot = rotations[idx];
          const yOff = yOffsets[idx];
          const isCenter = card.isCenter;

          return (
            <div
              key={idx}
              className={`fan-card ${isCenter ? 'center-card' : ''}`}
              onClick={() => onNavigateTab('pandals')}
              style={{
                width: isCenter ? '240px' : '200px',
                height: isCenter ? '320px' : '280px',
                borderRadius: '24px',
                overflow: 'hidden',
                position: 'relative',
                transform: `rotate(${rot}deg) translateY(${yOff}px) ${isCenter ? 'scale(1.08)' : 'scale(0.95)'}`,
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer',
                border: isCenter ? '2px solid rgba(225, 29, 72, 0.8)' : '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: isCenter
                  ? '0 25px 50px -10px rgba(225, 29, 72, 0.5), 0 0 30px rgba(245, 158, 11, 0.3)'
                  : '0 15px 35px rgba(0,0,0,0.4)',
                zIndex: isCenter ? 5 : 5 - Math.abs(idx - 2),
                marginLeft: idx > 0 ? '-30px' : '0'
              }}
            >
              <img
                src={card.img}
                alt={card.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.85) 100%)'
              }} />

              {/* Tag Badge */}
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(8px)',
                padding: '4px 10px',
                borderRadius: '20px',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: '700'
              }}>
                {card.tag}
              </div>

              {/* Title */}
              <div style={{
                position: 'absolute',
                bottom: '14px',
                left: '14px',
                right: '14px',
                color: '#fff',
                fontSize: '0.88rem',
                fontWeight: '800'
              }}>
                {card.title}
              </div>
            </div>
          );
        })}
      </div>

      {/* Subtitle & Dual Action Buttons (Screenshot 1, 4) */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        textAlign: 'center',
        maxWidth: '650px'
      }}>
        <p style={{
          fontSize: '0.98rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          margin: 0
        }}>
          Your smart companion for exploring Kolkata’s Durga Puja. Discover pandals, find them on the map, and plan your perfect pandal-hopping journey with us.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
          <button
            onClick={() => onNavigateTab('map')}
            className="pill-action-btn under-shadow-glow"
            style={{
              padding: '12px 24px',
              borderRadius: '30px',
              background: 'linear-gradient(135deg, var(--accent-crimson), #be123c)',
              color: '#ffffff',
              fontWeight: '800',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 12px 30px -5px rgba(225, 29, 72, 0.45)'
            }}
          >
            <MapPin size={18} /> Explore Interactive Map & Routes →
          </button>

          <button
            onClick={user ? () => onNavigateTab('pandals') : onOpenAuth}
            className="under-shadow-glow"
            style={{
              padding: '12px 24px',
              borderRadius: '30px',
              background: 'var(--input-bg)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontWeight: '700',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <UserPlus size={18} /> Register for Search & Favorites
          </button>
        </div>
      </div>

      {/* Features Showcase Section (Screenshot 5) */}
      <section style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        marginTop: '20px'
      }}>
        {/* Showcase Badge */}
        <div style={{
          padding: '4px 16px',
          borderRadius: '20px',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          background: 'rgba(245, 158, 11, 0.1)',
          color: 'var(--accent-gold)',
          fontSize: '0.75rem',
          fontWeight: '800',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          [ FEATURES SHOWCASE ]
        </div>

        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: '900',
          color: 'var(--text-primary)',
          letterSpacing: '-0.5px',
          margin: 0,
          textAlign: 'center'
        }}>
          Smart Pandal Discovery & Parikrama Suite
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          width: '100%'
        }}>
          {/* Card 1 */}
          <div className="glass-card under-shadow-glow" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.2rem' }}>🔲</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                85+ Iconic Pandals Listed
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              NORTH, SOUTH & CENTRAL KOLKATA SHARAD SAMMAN WINNERS, CENTURY-OLD BONEDI BARI TRADITIONS & ARTISTIC THEME INSTALLATIONS.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card under-shadow-glow" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.2rem' }}>🔲</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                3 Zones: North, South & Middle
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              3 ZONES, NORTH, SOUTH & MIDDLE, FILTERED BY METRO & REGION WITH LIVE MAP BOUNDARIES AND METRO STATION DISTANCE.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card under-shadow-glow" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.2rem' }}>🔲</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                Live Turn-by-Turn Route Navigation
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              INTERACTIVE LEAFLET PARIKRAMA ROUTING WITH REAL-TIME GPS RE-POSITIONING & METRO ACCESS DIRECTLY ON YOUR MOBILE.
            </p>
          </div>
        </div>
      </section>

      {/* Grid of All Core Feature Modules */}
      <section style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
          Explore Pujo Adda Feature Modules
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Module 1 */}
          <div className="glass-card under-shadow-glow" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--accent-crimson)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Calendar size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>All India Festivals</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                Browse Durga Puja, Kali Puja, Diwali, Christmas, Holi & regional fairs across all States & Union Territories of India.
              </p>
            </div>
            <button onClick={() => onNavigateTab('festivals')} className="pill-action-btn" style={{ justifyContent: 'center' }}>
              Open Festivals Directory
            </button>
          </div>

          {/* Module 2 */}
          <div className="glass-card under-shadow-glow" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--accent-gold)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Compass size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>Pandals & Metro Line Index</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                85+ pandals mapped station-by-station along North-South Metro, South Kolkata, Salt Lake & Suburbs.
              </p>
            </div>
            <button onClick={() => onNavigateTab('pandals')} className="pill-action-btn" style={{ justifyContent: 'center' }}>
              Open Pandals Directory
            </button>
          </div>

          {/* Module 3 */}
          <div className="glass-card under-shadow-glow" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--accent-cyan)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Route size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>Multi-Stop Route Planner</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                Calculate shortest/fastest & alternative routes, "Complete the Area" mode, and download PDF tour itineraries.
              </p>
            </div>
            <button onClick={() => onNavigateTab('planner')} className="pill-action-btn" style={{ justifyContent: 'center' }}>
              Plan Pandal Circuit
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
