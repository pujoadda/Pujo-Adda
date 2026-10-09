import React, { useState, useMemo } from 'react';
import { Search, MapPin, CheckCircle2, Image as ImageIcon, X, ChevronLeft, ChevronRight, Download, Share2, Sparkles } from 'lucide-react';
import { FESTIVALS_LIST, FESTIVAL_CATEGORIES, INDIAN_STATES } from '../data/festivals';

export default function FestivalsPage({ onSelectFestival }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState('near'); // 'near' | 'select'

  // Lightbox Modal State
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeGalleryList, setActiveGalleryList] = useState([]);

  // Curated list of all drive festival photos for spotlight gallery
  const festivalDriveSpotlight = useMemo(() => [
    {
      title: 'Kojagari Lakshmi Puja 2026',
      sub: 'Goddess Lakshmi with Traditional Diyas & Alpana Art',
      src: '/images/festivals/IMG_aafe31cf-f255-42af-b541-d594b34a7a79.jpg',
      category: 'Kojagari Lakshmi Puja',
      location: 'Kolkata, West Bengal'
    },
    {
      title: 'Maa Kali & Diwali Illumination',
      sub: 'Divine Shakti Idol & Sacred Flame Puja',
      src: '/images/festivals/IMG_947add4e-9b5b-4de6-9187-a576c2befeb7.jpg',
      category: 'Kali Puja & Diwali',
      location: 'Dakshineswar / Kalighat, Kolkata'
    },
    {
      title: 'Jagaddhatri Puja - Helapukur Pandal',
      sub: 'Towering Grand Floral Pandal & Heritage Art',
      src: '/images/festivals/IMG_bd8c0653-e245-4525-a232-2a7b4015ed87.jpg',
      category: 'Jagaddhatri Puja',
      location: 'Helapukur, Chandannagar, Hooghly'
    },
    {
      title: 'Saraswati Puja - Goddess of Wisdom',
      sub: 'Divine Idol of Devi Saraswati with Veena',
      src: '/images/festivals/IMG_20ce6846-ccc2-4c38-98c6-762bf02cdc9b.jpg',
      category: 'Saraswati Puja',
      location: 'Kolkata, West Bengal'
    },
    {
      title: 'Kolkata Christmas Festival',
      sub: 'Park Street Illumination & Christmas Market Night',
      src: '/images/festivals/IMG_7b8c9eda-fb13-43cb-b0ab-da532a6eb434.jpg',
      category: 'Christmas Carnival',
      location: 'Park Street, Kolkata'
    },
    {
      title: 'Mumbai Ganesh Visarjan Procession',
      sub: 'Grand Oceanic Immersion & Water Celebrations',
      src: '/images/festivals/IMG_e2f1c203-467b-48e1-9f99-326cb8be6900.jpg',
      category: 'Ganesh Utsav',
      location: 'Girgaon Chowpatty, Mumbai'
    }
  ], []);

  const filteredFestivals = useMemo(() => {
    return FESTIVALS_LIST.filter(fest => {
      const matchCat = selectedCategory === 'all' || fest.category === selectedCategory;
      const matchState = selectedState === 'all' || fest.state === selectedState;
      const matchDist = selectedDistrict === 'all' || fest.district === selectedDistrict;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q ||
        fest.name.toLowerCase().includes(q) ||
        fest.bengaliName.toLowerCase().includes(q) ||
        fest.state.toLowerCase().includes(q) ||
        fest.district.toLowerCase().includes(q) ||
        fest.description.toLowerCase().includes(q);

      return matchCat && matchState && matchDist && matchQuery;
    });
  }, [selectedCategory, selectedState, selectedDistrict, searchQuery]);

  const availableDistricts = useMemo(() => {
    if (selectedState === 'all') return [];
    return INDIAN_STATES.find(s => s.name === selectedState)?.districts || [];
  }, [selectedState]);

  const openLightbox = (imgSrc, index = 0, customList = null) => {
    const list = customList || festivalDriveSpotlight.map(item => item.src);
    setActiveGalleryList(list);
    setLightboxIndex(index);
    setLightboxImage(imgSrc);
  };

  const handlePrevPhoto = (e) => {
    e.stopPropagation();
    if (activeGalleryList.length === 0) return;
    const newIdx = (lightboxIndex - 1 + activeGalleryList.length) % activeGalleryList.length;
    setLightboxIndex(newIdx);
    setLightboxImage(activeGalleryList[newIdx]);
  };

  const handleNextPhoto = (e) => {
    e.stopPropagation();
    if (activeGalleryList.length === 0) return;
    const newIdx = (lightboxIndex + 1) % activeGalleryList.length;
    setLightboxIndex(newIdx);
    setLightboxImage(activeGalleryList[newIdx]);
  };

  return (
    <div className="festivals-page-container animate-fade-in" style={{ padding: '0 20px 40px' }}>
      {/* Header & Title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2.1rem', fontWeight: '900', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span> All India Festival Directory & Photo Gallery</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: '4px 0 0 0' }}>
          Discover religious, cultural, heritage, and seasonal festivals across India with official high-resolution photo galleries.
        </p>
      </div>

      {/* Featured Google Drive Festival Spotlight Gallery */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', marginBottom: '32px', border: '1px solid var(--accent-gold)', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(15,23,42,0.6) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <Sparkles size={16} /> Official Festival Gallery Spotlight
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
              Curated Festival Photo Album
            </h2>
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', background: 'var(--input-bg)', padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
            📸 {festivalDriveSpotlight.length} High-Res Drive Pictures
          </span>
        </div>

        {/* Spotlight Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {festivalDriveSpotlight.map((photo, idx) => (
            <div
              key={idx}
              onClick={() => openLightbox(photo.src, idx, festivalDriveSpotlight.map(p => p.src))}
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                height: '210px',
                cursor: 'pointer',
                border: '1px solid var(--border-glow)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease'
              }}
              className="gallery-photo-card"
            >
              <img
                src={photo.src}
                alt={photo.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(15,23,42,0.92) 100%)',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                justify5Content: 'space-between',
                color: '#fff'
              }}>
                <span style={{
                  alignSelf: 'flex-start',
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  background: 'rgba(245, 158, 11, 0.85)',
                  color: '#000',
                  padding: '3px 10px',
                  borderRadius: '12px'
                }}>
                  {photo.category}
                </span>

                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '800', margin: '0 0 4px 0', color: '#ffffff' }}>
                    {photo.title}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: '#cbd5e1', margin: '0 0 6px 0', lineHeight: 1.3 }}>
                    {photo.sub}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#f59e0b', fontWeight: '700' }}>
                    <MapPin size={12} /> {photo.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Option A vs Option B Search Engine */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '20px', marginBottom: '24px', border: '1px solid var(--border-glow)' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSearchMode('near')}
            style={{
              padding: '8px 18px',
              borderRadius: '12px',
              border: 'none',
              background: searchMode === 'near' ? 'var(--accent-crimson)' : 'var(--input-bg)',
              color: searchMode === 'near' ? '#fff' : 'var(--text-secondary)',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            📍 OPTION A — Near My Location
          </button>
          <button
            onClick={() => setSearchMode('select')}
            style={{
              padding: '8px 18px',
              borderRadius: '12px',
              border: 'none',
              background: searchMode === 'select' ? 'var(--accent-crimson)' : 'var(--input-bg)',
              color: searchMode === 'select' ? '#fff' : 'var(--text-secondary)',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            🗺️ OPTION B — Select Location Hierarchy
          </button>
        </div>

        {/* Global Search Bar */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search Durga Puja, Kali Puja, Lakshmi Puja, Jagaddhatri Puja, Saraswati Puja, Christmas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '48px', fontSize: '0.95rem' }}
          />
        </div>

        {/* Location Hierarchy Selectors if Option B */}
        {searchMode === 'select' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '700' }}>State / Union Territory</label>
              <select
                className="form-input"
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedDistrict('all');
                }}
                style={{ marginTop: '4px' }}
              >
                <option value="all">All India (All States)</option>
                {INDIAN_STATES.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            {selectedState !== 'all' && (
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '700' }}>District</label>
                <select
                  className="form-input"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  style={{ marginTop: '4px' }}
                >
                  <option value="all">All Districts in {selectedState}</option>
                  {availableDistricts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Category Pills & Calendar Year Switcher */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {FESTIVAL_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: '1px solid var(--border-color)',
                  background: selectedCategory === cat.id ? 'var(--accent-gold)' : 'var(--input-bg)',
                  color: selectedCategory === cat.id ? '#000' : 'var(--text-primary)',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>Year:</span>
            {['2026', '2025', '2024'].map(y => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  background: selectedYear === y ? 'var(--accent-cyan)' : 'var(--input-bg)',
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
      </div>

      {/* Festival Cards Grid */}
      {filteredFestivals.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {filteredFestivals.map(fest => (
            <div
              key={fest.id}
              className="glass-panel"
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid var(--border-color)',
                transition: 'all 0.3s ease'
              }}
            >
              <div
                style={{ position: 'relative', height: '210px', cursor: 'pointer' }}
                onClick={() => openLightbox(fest.bannerImage, 0, fest.galleryImages || [fest.bannerImage])}
              >
                <img src={fest.bannerImage} alt={fest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 40%, rgba(15,23,42,0.95) 100%)'
                }} />
                
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  background: 'rgba(15,23,42,0.8)',
                  backdropFilter: 'blur(10px)',
                  color: '#fbbf24',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  border: '1px solid rgba(245, 158, 11, 0.4)'
                }}>
                  {fest.status}
                </span>

                <span style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '10px',
                  background: 'rgba(0,0,0,0.7)',
                  backdropFilter: 'blur(6px)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: '700'
                }}>
                  <ImageIcon size={14} /> Click to View Photo
                </span>
              </div>

              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--accent-gold)', fontWeight: '700', marginBottom: '4px' }}>
                    <MapPin size={14} /> {fest.district}, {fest.state}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                    {fest.name}
                  </h3>
                  {fest.bengaliName && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: '700', marginBottom: '8px' }}>
                      {fest.bengaliName}
                    </div>
                  )}
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                    {fest.description}
                  </p>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} style={{ color: '#4ade80' }} />
                    <span>Verified Source: {fest.verifiedSource}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => openLightbox(fest.bannerImage, 0, fest.galleryImages || [fest.bannerImage])}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-glow)',
                        background: 'var(--input-bg)',
                        color: 'var(--text-primary)',
                        fontWeight: '700',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <ImageIcon size={16} /> View Gallery
                    </button>
                    <button
                      onClick={() => onSelectFestival(fest)}
                      className="pill-action-btn"
                      style={{ flex: 1.2, justifyContent: 'center', padding: '10px', fontSize: '0.82rem' }}
                    >
                      Explore Festival
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', borderRadius: '24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🏮</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
            No verified festival information is currently available for this selected area/filter.
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
            We adhere to strict verified data guidelines. Try changing your state, district, or search category filters.
          </p>
        </div>
      )}

      {/* Lightbox Photo Viewer Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          className="animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '900px',
              maxHeight: '90vh',
              width: '100%',
              background: '#0f172a',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
              border: '1px solid var(--accent-gold)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'rgba(15,23,42,0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', fontWeight: '800', fontSize: '0.9rem' }}>
                <Sparkles size={18} /> Official Festival Directory High-Res Photo
              </div>
              <button
                onClick={() => setLightboxImage(null)}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Image View */}
            <div style={{ position: 'relative', flex: 1, minHeight: '350px', maxHeight: '65vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={lightboxImage}
                alt="Festival Photo"
                style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain' }}
              />

              {/* Prev / Next buttons */}
              {activeGalleryList.length > 1 && (
                <>
                  <button
                    onClick={handlePrevPhoto}
                    style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={handleNextPhoto}
                    style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Footer with share/download */}
            <div style={{ padding: '16px 20px', background: 'rgba(15,23,42,0.95)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                Photo {lightboxIndex + 1} of {activeGalleryList.length} • Pujo Adda Verified Media
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href={lightboxImage}
                  download
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: 'none', padding: '8px 16px', borderRadius: '12px', background: 'var(--accent-gold)', color: '#000', fontWeight: '800', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={16} /> Open Full Size
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
