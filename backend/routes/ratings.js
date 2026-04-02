const express  = require('express');
const Rating   = require('../models/Rating');
const { protect } = require('../middleware/auth');
const router   = express.Router();

// ── POST /api/ratings ────────────────────────
router.post('/', protect, async (req, res) => {
  try {
    const { orderId, sellerId, stars } = req.body;
    if (!orderId || !sellerId || !stars)
      return res.status(400).json({ message: 'orderId, sellerId and stars required' });

    // Upsert: update if exists, create if not
    const rating = await Rating.findOneAndUpdate(
      { orderId, sellerId, raterId: req.user.collegeId },
      { stars },
      { upsert: true, new: true }
    );
    res.json(rating);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/ratings/seller/:sellerId ────────
// Average rating + all ratings for a seller
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const ratings = await Rating.find({ sellerId: req.params.sellerId });
    const avg = ratings.length
      ? ratings.reduce((a, r) => a + r.stars, 0) / ratings.length
      : null;
    res.json({ avg, count: ratings.length, ratings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/ratings/my-ratings ─────────────
// Ratings I've given (to check if already rated an order)
router.get('/my-ratings', protect, async (req, res) => {
  try {
    const ratings = await Rating.find({ raterId: req.user.collegeId });
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
