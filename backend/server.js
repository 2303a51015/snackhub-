const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const dotenv   = require('dotenv');
const path     = require('path');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/auth',    require('./routes/auth'));
app.use('/api/snacks',  require('./routes/snacks'));
app.use('/api/orders',  require('./routes/orders'));
app.use('/api/ratings', require('./routes/ratings'));
app.use('/api/users',   require('./routes/users'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected successfully');
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`\n🚀 SnackHub server running!`);
      console.log(`📱 Open http://localhost:${PORT} in your browser\n`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('\n👉 Make sure MongoDB is running!');
    console.log('   Windows : Start MongoDB from Services, or run: mongod');
    console.log('   Mac/Linux: mongod --dbpath /data/db');
    console.log('   OR use free MongoDB Atlas: https://cloud.mongodb.com\n');
    process.exit(1);
  });

async function seedDatabase() {
  const User   = require('./models/User');
  const Snack  = require('./models/Snack');
  const bcrypt = require('bcryptjs');
  if (await User.countDocuments() > 0) { console.log('ℹ️  Database already seeded — skipping.'); return; }
  console.log('🌱 Seeding demo data...');
  const demoUsers = [
    { collegeId:'CS22B001', name:'Arjun Kumar',   dept:'CSE',   room:'A-204', password:'1234' },
    { collegeId:'EC21B045', name:'Priya Sharma',  dept:'ECE',   room:'B-112', password:'1234' },
    { collegeId:'ME22A033', name:'Rahul Nair',    dept:'MECH',  room:'C-308', password:'1234' },
    { collegeId:'IT21C022', name:'Sneha Reddy',   dept:'IT',    room:'D-105', password:'1234' },
    { collegeId:'EE23D011', name:'Karthik Menon', dept:'EEE',   room:'A-310', password:'1234' },
    { collegeId:'CV22B078', name:'Divya Patel',   dept:'CIVIL', room:'C-201', password:'1234' },
    { collegeId:'ME21A056', name:'Aditya Singh',  dept:'MECH',  room:'B-404', password:'1234' },
  ];
  const created = [];
  for (const u of demoUsers) {
    const user = await User.create({ ...u, password: await bcrypt.hash(u.password, 10) });
    created.push(user);
  }
  const uid = (id) => created.find(x => x.collegeId === id)._id;
  await Snack.insertMany([
  { name:'Lays Magic Masala',      cat:'Chips & Crisps',     price:20, qty:5,  emoji:'🍟', desc:'Unopened packet',          ownerId:'EC21B045', ownerName:'Priya Sharma',  ownerRoom:'B-112' },
  { name:'Frooti Mango Juice',     cat:'Drinks & Juices',    price:20, qty:6,  emoji:'🥭', desc:'Chilled, buy fast!',        ownerId:'EC21B045', ownerName:'Priya Sharma',  ownerRoom:'B-112' },
  { name:'Parle-G Biscuits',       cat:'Biscuits & Cookies', price:10, qty:10, emoji:'🍪', desc:'Full pack, sealed',          ownerId:'EC21B045', ownerName:'Priya Sharma',  ownerRoom:'B-112' },
  { name:'Kurkure Masala Munch',   cat:'Chips & Crisps',     price:15, qty:4,  emoji:'🌶️', desc:'Extra spicy',               ownerId:'EC21B045', ownerName:'Priya Sharma',  ownerRoom:'B-112' },
  { name:'Dairy Milk Silk',        cat:'Chocolates',         price:55, qty:2,  emoji:'🍫', desc:'Extra from care package',   ownerId:'ME22A033', ownerName:'Rahul Nair',    ownerRoom:'C-308' },
  { name:'Maggi Masala Noodles',   cat:'Instant Noodles',    price:15, qty:8,  emoji:'🍜', desc:'Masala flavour, sealed',    ownerId:'ME22A033', ownerName:'Rahul Nair',    ownerRoom:'C-308' },
  { name:'Too Yumm! Multigrain',   cat:'Chips & Crisps',     price:10, qty:4,  emoji:'🥨', desc:'Healthier option',          ownerId:'ME22A033', ownerName:'Rahul Nair',    ownerRoom:'C-308' },
  { name:'Horlicks Biscuits',      cat:'Biscuits & Cookies', price:25, qty:3,  emoji:'🫓', desc:'Health biscuits',           ownerId:'ME22A033', ownerName:'Rahul Nair',    ownerRoom:'C-308' },
  { name:'Cadbury 5 Star',         cat:'Chocolates',         price:20, qty:5,  emoji:'⭐', desc:'Classic 5 Star bar',        ownerId:'ME22A033', ownerName:'Rahul Nair',    ownerRoom:'C-308' },
  { name:'Yippee Noodles',         cat:'Instant Noodles',    price:15, qty:6,  emoji:'🍝', desc:'Magic masala flavour',      ownerId:'IT21C022', ownerName:'Sneha Reddy',   ownerRoom:'D-105' },
  { name:'Haldiram Aloo Bhujia',   cat:'Namkeen',            price:30, qty:3,  emoji:'🥔', desc:'Big packet, sharing size',  ownerId:'IT21C022', ownerName:'Sneha Reddy',   ownerRoom:'D-105' },
  { name:'Sting Energy Drink',     cat:'Drinks & Juices',    price:30, qty:4,  emoji:'⚡', desc:'Strawberry blast',          ownerId:'IT21C022', ownerName:'Sneha Reddy',   ownerRoom:'D-105' },
  { name:'KitKat Wafer Bar',       cat:'Chocolates',         price:30, qty:3,  emoji:'🍫', desc:'Have a break!',             ownerId:'IT21C022', ownerName:'Sneha Reddy',   ownerRoom:'D-105' },
  { name:'Pringles Original',      cat:'Chips & Crisps',     price:80, qty:1,  emoji:'🫙', desc:'Imported, rare find!',      ownerId:'IT21C022', ownerName:'Sneha Reddy',   ownerRoom:'D-105' },
  { name:'Oreo Chocolate Cream',   cat:'Biscuits & Cookies', price:30, qty:5,  emoji:'🖤', desc:'Classic Oreos, sealed',     ownerId:'EE23D011', ownerName:'Karthik Menon', ownerRoom:'A-310' },
  { name:'Roasted Peanuts',        cat:'Nuts & Seeds',       price:20, qty:7,  emoji:'🥜', desc:'Salted, great for study',   ownerId:'EE23D011', ownerName:'Karthik Menon', ownerRoom:'A-310' },
  { name:'Maaza Mango Tetra',      cat:'Drinks & Juices',    price:25, qty:5,  emoji:'🧃', desc:'200ml pack, chilled',       ownerId:'EE23D011', ownerName:'Karthik Menon', ownerRoom:'A-310' },
  { name:'Eclairs Toffees',        cat:'Sweets & Candies',   price:15, qty:6,  emoji:'🍬', desc:'Chocolate eclairs 10pcs',   ownerId:'CV22B078', ownerName:'Divya Patel',   ownerRoom:'C-201' },
  { name:'Thums Up 500ml',         cat:'Drinks & Juices',    price:35, qty:3,  emoji:'🥤', desc:'Chilled bottle',            ownerId:'ME21A056', ownerName:'Aditya Singh',  ownerRoom:'B-404' },
  { name:'Doritos Nacho Cheese',   cat:'Chips & Crisps',     price:60, qty:2,  emoji:'🌽', desc:'Imported bag',              ownerId:'ME21A056', ownerName:'Aditya Singh',  ownerRoom:'B-404' },
  { name:'Cup Noodles Chicken',    cat:'Instant Noodles',    price:30, qty:5,  emoji:'🍲', desc:'Just add hot water',        ownerId:'ME21A056', ownerName:'Aditya Singh',  ownerRoom:'B-404' },
]);
  console.log('✅ Seeded 7 users and 26 snacks!');
}
