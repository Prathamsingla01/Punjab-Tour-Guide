import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'punjab_tour_secret_key_12345';

// User Registration
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password.' });
  }

  try {
    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err.message });
      if (row) return res.status(400).json({ message: 'User already registered with this email.' });

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert User
      db.run(
        'INSERT INTO users (name, email, password, role, points, xp) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email, hashedPassword, 'Tourist', 100, 150], // 100 Welcome Points
        function (err) {
          if (err) return res.status(500).json({ message: 'Failed to create user', error: err.message });

          const userId = this.lastID;
          
          // Generate JWT
          const token = jwt.sign({ id: userId, email, role: 'Tourist' }, JWT_SECRET, { expiresIn: '7d' });

          res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
              id: userId,
              name,
              email,
              role: 'Tourist',
              points: 100,
              xp: 150
            }
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// User Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err.message });
    if (!user) return res.status(400).json({ message: 'Invalid email or password.' });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password.' });

    // Generate Token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        xp: user.xp
      }
    });
  });
});

// Fetch Current User Details (Protected)
router.get('/profile', verifyToken, (req, res) => {
  db.get('SELECT id, name, email, role, points, xp, created_at FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err.message });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  });
});

export default router;
