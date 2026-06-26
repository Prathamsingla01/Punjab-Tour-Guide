import express from 'express';
import db from '../config/database.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Helper middleware to check for Admin status
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'Super Admin' && req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Access Denied: Administrative access required.' });
  }
  next();
};

// ==========================================
// 1. ANALYTICS & MONITORING
// ==========================================

// GET /api/admin/stats - returns simple statistics
router.get('/stats', verifyToken, verifyAdmin, (req, res) => {
  const stats = {
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    trendingSearch: 'Golden Temple'
  };

  db.get('SELECT COUNT(*) as count FROM users', [], (err, uRow) => {
    if (err) return res.status(500).json({ message: 'DB Error fetching users count', error: err.message });
    stats.totalUsers = uRow?.count || 0;

    db.get('SELECT COUNT(*) as count, SUM(amount) as revenue FROM bookings', [], (err, bRow) => {
      if (err) return res.status(500).json({ message: 'DB Error fetching bookings stats', error: err.message });
      stats.totalBookings = bRow?.count || 0;
      stats.totalRevenue = bRow?.revenue || 0;

      db.get(`
        SELECT d.name, COUNT(r.id) as count 
        FROM destinations d 
        LEFT JOIN reviews r ON d.id = r.destination_id 
        GROUP BY d.id 
        ORDER BY count DESC 
        LIMIT 1
      `, [], (err, trendRow) => {
        if (!err && trendRow && trendRow.name) {
          stats.trendingSearch = trendRow.name;
        }
        res.status(200).json(stats);
      });
    });
  });
});

// GET /api/admin/analytics - returns full charts statistics arrays
router.get('/analytics', verifyToken, verifyAdmin, (req, res) => {
  const data = {
    registrations: [
      { label: 'Mar', value: 12 },
      { label: 'Apr', value: 24 },
      { label: 'May', value: 18 },
      { label: 'Jun', value: 35 }
    ],
    revenueTrend: [
      { label: 'Week 1', value: 12000 },
      { label: 'Week 2', value: 34000 },
      { label: 'Week 3', value: 45000 },
      { label: 'Week 4', value: 64200 }
    ],
    topDestinations: [],
    rolesDistribution: []
  };

  // Fetch actual user roles count
  db.all('SELECT role as label, COUNT(*) as value FROM users GROUP BY role', [], (err, rolesRows) => {
    if (!err && rolesRows) {
      data.rolesDistribution = rolesRows;
    }

    // Fetch destination popularity count
    db.all(`
      SELECT d.name as label, COUNT(b.id) as value 
      FROM destinations d 
      LEFT JOIN hotels h ON d.id = h.destination_id
      LEFT JOIN bookings b ON h.id = b.hotel_id
      GROUP BY d.id 
      ORDER BY value DESC 
      LIMIT 4
    `, [], (err, destRows) => {
      if (!err && destRows) {
        data.topDestinations = destRows.map(r => ({ label: r.label, value: r.value || 1 }));
      }
      res.status(200).json(data);
    });
  });
});

// ==========================================
// 2. USER & ROLE MANAGEMENT
// ==========================================

// GET /api/admin/users - list all users
router.get('/users', verifyToken, verifyAdmin, (req, res) => {
  db.all('SELECT id, name, email, role, points, xp, created_at FROM users ORDER BY name ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB Error loading users list', error: err.message });
    res.status(200).json(rows || []);
  });
});

// PUT /api/admin/users/:id/role - update user roles
router.put('/users/:id/role', verifyToken, verifyAdmin, (req, res) => {
  const targetId = parseInt(req.params.id);
  const { role } = req.body;

  if (!['Super Admin', 'Admin', 'Moderator', 'Tourist', 'Guest'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role assignment requested.' });
  }

  db.run('UPDATE users SET role = ? WHERE id = ?', [role, targetId], function(err) {
    if (err) return res.status(500).json({ message: 'DB Error updating user role', error: err.message });

    db.run('INSERT INTO system_logs (log_level, message) VALUES (?, ?)', [
      'INFO',
      `Super Admin changed role of User ID ${targetId} to '${role}'.`
    ]);

    res.status(200).json({ message: 'User role updated successfully.' });
  });
});

// ==========================================
// 3. DESTINATIONS MANAGEMENT
// ==========================================
router.post('/destinations', verifyToken, verifyAdmin, (req, res) => {
  const { name, tagline, description, history, best_time, crowd_level, avg_time, coordinates_lat, coordinates_lng } = req.body;

  if (!name || !description) return res.status(400).json({ message: 'Name and description are required.' });

  db.run(`
    INSERT INTO destinations (name, tagline, description, history, best_time, crowd_level, avg_time, coordinates_lat, coordinates_lng) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [name, tagline, description, history, best_time, crowd_level, avg_time, coordinates_lat || 31.62, coordinates_lng || 74.87], function(err) {
    if (err) return res.status(500).json({ message: 'Failed to create destination', error: err.message });
    res.status(201).json({ message: 'Destination created.', id: this.lastID });
  });
});

router.put('/destinations/:id', verifyToken, verifyAdmin, (req, res) => {
  const destId = parseInt(req.params.id);
  const { name, tagline, description, history, best_time, crowd_level, avg_time } = req.body;

  db.run(`
    UPDATE destinations 
    SET name = ?, tagline = ?, description = ?, history = ?, best_time = ?, crowd_level = ?, avg_time = ?
    WHERE id = ?
  `, [name, tagline, description, history, best_time, crowd_level, avg_time, destId], function(err) {
    if (err) return res.status(500).json({ message: 'Failed to update destination', error: err.message });
    res.status(200).json({ message: 'Destination updated successfully.' });
  });
});

router.delete('/destinations/:id', verifyToken, verifyAdmin, (req, res) => {
  const destId = parseInt(req.params.id);

  db.run('DELETE FROM destinations WHERE id = ?', [destId], function(err) {
    if (err) return res.status(500).json({ message: 'Failed to delete destination', error: err.message });
    res.status(200).json({ message: 'Destination deleted successfully.' });
  });
});

// ==========================================
// 4. HOTELS & RESTAURANTS CRUD
// ==========================================
router.post('/hotels', verifyToken, verifyAdmin, (req, res) => {
  const { destination_id, name, price_per_night, rating, amenities, image_url } = req.body;

  db.run(`
    INSERT INTO hotels (destination_id, name, price_per_night, rating, amenities, image_url) 
    VALUES (?, ?, ?, ?, ?, ?)
  `, [destination_id || 1, name, price_per_night, rating || 4.5, amenities, image_url], function(err) {
    if (err) return res.status(500).json({ message: 'Failed to create hotel', error: err.message });
    res.status(201).json({ message: 'Hotel stay added successfully.', id: this.lastID });
  });
});

router.delete('/hotels/:id', verifyToken, verifyAdmin, (req, res) => {
  const hotelId = parseInt(req.params.id);
  db.run('DELETE FROM hotels WHERE id = ?', [hotelId], function(err) {
    if (err) return res.status(500).json({ message: 'Failed to delete hotel stay', error: err.message });
    res.status(200).json({ message: 'Hotel stay deleted.' });
  });
});

router.post('/restaurants', verifyToken, verifyAdmin, (req, res) => {
  const { destination_id, name, specialty, rating, spicy_level, is_veg, image_url } = req.body;

  db.run(`
    INSERT INTO restaurants (destination_id, name, specialty, rating, spicy_level, is_veg, image_url) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [destination_id || 1, name, specialty, rating || 4.5, spicy_level, is_veg, image_url], function(err) {
    if (err) return res.status(500).json({ message: 'Failed to create restaurant entry', error: err.message });
    res.status(201).json({ message: 'Restaurant added successfully.', id: this.lastID });
  });
});

router.delete('/restaurants/:id', verifyToken, verifyAdmin, (req, res) => {
  const restId = parseInt(req.params.id);
  db.run('DELETE FROM restaurants WHERE id = ?', [restId], function(err) {
    if (err) return res.status(500).json({ message: 'Failed to delete restaurant', error: err.message });
    res.status(200).json({ message: 'Restaurant deleted.' });
  });
});

// ==========================================
// 5. BOOKINGS ADMINISTRATION
// ==========================================
router.get('/bookings', verifyToken, verifyAdmin, (req, res) => {
  db.all(`
    SELECT b.id, b.check_in, b.check_out, b.amount, b.status, u.name as user_name, h.name as hotel_name 
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN hotels h ON b.hotel_id = h.id
    ORDER BY b.id DESC
  `, [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB Error loading bookings', error: err.message });
    res.status(200).json(rows || []);
  });
});

router.put('/bookings/:id/status', verifyToken, verifyAdmin, (req, res) => {
  const bookingId = parseInt(req.params.id);
  const { status } = req.body; // 'Confirmed' or 'Cancelled'

  db.run('UPDATE bookings SET status = ? WHERE id = ?', [status, bookingId], function(err) {
    if (err) return res.status(500).json({ message: 'DB Error updating status', error: err.message });
    res.status(200).json({ message: 'Booking status updated successfully.' });
  });
});

// ==========================================
// 6. BACKUP & RESTORE UTILITIES
// ==========================================
router.get('/backup', verifyToken, verifyAdmin, (req, res) => {
  db.exportBackup((err, backup) => {
    if (err) return res.status(500).json({ message: 'Backup execution failed', error: err.message });
    res.status(200).json(backup);
  });
});

router.post('/restore', verifyToken, verifyAdmin, (req, res) => {
  const backupData = req.body;
  if (!backupData || typeof backupData !== 'object') {
    return res.status(400).json({ message: 'Invalid backup structure supplied.' });
  }

  db.importRestore(backupData, (err) => {
    if (err) return res.status(500).json({ message: 'Restore process failed', error: err.message });
    res.status(200).json({ message: 'Database restored successfully.' });
  });
});

// ==========================================
// 7. REVIEWS & AUDIT LOGS MODERATION
// ==========================================
router.get('/reviews', verifyToken, verifyAdmin, (req, res) => {
  db.all(`
    SELECT r.id, r.comment, r.rating, r.status, u.name as user, d.name as target 
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    JOIN destinations d ON r.destination_id = d.id
    WHERE r.status = 'Pending'
    ORDER BY r.created_at DESC
  `, [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB Error fetching pending reviews', error: err.message });
    res.status(200).json(rows || []);
  });
});

router.post('/reviews/:id/approve', verifyToken, verifyAdmin, (req, res) => {
  const reviewId = parseInt(req.params.id);

  db.get('SELECT user_id FROM reviews WHERE id = ?', [reviewId], (err, review) => {
    if (err) return res.status(500).json({ message: 'DB Error locating review', error: err.message });
    if (!review) return res.status(404).json({ message: 'Review not found.' });

    db.run("UPDATE reviews SET status = 'Approved' WHERE id = ?", [reviewId], function(err) {
      if (err) return res.status(500).json({ message: 'Failed to approve review', error: err.message });

      db.run('UPDATE users SET points = points + 10, xp = xp + 20 WHERE id = ?', [review.user_id], (err) => {
        if (err) console.error('Failed to reward reviewer points:', err.message);
        
        db.run('INSERT INTO system_logs (log_level, message) VALUES (?, ?)', [
          'INFO', 
          `Approved review ID ${reviewId} and rewarded +10 points to User ID ${review.user_id}.`
        ]);

        res.status(200).json({ message: 'Review approved successfully, points rewarded.' });
      });
    });
  });
});

router.post('/reviews/:id/reject', verifyToken, verifyAdmin, (req, res) => {
  const reviewId = parseInt(req.params.id);

  db.run('DELETE FROM reviews WHERE id = ?', [reviewId], function(err) {
    if (err) return res.status(500).json({ message: 'Failed to delete review', error: err.message });
    
    db.run('INSERT INTO system_logs (log_level, message) VALUES (?, ?)', [
      'WARN', 
      `Rejected and deleted review ID ${reviewId}.`
    ]);

    res.status(200).json({ message: 'Review rejected and deleted successfully.' });
  });
});

router.get('/logs', verifyToken, verifyAdmin, (req, res) => {
  db.all('SELECT * FROM system_logs ORDER BY timestamp DESC LIMIT 50', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB Error fetching system logs', error: err.message });
    res.status(200).json(rows || []);
  });
});

export default router;
