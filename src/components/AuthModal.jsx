import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, ShieldCheck, Sparkles, AlertCircle, CheckCircle2, RefreshCw, MapPin } from 'lucide-react';
import { loginUser, registerUser, loginWithGoogle, sendPasswordResetLink } from '../services/authService';
import { INDIAN_STATES } from '../data/festivals';

// Generator for Section 7 Custom CAPTCHA (6 Random Chars A-Z, 1-9 excluding 0)
function generateCaptchaCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function AuthModal({ onClose, onLoginSuccess, isSearchPrompt = false }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedState, setSelectedState] = useState('West Bengal');
  const [selectedDistrict, setSelectedDistrict] = useState('Kolkata');
  const [allowLocation, setAllowLocation] = useState(true);

  // CAPTCHA State (Section 7)
  const [captchaCode, setCaptchaCode] = useState(() => generateCaptchaCode());
  const [userCaptchaInput, setUserCaptchaInput] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptchaCode());
    setUserCaptchaInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Verify Custom CAPTCHA (Section 7)
    if (userCaptchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      refreshCaptcha();
      if (attempts >= 3) {
        setErrorMsg('Too many failed CAPTCHA attempts. New verification code generated.');
      } else {
        setErrorMsg('Invalid Security CAPTCHA code. Please try again.');
      }
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'forgot') {
        const result = await sendPasswordResetLink(email);
        if (result.success) {
          setSuccessMsg(result.message);
        } else {
          setErrorMsg(result.error || 'Failed to send password reset email.');
        }
      } else if (mode === 'register') {
        const result = await registerUser({
          name,
          email,
          password,
          state: selectedState,
          district: selectedDistrict,
          allowLocation
        });
        if (result.success) {
          setSuccessMsg('Account registered successfully! Redirecting...');
          setTimeout(() => {
            onLoginSuccess(result.user);
          }, 400);
        } else {
          setErrorMsg(result.error || 'Registration failed.');
        }
      } else {
        const result = await loginUser({ email, password });
        if (result.success) {
          setSuccessMsg('Signed in successfully! Redirecting...');
          setTimeout(() => {
            onLoginSuccess(result.user);
          }, 400);
        } else {
          setErrorMsg(result.error || 'Login failed.');
        }
      }
    } catch (err) {
      setErrorMsg('Server authentication error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    if (provider === 'Google') {
      setIsSubmitting(true);
      setErrorMsg('');
      setSuccessMsg('');
      const result = await loginWithGoogle();
      setIsSubmitting(false);
      if (result.success) {
        setSuccessMsg(`Welcome ${result.user.name}! Redirecting...`);
        setTimeout(() => {
          onLoginSuccess(result.user);
        }, 400);
      } else {
        setErrorMsg(result.error || 'Google Sign-In failed.');
      }
    }
  };

  const currentDistricts = INDIAN_STATES.find(s => s.name === selectedState)?.districts || ['Kolkata'];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="glass-panel animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '450px',
          maxWidth: '94vw',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '24px',
          padding: '28px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          border: '1px solid var(--border-glow)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'var(--input-bg)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #e11d48, #f59e0b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 10px',
            color: '#fff',
            fontSize: '1.5rem',
            boxShadow: '0 0 20px rgba(225, 29, 72, 0.4)'
          }}>
            🪔
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            {mode === 'forgot'
              ? 'Reset Your Password'
              : mode === 'login'
              ? 'Welcome Back to Pujo Adda'
              : 'Create Pujo Adda Account'}
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {mode === 'forgot'
              ? 'Enter your email to receive a password reset link'
              : mode === 'login'
              ? 'Sign in to access search, routes & social adda'
              : 'Join festival lovers across India'}
          </p>
        </div>

        {/* Search Guard Banner Notice */}
        {isSearchPrompt && (
          <div style={{
            padding: '10px 12px',
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            color: '#fbbf24',
            fontSize: '0.8rem',
            lineHeight: 1.4,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={16} style={{ shrink: 0 }} />
            <span>Please log in or register your account to unlock Pandal Search & Live Route Filtering!</span>
          </div>
        )}

        {/* Error Banner */}
        {errorMsg && (
          <div style={{
            padding: '10px 12px',
            borderRadius: '10px',
            background: 'rgba(225, 29, 72, 0.15)',
            border: '1px solid rgba(225, 29, 72, 0.4)',
            color: '#f87171',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} style={{ shrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Banner */}
        {successMsg && (
          <div style={{
            padding: '10px 12px',
            borderRadius: '10px',
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            color: '#4ade80',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={16} style={{ shrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Mode Switcher Tabs */}
        {mode !== 'forgot' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: 'var(--input-bg)',
            padding: '4px',
            borderRadius: '12px',
            border: '1px solid var(--border-color)'
          }}>
            <button
              onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
              style={{
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: mode === 'login' ? 'var(--accent-crimson)' : 'transparent',
                color: mode === 'login' ? '#fff' : 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
              style={{
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: mode === 'register' ? 'var(--accent-crimson)' : 'transparent',
                color: mode === 'register' ? '#fff' : 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Register
            </button>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mode === 'register' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Anirban Mukherjee"
                    style={{ paddingLeft: '38px' }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* State & District (Section 6) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    State
                  </label>
                  <select
                    className="form-input"
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      const dists = INDIAN_STATES.find(s => s.name === e.target.value)?.districts || [];
                      setSelectedDistrict(dists[0] || '');
                    }}
                    style={{ padding: '8px 10px', fontSize: '0.82rem' }}
                  >
                    {INDIAN_STATES.map(st => (
                      <option key={st.id} value={st.name}>{st.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    District
                  </label>
                  <select
                    className="form-input"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    style={{ padding: '8px 10px', fontSize: '0.82rem' }}
                  >
                    {currentDistricts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Optional Location Permission Switch (Section 6) */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={allowLocation}
                  onChange={(e) => setAllowLocation(e.target.checked)}
                />
                <span>Allow location permission for nearby discovery & routes (Approximate location only)</span>
              </label>
            </>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                style={{ paddingLeft: '38px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setErrorMsg(''); setSuccessMsg(''); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-cyan)',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  style={{ paddingLeft: '38px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* Section 7: CUSTOM CAPTCHA VERIFICATION */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--accent-gold)', marginBottom: '4px' }}>
              Security Verification CAPTCHA
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'var(--input-bg)',
              padding: '6px 12px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)'
            }}>
              {/* Visual Display for CAPTCHA */}
              <div style={{
                fontFamily: 'monospace',
                fontSize: '1.2rem',
                fontWeight: '900',
                letterSpacing: '4px',
                color: '#f59e0b',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(225, 29, 72, 0.2))',
                padding: '6px 14px',
                borderRadius: '8px',
                userSelect: 'none',
                textShadow: '0 0 8px rgba(245, 158, 11, 0.5)'
              }}>
                {captchaCode}
              </div>
              <button
                type="button"
                onClick={refreshCaptcha}
                title="Generate New CAPTCHA Code"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <RefreshCw size={18} />
              </button>
              <input
                type="text"
                className="form-input"
                placeholder="Enter 6 chars"
                value={userCaptchaInput}
                onChange={(e) => setUserCaptchaInput(e.target.value)}
                maxLength={6}
                required
                style={{
                  flex: 1,
                  fontFamily: 'monospace',
                  textTransform: 'uppercase',
                  fontWeight: '700',
                  letterSpacing: '2px',
                  padding: '6px 10px',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '12px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--accent-gold), #d97706)',
              border: 'none',
              color: '#000',
              fontWeight: '800',
              fontSize: '0.92rem',
              cursor: isSubmitting ? 'wait' : 'pointer',
              marginTop: '4px',
              boxShadow: '0 6px 20px rgba(245, 158, 11, 0.35)',
              opacity: isSubmitting ? 0.8 : 1
            }}
          >
            {isSubmitting
              ? 'Processing...'
              : mode === 'forgot'
              ? 'Send Password Reset Link'
              : mode === 'login'
              ? 'Sign In to Account'
              : 'Create New Account'}
          </button>

          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-cyan)',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer',
                textAlign: 'center',
                marginTop: '4px'
              }}
            >
              ← Back to Sign In
            </button>
          )}
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>OR SIGN IN WITH</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
        </div>

        {/* Google Sign In Button */}
        <button
          onClick={() => handleSocialLogin('Google')}
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '12px',
            background: 'var(--input-bg)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            fontWeight: '700',
            cursor: isSubmitting ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
