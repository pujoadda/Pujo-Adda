import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class MapErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('InteractiveMap Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          width: '100%',
          height: '100%',
          minHeight: '500px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f172a',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#ffffff',
          padding: '24px',
          textAlign: 'center'
        }}>
          <AlertTriangle size={48} style={{ color: '#ef4444', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '8px' }}>
            Map View Rendering Issue
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '400px', marginBottom: '20px' }}>
            {this.state.error?.message || 'An error occurred while loading the Leaflet map tiles or route overlays.'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '24px',
              background: '#1a73e8',
              border: 'none',
              color: '#ffffff',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={16} /> Reload Map
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
