import express from 'express';
import db from '../config/database.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Create new stay booking (Protected)
router.post('/', verifyToken, (req, res) => {
  const { hotelId, checkIn, checkOut, amount } = req.body;
  const userId = req.user.id;

  if (!hotelId || !checkIn || !checkOut || !amount) {
    return res.status(400).json({ message: 'All booking fields are required.' });
  }

  // Insert Booking record
  db.run(
    'INSERT INTO bookings (user_id, hotel_id, check_in, check_out, amount, status) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, hotelId, checkIn, checkOut, amount, 'Confirmed'],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to record booking', error: err.message });
      }

      const bookingId = this.lastID;

      // Add loyalty points to user profile: 10% of total spend in points, and 200 XP
      const pointsEarned = Math.floor(amount * 0.05);
      const xpEarned = 150;

      db.run(
        'UPDATE users SET points = points + ?, xp = xp + ? WHERE id = ?',
        [pointsEarned, xpEarned, userId],
        (err) => {
          if (err) console.error('Error awarding loyalty points:', err.message);
        }
      );

      res.status(201).json({
        message: 'Stay booked successfully! 150 XP and reward points awarded.',
        booking: {
          id: bookingId,
          userId,
          hotelId,
          checkIn,
          checkOut,
          amount,
          status: 'Confirmed',
          pointsAwarded: pointsEarned
        }
      });
    }
  );
});

// Retrieve User Stay Bookings (Protected)
router.get('/', verifyToken, (req, res) => {
  const userId = req.user.id;

  db.all(
    `SELECT b.*, h.name as hotel_name, h.image_url 
     FROM bookings b 
     JOIN hotels h ON b.hotel_id = h.id 
     WHERE b.user_id = ? 
     ORDER BY b.id DESC`,
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to retrieve bookings', error: err.message });
      }
      res.status(200).json(rows);
    }
  );
});

export default router;
