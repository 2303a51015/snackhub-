const express  = require('express');
const Order    = require('../models/Order');
const Snack    = require('../models/Snack');
const { protect } = require('../middleware/auth');
const router   = express.Router();

// ── POST /api/orders ─────────────────────────
// Place a new order
router.post('/', protect, async (req, res) => {
  try {
    const { items } = req.body;   // array of cart items
    if (!items || items.length === 0)
      return res.status(400).json({ message: 'Cart is empty' });

    // Reduce snack quantities in DB
    for (const item of items) {
      const snack = await Snack.findById(item.snackId);
      if (!snack) return res.status(404).json({ message: `Snack not found: ${item.name}` });
      if (snack.qty < item.qty)
        return res.status(400).json({ message: `Not enough stock for ${snack.name}` });
      snack.qty -= item.qty;
      await snack.save();
    }

    const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);
    const delivFee = items.filter(i => i.type === 'delivery').reduce((a, i) => a + 10 * i.qty, 0);
    const hasDelivery = items.some(i => i.type === 'delivery');

    const order = await Order.create({
      buyerId:   req.user.collegeId,
      buyerName: req.user.name,
      items,
      total:     subtotal + delivFee,
      delivFee,
      status:    hasDelivery ? 'pending' : 'pickup',
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/orders/mine ─────────────────────
// Orders I placed as buyer
router.get('/mine', protect, async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user.collegeId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/orders/incoming ─────────────────
// Orders containing MY snacks (seller view)
router.get('/incoming', protect, async (req, res) => {
  try {
    const orders = await Order.find({
      'items.ownerId': req.user.collegeId
    }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PATCH /api/orders/:id/deliver ────────────
// Buyer marks order as delivered/received
router.patch('/:id/deliver', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.buyerId !== req.user.collegeId)
      return res.status(403).json({ message: 'Not your order' });
    order.status      = 'delivered';
    order.deliveredAt = new Date();
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PATCH /api/orders/:id/dispatch ───────────
// Seller marks their items as dispatched
router.patch('/:id/dispatch', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const myItem = order.items.find(i => i.ownerId === req.user.collegeId);
    if (!myItem) return res.status(403).json({ message: 'No items from you in this order' });

    order.dispatchedBy.set(req.user.collegeId, Date.now());
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
