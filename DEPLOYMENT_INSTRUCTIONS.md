# 🚀 Deploying Your E-Commerce Website - Complete Guide

## **Step 1: Get a Cloud Hosting Account**

### Quick Setup Options (Recommended for Beginners):

| Platform | Free Tier | Best For | Setup Time |
|----------|-----------|----------|-----------|
| **Render** | ✅ Yes | Backend + Frontend | 5 min |
| **Railway** | ⚠️ Limited | Backend + Frontend | 5 min |
| **Vercel** | ✅ Yes | Frontend Only | 3 min |
| **Netlify** | ✅ Yes | Frontend Only | 3 min |

### Database Options:

| Platform | Free Tier | Best For |
|----------|-----------|----------|
| **MongoDB Atlas** | ✅ 512MB | Best Choice |
| **MongoDB Community Cloud** | Limited | Testing |

---

## **Step 2: Setup MongoDB Atlas (Cloud Database)**

### Create Free MongoDB Database:

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. **Sign Up** → Create Free Tier Cluster
3. Click **"Build a Cluster"** → Select **M0 (Free Forever)**
4. Choose region (pick closest to your users)
5. Create database user:
   - Username: `ecommerce_user`
   - Password: Generate & save it securely
6. Get connection string:
   - Click **"Connect"** → **"Drivers"**
   - Select **Node.js**
   - Copy URI: `mongodb+srv://username:password@cluster.mongodb.net/ecommerce`
   
⚠️ **IMPORTANT:** Replace `username` and `password` with your actual credentials!

**Save this URI - you'll need it next!**

---

## **Step 3: Deploy Backend (Choose One)**

### Option A: Deploy on Render (Easiest)

1. Go to [https://render.com](https://render.com)
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository
5. Fill form:
   ```
   Name: ecommerce-backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```
6. Add Environment Variables:
   ```
   MONGO_URI = mongodb+srv://username:password@cluster.mongodb.net/ecommerce
   JWT_SECRET = YourSecureKey12345Changed!
   CLIENT_URL = https://ecommerce-client.vercel.app  (frontend URL)
   PORT = 10000
   RAZORPAY_KEY_ID = your_key_here
   RAZORPAY_KEY_SECRET = your_secret_here
   ```
7. Click **"Create Web Service"**
8. Wait 3-5 minutes for deployment
9. Copy your URL: `https://ecommerce-backend.onrender.com`

### Option B: Deploy on Railway

1. Go to [https://railway.app](https://railway.app)
2. Click **"Start a New Project"** → **GitHub Repo**
3. Select your repository
4. Add these Environment Variables:
   ```
   MONGO_URI = mongodb+srv://username:password@cluster.mongodb.net/ecommerce
   JWT_SECRET = YourSecureKey12345Changed!
   CLIENT_URL = https://ecommerce-client.vercel.app
   RAZORPAY_KEY_ID = your_key_here
   RAZORPAY_KEY_SECRET = your_secret_here
   ```
5. Railway auto-detects **Node.js** project
6. Deploy
7. Copy your backend URL

---

## **Step 4: Build Frontend for Production**

Run these commands in your terminal:

```bash
cd client
npm install
npm run build
```

This creates a `dist/` folder with your production website.

---

## **Step 5: Deploy Frontend (Choose One)**

### Option A: Deploy on Vercel (BEST)

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"Import Project"** → Select your repo
4. Configure:
   ```
   Framework: Vite
   Root Directory: ./client
   Build Command: npm run build
   Output Directory: dist
   ```
5. Add Environment Variable:
   ```
   VITE_API_URL = https://ecommerce-backend.onrender.com
   VITE_RAZORPAY_KEY_ID = your_razorpay_key
   ```
6. Click **"Deploy"**
7. Your site is live! URL: `https://ecommerce-client.vercel.app`

### Option B: Deploy on Netlify

1. Go to [https://netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click **"Import an existing project"** → Select repo
4. Configure:
   ```
   Base Directory: client
   Build Command: npm run build
   Publish Directory: dist
   ```
5. Add Build Environment Variables (in Site settings):
   ```
   VITE_API_URL = https://ecommerce-backend.onrender.com
   VITE_RAZORPAY_KEY_ID = your_razorpay_key
   ```
6. Deploy

---

## **Step 6: Fix Your Environment Files**

### Update `server/.env`:
```env
MONGO_URI=mongodb+srv://ecommerce_user:YourPassword@cluster.mongodb.net/ecommerce
JWT_SECRET=RakeshEcommerce@2026!SecureKey#9843
CLIENT_URL=https://ecommerce-frontend.vercel.app
PORT=10000
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

### Update `client/.env`:
```env
VITE_API_URL=https://ecommerce-backend.onrender.com
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

---

## **Step 7: Update Your Backend for Production**

Your `server.js` needs to serve the built frontend. Update it:

```javascript
// After app.use(errorHandler); add:

const path = require('path');
const buildPath = path.join(__dirname, '../client/dist');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Client URL: ${process.env.CLIENT_URL}`);
  console.log(`🗄️ MongoDB: ${process.env.MONGO_URI}`);
});
```

---

## **Step 8: Add Seed Data to Cloud Database**

Once your backend is deployed, run:

```bash
cd server
MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/ecommerce" node seedData.js
```

Or through Render:
1. Go to your Render service
2. Click **"Shell"** tab
3. Run: `MONGO_URI="$MONGO_URI" node seedData.js`

---

## **Step 9: Verify Everything**

1. Open your frontend URL: `https://ecommerce-client.vercel.app`
2. You should see **20 products**
3. Test Login: `admin@ecommerce.com` / `admin123`
4. Test Cart + Checkout
5. Check Admin Dashboard

---

## **Troubleshooting**

### Backend won't run:
- Check MongoDB URI is correct
- Verify network access in MongoDB Atlas (allow all IPs for now)

### Frontend shows loading error:
- Check `VITE_API_URL` points to correct backend
- Clear browser cache (Ctrl+Shift+Delete)

### Products not showing:
- Run seed data command
- Check MongoDB database has data

### Payment doesn't work:
- Get real Razorpay keys (test mode keys work in development)
- Update env variables

---

## **Your Live Website URLs**

Once deployed, update these bookmarks:

- **Frontend:** `https://ecommerce-client.vercel.app`
- **Backend API:** `https://ecommerce-backend.onrender.com`
- **Admin Panel:** `https://ecommerce-client.vercel.app/admin`

**Congratulations! Your website is now live! 🎉**
