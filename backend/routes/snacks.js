const express  = require('express');
const Snack    = require('../models/Snack');
const { protect } = require('../middleware/auth');
const router   = express.Router();

// ── GET /api/snacks ──────────────────────────
// All snacks (excluding current user's own)
router.get('/', protect, async (req, res) => {
  try {
    const snacks = await Snack.find({ qty: { $gt: 0 } }).sort({ createdAt: -1 });
    res.json(snacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/snacks/mine ─────────────────────
// My own listed snacks
router.get('/mine', protect, async (req, res) => {
  try {
    const snacks = await Snack.find({ ownerId: req.user.collegeId }).sort({ createdAt: -1 });
    res.json(snacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/snacks ─────────────────────────
// Add a new snack listing
router.post('/', protect, async (req, res) => {
  try {
    const { name, cat, price, qty, emoji, desc } = req.body;
    if (!name || !cat || !price || !qty)
      return res.status(400).json({ message: 'Name, category, price and quantity are required' });

    const snack = await Snack.create({
      name, cat,
      price: Number(price),
      qty:   Number(qty),
      emoji: emoji || '🍬',
      desc:  desc  || '',
      ownerId:   req.user.collegeId,
      ownerName: req.user.name,
      ownerRoom: req.user.room,
    });
    res.status(201).json(snack);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/snacks/:id ───────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    const snack = await Snack.findById(req.params.id);
    if (!snack) return res.status(404).json({ message: 'Snack not found' });
    if (snack.ownerId !== req.user.collegeId)
      return res.status(403).json({ message: 'Not your snack' });
    await snack.deleteOne();
    res.json({ message: 'Snack removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/snacks/seed ────────────────────
// Seeds demo snacks (only if DB is empty)
router.post('/seed', async (req, res) => {
  try {
    const count = await Snack.countDocuments();
    if (count > 0) return res.json({ message: 'Already seeded' });

    const User = require('../models/User');
    const priya   = await User.findOne({ collegeId: 'EC21B045' });
    const rahul   = await User.findOne({ collegeId: 'ME22A033' });
    const sneha   = await User.findOne({ collegeId: 'IT21C022' });
    const karthik = await User.findOne({ collegeId: 'EE23D011' });
    const divya   = await User.findOne({ collegeId: 'CV22B078' });
    const aditya  = await User.findOne({ collegeId: 'ME21A056' });

    if (!priya) return res.status(400).json({ message: 'Seed users first via /api/auth/seed' });

    const demoSnacks = [
      // Priya
      { ownerId:'EC21B045', ownerName:'Priya Sharma',  ownerRoom:'B-112', name:'Lays Magic Masala',      cat:'Chips & Crisps',     price:20, qty:5,  emoji:'🍟', desc:'Unopened packet' },
      { ownerId:'EC21B045', ownerName:'Priya Sharma',  ownerRoom:'B-112', name:'Frooti Mango Juice',     cat:'Drinks & Juices',    price:20, qty:6,  emoji:'🥭', desc:'Chilled, buy fast!' },
      { ownerId:'EC21B045', ownerName:'Priya Sharma',  ownerRoom:'B-112', name:'Parle-G Biscuits',       cat:'Biscuits & Cookies', price:10, qty:10, emoji:'🍪', desc:'Full pack, sealed' },
      { ownerId:'EC21B045', ownerName:'Priya Sharma',  ownerRoom:'B-112', name:'Kurkure Masala Munch',   cat:'Chips & Crisps',     price:15, qty:4,  emoji:'🌶️', desc:'Extra spicy!' },
      // Rahul
      { ownerId:'ME22A033', ownerName:'Rahul Nair',    ownerRoom:'C-308', name:'Dairy Milk Silk',        cat:'Chocolates',         price:55, qty:2,  emoji:'🍫', desc:'Extra from care package' },
      { ownerId:'ME22A033', ownerName:'Rahul Nair',    ownerRoom:'C-308', name:'Maggi Masala Noodles',   cat:'Instant Noodles',    price:15, qty:8,  emoji:'🍜', desc:'Masala flavour, sealed' },
      { ownerId:'ME22A033', ownerName:'Rahul Nair',    ownerRoom:'C-308', name:'Too Yumm! Multigrain',   cat:'Chips & Crisps',     price:10, qty:4,  emoji:'🥨', desc:'Healthier option' },
      { ownerId:'ME22A033', ownerName:'Rahul Nair',    ownerRoom:'C-308', name:'Cadbury 5 Star',         cat:'Chocolates',         price:20, qty:5,  emoji:'⭐', desc:'' },
      // Sneha
      { ownerId:'IT21C022', ownerName:'Sneha Reddy',   ownerRoom:'D-105', name:'Yippee Noodles',         cat:'Instant Noodles',    price:15, qty:6,  emoji:'🍝', desc:'Magic masala flavour' },
      { ownerId:'IT21C022', ownerName:'Sneha Reddy',   ownerRoom:'D-105', name:'Haldiram Aloo Bhujia',   cat:'Namkeen',            price:30, qty:3,  emoji:'🥔', desc:'Big packet' },
      { ownerId:'IT21C022', ownerName:'Sneha Reddy',   ownerRoom:'D-105', name:'Sting Energy Drink',     cat:'Drinks & Juices',    price:30, qty:4,  emoji:'⚡', desc:'Strawberry blast' },
      { ownerId:'IT21C022', ownerName:'Sneha Reddy',   ownerRoom:'D-105', name:'KitKat Wafer Bar',       cat:'Chocolates',         price:30, qty:3,  emoji:'🍫', desc:'Have a break!' },
      { ownerId:'IT21C022', ownerName:'Sneha Reddy',   ownerRoom:'D-105', name:'Pringles Original',      cat:'Chips & Crisps',     price:80, qty:1,  emoji:'🫙', desc:'Imported, rare find!' },
      // Karthik
      { ownerId:'EE23D011', ownerName:'Karthik Menon', ownerRoom:'A-310', name:'Oreo Chocolate Cream',   cat:'Biscuits & Cookies', price:30, qty:5,  emoji:'🖤', desc:'Classic Oreos, sealed' },
      { ownerId:'EE23D011', ownerName:'Karthik Menon', ownerRoom:'A-310', name:'Roasted Peanuts Packet', cat:'Nuts & Seeds',       price:20, qty:7,  emoji:'🥜', desc:'Great for night study' },
      { ownerId:'EE23D011', ownerName:'Karthik Menon', ownerRoom:'A-310', name:'Maaza Mango Tetra Pack', cat:'Drinks & Juices',    price:25, qty:5,  emoji:'🧃', desc:'200ml pack, chilled' },
      { ownerId:'EE23D011', ownerName:'Karthik Menon', ownerRoom:'A-310', name:'Bikano Chana Chur',      cat:'Namkeen',            price:20, qty:4,  emoji:'🫘', desc:'Crunchy and spicy' },
      // Divya
      { ownerId:'CV22B078', ownerName:'Divya Patel',   ownerRoom:'C-201', name:'Eclairs Toffees 10pcs',  cat:'Sweets & Candies',   price:15, qty:6,  emoji:'🍬', desc:'Chocolate eclairs' },
      { ownerId:'CV22B078', ownerName:'Divya Patel',   ownerRoom:'C-201', name:'Hide & Seek Choco Chip', cat:'Biscuits & Cookies', price:25, qty:4,  emoji:'🍪', desc:'Dark chocolate chips' },
      { ownerId:'CV22B078', ownerName:'Divya Patel',   ownerRoom:'C-201', name:'Sunflower Seeds Pack',   cat:'Nuts & Seeds',       price:25, qty:3,  emoji:'🌻', desc:'Lightly salted' },
      // Aditya
      { ownerId:'ME21A056', ownerName:'Aditya Singh',  ownerRoom:'B-404', name:'Thums Up 500ml',         cat:'Drinks & Juices',    price:35, qty:3,  emoji:'🥤', desc:'Chilled bottle' },
      { ownerId:'ME21A056', ownerName:'Aditya Singh',  ownerRoom:'B-404', name:'Doritos Nacho Cheese',   cat:'Chips & Crisps',     price:60, qty:2,  emoji:'🌽', desc:'Imported bag' },
      { ownerId:'ME21A056', ownerName:'Aditya Singh',  ownerRoom:'B-404', name:'Kaju Katli 100g',        cat:'Sweets & Candies',   price:70, qty:1,  emoji:'💎', desc:'Home-made by mom!' },
      { ownerId:'ME21A056', ownerName:'Aditya Singh',  ownerRoom:'B-404', name:'Cup Noodles Chicken',    cat:'Instant Noodles',    price:30, qty:5,  emoji:'🍲', desc:'Just add hot water' },
    ];

    await Snack.insertMany(demoSnacks);
    res.json({ message: `Seeded ${demoSnacks.length} demo snacks` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
