# E-Commerce Full-Stack Deployment Guide

## 🚀 Quick Start (Development)

### Start Backend Server
**Windows:**
```bash
cd server
npm install
node server.js
```

**Backend should show:**
```
🔍 MongoDB URI: Found
Server running on port 5000
✅ MongoDB Connected: localhost
```

### Start Frontend (New Terminal)
**Windows:**
```bash
cd client
npm install
npm run dev
```

**Frontend should show:**
```
VITE v7.x.x  ready in xxx ms
➜  Local:   http://localhost:5174/
```

---

## ✅ Local Testing Checklist

### Test 1: Backend API
```powershell
Invoke-WebRequest http://localhost:5000/api/products -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json | Measure-Object
```
**Expected:** Returns 20 products

### Test 2: Frontend Products Load
- Open http://localhost:5174 (or 5173)
- Should see 20 products displayed
- **Expected:** ✅ Products grid loads

### Test 3: Authentication
- Click **Login** button
- Use test credentials:
  - Email: `admin@ecommerce.com` (or `john@ecommerce.com`)
  - Password: `admin123` (or `user123`)
- **Expected:** ✅ Login successful, redirects to home/dashboard

### Test 4: Shopping Cart
- Click on any product
- Click **"Add to Cart"**
- Click **"Cart"** in header
- **Expected:** ✅ Product appears in cart

### Test 5: Checkout (With Payment)
- Go to Cart
- Click **"Proceed to Checkout"**
- Fill shipping info
- Click **"Pay Now"**
- **Expected:** ✅ Razorpay modal appears (if credentials set)

### Test 6: Admin Dashboard
- Login as admin (`admin@ecommerce.com` / `admin123`)
- Navigate to **Admin** page  
- **Expected:** ✅ Can see products, orders, users management

---

## 🗄️ Database Check

### Verify Local MongoDB Has Data
```powershell
cd server
node -e "
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const Product = require('./models/product');
  const User = require('./models/user');
  const Order = require('./models/order');
  console.log('Products:', await Product.countDocuments());
  console.log('Users:', await User.countDocuments());
  console.log('Orders:', await Order.countDocuments());
  process.exit(0);
}).catch(e => { console.error('Error:', e.message); process.exit(1); });
"
```

**Expected Output:**
```
Products: 20
Users: 3
Orders: 2
```

---

## 🌐 Deployment to Render

### Prerequisites
1. ✅ GitHub repository created and pushed
2. ✅ MongoDB Atlas account (or alternative cloud DB)
3. ✅ Render account (https://render.com)
4. ✅ Razorpay test/live credentials

### Step 1: Prepare Environment Variables

Create a `.env.render` file with PRODUCTION values:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
JWT_SECRET=RakeshEcommerce@2026!SecureKey#9843
RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY
RAZORPAY_KEY_SECRET=YOUR_LIVE_SECRET
CLIENT_URL=https://your-frontend-render-url.onrender.com
PORT=5000
```

### Step 2: Deploy Backend

1. **Create Web Service on Render:**
   - Go to https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect GitHub repository

2. **Configure Build Settings:**
   - **Name:** ecommerce-backend
   - **Environment:** Node
   - **Region:** Pick closest to you
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && node server.js`

3. **Add Environment Variables:**
   - Click "Advanced" or "Environment" tab
   - Add all variables from `.env.render`

4. **Deploy:** Click "Create Web Service"

### Step 3: Seed Database on Render

Once backend is deployed and running:

1. **Connect to Render Shell:**
   - Go to your Web Service on Render
   - Click "Shell" tab

2. **Run Seed Script:**
   ```bash
   cd server
   node seedData.js
   ```

3. **Expected Output:**
   ```
   MongoDB Connected
   Cleared existing data
   ✅ Created 3 users
   ✅ Created 20 products
   ✅ Created 2 orders
   ✨ Database seeded successfully!
   ```

### Step 4: Deploy Frontend

1. **Create Static Site on Render:**
   - Go to https://dashboard.render.com
   - Click "New +" → "Static Site"
   - Connect GitHub repository

2. **Configure Build Settings:**
   - **Name:** ecommerce-frontend
   - **Build Command:** `cd client && npm install && npm run build`
   - **Publish Directory:** `client/dist`

3. **Add Environment Variable:**
   - `VITE_API_URL=https://your-backend-render-url.onrender.com`

4. **Deploy:** Click "Create Site"

### Step 5: Configure CORS (Backend)

Update `server/server.js` to allow production domain:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://your-frontend-render-url.onrender.com'
  ]
}));
```

---

## 📊 File Structure Overview

```
ecommerce/
├── server/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── userController.js  # Auth, registration
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── paymentController.js # Razorpay integration
│   ├── models/
│   │   ├── user.js            # User schema with bcrypt
│   │   ├── product.js
│   │   └── order.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   └── paymentRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT protection
│   │   └── errorMiddleware.js
│   ├── server.js              # Express app entry
│   ├── seedData.js            # Database seeding
│   ├── .env                   # Local environment
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Product listing
│   │   │   ├── ProductDetail.jsx  # Single product
│   │   │   ├── Cart.jsx           # Shopping cart
│   │   │   ├── Checkout.jsx       # Order + Razorpay
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Orders.jsx         # Order history
│   │   │   ├── OrderDetail.jsx    # Pay status
│   │   │   └── Admin.jsx          # Dashboard
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ProductCard.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # Auth state
│   │   │   └── CartContext.jsx    # Cart state
│   │   ├── api.js                 # Axios config
│   │   └── App.jsx                # Router
│   ├── .env                       # Vite env
│   └── package.json
│
├── .gitignore
├── start-server.bat               # Windows batch start
├── PAYMENT_SETUP.md               # Payment guide
└── README.md
```

---

## 🔒 Security Checklist

- ✅ `.env` files in `.gitignore` (no secrets in Git)
- ✅ JWT tokens stored in localStorage (frontend)
- ✅ Password hashing with bcryptjs
- ✅ RAZORPAY_KEY_SECRET never exposed to frontend
- ✅ Protected routes require JWT token
- ✅ Admin routes restricted to admin role
- ✅ CORS configured for allowed domains

---

## 🐛 Troubleshooting

### "Failed to load products" on frontend
```
✅ Check backend is running: http://localhost:5000/api/products
✅ Check database has products: node seedData.js
✅ Check CORS is enabled
✅ Check console (F12) for error messages
```

### "MongoDB connection failed"
```
✅ Verify MONGO_URI in .env
✅ Ensure local MongoDB is running: mongod
✅ For Render: Use MongoDB Atlas (mongodb+srv://...)
```

### "RAZORPAY_KEY_ID is mandatory"
```
✅ Add to .env: RAZORPAY_KEY_ID=rzp_test_xxx
✅ Add to .env: RAZORPAY_KEY_SECRET=xxx
✅ Restart server after adding
```

### Payment modal doesn't appear on Checkout
```
✅ Check browser console for errors
✅ Verify Razorpay credentials are set
✅ Check network tab to see API calls
✅ Ensure Razorpay CDN script loads
```

---

## 📱 Test Credentials

### Admin Account
- Email: `admin@ecommerce.com`
- Password: `admin123`

### Regular User Account
- Email: `john@ecommerce.com`
- Password: `user123`

### Razorpay Test Card
- Number: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits

---

## 🎯 Next Steps

1. ✅ Test locally (run both servers)
2. ✅ Verify all features work
3. ✅ Get MongoDB Atlas credentials (or alternative cloud DB)
4. ✅ Get Razorpay live credentials
5. ✅ Deploy to Render
6. ✅ Run seed script on Render
7. ✅ Test on live URL
8. ✅ Set up custom domain (optional)

---

**Everything is ready for production! 🚀**

For detailed payment setup, see [PAYMENT_SETUP.md](PAYMENT_SETUP.md)
