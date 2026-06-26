import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, Calendar, Heart, Award, 
  Settings, Key, Shield, LogOut, Gift, Compass 
} from 'lucide-react';
import { getBookings } from '../services/api';

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // If user is loading or not logged in, mock profile
  const profile = user || {
    name: 'Tourist Explorer',
    email: 'tourist@punjab.tour',
    role: 'Tourist',
    points: 150,
    xp: 350
  };

  const wishlist = [
    { id: 1, name: 'Golden Temple', city: 'Amritsar', image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?q=80&w=300' }
  ];

  const badges = [
    { name: 'Punjab Explorer', desc: 'Visited Amritsar & Chandigarh', icon: Compass, color: 'var(--color-mustard)' },
    { name: 'Foodie Master', desc: 'Unlocked Lassi & Kulcha recipes', icon: Gift, color: 'var(--color-phulkari-pink)' }
  ];

  useEffect(() => {
    const fetchUserBookings = async () => {
      if (token) {
        setLoadingBookings(true);
        const data = await getBookings(token);
        setBookings(data);
        setLoadingBookings(false);
      } else {
        // Fallback mock booking
        setBookings([
          { id: 'BK-9981', hotel_name: 'Taj Swarna', check_in: '2026-07-15', check_out: '2026-07-18', status: 'Confirmed', amount: 28500 }
        ]);
      }
    };
    fetchUserBookings();
  }, [token]);

  return (
    <div className="dashboard-page container section animate-fade-in-up" style={{ marginTop: '72px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 'var(--space-5)' }}>
        
        {/* Sidebar Nav */}
        <div className="glass-panel" style={{ padding: 'var(--space-4)', height: 'fit-content' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-mustard), var(--color-phulkari-pink))', margin: '0 auto var(--space-2) auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '32px', fontWeight: '700' }}>
              {profile.name[0]}
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)' }}>{profile.name}</h3>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{profile.role}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              onClick={() => setActiveTab('profile')} 
              className={`mobile-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              style={{ width: '100%', textCombineUpright: 'none' }}
            >
              <User size={16} />
              <span>My Profile</span>
            </button>
            <button 
              onClick={() => setActiveTab('bookings')} 
              className={`mobile-nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
              style={{ width: '100%' }}
            >
              <Calendar size={16} />
              <span>Stays & Bookings</span>
            </button>
            <button 
              onClick={() => setActiveTab('wishlist')} 
              className={`mobile-nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
              style={{ width: '100%' }}
            >
              <Heart size={16} />
              <span>My Wishlist</span>
            </button>
            <button 
              onClick={() => setActiveTab('badges')} 
              className={`mobile-nav-item ${activeTab === 'badges' ? 'active' : ''}`}
              style={{ width: '100%' }}
            >
              <Award size={16} />
              <span>Achievements</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="glass-panel" style={{ padding: 'var(--space-4)' }}>
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="animate-fade-in-up">
              <h2 style={{ marginBottom: 'var(--space-3)' }}>Personal Profile</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div style={{ padding: 'var(--space-3)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Email Address</span>
                  <p style={{ fontWeight: '600' }}>{profile.email}</p>
                </div>
                <div style={{ padding: 'var(--space-3)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Account Level</span>
                  <p style={{ fontWeight: '600', color: 'var(--color-mustard)' }}>Level 2 Explorer ({profile.xp} XP)</p>
                </div>
              </div>

              {/* Reward Points Box */}
              <div style={{ marginTop: 'var(--space-4)', background: 'linear-gradient(135deg, rgba(255,184,0,0.05), rgba(10,110,63,0.05))', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-green)' }}>
                    <Gift size={20} />
                    <span>Loyalty Points</span>
                  </h3>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Earn more points by planning trips, writing restaurant reviews, and passing Punjabi quizzes!
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Total Balance</span>
                  <p style={{ fontSize: '32px', fontWeight: '800', color: 'var(--color-green)' }}>{profile.points} pts</p>
                </div>
              </div>
            </div>
          )}

          {/* BOOKINGS TAB */}
          {activeTab === 'bookings' && (
            <div className="animate-fade-in-up">
              <h2 style={{ marginBottom: 'var(--space-3)' }}>My Stay Bookings</h2>
              {loadingBookings ? (
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Loading stays...</p>
              ) : bookings.length > 0 ? (
                bookings.map((bk) => (
                  <div key={bk.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3)', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '8px', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: 'var(--text-base)' }}>{bk.hotel_name || bk.hotel}</h4>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Check In: {bk.check_in || bk.checkIn} &bull; Check Out: {bk.check_out || bk.checkOut}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '10px', background: 'var(--bg-primary)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-color)', color: 'var(--color-green)', fontWeight: '600', display: 'inline-block' }}>
                        {bk.status}
                      </span>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: '600', marginTop: '4px' }}>₹{bk.amount}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>No active bookings found.</p>
              )}
            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div className="animate-fade-in-up">
              <h2 style={{ marginBottom: 'var(--space-3)' }}>My Wishlist</h2>
              <div className="grid-cols-3">
                {wishlist.map((item) => (
                  <div key={item.id} className="destination-card" style={{ height: '220px' }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div className="card-gradient-overlay" />
                    <div className="card-content">
                      <span className="card-meta">{item.city}</span>
                      <h4 style={{ color: '#FFFFFF', fontSize: 'var(--text-base)' }}>{item.name}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACHIEVEMENTS TAB */}
          {activeTab === 'badges' && (
            <div className="animate-fade-in-up">
              <h2 style={{ marginBottom: 'var(--space-3)' }}>Achievements & Badges</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                {badges.map((badge, i) => {
                  const Icon = badge.icon;
                  return (
                    <div key={i} style={{ padding: 'var(--space-3)', border: '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>
                      <div className="flex-center" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-primary)', margin: '0 auto 8px auto', color: badge.color }}>
                        <Icon size={24} />
                      </div>
                      <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: '600' }}>{badge.name}</h4>
                      <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{badge.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
