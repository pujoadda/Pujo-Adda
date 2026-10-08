import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  ChevronRight,
  ChevronDown,
  MapPin,
  Music,
  Sparkles,
  Info,
  Calendar,
  Volume2,
  VolumeX,
  Filter,
  Flame,
  Award
} from 'lucide-react';
import { PUJAS_DATA } from '../data/pujas';
import { METRO_LINES } from '../data/transportData';
import { MUSIC_TRACKS } from '../data/musicData';

const MAJOR_PUJAS = [
  { id: 'durga-puja', name: 'Durga Puja', bengali: 'দুর্গাপূজা', icon: '🪔', season: 'Sharodotsav (Oct)', bg: 'linear-gradient(135deg, #e11d48, #991b1b)', desc: 'The 5-day grand festival celebrating Goddess Durga.' },
  { id: 'kali-puja', name: 'Kali Puja', bengali: 'কালীপূজা', icon: '🔱', season: 'Diwali Night (Nov)', bg: 'linear-gradient(135deg, #312e81, #1e1b4b)', desc: 'Midnight worship of Goddess Kali with diyas and lights.' },
  { id: 'saraswati-puja', name: 'Saraswati Puja', bengali: 'সরস্বতী পূজা', icon: '🪕', season: 'Vasant Panchami (Feb)', bg: 'linear-gradient(135deg, #d97706, #b45309)', desc: 'Worship of the Goddess of Knowledge, Art & Music.' },
  { id: 'lokkhi-puja', name: 'Lokkhi (Lakshmi) Puja', bengali: 'লক্ষ্মী পূজা', icon: '🪙', season: 'Kojagari Purnima', bg: 'linear-gradient(135deg, #ca8a04, #854d0e)', desc: 'Kojagari Lakshmi Puja for prosperity & good fortune.' },
  { id: 'ganesh-puja', name: 'Ganesh Puja', bengali: 'গণেশ পূজা', icon: '🐘', season: 'Ganesh Chaturthi', bg: 'linear-gradient(135deg, #ea580c, #9a3412)', desc: 'Celebration of Lord Ganesha, the remover of obstacles.' },
  { id: 'jagadhatri-puja', name: 'Jagadhatri Puja', bengali: 'জগদ্ধাত্রী পূজা', icon: '🦁', season: 'Chandannagar Special (Nov)', bg: 'linear-gradient(135deg, #059669, #065f46)', desc: 'Famed giant illumination & pandals in Chandannagar & Krishnanagar.' },
  { id: 'kartik-puja', name: 'Kartik Puja', bengali: 'কার্তিক পূজা', icon: '🦚', season: 'Katwa & Bansberia Special', bg: 'linear-gradient(135deg, #0284c7, #075985)', desc: 'Traditional Kartik Puja carnivals of Katwa and Bengal.' }
];

// Locality mapping across West Bengal
const SAMPLE_NON_KOLKATA_PUJAS = [
  { id: 'pujo-belgharia-1', pujaType: 'durga-puja', name: 'Belgharia 17 Pally Durgotsav', place: 'Belgharia', district: 'North 24 Parganas', address: '17 Pally Grounds, Belgharia, Kolkata 700056', theme: 'Traditional Dhakis & Terracotta Idol', description: 'Famous community puja in Belgharia locality known for eco-friendly pandal design.', musicId: 'track-2' },
  { id: 'pujo-sodpur-1', pujaType: 'durga-puja', name: 'Sodpur HB Town Sarbojanin', place: 'Sodpur', district: 'North 24 Parganas', address: 'HB Town Park, Sodpur', theme: 'Gramin Bengal Heritage', description: 'Major crowd puller along Sodepur Station Road with traditional lighting.', musicId: 'track-1' },
  { id: 'pujo-howrah-1', pujaType: 'durga-puja', name: 'Howrah Shibpur Sporting Club', place: 'Howrah', district: 'Howrah', address: 'Shibpur Bazar, Howrah', theme: 'Rajbari Vintage Architecture', description: 'Historic 90-year old Puja near Howrah Station.', musicId: 'track-3' },
  { id: 'pujo-malda-1', pujaType: 'durga-puja', name: 'Malda Sarbojanin English Bazar', place: 'Malda', district: 'Malda', address: 'English Bazar Grounds, Malda', theme: 'Silk City Traditions', description: 'Renowned central Malda festival featuring handicraft pandals.', musicId: 'track-2' },
  { id: 'pujo-jalpaiguri-1', pujaType: 'durga-puja', name: 'Jalpaiguri Dinbazar Durgotsav', place: 'Jalpaiguri', district: 'Jalpaiguri', address: 'Dinbazar, Jalpaiguri Town', theme: 'Dooars Forest Harmony', description: 'North Bengal cultural icon with traditional idol modeling.', musicId: 'track-5' },
  { id: 'pujo-kali-1', pujaType: 'kali-puja', name: 'Naihati Boro Maa Kali', place: 'Naihati', district: 'North 24 Parganas', address: 'Naihati Station Road', theme: '21-Feet Magnificent Idol', description: 'World-famous Boro Maa Kali Puja visited by lakhs of devotees.', musicId: 'track-7' },
  { id: 'pujo-kali-2', pujaType: 'kali-puja', name: 'Barasat Kadamgachi Kali Puja', place: 'Barasat', district: 'North 24 Parganas', address: 'Barasat Kadamgachi', theme: 'Laser Light Extravaganza', description: 'Famous Barasat Kali Puja circuit featuring illuminated gates.', musicId: 'track-6' },
  { id: 'pujo-jaga-1', pujaType: 'jagadhatri-puja', name: 'Chandannagar Strand Road Jagadhatri', place: 'Chandannagar', district: 'Hooghly', address: 'Strand Road, Chandannagar', theme: 'World Heritage Light Illuminations', description: 'Spectacular 3D moving light displays along the Hooghly river bank.', musicId: 'track-2' }
];

export default function PandalPujaModal({ onClose }) {
  const [selectedPuja, setSelectedPuja] = useState(null); // Level 1 selected (e.g. 'durga-puja')
  const [placeFilter, setPlaceFilter] = useState('');
  const [expandedZone, setExpandedZone] = useState('north'); // 'north' | 'central' | 'south'
  const [expandedCorridor, setExpandedCorridor] = useState(null);
  const [selectedPandalDetail, setSelectedPandalDetail] = useState(null);

  // Audio Playback State
  const [currentAudioTrack, setCurrentAudioTrack] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioElement, setAudioElement] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedPandalDetail) {
          setSelectedPandalDetail(null);
        } else if (selectedPuja) {
          setSelectedPuja(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, [selectedPandalDetail, selectedPuja, onClose, audioElement]);

  // Play traditional music track
  const toggleAudio = (trackId) => {
    const track = MUSIC_TRACKS.find(t => t.id === trackId) || MUSIC_TRACKS[1]; // fallback to Chandi Path

    if (currentAudioTrack && currentAudioTrack.id === track.id && isPlayingAudio) {
      if (audioElement) audioElement.pause();
      setIsPlayingAudio(false);
      return;
    }

    if (audioElement) audioElement.pause();

    const audio = new Audio(track.audioUrl);
    audio.play().then(() => {
      setAudioElement(audio);
      setCurrentAudioTrack(track);
      setIsPlayingAudio(true);
    }).catch(e => {
      console.warn('Audio play notice:', e);
      setIsPlayingAudio(false);
    });

    audio.onended = () => setIsPlayingAudio(false);
  };

  // Kolkata Durga Puja Tree Corridors based on Metro Blue Line
  const blueLineStations = METRO_LINES[0].stations;

  const northCorridorStations = blueLineStations.filter(s => ['Dakshineswar', 'Baranagar', 'Noapara', 'Dum Dum', 'Belgachia', 'Shyambazar', 'Sovabazar Sutanuti'].includes(s.name));
  const centralCorridorStations = blueLineStations.filter(s => ['Girish Park', 'Mahatma Gandhi Road', 'Central', 'Chandni Chowk', 'Esplanade'].includes(s.name));
  const southCorridorStations = blueLineStations.filter(s => ['Park Street', 'Maidan', 'Rabindra Sadan', 'Netaji Bhavan', 'Jatin Das Park', 'Kalighat', 'Rabindra Sarobar', 'Mahanayak Uttam Kumar (Tollygunge)', 'Netaji (Kudghat)', 'Masterda Surya Sen (Bansdroni)', 'Gitanjali (Naktala)', 'Kavi Nazrul (Garia)', 'Kavi Subhash (New Garia)'].includes(s.name));

  // Combined Dataset for Selected Puja
  const allPandalsForPuja = React.useMemo(() => {
    if (!selectedPuja) return [];
    if (selectedPuja.id === 'durga-puja') {
      return [...PUJAS_DATA.map(p => ({ ...p, pujaType: 'durga-puja', district: 'Kolkata', place: p.address.split(',')[1]?.trim() || 'Kolkata' })), ...SAMPLE_NON_KOLKATA_PUJAS.filter(p => p.pujaType === 'durga-puja')];
    }
    return SAMPLE_NON_KOLKATA_PUJAS.filter(p => p.pujaType === selectedPuja.id);
  }, [selectedPuja]);

  // Filtered Pandals by place query
  const searchedPandals = React.useMemo(() => {
    if (!placeFilter.trim()) return allPandalsForPuja;
    const q = placeFilter.toLowerCase().trim();
    return allPandalsForPuja.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.place && p.place.toLowerCase().includes(q)) ||
      (p.district && p.district.toLowerCase().includes(q)) ||
      (p.address && p.address.toLowerCase().includes(q)) ||
      (p.nearestMetro && p.nearestMetro.toLowerCase().includes(q))
    );
  }, [allPandalsForPuja, placeFilter]);

  return (
    <div
      className="modal-backdrop animate-fade-in"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(12px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        className="glass-panel main-popup-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '920px',
          maxWidth: '96vw',
          maxHeight: '90vh',
          background: 'var(--bg-card)',
          borderRadius: '24px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(225, 29, 72, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Header Bar */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {selectedPuja ? (
              <button
                onClick={() => setSelectedPuja(null)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '12px',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--accent-gold)',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                ← All Pujas
              </button>
            ) : null}
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{selectedPuja ? `${selectedPuja.icon} ${selectedPuja.name}` : '🪔 WEST BENGAL FESTIVAL & PUJO PORTAL'}</span>
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                {selectedPuja ? `${selectedPuja.bengali} • ${selectedPuja.season}` : 'Explore Durga Puja, Kali Puja, Jagadhatri & major festivals by locality & Metro corridors.'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {currentAudioTrack && (
              <button
                onClick={() => toggleAudio(currentAudioTrack.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  background: isPlayingAudio ? 'rgba(34, 197, 94, 0.2)' : 'var(--input-bg)',
                  border: isPlayingAudio ? '1px solid #22c55e' : '1px solid var(--border-color)',
                  color: isPlayingAudio ? '#4ade80' : 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {isPlayingAudio ? <Volume2 size={16} className="theme-toggle-spin" /> : <VolumeX size={16} />}
                <span>{isPlayingAudio ? 'Playing Music' : 'Muted'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* LEVEL 1: MAJOR PUJAS SELECTOR */}
          {!selectedPuja ? (
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--accent-gold)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
                SELECT MAJOR PUJA CATEGORY
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                {MAJOR_PUJAS.map((puja) => (
                  <div
                    key={puja.id}
                    onClick={() => setSelectedPuja(puja)}
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '20px',
                      padding: '20px',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.borderColor = '#e11d48';
                      e.currentTarget.style.boxShadow = '0 12px 24px -8px rgba(225, 29, 72, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '14px',
                        background: puja.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.4rem'
                      }}>
                        {puja.icon}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                          {puja.name}
                        </h3>
                        <div style={{ fontSize: '0.82rem', color: 'var(--accent-gold)', fontWeight: '700' }}>
                          {puja.bengali}
                        </div>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                      {puja.desc}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: '700' }}>
                      <span>🗓️ {puja.season}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f43f5e' }}>Explore →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* LEVEL 2: SELECTED PUJA DRILL DOWN & TREE HIERARCHY */
            <div>
              {/* Place Search & Filter Bar */}
              <div style={{
                background: 'var(--input-bg)',
                padding: '16px',
                borderRadius: '18px',
                border: '1px solid var(--border-color)',
                marginBottom: '20px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                  <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="form-input"
                    placeholder={`Search ${selectedPuja.name} by place (e.g. Belgharia, Sodpur, Malda, Salt Lake)...`}
                    value={placeFilter}
                    onChange={(e) => setPlaceFilter(e.target.value)}
                    style={{ paddingLeft: '38px', fontSize: '0.88rem' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => toggleAudio('track-2')}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.2), rgba(245, 158, 11, 0.2))',
                      border: '1px solid rgba(225, 29, 72, 0.4)',
                      color: '#fff',
                      fontWeight: '800',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Music size={15} /> Play {selectedPuja.name} Music
                  </button>

                  {placeFilter && (
                    <button
                      onClick={() => setPlaceFilter('')}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '12px',
                        background: 'var(--input-bg)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              </div>

              {/* KOLKATA DURGA PUJA HIERARCHICAL TREE (NORTH / CENTRAL / SOUTH METRO CORRIDORS) */}
              {selectedPuja.id === 'durga-puja' && !placeFilter && (
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--accent-gold)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🚇 KOLKATA METRO CORRIDOR TREE HIERARCHY</span>
                  </div>

                  {/* 3 ZONES TABS */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                    {[
                      { id: 'north', title: 'North Kolkata', corridor: 'Dakshineswar ↔ Sovabazar Sutanuti', count: PUJAS_DATA.filter(p => p.zone === 'north').length },
                      { id: 'central', title: 'Central Kolkata', corridor: 'Girish Park ↔ Esplanade', count: PUJAS_DATA.filter(p => p.zone === 'middle').length },
                      { id: 'south', title: 'South Kolkata', corridor: 'Park Street ↔ Kavi Subhash', count: PUJAS_DATA.filter(p => p.zone === 'south').length }
                    ].map(z => (
                      <button
                        key={z.id}
                        onClick={() => setExpandedZone(z.id)}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '16px',
                          border: expandedZone === z.id ? '1px solid #e11d48' : '1px solid var(--border-color)',
                          background: expandedZone === z.id ? 'linear-gradient(135deg, rgba(225, 29, 72, 0.25), rgba(245, 158, 11, 0.25))' : 'var(--input-bg)',
                          color: '#fff',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ fontSize: '0.95rem', fontWeight: '800' }}>{z.title} ({z.count})</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', marginTop: '2px' }}>{z.corridor}</div>
                      </button>
                    ))}
                  </div>

                  {/* EXPANDED CORRIDOR METRO STATIONS & PANDALS TREE */}
                  <div style={{ background: 'var(--input-bg)', borderRadius: '20px', padding: '16px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={16} style={{ color: '#f43f5e' }} />
                      <span>
                        Pandals along {expandedZone === 'north' ? 'North Corridor (Dakshineswar to Sovabazar)' : expandedZone === 'central' ? 'Central Corridor (Girish Park to Esplanade)' : 'South Corridor (Park Street to Kavi Subhash)'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {(expandedZone === 'north' ? northCorridorStations : expandedZone === 'central' ? centralCorridorStations : southCorridorStations).map(station => {
                        const stationPandals = PUJAS_DATA.filter(p => p.nearestMetro && p.nearestMetro.toLowerCase().includes(station.name.toLowerCase()));
                        const isCorridorOpen = expandedCorridor === station.id;

                        return (
                          <div key={station.id} style={{ borderRadius: '14px', border: '1px solid var(--border-color)', background: 'rgba(15, 23, 42, 0.4)', overflow: 'hidden' }}>
                            <div
                              onClick={() => setExpandedCorridor(isCorridorOpen ? null : station.id)}
                              style={{
                                padding: '12px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                background: isCorridorOpen ? 'rgba(225, 29, 72, 0.12)' : 'transparent'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7' }} />
                                <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                                  Metro Station: {station.name}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '10px' }}>
                                  {stationPandals.length > 0 ? `${stationPandals.length} Verified Pandals` : 'General Area'}
                                </span>
                              </div>
                              {isCorridorOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </div>

                            {/* Pandal list for station */}
                            {isCorridorOpen && (
                              <div style={{ padding: '12px 16px 16px', borderTop: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
                                {stationPandals.length > 0 ? (
                                  stationPandals.map(p => (
                                    <div
                                      key={p.id}
                                      onClick={() => setSelectedPandalDetail(p)}
                                      style={{
                                        padding: '12px',
                                        borderRadius: '12px',
                                        background: 'var(--bg-card)',
                                        border: '1px solid var(--border-color)',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-primary)' }}>{p.name}</div>
                                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', marginTop: '4px' }}>🎨 {p.theme}</div>
                                      <div style={{ fontSize: '0.72rem', color: '#4ade80', marginTop: '4px' }}>{p.crowdStatus}</div>
                                    </div>
                                  ))
                                ) : (
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                    No major admin-listed pandals directly adjacent to this specific station stop.
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ALL SEARCHED / FILTERED PANDALS LIST */}
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--accent-gold)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
                  {placeFilter ? `SEARCH RESULTS FOR "${placeFilter}" (${searchedPandals.length})` : `ALL ADMIN VERIFIED ${selectedPuja.name.toUpperCase()} PANDALS (${searchedPandals.length})`}
                </div>

                {searchedPandals.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                    {searchedPandals.map(pandal => (
                      <div
                        key={pandal.id}
                        onClick={() => setSelectedPandalDetail(pandal)}
                        style={{
                          background: 'var(--input-bg)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '18px',
                          padding: '16px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--accent-gold)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border-color)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                              {pandal.name}
                            </h4>
                            <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-gold)', fontWeight: '700' }}>
                              {pandal.district || pandal.zoneName || 'West Bengal'}
                            </span>
                          </div>

                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={14} style={{ color: '#f43f5e' }} /> {pandal.address}
                          </div>

                          {pandal.theme && (
                            <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: '600', marginBottom: '8px' }}>
                              🎨 Theme: {pandal.theme}
                            </div>
                          )}
                        </div>

                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: '700' }}>
                            {pandal.crowdStatus || 'Verified Entry'}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: '700' }}>
                            View Details →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '50px 20px', textAlign: 'center', background: 'var(--input-bg)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔍</div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                      No result found for "{placeFilter}"
                    </h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
                      No admin-listed {selectedPuja.name} pandals exist in this specific locality yet. Try searching another area (e.g. Belgharia, Sodpur, Howrah, Malda, Kolkata).
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* PANDAL DETAIL SUB-MODAL */}
        {selectedPandalDetail && (
          <div
            className="modal-backdrop animate-fade-in"
            onClick={() => setSelectedPandalDetail(null)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 2010,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px'
            }}
          >
            <div
              className="glass-panel"
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '600px',
                maxWidth: '92vw',
                maxHeight: '85vh',
                overflowY: 'auto',
                borderRadius: '24px',
                padding: '24px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                  {selectedPandalDetail.name}
                </h3>
                <button
                  onClick={() => setSelectedPandalDetail(null)}
                  style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              {selectedPandalDetail.image && (
                <img
                  src={selectedPandalDetail.image}
                  alt={selectedPandalDetail.name}
                  style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '16px', marginBottom: '16px' }}
                />
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
                <div style={{ background: 'var(--input-bg)', padding: '12px', borderRadius: '12px' }}>
                  📍 <strong>Location & Address:</strong> {selectedPandalDetail.address}
                </div>

                {selectedPandalDetail.nearestMetro && (
                  <div style={{ background: 'var(--input-bg)', padding: '12px', borderRadius: '12px' }}>
                    🚇 <strong>Nearest Metro Station:</strong> {selectedPandalDetail.nearestMetro}
                  </div>
                )}

                <div style={{ background: 'var(--input-bg)', padding: '12px', borderRadius: '12px' }}>
                  🎨 <strong>Theme:</strong> {selectedPandalDetail.theme || 'Traditional Sabeki Idol'}
                </div>

                <div style={{ background: 'var(--input-bg)', padding: '12px', borderRadius: '12px' }}>
                  📜 <strong>Description & Wish:</strong> {selectedPandalDetail.description || 'May Goddess Durga bless all devotees with peace, prosperity and happiness.'}
                </div>

                {/* Integrated Music Player trigger */}
                <button
                  onClick={() => toggleAudio(selectedPandalDetail.musicId || 'track-2')}
                  style={{
                    marginTop: '8px',
                    padding: '12px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #e11d48, #f59e0b)',
                    border: 'none',
                    color: '#fff',
                    fontWeight: '800',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Music size={18} />
                  <span>{isPlayingAudio ? 'Pause Traditional Music' : 'Play Traditional Pujo Audio Track'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
