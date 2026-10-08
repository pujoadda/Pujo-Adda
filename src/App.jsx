import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import FestivalsPage from './components/FestivalsPage';
import PandalsPage from './components/PandalsPage';
import NearbyPlacesPage from './components/NearbyPlacesPage';
import RoutePlannerPage from './components/RoutePlannerPage';
import PujoWalkMode from './components/PujoWalkMode';
import CrowdPage from './components/CrowdPage';
import AddaSocialPage from './components/AddaSocialPage';
import MemoriesPassportPage from './components/MemoriesPassportPage';
import AiDiscoveryPage from './components/AiDiscoveryPage';
import EmergencySosPage from './components/EmergencySosPage';
import BhogFoodTrackerPage from './components/BhogFoodTrackerPage';
import AdminDashboardPage from './components/AdminDashboardPage';
import ArViewModal from './components/ArViewModal';
import AuthModal from './components/AuthModal';
import InteractiveMap from './components/InteractiveMap';
import DirectionsDrawer from './components/DirectionsDrawer';
import Header from './components/Header';
import PujaCard from './components/PujaCard';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import PwaInstallModal from './components/PwaInstallModal';
import PandalPujaModal from './components/PandalPujaModal';
import FriendSuggestionsModal from './components/FriendSuggestionsModal';

import { PUJAS_DATA, DEFAULT_USER_LOCATION } from './data/pujas';
import { getCurrentSessionUser, logoutUser } from './services/authService';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('home');

  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('pujo_adda_theme') || 'dark';
  });

  // Auth State
  const [user, setUser] = useState(() => getCurrentSessionUser());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSearchAuthPrompt, setIsSearchAuthPrompt] = useState(false);
  const [showLogoutToast, setShowLogoutToast] = useState(false);

  // Modals
  const [showArModal, setShowArModal] = useState(false);
  const [showPandalModal, setShowPandalModal] = useState(false);
  const [showFriendSuggestionsModal, setShowFriendSuggestionsModal] = useState(false);

  // Listen to tab changes for pandals
  useEffect(() => {
    if (activeTab === 'pandals') {
      setShowPandalModal(true);
    }
  }, [activeTab]);

  // Map & Pandals State
  const [activeZone, setActiveZone] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('map');
  const [selectedPuja, setSelectedPuja] = useState(null);
  const [navTargetPuja, setNavTargetPuja] = useState(null);
  const [userLocation, setUserLocation] = useState(DEFAULT_USER_LOCATION);
  const [isLocating, setIsLocating] = useState(false);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pujo_adda_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLoginSuccess = (userObj) => {
    setUser(userObj);
    localStorage.setItem('pujo_adda_user', JSON.stringify(userObj));
    setShowAuthModal(false);
    setIsSearchAuthPrompt(false);
    // Show Friend Suggestions Modal upon login!
    setShowFriendSuggestionsModal(true);
  };

  const handleLogout = async () => {
    setUser(null);
    await logoutUser();
    setShowLogoutToast(true);
    setTimeout(() => setShowLogoutToast(false), 3500);
  };

  const handleLocateMe = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            name: 'Your Current Live Location'
          });
          setIsLocating(false);
        },
        () => {
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleGetDirections = (puja) => {
    setNavTargetPuja(puja);
    setSelectedPuja(puja);
    setActiveTab('map');
  };

  const filteredPujas = useMemo(() => {
    return PUJAS_DATA.filter((puja) => {
      const matchesZone = activeZone === 'all' || puja.zone === activeZone;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        puja.name.toLowerCase().includes(q) ||
        puja.bengaliName.toLowerCase().includes(q) ||
        puja.address.toLowerCase().includes(q) ||
        puja.theme.toLowerCase().includes(q);
      return matchesZone && matchesSearch;
    });
  }, [activeZone, searchQuery]);

  const [showMusicDrawer, setShowMusicDrawer] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      <div className="graph-grid-bg" />
      <div className="animated-mesh-glow" />

      {/* Re-integrated Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenMusic={() => setShowMusicDrawer(true)}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div className="main-content-layout" style={{
        flex: 1,
        paddingLeft: isSidebarCollapsed ? '78px' : '260px',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minWidth: 0,
        transition: 'padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          theme={theme}
          toggleTheme={toggleTheme}
          user={user}
          onOpenAuth={() => setShowAuthModal(true)}
          onLogout={handleLogout}
          onOpenAr={() => setShowArModal(true)}
          onOpenSos={() => setActiveTab('safety')}
        />

        <main style={{ flex: 1, paddingTop: '95px' }}>
          {activeTab === 'home' && (
            <HomePage
              onNavigateTab={(tab) => setActiveTab(tab)}
              onSelectFestival={() => setActiveTab('festivals')}
              onOpenAuth={() => setShowAuthModal(true)}
              user={user}
            />
          )}

          {activeTab === 'about' && (
            <AboutPage onNavigateTab={(tab) => setActiveTab(tab)} />
          )}

          {activeTab === 'contact' && (
            <ContactPage />
          )}

          {activeTab === 'festivals' && (
            <FestivalsPage
              onSelectFestival={() => setActiveTab('pandals')}
            />
          )}

          {activeTab === 'pandals' && (
            <PandalsPage
              onSelectPuja={(p) => setSelectedPuja(p)}
              onGetDirections={handleGetDirections}
            />
          )}

          {activeTab === 'nearby' && (
            <NearbyPlacesPage />
          )}

          {activeTab === 'planner' && (
            <RoutePlannerPage
              userLocation={userLocation}
              onStartPujoWalk={() => setActiveTab('walk')}
            />
          )}

          {activeTab === 'walk' && (
            <PujoWalkMode
              user={user}
              onExitWalk={() => setActiveTab('planner')}
            />
          )}

          {activeTab === 'crowd' && (
            <CrowdPage onGetDirections={handleGetDirections} />
          )}

          {activeTab === 'adda' && (
            <AddaSocialPage user={user} onOpenAuth={() => setShowAuthModal(true)} />
          )}

          {activeTab === 'memories_passport' && (
            <MemoriesPassportPage user={user} onOpenAuth={() => setShowAuthModal(true)} />
          )}

          {activeTab === 'ai' && (
            <AiDiscoveryPage userLocation={userLocation} onGetDirections={handleGetDirections} />
          )}

          {activeTab === 'safety' && (
            <EmergencySosPage user={user} />
          )}

          {activeTab === 'food' && (
            <BhogFoodTrackerPage />
          )}

          {activeTab === 'profile_admin' && (
            <AdminDashboardPage user={user} />
          )}

          {activeTab === 'map' && (
            <div style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', padding: '0 20px 20px' }}>
              <Header
                activeZone={activeZone}
                setActiveZone={setActiveZone}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                viewMode={viewMode}
                setViewMode={setViewMode}
                onLocateMe={handleLocateMe}
                isLocating={isLocating}
                user={user}
                onPromptAuth={() => setShowAuthModal(true)}
              />

              <div className="main-map-layout" style={{ flex: 1, minHeight: 0, marginTop: '8px' }}>
                <div className="side-panel-container">
                  {filteredPujas.map((puja) => (
                    <PujaCard
                      key={puja.id}
                      puja={puja}
                      isSelected={selectedPuja && selectedPuja.id === puja.id}
                      onSelect={(p) => setSelectedPuja(p)}
                      onDirections={handleGetDirections}
                    />
                  ))}
                </div>

                <div className="map-wrapper" style={{ height: '100%', width: '100%' }}>
                  <InteractiveMap
                    pujas={filteredPujas}
                    activeZone={activeZone}
                    userLocation={userLocation}
                    selectedPuja={selectedPuja}
                    onSelectPuja={(p) => setSelectedPuja(p)}
                    onDirections={handleGetDirections}
                    theme={theme}
                  />

                  {navTargetPuja && (
                    <DirectionsDrawer
                      targetPuja={navTargetPuja}
                      userLocation={userLocation}
                      onClose={() => setNavTargetPuja(null)}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* PWA App Installation Approval Modal */}
      <PwaInstallModal />

      {/* Mobile AR View Simulator */}
      {showArModal && <ArViewModal onClose={() => setShowArModal(false)} />}

      {/* Floating Pandal & Puja Modal Popup */}
      {showPandalModal && (
        <PandalPujaModal onClose={() => setShowPandalModal(false)} />
      )}

      {/* Login Success Friend Suggestions Modal */}
      {showFriendSuggestionsModal && (
        <FriendSuggestionsModal
          user={user}
          onClose={() => setShowFriendSuggestionsModal(false)}
          onOpenChatWithUser={(u) => {
            setShowFriendSuggestionsModal(false);
            setActiveTab('adda');
          }}
          onOpenAuth={() => setShowAuthModal(true)}
        />
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => {
            setShowAuthModal(false);
            setIsSearchAuthPrompt(false);
          }}
          onLoginSuccess={handleLoginSuccess}
          isSearchPrompt={isSearchAuthPrompt}
        />
      )}
    </div>
  );
}
