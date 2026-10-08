import React from 'react';
import { Award, Compass, Route, Sparkles, BookOpen, Heart, MapPin, Music } from 'lucide-react';

export default function AboutPage({ onNavigateTab }) {
  return (
    <div className="animate-fade-in" style={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px 20px 80px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '40px'
    }}>
      {/* Top Header Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 18px',
        borderRadius: '30px',
        background: 'rgba(245, 158, 11, 0.12)',
        border: '1px solid rgba(245, 158, 11, 0.4)',
        color: 'var(--accent-gold)',
        fontSize: '0.85rem',
        fontWeight: '700'
      }}>
        <Sparkles size={15} /> Cultural Heritage & Celebration Guide
      </div>

      {/* Hero Title & Subtitle */}
      <div style={{ textAlign: 'center', maxWidth: '800px' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '900',
          color: 'var(--text-primary)',
          letterSpacing: '-0.8px',
          marginBottom: '10px'
        }}>
          About Pujo Adda & Kolkata Durga Puja 2026
        </h1>
        <p className="bengali-title" style={{
          fontSize: '1.25rem',
          color: 'var(--accent-gold)',
          fontWeight: '700',
          lineHeight: 1.5
        }}>
          ইউনেস্কো স্বীকৃত কলকাতার দুর্গোৎসব ও আবহমান ঐতিহ্য
        </p>
      </div>

      {/* Top 3 Core Feature Cards with Ambient Under-Shadow */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        width: '100%'
      }}>
        {/* Card 1 */}
        <div className="glass-card under-shadow-glow" style={{
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'rgba(245, 158, 11, 0.2)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            color: 'var(--accent-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Award size={24} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            UNESCO Intangible Cultural Heritage
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
            In December 2021, Kolkata's Durga Puja was officially inscribed on UNESCO's Representative List of the Intangible Cultural Heritage of Humanity. It is an extraordinary 5-day public art installation festival uniting millions across all communities.
          </p>
        </div>

        {/* Card 2 */}
        <div className="glass-card under-shadow-glow" style={{
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'rgba(225, 29, 72, 0.2)',
            border: '1px solid rgba(225, 29, 72, 0.4)',
            color: 'var(--accent-crimson)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Heart size={24} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            The Essence of "Pujo Adda"
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
            "Adda" is the iconic Bengali tradition of spontaneous, lively intellectual conversation, laughter, and camaraderie. During Sharadotsav, street food stalls, dhak beats, pandal hopping queues, and tea corners transform into vibrant social hubs.
          </p>
        </div>

        {/* Card 3 (Active highlight in screenshot) */}
        <div className="glass-card under-shadow-glow" style={{
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          position: 'relative',
          overflow: 'hidden',
          borderColor: 'rgba(245, 158, 11, 0.6)',
          boxShadow: '0 15px 35px -5px rgba(245, 158, 11, 0.3)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'rgba(56, 189, 248, 0.2)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            color: 'var(--accent-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Compass size={24} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            Smart Route & Metro Guidance
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
            Pujo Adda provides interactive Leaflet maps with custom zone markers, nearest metro station distance calculation, turn-by-turn route polylines, crowd waiting status, and synthesized Web Audio Dhak beats.
          </p>
        </div>
      </div>

      {/* Key Durga Puja Traditions Section */}
      <div className="glass-panel" style={{
        width: '100%',
        padding: '32px',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <h2 style={{
          fontSize: '1.4rem',
          fontWeight: '900',
          color: 'var(--text-primary)',
          letterSpacing: '-0.3px',
          margin: 0
        }}>
          Key Durga Puja Traditions Highlighted in Pujo Adda
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {/* Tradition 1 */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '1.4rem' }}>🏺</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--accent-gold)', margin: 0 }}>
                Kumartuli Clay Idol Artistry
              </h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Handcrafted clay sculptures sculpted along the banks of the Hooghly River in North Kolkata's traditional artisan alley.
            </p>
          </div>

          {/* Tradition 2 */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '1.4rem' }}>🏛️</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--accent-cyan)', margin: 0 }}>
                Bonedi Bari Heritage Pujas
              </h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Centuries-old aristocratic household celebrations at Sovabazar Rajbari, Laha Bari, and Rani Rashmoni's thakurbali.
            </p>
          </div>

          {/* Tradition 3 */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '1.4rem' }}>🥁</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--accent-crimson)', margin: 0 }}>
                Dhunuchi Naach & Dhak Rhythm
              </h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Traditional camphor dance accompanied by thunderous dhak beat tempos during Sandhya Aarti and Vijaya Dashami.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
