import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  Music,
  Search,
  X,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Radio
} from 'lucide-react';
import { MUSIC_TRACKS, MUSIC_CATEGORIES } from '../data/musicData';

export default function MusicPlayer({ isOpen, onClose }) {
  // Load saved state from localStorage or defaults
  const [currentTrackIndex, setCurrentTrackIndex] = useState(() => {
    const saved = localStorage.getItem('pujo_music_track_idx');
    return saved !== null ? parseInt(saved, 10) : 0;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isExpanded, setIsExpanded] = useState(true);

  const audioRef = useRef(null);

  const currentTrack = MUSIC_TRACKS[currentTrackIndex] || MUSIC_TRACKS[0];

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('pujo_music_track_idx', currentTrackIndex.toString());
  }, [currentTrackIndex]);

  // Audio Event Listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else if (isShuffle) {
        const randIdx = Math.floor(Math.random() * MUSIC_TRACKS.length);
        setCurrentTrackIndex(randIdx);
      } else {
        // Continuous Random Autoplay ("Infinite Festival Radio Mode")
        const nextIdx = (currentTrackIndex + 1) % MUSIC_TRACKS.length;
        setCurrentTrackIndex(nextIdx);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, isRepeat, isShuffle, volume, isMuted]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch((e) => console.warn(e));
    }
  };

  const playTrack = (index) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch((e) => console.warn(e));
      }
    }, 150);
  };

  const handleNext = () => {
    if (isShuffle) {
      const randIdx = Math.floor(Math.random() * MUSIC_TRACKS.length);
      playTrack(randIdx);
    } else {
      playTrack((currentTrackIndex + 1) % MUSIC_TRACKS.length);
    }
  };

  const handlePrev = () => {
    playTrack((currentTrackIndex - 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length);
  };

  const handleScrub = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Search & Category Filter logic
  const filteredTracks = MUSIC_TRACKS.filter((track) => {
    const matchesCategory = selectedCategory === 'all' || track.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      track.title.toLowerCase().includes(q) ||
      track.artist.toLowerCase().includes(q) ||
      track.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      className="music-drawer-container animate-fade-in"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9990,
        width: '380px',
        maxWidth: 'calc(100vw - 32px)',
        borderRadius: '24px',
        background: 'rgba(10, 10, 16, 0.94)',
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)',
        border: '1.5px solid var(--border-glow)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(225, 29, 72, 0.3)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <audio ref={audioRef} src={currentTrack.audioUrl} preload="metadata" />

      {/* Top Header & Search Control Bar */}
      <div style={{
        padding: '16px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-crimson), #be123c)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 0 15px rgba(225, 29, 72, 0.5)'
            }}>
              <Radio size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                PUJO MUSIC RADIO <Sparkles size={13} style={{ color: 'var(--accent-gold)' }} />
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>
                Continuous Autoplay Audio Stream
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
              title={isExpanded ? 'Collapse Playlist' : 'Expand Playlist'}
            >
              {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Sticky Search Input Bar */}
        {isExpanded && (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search 100+ tracks, artists, bhajans, phonk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 32px 8px 36px',
                borderRadius: '20px',
                background: 'var(--input-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.82rem',
                outline: 'none'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '10px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Category Pills Slider & Playlist Stream (When Expanded) */}
      {isExpanded && (
        <>
          {/* Categories Pill Slider */}
          <div style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            padding: '10px 16px',
            borderBottom: '1px solid var(--border-color)',
            scrollbarWidth: 'none'
          }}>
            {MUSIC_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '16px',
                    border: active ? '1px solid #f43f5e' : '1px solid var(--border-color)',
                    background: active ? 'rgba(225, 29, 72, 0.2)' : 'transparent',
                    color: active ? 'var(--accent-crimson)' : 'var(--text-secondary)',
                    fontSize: '0.74rem',
                    fontWeight: active ? '700' : '500',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Track List */}
          <div style={{
            maxHeight: '220px',
            overflowY: 'auto',
            padding: '8px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            {filteredTracks.map((track) => {
              const originalIndex = MUSIC_TRACKS.findIndex((t) => t.id === track.id);
              const isSelected = currentTrackIndex === originalIndex;
              return (
                <div
                  key={track.id}
                  onClick={() => playTrack(originalIndex)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '6px 10px',
                    borderRadius: '12px',
                    background: isSelected ? 'rgba(225, 29, 72, 0.15)' : 'transparent',
                    border: isSelected ? '1px solid rgba(225, 29, 72, 0.4)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <img
                    src={track.cover}
                    alt={track.title}
                    style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '0.82rem', fontWeight: isSelected ? '800' : '600', color: isSelected ? 'var(--accent-crimson)' : 'var(--text-primary)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {track.title}
                    </h4>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {track.artist}
                    </p>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{track.duration}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Persistent Audio Control Footer Bar */}
      <div style={{
        padding: '12px 16px',
        background: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {/* Track Title & Artwork Banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#fff', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentTrack.title}
            </h4>
            <p style={{ fontSize: '0.74rem', color: 'var(--accent-gold)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* Progress Bar Scrubber */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', minWidth: '28px' }}>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleScrub}
            style={{ flex: 1, accentColor: 'var(--accent-crimson)', height: '4px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', minWidth: '28px' }}>{formatTime(duration)}</span>
        </div>

        {/* Playback Buttons Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '2px' }}>
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            style={{ background: 'transparent', border: 'none', color: isShuffle ? 'var(--accent-crimson)' : 'var(--text-muted)', cursor: 'pointer' }}
            title="Random Autoplay Shuffle"
          >
            <Shuffle size={15} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={handlePrev} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
              <SkipBack size={18} />
            </button>
            <button
              onClick={togglePlay}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-crimson), #be123c)',
                border: 'none',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 0 15px rgba(225, 29, 72, 0.5)'
              }}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
            </button>
            <button onClick={handleNext} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
              <SkipForward size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => setIsMuted(!isMuted)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(false);
              }}
              style={{ width: '50px', accentColor: 'var(--accent-gold)', height: '4px', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
