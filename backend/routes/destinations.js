import express from 'express';
import db from '../config/database.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get all destinations (with search & filters)
router.get('/', (req, res) => {
  const { search, accessibility, crowd } = req.query;

  let query = 'SELECT * FROM destinations WHERE 1=1';
  const params = [];

  if (search) {
    query += ' AND (name LIKE ? OR tagline LIKE ? OR description LIKE ?)';
    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam, searchParam);
  }

  if (accessibility && accessibility !== 'All') {
    query += ' AND accessibility = ?';
    params.push(accessibility);
  }

  if (crowd && crowd !== 'All') {
    query += ' AND crowd_level = ?';
    params.push(crowd);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    res.status(200).json(rows);
  });
});

// Get a single destination details
router.get('/:id', (req, res) => {
  const destId = parseInt(req.params.id);

  db.get('SELECT * FROM destinations WHERE id = ?', [destId], (err, dest) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err.message });
    if (!dest) return res.status(404).json({ message: 'Destination not found' });

    // Fetch hotels for this destination
    db.all('SELECT * FROM hotels WHERE destination_id = ?', [destId], (err, hotels) => {
      if (err) return res.status(500).json({ message: 'Error retrieving hotels', error: err.message });

      // Fetch restaurants for this destination
      db.all('SELECT * FROM restaurants WHERE destination_id = ?', [destId], (err, restaurants) => {
        if (err) return res.status(500).json({ message: 'Error retrieving restaurants', error: err.message });

        res.status(200).json({
          ...dest,
          hotels: hotels || [],
          restaurants: restaurants || []
        });
      });
    });
  });
});

// GET /api/destinations/:id/reviews - retrieve all approved reviews for a destination
router.get('/:id/reviews', (req, res) => {
  const destId = parseInt(req.params.id);

  db.all(`
    SELECT r.id, r.comment, r.rating, r.created_at, u.name as user_name 
    FROM reviews r 
    JOIN users u ON r.user_id = u.id 
    WHERE r.destination_id = ? AND r.status = 'Approved'
    ORDER BY r.created_at DESC
  `, [destId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error fetching reviews', error: err.message });
    res.status(200).json(rows || []);
  });
});

// POST /api/destinations/:id/reviews - submit a new review (Pending status)
router.post('/:id/reviews', verifyToken, (req, res) => {
  const destId = parseInt(req.params.id);
  const userId = req.user.id;
  const { comment, rating } = req.body;

  if (!comment || !rating) {
    return res.status(400).json({ message: 'Comment and rating are required.' });
  }

  db.run(
    'INSERT INTO reviews (user_id, destination_id, comment, rating, status) VALUES (?, ?, ?, ?, ?)',
    [userId, destId, comment, rating, 'Pending'],
    function (err) {
      if (err) return res.status(500).json({ message: 'Failed to submit review', error: err.message });

      // Audit Log
      db.run('INSERT INTO system_logs (log_level, message) VALUES (?, ?)', [
        'INFO',
        `User ID ${userId} submitted a review for Destination ID ${destId} (Review ID ${this.lastID}).`
      ]);

      res.status(201).json({ 
        message: 'Review submitted successfully and is pending admin approval.',
        reviewId: this.lastID 
      });
    }
  );
});

export default router;
