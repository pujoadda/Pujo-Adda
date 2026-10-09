import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default class SocialErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Social adda tab error boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          background: 'var(--bg-card)',
          borderRadius: '24px',
          margin: '20px auto',
          maxWidth: '600px',
          border: '1px solid var(--border-color)',
          color: 'var(--text-primary)'
        }}>
          <AlertCircle size={48} style={{ color: '#e11d48', marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Social Adda Section Issue</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
            {this.state.error?.message || 'An issue occurred while loading messages.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '10px 20px',
              borderRadius: '20px',
              background: '#e11d48',
              border: 'none',
              color: '#fff',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} /> Reload Adda Tab
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
