import React, { useState, useEffect } from 'react';
import {
  Home,
  Calendar,
  Compass,
  MapPin,
  Route,
  Users,
  Bot,
  ShieldAlert,
  BookOpen,
  Utensils,
  Camera,
  Footprints,
  Sparkles,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sliders,
  Search,
  Sun,
  Moon,
  Flame,
  X
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onLogout,
  theme,
  toggleTheme,
  isCollapsed: controlledIsCollapsed,
  setIsCollapsed: controlledSetIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}) {
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  const isCollapsed = controlledIsCollapsed !== undefined ? controlledIsCollapsed : internalIsCollapsed;
  const setIsCollapsed = controlledSetIsCollapsed || setInternalIsCollapsed;

  const [searchFilter, setSearchFilter] = useState('');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, label: '', badge: '' });

  // Navigation Data Architecture (Music mode removed)
  const navigationGroups = [
    {
      group: 'DISCOVER',
      items: [
        { id: 'home', label: 'Home Feed', icon: Home, badge: null, shortcut: 'H' },
        { id: 'festivals', label: 'Festivals Directory', icon: Calendar, badge: 'ALL-INDIA', shortcut: 'F' },
        { id: 'pandals', label: 'Pandals & Puja', icon: Compass, badge: 'POPULAR', shortcut: 'P' },
        { id: 'map', label: 'Interactive Map', icon: MapPin, badge: null, shortcut: 'M' },
        { id: 'nearby', label: 'Nearby Attractions', icon: Sliders, badge: null }
      ]
    },
    {
      group: 'PLAN & CROWD',
      items: [
        { id: 'planner', label: 'Route Planner', icon: Route, badge: 'HOT', shortcut: 'R' },
        { id: 'crowd', label: 'Live Crowd Status', icon: Sparkles, badge: 'LIVE', isLive: true },
        { id: 'food', label: 'Food & Bhog Tracker', icon: Utensils, badge: 'BHOG' }
      ]
    },
    {
      group: 'COMMUNITY',
      items: [
        { id: 'adda', label: 'Adda & Partners', icon: Users, badge: 'SOCIAL' }
      ]
    },
    {
      group: 'EXPERIENCES',
      items: [
        { id: 'walk', label: 'Pujo Walk (3D Avatar)', icon: Footprints, badge: '3D' },
        { id: 'ar', label: 'AR Camera View', icon: Camera, badge: 'AR' },
        { id: 'memories_passport', label: 'Memories & Passport', icon: BookOpen, badge: null }
      ]
    },
    {
      group: 'SMART AI',
      items: [
        { id: 'ai', label: 'AI Pujo Assistant', icon: Bot, badge: 'AI ✦', isAi: true }
      ]
    },
    {
      group: 'SAFETY & EMERGENCY',
      items: [
        { id: 'safety', label: 'Emergency SOS', icon: ShieldAlert, badge: 'SOS', isSos: true }
      ]
    },
    {
      group: 'ACCOUNT & ADMIN',
      items: [
        { id: 'profile_admin', label: 'Profile & Admin', icon: User, badge: null }
      ]
    }
  ];

  // Filter items if user types in search box
  const filteredGroups = navigationGroups.map(group => {
    const q = searchFilter.toLowerCase().trim();
    if (!q) return group;
    const matchingItems = group.items.filter(
      item => item.label.toLowerCase().includes(q) || group.group.toLowerCase().includes(q)
    );
    return { ...group, items: matchingItems };
  }).filter(group => group.items.length > 0);

  const handleMouseEnterItem = (e, item) => {
    if (isCollapsed) {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltipPos({
        top: rect.top + rect.height / 2,
        label: item.label,
        badge: item.badge
      });
      setHoveredItem(item.id);
    }
  };

  const handleMouseLeaveItem = () => {
    setHoveredItem(null);
  };

  const handleItemClick = (itemId) => {
    setActiveTab(itemId);
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="sidebar-mobile-backdrop"
          onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            zIndex: 1004,
            animation: 'fadeIn 0.25s ease'
          }}
        />
      )}

      {/* Main Floating Glass Sidebar Dock Panel */}
      <aside
        className={`desktop-sidebar pro-sidebar-container ${isMobileOpen ? 'mobile-open' : ''}`}
        style={{
          width: isCollapsed ? '76px' : '270px',
          height: 'calc(100vh - 32px)',
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 1005,
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          background: 'var(--sidebar-bg, rgba(11, 15, 25, 0.92))',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-main, 0 20px 40px rgba(0, 0, 0, 0.35))',
          overflow: 'hidden',
          userSelect: 'none'
        }}
      >
        {/* Header / Brand Identity */}
        <div className="sidebar-header" style={{
          padding: isCollapsed ? '16px 12px' : '18px 18px 14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          borderBottom: '1px solid var(--border-color)',
          position: 'relative',
          minHeight: '70px',
          boxSizing: 'border-box'
        }}>
          {!isCollapsed ? (
            <div
              onClick={() => handleItemClick('home')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer'
              }}
            >
              <div style={{ position: 'relative' }}>
                <img
                  src="/logo.png"
                  alt="Pujo Adda Logo"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    objectFit: 'cover',
                    boxShadow: '0 0 16px rgba(225, 29, 72, 0.5)',
                    border: '1.5px solid rgba(245, 158, 11, 0.6)'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#10b981',
                  border: '2px solid #0f172a',
                  boxShadow: '0 0 8px #10b981'
                }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h1 style={{
                    fontSize: '1.15rem',
                    fontWeight: '900',
                    letterSpacing: '-0.3px',
                    background: 'linear-gradient(135deg, #ffffff 30%, #f43f5e 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    margin: 0
                  }}>
                    Pujo Adda
                  </h1>
                  <span style={{
                    fontSize: '0.6rem',
                    fontWeight: '800',
                    padding: '2px 6px',
                    borderRadius: '6px',
                    background: 'rgba(245, 158, 11, 0.2)',
                    color: '#fbbf24',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    letterSpacing: '0.5px'
                  }}>
                    PRO
                  </span>
                </div>
                <span style={{
                  fontSize: '0.68rem',
                  color: 'var(--text-muted)',
                  fontWeight: '600',
                  letterSpacing: '0.3px'
                }}>
                  Festival Companion
                </span>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setIsCollapsed(false)}
              title="Expand Sidebar"
              style={{
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <img
                src="/logo.png"
                alt="Pujo Adda"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  objectFit: 'cover',
                  boxShadow: '0 0 12px rgba(225, 29, 72, 0.4)'
                }}
              />
            </div>
          )}

          {/* Desktop Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand Sidebar (Ctrl+\\)" : "Collapse Sidebar (Ctrl+\\)"}
            className="sidebar-toggle-btn"
            style={{
              background: 'var(--input-bg, rgba(255,255,255,0.06))',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              borderRadius: '10px',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.25s ease'
            }}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {/* Mobile Close Button */}
          {isMobileOpen && (
            <button
              onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
              className="mobile-close-btn"
              style={{
                position: 'absolute',
                right: '12px',
                top: '18px',
                background: 'rgba(225, 29, 72, 0.15)',
                border: '1px solid rgba(225, 29, 72, 0.3)',
                color: '#f43f5e',
                borderRadius: '8px',
                padding: '6px',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Quick Search Filter (Expanded view only) */}
        {!isCollapsed && (
          <div style={{ padding: '12px 14px 4px 14px' }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Search size={14} style={{
                position: 'absolute',
                left: '10px',
                color: 'var(--text-muted)'
              }} />
              <input
                type="text"
                placeholder="Jump to feature..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 28px 7px 32px',
                  borderRadius: '10px',
                  background: 'var(--input-bg, rgba(255,255,255,0.05))',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.78rem',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Scrollable Navigation Body */}
        <div
          className="sidebar-scroll-body"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: isCollapsed ? '12px 8px' : '12px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          {filteredGroups.map((grp) => (
            <div key={grp.group} className="sidebar-group-block">
              {!isCollapsed && (
                <div style={{
                  fontSize: '0.64rem',
                  fontWeight: '800',
                  color: 'var(--text-muted)',
                  letterSpacing: '1.2px',
                  padding: '0 10px 6px 10px',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span>{grp.group}</span>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      onMouseEnter={(e) => handleMouseEnterItem(e, item)}
                      onMouseLeave={handleMouseLeaveItem}
                      className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                      style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        gap: isCollapsed ? 0 : '12px',
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        padding: isCollapsed ? '10px 0' : '9px 12px',
                        borderRadius: '12px',
                        border: isActive
                          ? '1px solid rgba(225, 29, 72, 0.4)'
                          : '1px solid transparent',
                        background: isActive
                          ? 'linear-gradient(135deg, rgba(225, 29, 72, 0.85), rgba(225, 29, 72, 0.65))'
                          : 'transparent',
                        color: isActive ? '#ffffff' : 'var(--text-secondary)',
                        fontWeight: isActive ? '700' : '500',
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        boxShadow: isActive
                          ? '0 4px 16px rgba(225, 29, 72, 0.35)'
                          : 'none',
                        textAlign: 'left'
                      }}
                    >
                      {/* Active Left Pill Accent Stripe */}
                      {isActive && !isCollapsed && (
                        <div style={{
                          position: 'absolute',
                          left: '0',
                          top: '20%',
                          bottom: '20%',
                          width: '3px',
                          borderRadius: '0 4px 4px 0',
                          background: '#fbbf24',
                          boxShadow: '0 0 8px #fbbf24'
                        }} />
                      )}

                      {/* Icon */}
                      <Icon
                        size={18}
                        style={{
                          flexShrink: 0,
                          color: isActive
                            ? '#ffffff'
                            : item.isSos
                            ? '#f43f5e'
                            : item.isLive
                            ? '#f59e0b'
                            : item.isAi
                            ? '#38bdf8'
                            : 'var(--text-muted)',
                          transition: 'color 0.2s ease, transform 0.2s ease'
                        }}
                      />

                      {/* Label & Badge when expanded */}
                      {!isCollapsed && (
                        <div style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap'
                        }}>
                          <span style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {item.label}
                          </span>

                          {item.badge && (
                            <span style={{
                              fontSize: '0.6rem',
                              fontWeight: '800',
                              padding: '2px 6px',
                              borderRadius: '20px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.3px',
                              background: item.isLive
                                ? 'rgba(239, 68, 68, 0.2)'
                                : item.isAi
                                ? 'rgba(56, 189, 248, 0.2)'
                                : item.isSos
                                ? 'rgba(225, 29, 72, 0.3)'
                                : 'rgba(245, 158, 11, 0.15)',
                              color: item.isLive
                                ? '#f87171'
                                : item.isAi
                                ? '#38bdf8'
                                : item.isSos
                                ? '#ff4d4d'
                                : '#fbbf24',
                              border: item.isLive
                                ? '1px solid rgba(239, 68, 68, 0.4)'
                                : item.isAi
                                ? '1px solid rgba(56, 189, 248, 0.4)'
                                : '1px solid rgba(245, 158, 11, 0.3)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}>
                              {item.isLive && (
                                <span className="live-dot-pulse" style={{
                                  width: '5px',
                                  height: '5px',
                                  borderRadius: '50%',
                                  background: '#f87171',
                                  display: 'inline-block'
                                }} />
                              )}
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Dot for collapsed active state */}
                      {isCollapsed && isActive && (
                        <div style={{
                          position: 'absolute',
                          right: '6px',
                          top: '6px',
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#fbbf24',
                          boxShadow: '0 0 6px #fbbf24'
                        }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Live Festival Info Banner (Expanded only) */}
        {!isCollapsed && (
          <div style={{
            padding: '10px 14px',
            margin: '0 10px 10px 10px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(225, 29, 72, 0.12))',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fbbf24',
              flexShrink: 0
            }}>
              <Flame size={16} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                Durga Puja Live
              </div>
              <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                🌟 Festive Vibing • 450+ Pandals
              </div>
            </div>
          </div>
        )}

        {/* Theme Action Row */}
        <div style={{
          padding: isCollapsed ? '8px 10px' : '8px 14px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          gap: '8px'
        }}>
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: '10px',
              padding: '8px 12px',
              borderRadius: '10px',
              background: 'var(--input-bg, rgba(255,255,255,0.06))',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.78rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {theme === 'dark' ? (
              <Sun size={16} style={{ color: '#fbbf24' }} />
            ) : (
              <Moon size={16} style={{ color: '#e11d48' }} />
            )}
            {!isCollapsed && (
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            )}
          </button>
        </div>

        {/* User Session Footer */}
        <div style={{
          padding: isCollapsed ? '12px 8px' : '14px 14px',
          borderTop: '1px solid var(--border-color)',
          background: 'rgba(0, 0, 0, 0.15)'
        }}>
          {user ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'space-between',
              gap: '10px'
            }}>
              {!isCollapsed && (
                <div
                  onClick={() => handleItemClick('profile_admin')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f59e0b, #e11d48)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '900',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    flexShrink: 0,
                    boxShadow: '0 0 10px rgba(245, 158, 11, 0.4)',
                    overflow: 'hidden'
                  }}>
                    {user.photoURL || user.avatar ? (
                      <img src={user.photoURL || user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      user.name ? user.name[0].toUpperCase() : 'U'
                    )}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden'
                    }}>
                      {user.name || user.email}
                    </div>
                    <div style={{
                      fontSize: '0.66rem',
                      color: '#10b981',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                      Active Member
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={onLogout}
                title="Logout"
                style={{
                  background: 'rgba(225, 29, 72, 0.15)',
                  border: '1px solid rgba(225, 29, 72, 0.3)',
                  color: '#f87171',
                  borderRadius: '10px',
                  padding: isCollapsed ? '10px' : '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              style={{
                width: '100%',
                padding: isCollapsed ? '10px 0' : '10px 14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #e11d48, #f59e0b)',
                border: 'none',
                color: '#ffffff',
                fontWeight: '800',
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 18px rgba(225, 29, 72, 0.35)',
                transition: 'all 0.25s ease'
              }}
            >
              <User size={16} />
              {!isCollapsed && <span>Login / Sign Up</span>}
            </button>
          )}
        </div>
      </aside>

      {/* Floating Glass Tooltip when Collapsed */}
      {isCollapsed && hoveredItem && tooltipPos.label && (
        <div
          style={{
            position: 'fixed',
            left: '100px',
            top: `${tooltipPos.top}px`,
            transform: 'translateY(-50%)',
            zIndex: 1010,
            padding: '6px 12px',
            borderRadius: '8px',
            background: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            color: '#ffffff',
            fontSize: '0.78rem',
            fontWeight: '700',
            whiteSpace: 'nowrap',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.15s ease'
          }}
        >
          <span>{tooltipPos.label}</span>
          {tooltipPos.badge && (
            <span style={{
              fontSize: '0.62rem',
              fontWeight: '800',
              padding: '2px 5px',
              borderRadius: '4px',
              background: 'rgba(245, 158, 11, 0.25)',
              color: '#fbbf24',
              border: '1px solid rgba(245, 158, 11, 0.4)'
            }}>
              {tooltipPos.badge}
            </span>
          )}
        </div>
      )}
    </>
  );
}


