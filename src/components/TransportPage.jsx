import React, { useState, useMemo } from 'react';
import {
  Train,
  Navigation,
  Bus,
  Search,
  MapPin,
  Clock,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Sliders,
  CheckCircle2,
  DollarSign,
  ChevronDown,
  ChevronRight,
  Info,
  Compass,
  ArrowLeftRight,
  Bell,
  Radio,
  Zap,
  Check,
  ShieldCheck,
  LayoutGrid
} from 'lucide-react';

import { TRAINS_DATA, searchTrains } from '../data/trainsData';
import { METRO_LINES, BUS_ROUTES, calculateMetroRoute } from '../data/transportData';

// Station quick search pills
const POPULAR_STATIONS = [
  { code: 'SDAH', name: 'Sealdah' },
  { code: 'HWH', name: 'Howrah' },
  { code: 'KOAA', name: 'Kolkata' },
  { code: 'NJP', name: 'New Jalpaiguri' },
  { code: 'BWN', name: 'Bardhaman' },
  { code: 'RPH', name: 'Rampurhat' },
  { code: 'MLDT', name: 'Malda Town' },
  { code: 'KGP', name: 'Kharagpur' },
  { code: 'DGHA', name: 'Digha' },
  { code: 'ASN', name: 'Asansol' },
  { code: 'BLGT', name: 'Balurghat' }
];

export default function TransportPage() {
  // Main mode: 'home' | 'train' | 'metro' | 'bus'
  const [activeMode, setActiveMode] = useState('train');

  // "Where Is My Train" Search States
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [trainQuery, setTrainQuery] = useState('');
  const [trainCategoryFilter, setTrainCategoryFilter] = useState('all');

  // Live Running Status / Track Modal State
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [trackDirection, setTrackDirection] = useState('UP'); // 'UP' | 'DOWN'
  const [activeTabInsideTrain, setActiveTabInsideTrain] = useState('live'); // 'live' | 'schedule' | 'coach'
  const [alarmSet, setAlarmSet] = useState(false);
  const [sourceMode, setSourceMode] = useState('GPS'); // 'GPS' | 'CELL' | 'TIMETABLE'

  // Metro States
  const [selectedMetroLine, setSelectedMetroLine] = useState('blue');
  const [metroFrom, setMetroFrom] = useState('m-dakshineswar');
  const [metroTo, setMetroTo] = useState('m-esplanade');

  // Bus States
  const [busOperatorFilter, setBusOperatorFilter] = useState('all');

  // Swap From and To stations
  const handleSwapStations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  // Search Results
  const trainResults = useMemo(() => {
    let list = searchTrains({ from: fromLocation, to: toLocation, category: trainCategoryFilter });
    if (trainQuery.trim()) {
      const q = trainQuery.toLowerCase().trim();
      list = list.filter(t =>
        t.number.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        (t.upNumber && t.upNumber.includes(q)) ||
        (t.downNumber && t.downNumber.includes(q))
      );
    }
    return list;
  }, [fromLocation, toLocation, trainCategoryFilter, trainQuery]);

  const calculatedMetro = useMemo(() => {
    return calculateMetroRoute(metroFrom, metroTo);
  }, [metroFrom, metroTo]);

  const filteredBuses = useMemo(() => {
    return BUS_ROUTES.filter(b => {
      const matchOp = busOperatorFilter === 'all' || b.operator.toLowerCase().includes(busOperatorFilter.toLowerCase());
      const qFrom = fromLocation.toLowerCase().trim();
      const qTo = toLocation.toLowerCase().trim();

      const stopsLower = b.stops.map(s => s.toLowerCase());
      const origLower = b.origin.toLowerCase();
      const destLower = b.destination.toLowerCase();

      const matchFrom = !qFrom || origLower.includes(qFrom) || stopsLower.some(s => s.includes(qFrom));
      const matchTo = !qTo || destLower.includes(qTo) || stopsLower.some(s => s.includes(qTo));

      return matchOp && matchFrom && matchTo;
    });
  }, [busOperatorFilter, fromLocation, toLocation]);

  const activeMetroLineObj = METRO_LINES.find(l => l.id === selectedMetroLine) || METRO_LINES[0];

  return (
    <div className="transport-page-container animate-fade-in" style={{ padding: '0 20px 40px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Title & Brand Banner */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: '900', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: '#fff',
              padding: '4px 12px',
              borderRadius: '14px',
              fontSize: '1.1rem',
              fontWeight: '900',
              boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)'
            }}>
              🚆 WHERE IS MY TRAIN
            </span>
            <span style={{ fontSize: '1.4rem' }}>— Live Travel Hub</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
            Real-time Railway Live Status, Station-by-Station Track Diagram, Fares & Metro/Bus Companion.
          </p>
        </div>

        {/* Mode Switcher Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '4px',
          padding: '4px',
          background: 'var(--input-bg)',
          borderRadius: '24px',
          border: '1px solid var(--border-color)'
        }}>
          {[
            { id: 'train', label: '🚆 Train Status', icon: Train },
            { id: 'metro', label: '🚇 Metro', icon: Navigation },
            { id: 'bus', label: '🚌 Bus', icon: Bus },
            { id: 'home', label: 'Overview', icon: Compass }
          ].map(tab => {
            const TIcon = tab.icon;
            const isActive = activeMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveMode(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '20px',
                  border: 'none',
                  background: isActive ? 'linear-gradient(135deg, #16a34a, #15803d)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  fontWeight: isActive ? '800' : '600',
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 12px rgba(22, 163, 74, 0.3)' : 'none'
                }}
              >
                <TIcon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ICONIC "WHERE IS MY TRAIN" GREEN HEADER SEARCH BOX */}
      {activeMode === 'train' && (
        <div
          className="glass-panel"
          style={{
            background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.2), rgba(15, 23, 42, 0.95))',
            borderRadius: '24px',
            padding: '24px',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            marginBottom: '28px',
            boxShadow: '0 10px 30px -5px rgba(22, 163, 74, 0.2)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#4ade80', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Radio size={16} className="theme-toggle-spin" />
              <span>FIND TRAIN ROUTE & LIVE STATUS</span>
            </span>

            {/* Source Mode Toggle: GPS vs Cell Tower vs Timetable */}
            <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.4)', padding: '3px', borderRadius: '12px' }}>
              {['GPS', 'CELL', 'TIMETABLE'].map(m => (
                <button
                  key={m}
                  onClick={() => setSourceMode(m)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '8px',
                    border: 'none',
                    background: sourceMode === m ? '#22c55e' : 'transparent',
                    color: sourceMode === m ? '#000' : 'var(--text-muted)',
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  {m === 'GPS' ? '📡 GPS Live' : m === 'CELL' ? '📶 Cell Tower' : '📅 Timetable'}
                </button>
              ))}
            </div>
          </div>

          {/* FROM / TO / SWAP ROW */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
            {/* From Station */}
            <div style={{ position: 'relative' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#4ade80', display: 'block', marginBottom: '4px' }}>
                FROM STATION
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#4ade80' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="From Station (e.g. SDAH / Sealdah)"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  style={{ paddingLeft: '36px', fontSize: '0.92rem', fontWeight: '700' }}
                />
              </div>
            </div>

            {/* Swap Button */}
            <button
              onClick={handleSwapStations}
              title="Swap Origin and Destination"
              style={{
                marginTop: '18px',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.25)',
                border: '1px solid rgba(34, 197, 94, 0.5)',
                color: '#4ade80',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(180deg)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0deg)'}
            >
              <ArrowLeftRight size={18} />
            </button>

            {/* To Station */}
            <div style={{ position: 'relative' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#f43f5e', display: 'block', marginBottom: '4px' }}>
                TO STATION
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#f43f5e' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="To Station (e.g. HDB / Haldibari, NJP)"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  style={{ paddingLeft: '36px', fontSize: '0.92rem', fontWeight: '700' }}
                />
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={() => {}}
              style={{
                marginTop: '18px',
                padding: '12px 24px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #22c55e, #15803d)',
                border: 'none',
                color: '#fff',
                fontWeight: '900',
                fontSize: '0.92rem',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Search size={18} />
              <span>FIND TRAINS</span>
            </button>
          </div>

          {/* Quick Popular Station Code Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', marginRight: '4px' }}>POPULAR:</span>
            {POPULAR_STATIONS.map(s => (
              <button
                key={s.code}
                onClick={() => {
                  if (!fromLocation) setFromLocation(s.name);
                  else if (!toLocation) setToLocation(s.name);
                  else { setFromLocation(s.name); setToLocation(''); }
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: 'var(--text-primary)',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {s.name} ({s.code})
              </button>
            ))}
          </div>

          {/* Direct Search by Train No / Name input */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search by Train No. or Train Name (e.g. 12343, Darjeeling Mail, Padatik, Vande Bharat)..."
              value={trainQuery}
              onChange={(e) => setTrainQuery(e.target.value)}
              style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TRAIN RESULTS LIST (WHERE IS MY TRAIN CARDS) */}
      {/* ========================================================================= */}
      {activeMode === 'train' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Category Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)' }}>CATEGORY:</span>
              {[
                { id: 'all', label: 'All Trains' },
                { id: 'superfast', label: 'Superfast Mail' },
                { id: 'vande', label: 'Vande Bharat' },
                { id: 'express', label: 'Express' },
                { id: 'emu', label: 'EMU Suburban' },
                { id: 'memu', label: 'MEMU / DEMU' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setTrainCategoryFilter(cat.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '12px',
                    border: trainCategoryFilter === cat.id ? '1px solid #22c55e' : '1px solid var(--border-color)',
                    background: trainCategoryFilter === cat.id ? '#16a34a' : 'var(--input-bg)',
                    color: '#fff',
                    fontWeight: '800',
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: '700' }}>
              Showing <span style={{ color: '#4ade80' }}>{trainResults.length}</span> verified trains
            </div>
          </div>

          {/* Train Cards List */}
          {trainResults.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
              {trainResults.map(train => {
                const isVande = train.category.includes('Vande');
                const isSuperfast = train.category.includes('Superfast');

                return (
                  <div
                    key={train.number}
                    className="glass-panel"
                    style={{
                      padding: '20px',
                      borderRadius: '22px',
                      border: isVande ? '1px solid #38bdf8' : isSuperfast ? '1px solid rgba(225, 29, 72, 0.4)' : '1px solid var(--border-color)',
                      background: 'var(--bg-card)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      boxShadow: '0 8px 20px -4px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <div>
                      {/* Top Bar: Train Number & Running Days */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '10px',
                            background: isVande ? 'rgba(56, 189, 248, 0.2)' : 'rgba(34, 197, 94, 0.18)',
                            color: isVande ? '#38bdf8' : '#4ade80',
                            fontWeight: '900',
                            fontSize: '0.82rem',
                            border: `1px solid ${isVande ? 'rgba(56, 189, 248, 0.4)' : 'rgba(34, 197, 94, 0.4)'}`
                          }}>
                            #{train.number}
                          </span>
                          <span style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--accent-gold)', textTransform: 'uppercase' }}>
                            {train.category}
                          </span>
                        </div>

                        {/* Running Days Indicator M T W T F S S */}
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                            <span
                              key={idx}
                              style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '4px',
                                background: train.frequency === 'Daily' || train.frequency.includes('6 Days') ? '#22c55e' : 'rgba(255,255,255,0.1)',
                                color: train.frequency === 'Daily' || train.frequency.includes('6 Days') ? '#000' : 'var(--text-muted)',
                                fontSize: '0.62rem',
                                fontWeight: '900',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              {day}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Train Name */}
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 12px 0' }}>
                        {train.name}
                      </h3>

                      {/* Departure & Arrival Box (Where Is My Train Style) */}
                      <div style={{
                        background: 'var(--input-bg)',
                        padding: '14px',
                        borderRadius: '16px',
                        border: '1px solid var(--border-color)',
                        marginBottom: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        {/* Origin */}
                        <div>
                          <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#4ade80' }}>
                            {train.upDep || train.dep || '22:15'}
                          </div>
                          <div style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                            {train.origin.split(' ')[0]}
                          </div>
                        </div>

                        {/* Duration Line */}
                        <div style={{ flex: 1, margin: '0 12px', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '700' }}>
                            {train.distanceKm ? `${train.distanceKm} km` : 'Direct Route'}
                          </div>
                          <div style={{ height: '2px', background: 'linear-gradient(90deg, #22c55e, #f59e0b)', margin: '4px 0', position: 'relative' }}>
                            <span style={{ position: 'absolute', top: '-4px', left: '50%', transform: 'translateX(-50%)', width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#4ade80', fontWeight: '800' }}>
                            ● DAILY SCHEDULED
                          </div>
                        </div>

                        {/* Destination */}
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#f43f5e' }}>
                            {train.upArr || train.arr || '09:30'}
                          </div>
                          <div style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                            {train.destination.split(' ')[0]}
                          </div>
                        </div>
                      </div>

                      {/* Fares & Classes Pill Bar */}
                      {train.fareStr && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                          {train.fareStr.split(', ').map(f => (
                            <span
                              key={f}
                              style={{
                                fontSize: '0.75rem',
                                fontWeight: '800',
                                padding: '3px 8px',
                                borderRadius: '8px',
                                background: 'rgba(245, 158, 11, 0.15)',
                                color: 'var(--accent-gold)',
                                border: '1px solid rgba(245, 158, 11, 0.3)'
                              }}
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons: LIVE STATUS & SCHEDULE */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                      <button
                        onClick={() => {
                          setSelectedTrain(train);
                          setActiveTabInsideTrain('live');
                        }}
                        style={{
                          flex: 1,
                          padding: '10px 12px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                          border: 'none',
                          color: '#fff',
                          fontWeight: '900',
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
                        }}
                      >
                        <Radio size={16} className="theme-toggle-spin" />
                        <span>LIVE RUNNING STATUS</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedTrain(train);
                          setActiveTabInsideTrain('schedule');
                        }}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '12px',
                          background: 'var(--input-bg)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-primary)',
                          fontWeight: '800',
                          fontSize: '0.82rem',
                          cursor: 'pointer'
                        }}
                      >
                        Timetable
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', borderRadius: '24px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🚆</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                No transport data is currently available for this search.
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Try searching for station names like 'Sealdah', 'Howrah', 'NJP', 'Haldibari' or clear your filters.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. METRO SECTION */}
      {/* ========================================================================= */}
      {activeMode === 'metro' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
            {METRO_LINES.map(line => (
              <button
                key={line.id}
                onClick={() => setSelectedMetroLine(line.id)}
                style={{
                  padding: '12px 18px',
                  borderRadius: '16px',
                  border: selectedMetroLine === line.id ? `2px solid ${line.color}` : '1px solid var(--border-color)',
                  background: selectedMetroLine === line.id ? line.gradient : 'var(--input-bg)',
                  color: '#fff',
                  fontWeight: '800',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {line.name}
              </button>
            ))}
          </div>

          <div className="glass-panel" style={{ padding: '20px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--accent-gold)', marginBottom: '16px' }}>
              KOLKATA METRO FARE & ROUTE CALCULATOR
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  BOARDING STATION
                </label>
                <select
                  value={metroFrom}
                  onChange={(e) => setMetroFrom(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '0.88rem' }}
                >
                  {METRO_LINES.flatMap(l => l.stations).map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  DESTINATION STATION
                </label>
                <select
                  value={metroTo}
                  onChange={(e) => setMetroTo(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '0.88rem' }}
                >
                  {METRO_LINES.flatMap(l => l.stations).map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>
            </div>

            {calculatedMetro && (
              <div style={{ background: 'var(--input-bg)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Ticket Fare</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#4ade80' }}>₹{calculatedMetro.fare}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Distance</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>{calculatedMetro.distanceKm} km</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Travel Time</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-gold)' }}>~{calculatedMetro.durationMins} mins</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Interchange</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: calculatedMetro.sameLine ? '#4ade80' : '#f43f5e' }}>
                    {calculatedMetro.sameLine ? 'Direct (No Interchange)' : calculatedMetro.interchangeStation}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. BUS SECTION */}
      {/* ========================================================================= */}
      {activeMode === 'bus' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>OPERATOR:</span>
            {['all', 'WBTC', 'SBSTC', 'NBSTC', 'PRIVATE'].map(op => (
              <button
                key={op}
                onClick={() => setBusOperatorFilter(op)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '12px',
                  border: busOperatorFilter === op ? '1px solid #16a34a' : '1px solid var(--border-color)',
                  background: busOperatorFilter === op ? '#16a34a' : 'var(--input-bg)',
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                {op.toUpperCase()}
              </button>
            ))}
          </div>

          {filteredBuses.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
              {filteredBuses.map(bus => (
                <div key={bus.routeNo} className="glass-panel" style={{ padding: '20px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '900', color: '#fff', background: '#16a34a', padding: '3px 10px', borderRadius: '10px' }}>
                      Route #{bus.routeNo}
                    </span>
                    <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '8px', background: bus.liveAvailable ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)', color: bus.liveAvailable ? '#4ade80' : 'var(--text-muted)', fontWeight: '800' }}>
                      {bus.liveAvailable ? '● LIVE GPS TRACKING' : 'SCHEDULED'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                    {bus.operator} — {bus.type}
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                    📍 <strong>Route:</strong> {bus.origin} ↔ {bus.destination}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '50px 20px', textAlign: 'center', borderRadius: '20px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🚌</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                No transport data is currently available for this search.
              </h3>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* DEDICATED "WHERE IS MY TRAIN" LIVE RUNNING TRACK MODAL */}
      {/* ========================================================================= */}
      {selectedTrain && (
        <div
          className="modal-backdrop animate-fade-in"
          onClick={() => setSelectedTrain(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(12px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            className="glass-panel"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '850px',
              maxWidth: '96vw',
              maxHeight: '92vh',
              borderRadius: '24px',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              background: 'var(--bg-card)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(34, 197, 94, 0.25)'
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '18px 24px',
              background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.3), rgba(15, 23, 42, 0.95))',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ padding: '2px 8px', borderRadius: '8px', background: '#22c55e', color: '#000', fontWeight: '900', fontSize: '0.82rem' }}>
                    #{selectedTrain.number}
                  </span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#fff', margin: 0 }}>
                    {selectedTrain.name}
                  </h3>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#4ade80', fontWeight: '700', marginTop: '4px' }}>
                  {selectedTrain.category} • {selectedTrain.origin} → {selectedTrain.destination}
                </div>
              </div>

              {/* Action Buttons inside Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setAlarmSet(!alarmSet)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '12px',
                    background: alarmSet ? 'rgba(234, 179, 8, 0.25)' : 'var(--input-bg)',
                    border: alarmSet ? '1px solid #eab308' : '1px solid var(--border-color)',
                    color: alarmSet ? '#facc15' : 'var(--text-secondary)',
                    fontWeight: '800',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Bell size={15} />
                  <span>{alarmSet ? 'Alarm Set 🔔' : 'Set Alarm'}</span>
                </button>

                <button
                  onClick={() => setSelectedTrain(null)}
                  style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: '50%', width: '34px', height: '34px', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* LIVE STATUS BAR (WHERE IS MY TRAIN SIGNATURE BLUE/GREEN BANNER) */}
            <div style={{
              background: 'linear-gradient(135deg, #1e3a8a, #0284c7)',
              padding: '14px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#fff',
              fontSize: '0.86rem',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="theme-toggle-spin" style={{ fontSize: '1.2rem' }}>🚆</span>
                <div>
                  <div style={{ fontWeight: '900', color: '#38bdf8' }}>
                    Currently at Bolpur Shantiniketan (BHP)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#e0f2fe' }}>
                    Departed Rampurhat at 15:25 • Speed: 82 km/h • PF 1
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ padding: '4px 10px', borderRadius: '12px', background: '#22c55e', color: '#000', fontWeight: '900', fontSize: '0.78rem' }}>
                  ON TIME
                </span>
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Source: {sourceMode}</span>
              </div>
            </div>

            {/* Sub-Tabs: Live Track vs Timetable vs Coach Layout */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: 'var(--input-bg)' }}>
              {[
                { id: 'live', label: '🚆 Live Track Route' },
                { id: 'schedule', label: '📅 Full Timetable' },
                { id: 'coach', label: '🚃 Coach Layout' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTabInsideTrain(t.id)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: 'none',
                    borderBottom: activeTabInsideTrain === t.id ? '3px solid #22c55e' : '3px solid transparent',
                    background: 'transparent',
                    color: activeTabInsideTrain === t.id ? '#4ade80' : 'var(--text-secondary)',
                    fontWeight: activeTabInsideTrain === t.id ? '900' : '600',
                    fontSize: '0.84rem',
                    cursor: 'pointer'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* MODAL BODY */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              {/* TAB 1: LIVE VERTICAL TRACK ROUTE DIAGRAM */}
              {activeTabInsideTrain === 'live' && (
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--accent-gold)', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>STATION-BY-STATION TRACK DIAGRAM</span>
                    <span>PF = Platform Number</span>
                  </div>

                  <div style={{ position: 'relative', paddingLeft: '30px' }}>
                    {/* Vertical Railway Line Track */}
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      bottom: '15px',
                      left: '12px',
                      width: '4px',
                      background: 'linear-gradient(180deg, #22c55e 0%, #22c55e 40%, #0284c7 60%, #64748b 100%)',
                      borderRadius: '4px'
                    }} />

                    {/* Station Nodes */}
                    {(selectedTrain.stops || [selectedTrain.origin, ...(selectedTrain.keyStopsStr ? selectedTrain.keyStopsStr.split(', ') : []), selectedTrain.destination]).map((stationName, index, array) => {
                      const isFirst = index === 0;
                      const isLast = index === array.length - 1;
                      const isCurrent = index === Math.floor(array.length / 2); // Simulated current train location
                      const isPassed = index < Math.floor(array.length / 2);

                      return (
                        <div
                          key={index}
                          style={{
                            position: 'relative',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            opacity: isPassed ? 0.75 : 1
                          }}
                        >
                          {/* Station Node Marker */}
                          <div style={{
                            position: 'absolute',
                            left: '-24px',
                            width: isCurrent ? '20px' : '14px',
                            height: isCurrent ? '20px' : '14px',
                            borderRadius: '50%',
                            background: isCurrent ? '#22c55e' : isPassed ? '#22c55e' : '#64748b',
                            border: isCurrent ? '3px solid #fff' : '2px solid var(--bg-card)',
                            boxShadow: isCurrent ? '0 0 15px #22c55e' : 'none',
                            zIndex: 2
                          }} />

                          {/* Station Name & Details */}
                          <div style={{ marginLeft: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '0.95rem', fontWeight: isCurrent ? '900' : '700', color: isCurrent ? '#4ade80' : 'var(--text-primary)' }}>
                                {stationName}
                              </span>
                              {isCurrent && (
                                <span style={{ padding: '2px 8px', borderRadius: '8px', background: '#22c55e', color: '#000', fontSize: '0.7rem', fontWeight: '900' }}>
                                  🚆 LIVE HERE
                                </span>
                              )}
                            </div>

                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                              PF {index % 3 + 1} • {index * 75} km from origin
                            </div>
                          </div>

                          {/* Timing & Delay Status */}
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.88rem', fontWeight: '800', color: isCurrent ? '#4ade80' : 'var(--text-primary)' }}>
                              {isFirst ? (selectedTrain.upDep || selectedTrain.dep || '22:15') : isLast ? (selectedTrain.upArr || selectedTrain.arr || '09:30') : `Arr ${12 + index}:30`}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: isPassed ? '#22c55e' : '#4ade80', fontWeight: '700' }}>
                              {isPassed ? 'Passed' : isCurrent ? 'Right Time' : 'Scheduled'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: FULL TIMETABLE TABLE */}
              {activeTabInsideTrain === 'schedule' && (
                <div>
                  <div style={{ background: 'var(--input-bg)', padding: '14px', borderRadius: '14px', marginBottom: '16px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <div>🚆 <strong>Train:</strong> {selectedTrain.name} (#{selectedTrain.number})</div>
                    <div>🗓️ <strong>Running Days:</strong> {selectedTrain.frequency || selectedTrain.runningDays}</div>
                    {selectedTrain.fareStr && <div>🎟️ <strong>Fares:</strong> {selectedTrain.fareStr}</div>}
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--accent-gold)', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>#</th>
                        <th style={{ padding: '10px' }}>Station Name</th>
                        <th style={{ padding: '10px' }}>Platform</th>
                        <th style={{ padding: '10px' }}>Arr / Dep</th>
                        <th style={{ padding: '10px' }}>Halt</th>
                        <th style={{ padding: '10px' }}>Distance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedTrain.stops || [selectedTrain.origin, ...(selectedTrain.keyStopsStr ? selectedTrain.keyStopsStr.split(', ') : []), selectedTrain.destination]).map((st, i, arr) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '10px', color: 'var(--text-muted)' }}>{i + 1}</td>
                          <td style={{ padding: '10px', fontWeight: '800', color: 'var(--text-primary)' }}>{st}</td>
                          <td style={{ padding: '10px', color: 'var(--accent-cyan)' }}>PF {i % 3 + 1}</td>
                          <td style={{ padding: '10px', color: '#4ade80', fontWeight: '700' }}>
                            {i === 0 ? selectedTrain.upDep || '22:15' : i === arr.length - 1 ? selectedTrain.upArr || '09:30' : `${13 + i}:15`}
                          </td>
                          <td style={{ padding: '10px' }}>{i === 0 || i === arr.length - 1 ? 'Source/Dest' : '5 mins'}</td>
                          <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{i * 75} km</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TAB 3: COACH LAYOUT & SEAT POSITION */}
              {activeTabInsideTrain === 'coach' && (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>
                    COACH POSITION & RAKE COMPOSITION
                  </h4>

                  <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '12px', justifyContent: 'center' }}>
                    {['ENG', 'SLR', 'GS', 'GS', 'S1', 'S2', 'S3', 'S4', 'S5', 'B1', 'B2', 'B3', 'A1', 'H1', 'SLR'].map((coach, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '12px',
                          background: coach.startsWith('S') ? 'rgba(34, 197, 94, 0.2)' : coach.startsWith('B') || coach.startsWith('A') ? 'rgba(56, 189, 248, 0.2)' : 'var(--input-bg)',
                          border: '1px solid var(--border-color)',
                          minWidth: '55px'
                        }}
                      >
                        <div style={{ fontSize: '0.9rem', fontWeight: '900', color: '#fff' }}>{coach}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {coach === 'ENG' ? 'Engine' : coach.startsWith('S') ? 'Sleeper' : coach.startsWith('B') ? '3AC' : coach.startsWith('A') ? '2AC' : 'General'}
                        </div>
                      </div>
                    ))}
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '12px' }}>
                    Standard 22-Coach Rake Position for Train #{selectedTrain.number}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
