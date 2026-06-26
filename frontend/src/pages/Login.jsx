import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Key, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'Super Admin' || loggedUser.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Incorrect credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center container animate-fade-in-up" style={{ minHeight: '80vh', marginTop: '72px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: 'var(--space-5)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
          <span style={{ fontSize: '32px' }}>ੴ</span>
          <h2 style={{ fontSize: 'var(--text-2xl)', marginTop: '8px' }}>Sign In</h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Welcome to Punjab Tour Guide Smart Platform</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(194, 24, 91, 0.1)', color: 'var(--color-phulkari-pink)', padding: 'var(--space-2)', borderRadius: '8px', fontSize: 'var(--text-xs)', marginBottom: '12px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-xs)', marginBottom: '4px', fontWeight: '600' }}>Email Address</label>
            <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', background: 'var(--bg-secondary)', alignItems: 'center' }}>
              <Mail size={16} style={{ color: 'var(--text-secondary)', marginRight: '8px' }} />
              <input 
                type="email" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ border: 'none', background: 'transparent', flex: '1', fontSize: 'var(--text-sm)' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-xs)', marginBottom: '4px', fontWeight: '600' }}>Password</label>
            <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', background: 'var(--bg-secondary)', alignItems: 'center' }}>
              <Key size={16} style={{ color: 'var(--text-secondary)', marginRight: '8px' }} />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ border: 'none', background: 'transparent', flex: '1', fontSize: 'var(--text-sm)' }}
              />
            </div>
            <div style={{ textAlign: 'right', marginTop: '4px' }}>
              <a href="#forgot" style={{ fontSize: '10px', color: 'var(--color-mustard)', fontWeight: '500' }}>Forgot Password?</a>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="login-nav-btn" 
            style={{ width: '100%', padding: '12px', marginTop: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
          >
            <LogIn size={16} />
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
          <span>Don't have an account? </span>
          <Link to="/register" style={{ color: 'var(--color-mustard)', fontWeight: '600' }}>Register Now</Link>
        </div>

        {/* Demo info credentials */}
        <div style={{ marginTop: 'var(--space-4)', background: 'var(--bg-primary)', padding: 'var(--space-2)', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '10px' }}>
          <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Demo Account Details:</p>
          <p>Super Admin: <code>admin@punjab.tour</code> / <code>admin123</code></p>
          <p>Tourist User: <code>singh@punjab.tour</code> / <code>any</code></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
