import React, { useState } from 'react';
import {
  Home,
  Calendar,
  Compass,
  MapPin,
  Route,
  Users,
  Music,
  Bot,
  ShieldAlert,
  BookOpen,
  Utensils,
  Camera,
  Footprints,
  Sparkles,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sliders,
  Bell
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onLogout,
  theme,
  toggleTheme,
  onOpenMusic,
  isCollapsed: controlledIsCollapsed,
  setIsCollapsed: controlledSetIsCollapsed
}) {
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  const isCollapsed = controlledIsCollapsed !== undefined ? controlledIsCollapsed : internalIsCollapsed;
  const setIsCollapsed = controlledSetIsCollapsed || setInternalIsCollapsed;

  const navigationGroups = [
    {
      group: 'DISCOVER',
      items: [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'festivals', label: 'Festivals', icon: Calendar },
        { id: 'pandals', label: 'Pandals / Puja', icon: Compass },
        { id: 'map', label: 'Explore Map', icon: MapPin },
        { id: 'nearby', label: 'Nearby Places', icon: Sliders }
      ]
    },
    {
      group: 'PLAN',
      items: [
        { id: 'planner', label: 'Route Planner', icon: Route },
        { id: 'crowd', label: 'Live Crowd', icon: Sparkles },
        { id: 'food', label: 'Food & Bhog', icon: Utensils }
      ]
    },
    {
      group: 'CONNECT',
      items: [
        { id: 'adda', label: 'Adda & Partners', icon: Users }
      ]
    },
    {
      group: 'EXPLORE',
      items: [
        { id: 'walk', label: 'Pujo Walk (Avatar)', icon: Footprints },
        { id: 'ar', label: 'AR Street View', icon: Camera },
        { id: 'memories_passport', label: 'Memories & Passport', icon: BookOpen },
        { id: 'music', label: 'Pujo Music', icon: Music }
      ]
    },
    {
      group: 'SMART',
      items: [
        { id: 'ai', label: 'AI Pujo Discovery', icon: Bot }
      ]
    },
    {
      group: 'SAFETY',
      items: [
        { id: 'safety', label: 'SOS Emergency', icon: ShieldAlert }
      ]
    },
    {
      group: 'ACCOUNT',
      items: [
        { id: 'profile_admin', label: 'Profile & Admin', icon: User }
      ]
    }
  ];

  return (
    <aside
      className="desktop-sidebar glass-panel"
      style={{
        width: isCollapsed ? '78px' : '260px',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRight: '1px solid var(--border-color)',
        backdropFilter: 'blur(20px)',
        background: 'rgba(15, 23, 42, 0.85)',
        overflow: 'hidden'
      }}
    >
      {/* Brand Header */}
      <div style={{
        padding: isCollapsed ? '16px 10px' : '18px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        borderBottom: '1px solid var(--border-color)'
      }}>
        {!isCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="/logo.png"
              alt="Pujo Adda Logo"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                objectFit: 'cover',
                boxShadow: '0 0 15px rgba(225, 29, 72, 0.4)',
                border: '1px solid rgba(225, 29, 72, 0.4)'
              }}
            />
            <div>
              <h1 style={{ fontSize: '1.1rem', fontWeight: '900', letterSpacing: '0.5px', color: '#fff', margin: 0 }}>
                Pujo Adda
              </h1>
              <span style={{ fontSize: '0.65rem', color: '#f59e0b', fontWeight: '700', textTransform: 'uppercase' }}>
                Festival Companion
              </span>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#cbd5e1',
            borderRadius: '10px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Scrollable Navigation Items */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: isCollapsed ? '12px 8px' : '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {navigationGroups.map((grp) => (
          <div key={grp.group}>
            {!isCollapsed && (
              <div style={{
                fontSize: '0.68rem',
                fontWeight: '800',
                color: '#64748b',
                letterSpacing: '1.2px',
                padding: '0 10px 6px 10px'
              }}>
                {grp.group}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {grp.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: isCollapsed ? 0 : '12px',
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                      padding: isCollapsed ? '10px 0' : '10px 14px',
                      borderRadius: '12px',
                      border: 'none',
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(225, 29, 72, 0.8), rgba(245, 158, 11, 0.8))'
                        : 'transparent',
                      color: isActive ? '#ffffff' : '#cbd5e1',
                      fontWeight: isActive ? '800' : '600',
                      fontSize: '0.86rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? '0 4px 15px rgba(225, 29, 72, 0.3)' : 'none'
                    }}
                  >
                    <Icon size={18} style={{ color: isActive ? '#ffffff' : item.id === 'safety' ? '#f43f5e' : '#94a3b8' }} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Session Footer */}
      <div style={{
        padding: isCollapsed ? '12px 8px' : '16px',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {user ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            gap: '10px'
          }}>
            {!isCollapsed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f59e0b, #e11d48)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}>
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {user.name || user.email}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#4ade80' }}>● Active Member</div>
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
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
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
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              border: 'none',
              color: '#000',
              fontWeight: '800',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <User size={16} />
            {!isCollapsed && <span>Login / Register</span>}
          </button>
        )}
      </div>
    </aside>
  );
}
