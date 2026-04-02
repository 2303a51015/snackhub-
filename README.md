# 🍿 SnackHub — Hostel Snack Exchange System
### Full Stack: Node.js + Express + MongoDB + HTML/CSS/JS

---

## 📁 Project Structure

```
snack-hub-full/
├── backend/
│   ├── models/
│   │   ├── User.js       ← User schema (collegeId, name, dept, room, password)
│   │   ├── Snack.js      ← Snack schema (name, price, qty, owner...)
│   │   ├── Order.js      ← Order schema (buyer, items, total, status...)
│   │   └── Rating.js     ← Rating schema (order, seller, rater, stars)
│   ├── routes/
│   │   ├── auth.js       ← POST /login, POST /register
│   │   ├── snacks.js     ← GET/POST/DELETE snacks
│   │   ├── orders.js     ← GET/POST orders, dispatch, deliver
│   │   ├── ratings.js    ← POST rating, GET seller rating
│   │   └── users.js      ← GET /me, GET all users
│   ├── middleware/
│   │   └── auth.js       ← JWT token verification
│   ├── server.js         ← Main Express server + MongoDB connection
│   ├── .env              ← Config (PORT, MONGO_URI, JWT_SECRET)
│   └── package.json
└── frontend/
    └── index.html        ← Complete frontend (talks to backend API)
```

---

## 🛠 Setup Instructions

### Step 1 — Install Node.js
Download from: https://nodejs.org (choose LTS version)
Check: `node --version` should show v16 or higher

### Step 2 — Install MongoDB
Download from: https://www.mongodb.com/try/download/community
Install and start MongoDB service.

**OR use MongoDB Atlas (Free Cloud)**
1. Go to https://cloud.mongodb.com → create free account
2. Create a free cluster → get connection string
3. Replace MONGO_URI in `backend/.env` with your Atlas URI

### Step 3 — Install dependencies
Open terminal in VS Code, go to backend folder:
```bash
cd backend
npm install
```

### Step 4 — Start the server
```bash
# Normal start
npm start

# OR with auto-restart on file changes (recommended for development)
npm run dev
```

### Step 5 — Open the app
Open your browser and go to:
```
http://localhost:5000
```

That's it! The backend serves the frontend too. ✅

---

## 🔐 Demo Login Credentials

| College ID  | Password | Name          | Dept  | Room  |
|-------------|----------|---------------|-------|-------|
| CS22B001    | 1234     | Arjun Kumar   | CSE   | A-204 |
| EC21B045    | 1234     | Priya Sharma  | ECE   | B-112 |
| ME22A033    | 1234     | Rahul Nair    | MECH  | C-308 |
| IT21C022    | 1234     | Sneha Reddy   | IT    | D-105 |
| EE23D011    | 1234     | Karthik Menon | EEE   | A-310 |
| CV22B078    | 1234     | Divya Patel   | CIVIL | C-201 |
| ME21A056    | 1234     | Aditya Singh  | MECH  | B-404 |

---

## 🌐 API Endpoints

| Method | Endpoint                        | Description                    |
|--------|---------------------------------|--------------------------------|
| POST   | /api/auth/login                 | Login with collegeId + password|
| POST   | /api/auth/register              | Register new student           |
| GET    | /api/snacks                     | Get all available snacks       |
| GET    | /api/snacks/mine                | Get my listed snacks           |
| POST   | /api/snacks                     | Add a new snack                |
| DELETE | /api/snacks/:id                 | Remove my snack                |
| POST   | /api/orders                     | Place an order                 |
| GET    | /api/orders/mine                | My orders as buyer             |
| GET    | /api/orders/incoming            | Orders for my snacks (seller)  |
| PATCH  | /api/orders/:id/deliver         | Mark order as received         |
| PATCH  | /api/orders/:id/dispatch        | Seller marks as dispatched     |
| POST   | /api/ratings                    | Submit a star rating           |
| GET    | /api/ratings/seller/:id         | Get seller's avg rating        |

---

## ✨ Features

- 🔐 JWT Authentication (login/register with College ID)
- 📦 List snacks to sell with emoji, price, quantity
- 🔍 Browse & search all available snacks
- 🛒 Cart with delivery (+₹10) or self-pickup options
- 📬 Seller sees all incoming orders with buyer's room number
- 🚀 Seller can mark orders as dispatched
- ✅ Buyer marks order as received
- ⭐ Star rating system (1-5) for sellers after delivery
- 📊 Dashboard with live stats

---

## 💡 Tips for Testing Multi-User

Since data is now stored in MongoDB (real database):
- Open **two different browsers** (Chrome + Edge, or Chrome normal + Incognito)
- Login as different users in each browser
- They will interact with the **same real database**
- Orders placed by Priya will **immediately appear** in Arjun's Incoming Orders!
