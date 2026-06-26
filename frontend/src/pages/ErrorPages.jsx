import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Compass, ShieldX, CloudOff, AlertTriangle } from 'lucide-react';

export const Error401 = () => (
  <div className="flex-center" style={{ height: '80vh', flexDirection: 'column', gap: 'var(--space-3)', marginTop: '72px' }}>
    <ShieldAlert size={64} style={{ color: 'var(--color-mustard)' }} />
    <h1 style={{ fontSize: 'var(--text-3xl)' }}>401 — Unauthorized</h1>
    <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', textAlign: 'center' }}>
      You must log in to view this tourist resource. Please sign in to verify your credentials.
    </p>
    <Link to="/login" className="login-nav-btn" style={{ padding: '8px 24px' }}>
      Log In
    </Link>
  </div>
);

export const Error403 = () => (
  <div className="flex-center" style={{ height: '80vh', flexDirection: 'column', gap: 'var(--space-3)', marginTop: '72px' }}>
    <ShieldX size={64} style={{ color: 'var(--color-phulkari-pink)' }} />
    <h1 style={{ fontSize: 'var(--text-3xl)' }}>403 — Forbidden</h1>
    <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', textAlign: 'center' }}>
      Access restricted. You do not possess the required Super Admin privileges to access this control page.
    </p>
    <Link to="/" className="login-nav-btn" style={{ padding: '8px 24px' }}>
      Back to Home
    </Link>
  </div>
);

export const Error404 = () => (
  <div className="flex-center" style={{ height: '80vh', flexDirection: 'column', gap: 'var(--space-3)', marginTop: '72px' }}>
    <Compass size={64} style={{ color: 'var(--color-mustard)' }} />
    <h1 style={{ fontSize: 'var(--text-3xl)' }}>404 — Page Not Found</h1>
    <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', textAlign: 'center' }}>
      The travel destination or resource you searched for does not exist in our database mappings.
    </p>
    <Link to="/" className="login-nav-btn" style={{ padding: '8px 24px' }}>
      Back to Home
    </Link>
  </div>
);

export const Error500 = () => (
  <div className="flex-center" style={{ height: '80vh', flexDirection: 'column', gap: 'var(--space-3)', marginTop: '72px' }}>
    <AlertTriangle size={64} style={{ color: 'var(--color-phulkari-pink)' }} />
    <h1 style={{ fontSize: 'var(--text-3xl)' }}>500 — Server Error</h1>
    <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', textAlign: 'center' }}>
      Our booking servers encountered an internal query failure. The development team has been alerted.
    </p>
    <button onClick={() => window.location.reload()} className="login-nav-btn" style={{ padding: '8px 24px' }}>
      Reload Page
    </button>
  </div>
);

export const OfflinePage = () => (
  <div className="flex-center" style={{ height: '80vh', flexDirection: 'column', gap: 'var(--space-3)', marginTop: '72px' }}>
    <CloudOff size={64} style={{ color: 'var(--color-mustard)' }} />
    <h1 style={{ fontSize: 'var(--text-3xl)' }}>Offline Mode Active</h1>
    <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', textAlign: 'center' }}>
      No internet connection detected. The PWA is currently utilizing offline cache records to display cities.
    </p>
    <button onClick={() => window.location.reload()} className="login-nav-btn" style={{ padding: '8px 24px' }}>
      Retry Connection
    </button>
  </div>
);
