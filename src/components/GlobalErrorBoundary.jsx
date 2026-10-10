import React from 'react';
import { AlertOctagon, RefreshCw, Home } from 'lucide-react';

export default class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Global Error Boundary caught uncaught exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.href = window.location.origin + window.location.pathname;
  };

  handleClearCacheAndReload = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #090d16 0%, #111827 100%)',
          color: '#ffffff',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          padding: '24px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            maxWidth: '560px',
            width: '100%',
            background: 'rgba(30, 41, 59, 0.7)',
            backdropFilter: 'blur(16px)',
            borderRadius: '24px',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
            padding: '36px 30px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '2px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <AlertOctagon size={38} style={{ color: '#ef4444' }} />
            </div>

            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: '800',
              marginBottom: '10px',
              color: '#f8fafc',
              letterSpacing: '-0.02em'
            }}>
              Something Went Wrong
            </h1>

            <p style={{
              color: '#94a3b8',
              fontSize: '0.95rem',
              lineHeight: '1.6',
              marginBottom: '24px'
            }}>
              An unexpected runtime error occurred. The application recovered to prevent a complete White Screen of Death.
            </p>

            {this.state.error && (
              <div style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '12px 16px',
                textAlign: 'left',
                fontSize: '0.85rem',
                color: '#fca5a5',
                fontFamily: 'monospace',
                overflowX: 'auto',
                marginBottom: '24px',
                maxHeight: '120px'
              }}>
                {this.state.error.toString()}
              </div>
            )}

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'center'
            }}>
              <button
                onClick={this.handleReload}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '30px',
                  background: 'linear-gradient(135deg, #d97706 0%, #dc2626 100%)',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)'
                }}
              >
                <RefreshCw size={18} /> Reload Application
              </button>

              <button
                onClick={this.handleClearCacheAndReload}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '30px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#cbd5e1',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                <Home size={18} /> Clear Session & Reset
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
