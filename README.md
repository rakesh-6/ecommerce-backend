# 🛍️ E-Commerce Full-Stack Application

A complete, production-ready e-commerce platform built with **React**, **Node.js/Express**, **MongoDB**, and **Razorpay payments**.

---

## ✨ Features

### 🏪 Shopping
- ✅ Browse 20 products with detailed information
- ✅ Search and filter products
- ✅ Responsive product gallery
- ✅ Product detail pages with images

### 🛒 Shopping Cart
- ✅ Add/remove items from cart
- ✅ Update quantities
- ✅ Persistent cart (localStorage)
- ✅ Real-time total calculation

### 💳 Checkout & Payments
- ✅ Shipping information form
- ✅ Razorpay payment gateway integration
- ✅ Secure payment verification (HMAC-SHA256)
- ✅ Order confirmation and tracking

### 👤 Authentication
- ✅ User registration with email
- ✅ Login with JWT tokens
- ✅ Password hashing (bcryptjs)
- ✅ Protected routes (admin/user roles)

### 📊 Admin Dashboard
- ✅ Manage products (CRUD)
- ✅ View all orders
- ✅ View all users
- ✅ Update order status
- ✅ Role-based access control

### 📱 User Account
- ✅ View order history
- ✅ Track order status
- ✅ View payment details
- ✅ User profile management

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React 19, Vite, React Router 6, Axios |
| **Backend** | Node.js, Express 5, Mongoose |
| **Database** | MongoDB (Local or Atlas) |
| **Authentication** | JWT, bcryptjs |
| **Payments** | Razorpay |
| **Hosting** | Render (deployment-ready) |

---

## 📋 Project Structure

```
ecommerce/
├── server/                    # Node.js Backend
│   ├── config/db.js
│   ├── controllers/           # Business logic
│   ├── models/                # MongoDB schemas
│   ├── routes/                # API endpoints
│   ├── middleware/            # Auth, error handling
│   ├── server.js              # Express app
│   ├── seedData.js            # Database seeding
│   └── .env
│
├── client/                    # React Frontend
│   ├── src/
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable components
│   │   ├── context/           # Auth & Cart state
│   │   ├── styles/            # CSS files
│   │   └── api.js             # API service
│   ├── .env
│   └── vite.config.js
│
├── DEPLOYMENT_GUIDE.md        # Deployment instructions
├── PAYMENT_SETUP.md           # Razorpay guide
├── start-all.ps1              # Windows startup script
└── start-all.sh               # Linux/Mac startup script
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** installed
- **MongoDB** running locally (recommended: Docker)

### Start MongoDB (Recommended)
```bash
docker compose up -d
```

If you don't have Docker, install MongoDB locally and ensure it’s running on `mongodb://localhost:27017`.

### Option 1: PowerShell (Windows)
```powershell
# Run everything with one command
.\start-all.ps1
```

### Option 2: Manual (All Platforms)

**Terminal 1 - Backend:**
```bash
cd server
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm install
npm run dev
```

Then open: http://localhost:5173 or http://localhost:5174

---

## 🧪 Testing

### Test Backend API
```bash
curl http://localhost:5000/api/products
```

### Test Credentials
```
Admin:  admin@ecommerce.com / admin123
User:   john@ecommerce.com / user123
```

### Test Razorpay Card
- Number: `4111 1111 1111 1111`
- Expiry: Any future date  
- CVV: Any 3 digits

---

## 📝 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Users
- `POST /api/users` - Register user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (protected)
- `GET /api/users` - Get all users (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/myorders` - Get user's orders (protected)
- `GET /api/orders/:id` - Get order details
- `GET /api/orders` - Get all orders (admin)
- `PUT /api/orders/:id` - Update order status (admin)

### Payments
- `POST /api/payment/create-order` - Create Razorpay order (protected)
- `POST /api/payment/verify` - Verify payment (protected)

---

## 🌐 Deployment (Render)

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for complete step-by-step instructions.

**Quick Summary:**
1. Push code to GitHub
2. Create Web Service on Render (backend)
3. Create Static Site on Render (frontend)
4. Add environment variables
5. Deploy and seed database

---

## 🔐 Environment Variables

### Backend `server/.env`
Create it by copying the template:
```bash
copy server\.env.example server\.env   # Windows
# cp server/.env.example server/.env   # Mac/Linux
```

```env
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=change_me_to_a_long_random_secret
CLIENT_URL=http://localhost:5173,http://localhost:5174
PORT=5000
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_secret
```

### Frontend `client/.env`
Create it by copying the template:
```bash
copy client\.env.example client\.env   # Windows
# cp client/.env.example client/.env   # Mac/Linux
```

```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_key_id
```

---

## 🐛 Troubleshooting

### Products not loading?
```
1. Check backend: http://localhost:5000/api/products
2. Seed database: cd server && node seedData.js
3. Check browser console (F12)
4. Verify MongoDB is running
```

### Payment not working?
```
1. Add RAZORPAY credentials to .env
2. Restart backend server
3. Check browser console for errors
4. Verify Razorpay account is active
```

### Port already in use?
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <PID> /F
```

---

## 📚 Documentation

- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Production deployment
- [PAYMENT_SETUP.md](PAYMENT_SETUP.md) - Razorpay integration
- Backend routes: `/server/routes/`
- Frontend pages: `/client/src/pages/`

---

## 👥 Sample Data

**3 Users:**
- Admin: admin@ecommerce.com / admin123
- User1: john@ecommerce.com / user123
- User2: jane@ecommerce.com / user123

**20 Products:**
- Electronics (Laptop, Phone, Tablet, Monitor, Smart Watch)
- Audio (Headphones, Speaker, Webcam)
- Accessories (Cables, Mouse, Keyboard, Cases, Adapters)
- Storage (SSD, Power Bank)
- Carrying (Laptop Bag, Stand)

**2 Sample Orders:**
- Order 1: Laptop + Headphones
- Order 2: Phone + Smart Watch

---

## 🎯 Development Roadmap

- ✅ Phase 1: Backend API with full CRUD
- ✅ Phase 2: React Frontend with routing
- ✅ Phase 3: Authentication & Cart
- ✅ Phase 4: Checkout & Orders
- ✅ Phase 5: Razorpay Integration
- ✅ Phase 6: Admin Dashboard
- ✅ Phase 7: Database Seeding
- 📋 Phase 8: Production Deployment

---

## 📞 Support

For issues:
1. Check troubleshooting section
2. Review error messages in console
3. See documentation guides
4. Check backend logs: `node server.js`

---

## 📄 License

This project is open-source and available for educational and commercial use.

---

**Built with ❤️ - Ready for Production! 🚀**

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
