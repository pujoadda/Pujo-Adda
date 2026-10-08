import React, { useState } from 'react';
import {
  Home,
  MapPin,
  Sparkles,
  Info,
  Mail,
  Sun,
  Moon,
  User,
  Grid,
  ChevronDown,
  Calendar,
  Route,
  Utensils,
  Camera,
  ShieldAlert,
  BookOpen,
  Music,
  Bot,
  Footprints,
  Sliders,
  LogOut
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  theme,
  toggleTheme,
  user,
  onOpenAuth,
  onLogout,
  onOpenAr,
  onOpenSos
}) {
  const [showDrawer, setShowDrawer] = useState(false);

  const mainPillItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'pandals', label: 'Pandals', icon: MapPin },
    { id: 'about', label: 'About', icon: Info },
    { id: 'contact', label: 'Contact', icon: Mail }
  ];

  const drawerFeatures = [
    { id: 'festivals', label: 'All India Festivals', icon: Calendar, cat: 'DISCOVER' },
    { id: 'pandals', label: 'Pandals & Maps', icon: MapPin, cat: 'DISCOVER' },
    { id: 'planner', label: 'Multi-Stop Route Planner', icon: Route, cat: 'PLAN' },
    { id: 'crowd', label: 'Live Crowd Status', icon: Sparkles, cat: 'PLAN' },
    { id: 'food', label: 'Food & Bhog Tracker', icon: Utensils, cat: 'PLAN' },
    { id: 'adda', label: 'Festival Adda & Partners', icon: Sliders, cat: 'CONNECT' },
    { id: 'walk', label: 'Pujo Walk (Avatar)', icon: Footprints, cat: 'EXPLORE' },
    { id: 'memories_passport', label: 'Memories & Passport', icon: BookOpen, cat: 'EXPLORE' },
    { id: 'music', label: 'Pujo Music Player', icon: Music, cat: 'EXPLORE' },
    { id: 'ai', label: 'AI Pujo Discovery', icon: Bot, cat: 'SMART' },
    { id: 'safety', label: 'SOS Emergency Portal', icon: ShieldAlert, cat: 'SAFETY' }
  ];

  return (
    <nav className="floating-pill-nav" style={{
      position: 'fixed',
      top: '16px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      padding: '5px 12px',
      borderRadius: '50px',
      background: 'var(--navbar-bg)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-main)',
      transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      width: 'fit-content',
      maxWidth: 'calc(100vw - 24px)',
      boxSizing: 'border-box'
    }}>
      {/* Brand Logo Pill */}
      <button
        onClick={() => setActiveTab('home')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '28px',
          border: '1px solid rgba(225, 29, 72, 0.4)',
          background: 'rgba(225, 29, 72, 0.15)',
          color: 'var(--text-primary)',
          fontWeight: '900',
          fontSize: '0.85rem',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          whiteSpace: 'nowrap',
          flexShrink: 0
        }}
        className="nav-brand-pill"
      >
        <img src="/logo.png" alt="Pujo Adda Logo" style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }} />
        <span className="brand-text">PUJO ADDA</span>
      </button>

      {/* Main Tab Navigation Buttons */}
      {mainPillItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setShowDrawer(false);
            }}
            title={item.label}
            className={`nav-pill-btn ${isActive ? 'active' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: isActive ? '7px 14px' : '7px 10px',
              borderRadius: '28px',
              border: isActive ? '1px solid #f43f5e' : '1px solid transparent',
              background: isActive
                ? 'linear-gradient(135deg, var(--accent-crimson), #be123c)'
                : 'transparent',
              color: isActive ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: isActive ? '800' : '600',
              fontSize: '0.84rem',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: isActive ? '0 6px 20px -3px rgba(225, 29, 72, 0.5)' : 'none',
              flexShrink: 0
            }}
          >
            <Icon size={16} />
            {isActive && (
              <span className="nav-active-label" style={{ whiteSpace: 'nowrap' }}>
                {item.label}
              </span>
            )}
          </button>
        );
      })}

      {/* Extra Features Menu Drawer Button */}
      <button
        onClick={() => setShowDrawer((prev) => !prev)}
        className={`nav-pill-btn ${showDrawer ? 'active' : ''}`}
        title="All Pujo Modules & Features"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          padding: '7px 9px',
          borderRadius: '28px',
          border: '1px solid var(--border-color)',
          background: showDrawer ? 'rgba(245, 158, 11, 0.2)' : 'var(--input-bg)',
          color: showDrawer ? 'var(--accent-gold)' : 'var(--text-secondary)',
          fontWeight: '600',
          fontSize: '0.84rem',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          flexShrink: 0
        }}
      >
        <Grid size={16} />
        <ChevronDown size={12} style={{ transform: showDrawer ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
      </button>

      {/* Vertical Divider */}
      <div style={{ width: '1px', height: '18px', background: 'var(--border-color)', margin: '0 2px', flexShrink: 0 }} />

      {/* Theme Switcher Toggle */}
      <button
        onClick={toggleTheme}
        title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '1px solid var(--border-color)',
          background: 'var(--input-bg)',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          flexShrink: 0
        }}
        className="theme-toggle-pill"
      >
        {theme === 'dark' ? (
          <Sun size={16} className="theme-toggle-spin" style={{ color: '#fbbf24' }} />
        ) : (
          <Moon size={16} className="theme-toggle-spin" style={{ color: '#e11d48' }} />
        )}
      </button>

      {/* User Profile / Auth Button */}
      <button
        onClick={user ? () => setActiveTab('profile_admin') : onOpenAuth}
        title={user ? user.name || user.email : 'Login / Register'}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '1px solid var(--border-color)',
          background: user ? 'rgba(56, 189, 248, 0.2)' : 'var(--input-bg)',
          color: user ? 'var(--accent-cyan)' : 'var(--text-primary)',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          flexShrink: 0
        }}
      >
        <User size={16} />
      </button>

      {/* Dropdown Quick Features Drawer Modal overlay */}
      {showDrawer && (
        <div
          className="glass-panel animate-fade-in under-shadow-glow nav-suite-dropdown"
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '300px',
            maxWidth: 'calc(100vw - 20px)',
            maxHeight: '440px',
            overflowY: 'auto',
            borderRadius: '20px',
            padding: '12px',
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-main)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            zIndex: 1010,
            boxSizing: 'border-box'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px 8px', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--accent-gold)', letterSpacing: '0.5px' }}>
              PUJO ADDA SUITE
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>10 Active Modules</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4px', paddingTop: '4px' }}>
            {drawerFeatures.map((feat) => {
              const FIcon = feat.icon;
              const isSelected = activeTab === feat.id;
              return (
                <button
                  key={feat.id}
                  onClick={() => {
                    setActiveTab(feat.id);
                    setShowDrawer(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    border: '1px solid transparent',
                    background: isSelected ? 'rgba(225, 29, 72, 0.15)' : 'transparent',
                    color: isSelected ? 'var(--accent-crimson)' : 'var(--text-primary)',
                    fontWeight: isSelected ? '700' : '500',
                    fontSize: '0.82rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    width: '100%',
                    boxSizing: 'border-box',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'transparent';
                    }
                  }}
                >
                  <FIcon size={16} style={{ color: isSelected ? 'var(--accent-crimson)' : 'var(--accent-gold)', flexShrink: 0 }} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {feat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
