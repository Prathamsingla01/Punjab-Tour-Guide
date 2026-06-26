import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart, Users, TrendingUp, Search, 
  ShieldAlert, Settings, FileText, CheckCircle, Plus, Trash2, Database, Download, Upload 
} from 'lucide-react';
import { 
  getAdminStats, getAdminReviews, 
  approveReview, rejectReview, getAdminLogs,
  getAdminAnalytics, getAdminUsers, updateUserRole,
  createDestination, deleteDestination, createHotel, deleteHotel,
  createRestaurant, deleteRestaurant, getAdminBookings, updateBookingStatus,
  downloadBackup, restoreBackup
} from '../services/api';

const AdminDashboard = () => {
  const { token, user } = useAuth();
  const [activeSub, setActiveSub] = useState('analytics');
  
  // States
  const [stats, setStats] = useState({ totalUsers: 0, totalBookings: 0, totalRevenue: 0, trendingSearch: '...' });
  const [analytics, setAnalytics] = useState({ registrations: [], revenueTrend: [], topDestinations: [], rolesDistribution: [] });
  const [usersList, setUsersList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [sysLogs, setSysLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  // Content Creation Forms States
  const [newDest, setNewDest] = useState({ name: '', tagline: '', description: '', history: '', best_time: 'October to March', crowd_level: 'Medium', avg_time: '2 Days' });
  const [newHotel, setNewHotel] = useState({ destination_id: 1, name: '', price_per_night: 5000, amenities: 'WiFi,Parking', image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=300' });
  const [newRest, setNewRest] = useState({ destination_id: 1, name: '', specialty: '', rating: 4.5, spicy_level: 2, is_veg: 1, image_url: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=300' });
  
  // Backup/Restore State
  const [restoreJson, setRestoreJson] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    setMsg('');
    setErr('');
    try {
      const statsData = await getAdminStats(token);
      setStats(statsData);

      const analyticsData = await getAdminAnalytics(token);
      setAnalytics(analyticsData);

      const uList = await getAdminUsers(token);
      setUsersList(uList);

      const bList = await getAdminBookings(token);
      setBookingsList(bList);

      const rList = await getAdminReviews(token);
      setPendingReviews(rList);

      const lList = await getAdminLogs(token);
      setSysLogs(lList);
    } catch (error) {
      console.error('Failed to retrieve control panel specs:', error);
      setErr('Administrative database synchronization failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token]);

  // Actions
  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(token, userId, newRole);
      setMsg('User privileges updated successfully.');
      fetchAdminData();
    } catch (e) {
      setErr('Role modification failed.');
    }
  };

  const handleCreateDest = async (e) => {
    e.preventDefault();
    try {
      await createDestination(token, newDest);
      setMsg('New destination entry cataloged.');
      setNewDest({ name: '', tagline: '', description: '', history: '', best_time: 'October to March', crowd_level: 'Medium', avg_time: '2 Days' });
      fetchAdminData();
    } catch (e) {
      setErr('Destination insertion failed.');
    }
  };

  const handleCreateHotel = async (e) => {
    e.preventDefault();
    try {
      await createHotel(token, newHotel);
      setMsg('New hotel stay logged.');
      setNewHotel({ destination_id: 1, name: '', price_per_night: 5000, amenities: 'WiFi,Parking', image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=300' });
      fetchAdminData();
    } catch (e) {
      setErr('Hotel lodging creation failed.');
    }
  };

  const handleCreateRest = async (e) => {
    e.preventDefault();
    try {
      await createRestaurant(token, newRest);
      setMsg('New dining eatery added.');
      setNewRest({ destination_id: 1, name: '', specialty: '', rating: 4.5, spicy_level: 2, is_veg: 1, image_url: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=300' });
      fetchAdminData();
    } catch (e) {
      setErr('Restaurant creation failed.');
    }
  };

  const handleBookingMod = async (id, status) => {
    try {
      await updateBookingStatus(token, id, status);
      setMsg(`Booking reservation status changed to ${status}.`);
      fetchAdminData();
    } catch (e) {
      setErr('Booking modification failed.');
    }
  };

  const handleApproveReview = async (id) => {
    try {
      await approveReview(token, id);
      setMsg('Tourist review approved and published.');
      fetchAdminData();
    } catch (e) {
      setErr('Review approval failed.');
    }
  };

  const handleRejectReview = async (id) => {
    try {
      await rejectReview(token, id);
      setMsg('Review deleted/rejected.');
      fetchAdminData();
    } catch (e) {
      setErr('Review deletion failed.');
    }
  };

  const handleDownloadBackup = async () => {
    try {
      const data = await downloadBackup(token);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Punjab_Tour_Backup_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setMsg('Backup file generated and downloaded.');
    } catch (e) {
      setErr('Backup download failed.');
    }
  };

  const handleRestoreBackup = async (e) => {
    e.preventDefault();
    if (!restoreJson.trim()) return;
    try {
      const parsed = JSON.parse(restoreJson);
      await restoreBackup(token, parsed);
      setMsg('Database restored successfully from local JSON.');
      setRestoreJson('');
      fetchAdminData();
    } catch (e) {
      setErr('Failed to restore. Please verify that the JSON syntax matches.');
    }
  };

  if (user && user.role !== 'Super Admin' && user.role !== 'Admin') {
    return (
      <div className="container section text-center animate-fade-in-up" style={{ marginTop: '120px', maxWidth: '500px' }}>
        <ShieldAlert size={48} style={{ color: 'var(--color-phulkari-pink)', margin: '0 auto 12px auto' }} />
        <h2>Access Restricted</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          Administrative credentials are required to view the management console.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-page container section animate-fade-in-up" style={{ marginTop: '72px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 'var(--space-5)' }}>
        
        {/* Navigation Sidebar */}
        <div className="glass-panel" style={{ padding: 'var(--space-4)', height: 'fit-content' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--color-phulkari-pink)', margin: '0 auto var(--space-2) auto', display: 'flex', alignItems: 'center', color: '#FFFFFF', fontSize: '24px', fontWeight: '700', justifyContent: 'center' }}>
              {user ? user.name[0] : 'A'}
            </div>
            <h3 style={{ fontSize: 'var(--text-base)' }}>{user ? user.name : 'Administrator'}</h3>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{user ? user.role : 'System Admin'}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button onClick={() => setActiveSub('analytics')} className={`mobile-nav-item ${activeSub === 'analytics' ? 'active' : ''}`} style={{ width: '100%' }}>
              <BarChart size={16} /> <span>Analytics Charts</span>
            </button>
            <button onClick={() => setActiveSub('users')} className={`mobile-nav-item ${activeSub === 'users' ? 'active' : ''}`} style={{ width: '100%' }}>
              <Users size={16} /> <span>Users & Roles</span>
            </button>
            <button onClick={() => setActiveSub('content')} className={`mobile-nav-item ${activeSub === 'content' ? 'active' : ''}`} style={{ width: '100%' }}>
              <Plus size={16} /> <span>Content CRUD</span>
            </button>
            <button onClick={() => setActiveSub('bookings')} className={`mobile-nav-item ${activeSub === 'bookings' ? 'active' : ''}`} style={{ width: '100%' }}>
              <CheckCircle size={16} /> <span>Bookings Operations</span>
            </button>
            <button onClick={() => setActiveSub('reviews')} className={`mobile-nav-item ${activeSub === 'reviews' ? 'active' : ''}`} style={{ width: '100%' }}>
              <CheckCircle size={16} /> <span>Pending Reviews ({pendingReviews.length})</span>
            </button>
            <button onClick={() => setActiveSub('settings')} className={`mobile-nav-item ${activeSub === 'settings' ? 'active' : ''}`} style={{ width: '100%' }}>
              <Database size={16} /> <span>Settings & Backups</span>
            </button>
            <button onClick={() => setActiveSub('logs')} className={`mobile-nav-item ${activeSub === 'logs' ? 'active' : ''}`} style={{ width: '100%' }}>
              <FileText size={16} /> <span>Audit logs ({sysLogs.length})</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="glass-panel" style={{ padding: 'var(--space-4)' }}>
          {msg && <div style={{ background: 'rgba(10,110,63,0.1)', color: 'var(--color-green)', padding: '10px', borderRadius: '8px', fontSize: 'var(--text-xs)', marginBottom: '12px' }}>{msg}</div>}
          {err && <div style={{ background: 'rgba(194,24,91,0.1)', color: 'var(--color-phulkari-pink)', padding: '10px', borderRadius: '8px', fontSize: 'var(--text-xs)', marginBottom: '12px' }}>{err}</div>}

          {/* SUB-TAB 1: ANALYTICS CHARTS */}
          {activeSub === 'analytics' && (
            <div className="animate-fade-in-up">
              <h2 style={{ marginBottom: 'var(--space-3)' }}>Interactive System Charts</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                <div style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>TOTAL REVENUE</span>
                  <h3 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-green)', marginTop: '4px' }}>₹{stats.totalRevenue.toLocaleString()}</h3>
                </div>
                <div style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>REGISTERED USERS</span>
                  <h3 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-mustard)', marginTop: '4px' }}>{stats.totalUsers}</h3>
                </div>
                <div style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>RESERVATIONS MADE</span>
                  <h3 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-phulkari-pink)', marginTop: '4px' }}>{stats.totalBookings}</h3>
                </div>
              </div>

              {/* Render custom SVG charts */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                
                {/* SVG Revenue Line Graph */}
                <div style={{ border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px', background: 'var(--bg-secondary)' }}>
                  <h4 style={{ marginBottom: '16px', fontSize: 'var(--text-sm)' }}>Weekly Revenue Trend</h4>
                  <svg viewBox="0 0 300 150" width="100%" height="150" style={{ overflow: 'visible' }}>
                    {/* Grid lines */}
                    <line x1="0" y1="120" x2="300" y2="120" stroke="var(--border-color)" strokeWidth="1" />
                    <line x1="0" y1="80" x2="300" y2="80" stroke="var(--border-color)" strokeWidth="1" />
                    <line x1="0" y1="40" x2="300" y2="40" stroke="var(--border-color)" strokeWidth="1" />
                    
                    {/* Area path */}
                    <path 
                      d="M 10 120 L 80 90 L 160 60 L 280 30 L 280 120 Z" 
                      fill="rgba(10,110,63,0.15)"
                    />
                    {/* Area line */}
                    <path 
                      d="M 10 120 L 80 90 L 160 60 L 280 30" 
                      fill="none" 
                      stroke="var(--color-green)" 
                      strokeWidth="3"
                    />

                    {/* Nodes circles */}
                    <circle cx="10" cy="120" r="4" fill="var(--color-green)" />
                    <circle cx="80" cy="90" r="4" fill="var(--color-green)" />
                    <circle cx="160" cy="60" r="4" fill="var(--color-green)" />
                    <circle cx="280" cy="30" r="4" fill="var(--color-green)" />

                    {/* Labels */}
                    <text x="10" y="140" fill="var(--text-secondary)" fontSize="8">W1</text>
                    <text x="80" y="140" fill="var(--text-secondary)" fontSize="8">W2</text>
                    <text x="160" y="140" fill="var(--text-secondary)" fontSize="8">W3</text>
                    <text x="280" y="140" fill="var(--text-secondary)" fontSize="8">W4</text>
                  </svg>
                </div>

                {/* SVG Popular Destinations Bar Chart */}
                <div style={{ border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px', background: 'var(--bg-secondary)' }}>
                  <h4 style={{ marginBottom: '16px', fontSize: 'var(--text-sm)' }}>Top Destinations Popularity</h4>
                  <svg viewBox="0 0 300 150" width="100%" height="150" style={{ overflow: 'visible' }}>
                    {/* Bar 1 (Amritsar) */}
                    <rect x="20" y="30" width="30" height="90" rx="4" fill="var(--color-mustard)" />
                    <text x="22" y="140" fill="var(--text-secondary)" fontSize="8">Amritsar</text>
                    
                    {/* Bar 2 (Chandigarh) */}
                    <rect x="90" y="60" width="30" height="60" rx="4" fill="var(--color-mustard)" />
                    <text x="90" y="140" fill="var(--text-secondary)" fontSize="8">Chd</text>

                    {/* Bar 3 (Patiala) */}
                    <rect x="160" y="80" width="30" height="40" rx="4" fill="var(--color-mustard)" />
                    <text x="160" y="140" fill="var(--text-secondary)" fontSize="8">Patiala</text>

                    {/* Bar 4 (Ludhiana) */}
                    <rect x="230" y="100" width="30" height="20" rx="4" fill="var(--color-mustard)" />
                    <text x="230" y="140" fill="var(--text-secondary)" fontSize="8">Others</text>
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB 2: USERS & ROLES */}
          {activeSub === 'users' && (
            <div className="animate-fade-in-up">
              <h2 style={{ marginBottom: 'var(--space-3)' }}>User Accounts Management</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-xs)' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '8px' }}>Name</th>
                    <th style={{ padding: '8px' }}>Email</th>
                    <th style={{ padding: '8px' }}>Role</th>
                    <th style={{ padding: '8px' }}>Reward Points</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '8px' }}>{u.name}</td>
                      <td style={{ padding: '8px' }}>{u.email}</td>
                      <td style={{ padding: '8px' }}>
                        <select 
                          value={u.role} 
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          style={{ padding: '4px', borderRadius: '4px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                        >
                          <option value="Super Admin">Super Admin</option>
                          <option value="Admin">Admin</option>
                          <option value="Moderator">Moderator</option>
                          <option value="Tourist">Tourist</option>
                          <option value="Guest">Guest</option>
                        </select>
                      </td>
                      <td style={{ padding: '8px' }}>{u.points} pts ({u.xp} XP)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* SUB-TAB 3: CONTENT CRUD */}
          {activeSub === 'content' && (
            <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Add Destination */}
              <form onSubmit={handleCreateDest} className="glass-panel" style={{ padding: '16px', background: 'var(--bg-secondary)' }}>
                <h3 style={{ marginBottom: '12px', fontSize: 'var(--text-sm)' }}>Add New Destination Hub</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input type="text" placeholder="Destination Name (e.g. Ludhiana)" value={newDest.name} onChange={e => setNewDest({...newDest, name: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} required />
                  <input type="text" placeholder="Tagline (e.g. Manchester of India)" value={newDest.tagline} onChange={e => setNewDest({...newDest, tagline: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
                </div>
                <textarea placeholder="Full Description..." value={newDest.description} onChange={e => setNewDest({...newDest, description: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', margin: '10px 0', minHeight: '60px' }} required />
                <button type="submit" className="login-nav-btn" style={{ padding: '8px 16px', fontSize: 'var(--text-xs)' }}>Submit Destination</button>
              </form>

              {/* Add Hotel Stays */}
              <form onSubmit={handleCreateHotel} className="glass-panel" style={{ padding: '16px', background: 'var(--bg-secondary)' }}>
                <h3 style={{ marginBottom: '12px', fontSize: 'var(--text-sm)' }}>Register Stays Lodging</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <input type="text" placeholder="Hotel Name" value={newHotel.name} onChange={e => setNewHotel({...newHotel, name: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} required />
                  <input type="number" placeholder="Price/Night (₹)" value={newHotel.price_per_night} onChange={e => setNewHotel({...newHotel, price_per_night: parseFloat(e.target.value)})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} required />
                  <input type="text" placeholder="Amenities (WiFi,Pool)" value={newHotel.amenities} onChange={e => setNewHotel({...newHotel, amenities: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
                </div>
                <button type="submit" className="login-nav-btn" style={{ padding: '8px 16px', fontSize: 'var(--text-xs)' }}>Submit Hotel</button>
              </form>
            </div>
          )}

          {/* SUB-TAB 4: BOOKINGS OPERATIONS */}
          {activeSub === 'bookings' && (
            <div className="animate-fade-in-up">
              <h2 style={{ marginBottom: 'var(--space-3)' }}>Stay Reservations Operations</h2>
              {bookingsList.length > 0 ? (
                bookingsList.map(bk => (
                  <div key={bk.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-secondary)', marginBottom: '8px', alignItems: 'center' }}>
                    <div>
                      <strong>BK-{bk.id} &bull; {bk.user_name}</strong>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Hotel: {bk.hotel_name} &bull; Amount: ₹{bk.amount}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => handleBookingMod(bk.id, 'Confirmed')} className="login-nav-btn" style={{ padding: '4px 8px', fontSize: '9px', background: 'var(--color-green)' }}>Confirm</button>
                      <button onClick={() => handleBookingMod(bk.id, 'Cancelled')} className="login-nav-btn" style={{ padding: '4px 8px', fontSize: '9px', background: 'var(--color-phulkari-pink)' }}>Cancel</button>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: 'var(--text-xs)' }}>No bookings currently in reservations ledger.</p>
              )}
            </div>
          )}

          {/* SUB-TAB 5: REVIEWS APPROVAL */}
          {activeSub === 'reviews' && (
            <div className="animate-fade-in-up">
              <h2 style={{ marginBottom: 'var(--space-3)' }}>Pending Review Approval Queue</h2>
              {pendingReviews.length > 0 ? (
                pendingReviews.map((rev) => (
                  <div key={rev.id} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: 'var(--space-3)', marginBottom: '12px', background: 'var(--bg-secondary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <strong>@{rev.user}</strong>
                      <span style={{ color: 'var(--color-mustard)' }}>Rating: {rev.rating} ★</span>
                    </div>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      Reviewed <strong>{rev.target}</strong>: "{rev.comment}"
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleApproveReview(rev.id)} className="login-nav-btn" style={{ padding: '6px 12px', fontSize: '10px', background: 'var(--color-green)' }}>Approve</button>
                      <button onClick={() => handleRejectReview(rev.id)} className="login-nav-btn" style={{ padding: '6px 12px', fontSize: '10px', background: 'var(--color-phulkari-pink)' }}>Reject</button>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>No reviews currently pending administrative moderation.</p>
              )}
            </div>
          )}

          {/* SUB-TAB 6: SETTINGS & BACKUPS */}
          {activeSub === 'settings' && (
            <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="glass-panel" style={{ padding: '16px', background: 'var(--bg-secondary)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <Download size={18} />
                  <span>Download System Backups</span>
                </h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Click below to serialize and download user profiles, destinations mapping, reviews, and bookings into a portably JSON data backup.
                </p>
                <button onClick={handleDownloadBackup} className="login-nav-btn" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Generate JSON Backup</span>
                </button>
              </div>

              <div className="glass-panel" style={{ padding: '16px', background: 'var(--bg-secondary)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <Upload size={18} />
                  <span>Restore Database Backup</span>
                </h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Paste a JSON backup payload to overwrite existing table records. Note: This will delete existing rows prior to insertion.
                </p>
                <form onSubmit={handleRestoreBackup}>
                  <textarea 
                    placeholder='{"users": [...], "destinations": [...]}' 
                    value={restoreJson} 
                    onChange={e => setRestoreJson(e.target.value)} 
                    style={{ width: '100%', minHeight: '100px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '10px', marginBottom: '10px' }} 
                    required 
                  />
                  <button type="submit" className="login-nav-btn" style={{ padding: '8px 16px' }}>
                    Restore Database
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* SUB-TAB 7: AUDIT LOGS */}
          {activeSub === 'logs' && (
            <div className="animate-fade-in-up">
              <h2 style={{ marginBottom: 'var(--space-3)' }}>System Audit Logs</h2>
              {sysLogs.length > 0 ? (
                <div style={{ background: '#12161A', padding: 'var(--space-3)', borderRadius: '8px', fontFamily: 'monospace', color: '#00FF66', fontSize: 'var(--text-xs)', maxHeight: '350px', overflowY: 'auto' }}>
                  {sysLogs.map((log) => (
                    <p key={log.id} style={{ marginBottom: '4px', wordBreak: 'break-all' }}>
                      [{new Date(log.timestamp).toLocaleTimeString()}] <span style={{ color: log.log_level === 'WARN' ? '#FFB800' : '#00FF66' }}>{log.log_level}</span>: {log.message}
                    </p>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>No logs loaded.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
