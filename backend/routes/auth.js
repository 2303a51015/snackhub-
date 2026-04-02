const express = require('express');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const router  = express.Router();

const makeToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ── POST /api/auth/register ──────────────────
router.post('/register', async (req, res) => {
  try {
    const { collegeId, name, dept, room, password } = req.body;
    if (!collegeId || !name || !dept || !room || !password)
      return res.status(400).json({ message: 'Please fill all fields' });

    const exists = await User.findOne({ collegeId: collegeId.toUpperCase() });
    if (exists)
      return res.status(400).json({ message: 'College ID already registered' });

    const user = await User.create({ collegeId, name, dept, room, password });
    res.status(201).json({
      token: makeToken(user._id),
      user:  { id: user._id, collegeId: user.collegeId, name: user.name, dept: user.dept, room: user.room }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/auth/login ─────────────────────
router.post('/login', async (req, res) => {
  try {
    const { collegeId, password } = req.body;
    const user = await User.findOne({ collegeId: collegeId.toUpperCase() });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid College ID or password' });

    res.json({
      token: makeToken(user._id),
      user:  { id: user._id, collegeId: user.collegeId, name: user.name, dept: user.dept, room: user.room }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/auth/users ──────────────────────
// Returns basic info about all users (for buyer room lookup)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('collegeId name dept room');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/auth/seed ──────────────────────
// Seeds demo users (only if DB is empty)
router.post('/seed', async (req, res) => {
  try {
    const count = await User.countDocuments();
    if (count > 0) return res.json({ message: 'Already seeded' });

    const demoUsers = [
      { collegeId: 'CS22B001', name: 'Arjun Kumar',   dept: 'CSE',   room: 'A-204', password: '1234' },
      { collegeId: 'EC21B045', name: 'Priya Sharma',  dept: 'ECE',   room: 'B-112', password: '1234' },
      { collegeId: 'ME22A033', name: 'Rahul Nair',    dept: 'MECH',  room: 'C-308', password: '1234' },
      { collegeId: 'IT21C022', name: 'Sneha Reddy',   dept: 'IT',    room: 'D-105', password: '1234' },
      { collegeId: 'EE23D011', name: 'Karthik Menon', dept: 'EEE',   room: 'A-310', password: '1234' },
      { collegeId: 'CV22B078', name: 'Divya Patel',   dept: 'CIVIL', room: 'C-201', password: '1234' },
      { collegeId: 'ME21A056', name: 'Aditya Singh',  dept: 'MECH',  room: 'B-404', password: '1234' },
    ];
    await User.insertMany(demoUsers);
    res.json({ message: `Seeded ${demoUsers.length} demo users` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
