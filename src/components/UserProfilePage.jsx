import React, { useState, useRef } from 'react';
import { User, Mail, Lock, Camera, CheckCircle2, ShieldCheck, Sparkles, KeyRound, Building2, RefreshCw, LogOut, Award, MapPin, Heart, ShieldAlert, Upload } from 'lucide-react';
import { sendPasswordResetLink, getRandomAvatarUrl } from '../services/authService';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import AdminDashboardPage from './AdminDashboardPage';

export default function UserProfilePage({ user, onUpdateUser, onLogout, onNavigateTab }) {
  const [activeSubTab, setActiveSubTab] = useState('profile'); // 'profile' | 'security' | 'activity' | 'admin'

  // Editable Form State
  const [name, setName] = useState(user?.name || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || user?.avatar || '');
  const fileInputRef = useRef(null);

  const [savingMsg, setSavingMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Password Reset State
  const [resetMsg, setResetMsg] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);

  // Avatar Selection Gallery
  const presetAvatars = [
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'pujo1')}`,
    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user?.name || 'pujo2')}`,
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=e11d48&color=fff&bold=true&size=128`,
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=f59e0b&color=fff&bold=true&size=128`,
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=38bdf8&color=fff&bold=true&size=128`,
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=10b981&color=fff&bold=true&size=128`
  ];

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingMsg('');
    setErrorMsg('');

    const newName = name.trim();
    if (!newName) {
      setErrorMsg('Name cannot be empty.');
      return;
    }

    const newPhoto = photoURL || getRandomAvatarUrl(newName);
    setIsSaving(true);

    try {
      const updatedUser = {
        ...user,
        name: newName,
        photoURL: newPhoto,
        avatar: newPhoto
      };

      // 1. Update localStorage
      localStorage.setItem('pujo_adda_user', JSON.stringify(updatedUser));

      // 2. Non-blocking Cloud Firestore update
      if (user?.uid && !user.uid.startsWith('demo_')) {
        setDoc(doc(db, 'users', user.uid), {
          name: newName,
          photoURL: newPhoto,
          updatedAt: new Date().toISOString()
        }, { merge: true }).catch((err) => console.warn('Firestore update notice:', err));
      }

      // 3. Update parent React App state
      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      }

      setSavingMsg('🎉 Profile updated successfully!');
      setTimeout(() => setSavingMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendPasswordReset = async () => {
    if (!user?.email) return;
    setIsSendingReset(true);
    setResetMsg('');
    const res = await sendPasswordResetLink(user.email);
    setIsSendingReset(false);
    if (res.success) {
      setResetMsg('📩 Password reset link sent! Check your email inbox.');
    } else {
      setResetMsg(`⚠️ ${res.error || 'Failed to send reset link.'}`);
    }
  };

  if (activeSubTab === 'admin') {
    return (
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <button
            onClick={() => setActiveSubTab('profile')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            ← Back to My Account Profile
          </button>
        </div>
        <AdminDashboardPage user={user} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 20px 40px', color: 'var(--text-primary)' }}>
      
      {/* Banner & Identity Card */}
      <div style={{
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.2), rgba(245, 158, 11, 0.2))',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-main)',
        padding: '32px 28px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '24px',
        backdropFilter: 'blur(20px)'
      }}>
        {/* Avatar Display */}
        <div style={{ position: 'relative' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            border: '3px solid #fbbf24',
            boxShadow: '0 0 24px rgba(245, 158, 11, 0.5)',
            overflow: 'hidden',
            background: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {photoURL ? (
              <img src={photoURL} alt={user?.name || 'User DP'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={48} style={{ color: '#fbbf24' }} />
            )}
          </div>
        </div>

        {/* User Details */}
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: '900',
              color: '#38bdf8',
              background: 'rgba(56, 189, 248, 0.18)',
              padding: '3px 10px',
              borderRadius: '12px',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              letterSpacing: '0.5px'
            }}>
              {user?.email?.endsWith('@gmail.com') ? '🎯 GOOGLE VERIFIED MEMBER' : '🪔 PUJO ADDA MEMBER'}
            </span>

            {user?.isBusinessOwner && (
              <span style={{
                fontSize: '0.68rem',
                fontWeight: '900',
                color: '#fbbf24',
                background: 'rgba(245, 158, 11, 0.18)',
                padding: '3px 10px',
                borderRadius: '12px',
                border: '1px solid rgba(245, 158, 11, 0.3)'
              }}>
                🏢 VERIFIED BUSINESS PARTNER
              </span>
            )}
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', margin: '6px 0 2px', color: 'var(--text-primary)' }}>
            {user?.name || 'Pujo Adda Lover'}
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Mail size={14} style={{ color: 'var(--accent-gold)' }} />
            {user?.email || 'member@pujoadda.com'}
          </p>
        </div>

        {/* Sub-Tab Selector Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveSubTab('profile')}
            style={{
              padding: '9px 16px',
              borderRadius: '20px',
              border: activeSubTab === 'profile' ? '1px solid #e11d48' : '1px solid var(--border-color)',
              background: activeSubTab === 'profile' ? 'var(--accent-crimson)' : 'var(--input-bg)',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            👤 Edit Profile & DP
          </button>
          <button
            onClick={() => setActiveSubTab('security')}
            style={{
              padding: '9px 16px',
              borderRadius: '20px',
              border: activeSubTab === 'security' ? '1px solid #f59e0b' : '1px solid var(--border-color)',
              background: activeSubTab === 'security' ? 'rgba(245, 158, 11, 0.2)' : 'var(--input-bg)',
              color: activeSubTab === 'security' ? '#fbbf24' : 'var(--text-secondary)',
              fontWeight: '700',
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            🔒 Security & Password
          </button>
          <button
            onClick={() => setActiveSubTab('admin')}
            style={{
              padding: '9px 16px',
              borderRadius: '20px',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              fontWeight: '800',
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            🛡️ Admin Audit Portal
          </button>
        </div>
      </div>

      {/* 👤 Edit Profile Section */}
      {activeSubTab === 'profile' && (
        <div style={{
          marginTop: '24px',
          background: 'var(--bg-card)',
          borderRadius: '24px',
          padding: '28px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-main)'
        }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} style={{ color: '#fbbf24' }} /> Edit Profile & Custom Display Picture (DP)
          </h2>

          {savingMsg && (
            <div style={{ padding: '10px 14px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', color: '#4ade80', fontSize: '0.85rem', fontWeight: '700', marginBottom: '16px' }}>
              {savingMsg}
            </div>
          )}

          {errorMsg && (
            <div style={{ padding: '10px 14px', borderRadius: '12px', background: 'rgba(225, 29, 72, 0.15)', border: '1px solid #e11d48', color: '#f87171', fontSize: '0.85rem', fontWeight: '700', marginBottom: '16px' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Display Name Input */}
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Your Display Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  style={{ paddingLeft: '44px', fontSize: '0.92rem' }}
                  required
                />
              </div>
            </div>

            {/* Avatar Gallery Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Choose Profile Avatar / DP
              </label>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {presetAvatars.map((url, idx) => (
                  <div
                    key={idx}
                    onClick={() => setPhotoURL(url)}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      padding: '3px',
                      border: photoURL === url ? '2.5px solid #fbbf24' : '2px solid transparent',
                      boxShadow: photoURL === url ? '0 0 16px rgba(245, 158, 11, 0.6)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background: '#0f172a'
                    }}
                  >
                    <img src={url} alt={`Avatar ${idx + 1}`} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>

              {/* Direct Image Upload from Device */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                      setErrorMsg('Selected image file is too large. Please pick an image under 5MB.');
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                      if (evt.target?.result) {
                        setPhotoURL(evt.target.result);
                        setSavingMsg('📁 Image loaded from device! Click "Save Profile Changes" to apply.');
                        setTimeout(() => setSavingMsg(''), 4000);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: '800',
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(56, 189, 248, 0.35)'
                  }}
                >
                  <Upload size={18} /> Upload Image from Device 📁
                </button>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Supports JPG, PNG, WEBP files
                </span>
              </div>
            </div>

            {/* Email (Read Only) */}
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Email Address (Account Identifier)
              </label>
              <input
                type="text"
                className="form-input"
                value={user?.email || 'N/A'}
                disabled
                style={{ opacity: 0.7, cursor: 'not-allowed', background: 'rgba(255,255,255,0.05)' }}
              />
            </div>

            {/* Submit Save Button */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button
                type="submit"
                disabled={isSaving}
                style={{
                  padding: '12px 28px',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #e11d48, #f59e0b)',
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: '0.92rem',
                  cursor: isSaving ? 'wait' : 'pointer',
                  boxShadow: '0 6px 20px rgba(225, 29, 72, 0.4)'
                }}
              >
                {isSaving ? 'Saving Changes...' : 'Save Profile Changes 💾'}
              </button>

              <button
                type="button"
                onClick={onLogout}
                style={{
                  padding: '12px 20px',
                  borderRadius: '14px',
                  border: '1px solid rgba(225, 29, 72, 0.3)',
                  background: 'rgba(225, 29, 72, 0.15)',
                  color: '#f87171',
                  fontWeight: '700',
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <LogOut size={16} /> Log Out
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 🔒 Security & Password Section */}
      {activeSubTab === 'security' && (
        <div style={{
          marginTop: '24px',
          background: 'var(--bg-card)',
          borderRadius: '24px',
          padding: '28px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-main)'
        }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <KeyRound size={20} style={{ color: '#fbbf24' }} /> Password & Security Controls
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Manage your password security or request a secure password reset link to your email.
          </p>

          {resetMsg && (
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38bdf8', color: '#38bdf8', fontSize: '0.85rem', fontWeight: '700', marginBottom: '20px' }}>
              {resetMsg}
            </div>
          )}

          <div style={{
            background: 'var(--input-bg)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '800', margin: '0 0 4px' }}>
                Reset Account Password via Email
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                We will send an official Firebase password reset link to <strong style={{ color: '#fbbf24' }}>{user?.email}</strong>.
              </p>
            </div>

            <button
              onClick={handleSendPasswordReset}
              disabled={isSendingReset}
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #1a73e8, #38bdf8)',
                border: 'none',
                color: '#ffffff',
                fontWeight: '800',
                fontSize: '0.85rem',
                cursor: isSendingReset ? 'wait' : 'pointer',
                boxShadow: '0 4px 16px rgba(26, 115, 232, 0.35)'
              }}
            >
              {isSendingReset ? 'Sending Email...' : 'Send Password Reset Email 📧'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
