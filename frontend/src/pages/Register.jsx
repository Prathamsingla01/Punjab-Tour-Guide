import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Key, User } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center container animate-fade-in-up" style={{ minHeight: '80vh', marginTop: '72px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: 'var(--space-5)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
          <span style={{ fontSize: '32px' }}>ੴ</span>
          <h2 style={{ fontSize: 'var(--text-2xl)', marginTop: '8px' }}>Create Account</h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Join as a Tourist and earn 100 Reward Points!</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(194, 24, 91, 0.1)', color: 'var(--color-phulkari-pink)', padding: 'var(--space-2)', borderRadius: '8px', fontSize: 'var(--text-xs)', marginBottom: '12px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-xs)', marginBottom: '4px', fontWeight: '600' }}>Full Name</label>
            <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', background: 'var(--bg-secondary)', alignItems: 'center' }}>
              <User size={16} style={{ color: 'var(--text-secondary)', marginRight: '8px' }} />
              <input 
                type="text" 
                placeholder="Guru Nanak"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ border: 'none', background: 'transparent', flex: '1', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

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
                style={{ border: 'none', background: 'transparent', flex: '1', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-xs)', marginBottom: '4px', fontWeight: '600' }}>Password</label>
            <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', background: 'var(--bg-secondary)', alignItems: 'center' }}>
              <Key size={16} style={{ color: 'var(--text-secondary)', marginRight: '8px' }} />
              <input 
                type="password" 
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={{ border: 'none', background: 'transparent', flex: '1', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="login-nav-btn" 
            style={{ width: '100%', padding: '12px', marginTop: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
          >
            <UserPlus size={16} />
            <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
          <span>Already have an account? </span>
          <Link to="/login" style={{ color: 'var(--color-mustard)', fontWeight: '600' }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
