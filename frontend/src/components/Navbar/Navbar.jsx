import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Sun, Moon, Compass, Calendar, MapPin, Globe,
  User, LogOut, Menu, X, Landmark, Coffee, 
  Volume2
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage, t } = useLanguage();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Scroll listener for shrinking header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { path: '/', label: t('home'), icon: Compass },
    { path: '/destinations', label: t('explore'), icon: MapPin },
    { path: '/planner', label: t('planner'), icon: Calendar },
    { path: '/hotels', label: t('hotels'), icon: Landmark },
    { path: '/food', label: t('food'), icon: Coffee },
    { path: '/utilities', label: t('utilities'), icon: Volume2 }
  ];

  const themeOptions = [
    { key: 'light', label: 'Light Theme', color: '#FAFAFB' },
    { key: 'dark', label: 'Dark Theme', color: '#12161A' },
    { key: 'heritage', label: 'Punjab Heritage', color: '#FFF8E7' },
    { key: 'baisakhi', label: 'Baisakhi Festival', color: '#F0F7FF' }
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setIsMobileMenuOpen(false)}>
          <span className="logo-dome">ੴ</span>
          <div className="logo-text">
            <span className="logo-title">Punjab</span>
            <span className="logo-subtitle">Tour Guide</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="navbar-links">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink 
                key={link.path} 
                to={link.path} 
                className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Actions (Themes, Auth, Languages) */}
        <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          
          {/* Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.06)', padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <Globe size={14} style={{ color: 'var(--text-secondary)' }} />
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer',
                outline: 'none'
              }}
              title="Select Language"
              aria-label="Change Language"
            >
              <option value="en" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>EN</option>
              <option value="hi" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>HI</option>
              <option value="pb" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>PB</option>
            </select>
          </div>

          {/* Theme Selector */}
          <div className="theme-selector-container">
            <button 
              className="action-btn theme-btn"
              onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
              title="Select Theme"
              aria-label="Change Color Theme"
            >
              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            {isThemeDropdownOpen && (
              <div className="theme-dropdown glass-panel">
                {themeOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => {
                      toggleTheme(opt.key);
                      setIsThemeDropdownOpen(false);
                    }}
                    className={`theme-dropdown-item ${theme === opt.key ? 'active' : ''}`}
                  >
                    <span className="theme-dot" style={{ backgroundColor: opt.color }} />
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Section */}
          {user ? (
            <div className="user-action-group">
              <Link 
                to={user.role === 'Super Admin' || user.role === 'Admin' ? '/admin' : '/dashboard'} 
                className="action-btn profile-btn"
              >
                <User size={18} />
                <span className="nav-username">{user.name.split(' ')[0]}</span>
              </Link>
              <button onClick={handleLogout} className="action-btn logout-btn" title={t('logout')}>
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-nav-btn">
              {t('login')}
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer glass-panel animate-fade-in-up">
          <div className="mobile-drawer-links">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink 
                  key={link.path} 
                  to={link.path} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon size={20} />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
            
            {/* Mobile Themes */}
            <div className="mobile-theme-section">
              <span className="mobile-section-title">Themes</span>
              <div className="mobile-theme-grid">
                {themeOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => {
                      toggleTheme(opt.key);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`mobile-theme-btn ${theme === opt.key ? 'active' : ''}`}
                  >
                    {opt.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Auth */}
            {user ? (
              <div className="mobile-auth-section">
                <Link 
                  to={user.role === 'Super Admin' || user.role === 'Admin' ? '/admin' : '/dashboard'} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mobile-nav-item"
                >
                  <User size={20} />
                  <span>{t('dashboard')} ({user.role})</span>
                </Link>
                <button onClick={handleLogout} className="mobile-logout-btn">
                  <LogOut size={20} />
                  <span>{t('logout')}</span>
                </button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="mobile-signin-btn">
                {t('login')} / {t('register')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
