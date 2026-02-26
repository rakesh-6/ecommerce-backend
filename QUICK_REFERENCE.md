# ⚡ QUICK REFERENCE - Deployment Commands

## 📱 Build Frontend

```bash
cd client
npm install
npm run build
```
Output: `client/dist/` folder ready for deployment

---

## 🚀 Deploy Backend (Render)

1. Push code to GitHub
2. Go to render.com
3. Create Web Service
4. Connect repository
5. Set variables (copy from below)
6. Done! ✅

**Environment Variables for Render:**
```
MONGO_URI = mongodb+srv://user:pass@cluster.mongodb.net/ecommerce
JWT_SECRET = YourSecureKey2026!
CLIENT_URL = https://your-frontend.vercel.app
NODE_ENV = production
PORT = 10000
RAZORPAY_KEY_ID = your_key
RAZORPAY_KEY_SECRET = your_secret
```

---

## 📱 Deploy Frontend (Vercel)

1. Go to vercel.com
2. Import GitHub repository
3. Set Root Directory: `client`
4. Set Build: `npm run build`
5. Set Output: `dist`
6. Add Variables:
   ```
   VITE_API_URL = https://ecommerce-backend.onrender.com
   VITE_RAZORPAY_KEY_ID = your_key
   ```
7. Deploy! ✅

---

## 🌱 Seed Database

After backend deployed:
```bash
MONGO_URI="mongodb+srv://user:pass@cluster.mongodb.net/ecommerce" npm run seed
```

Or in Render Shell:
```bash
MONGO_URI="$MONGO_URI" node seedData.js
```

---

## 🧪 Test Deployment

```bash
# Test API
curl https://your-backend.onrender.com/api/products

# Test Frontend
Open: https://your-frontend.vercel.app
```

---

## 🔐 Security Checklist

- [ ] MongoDB user account created
- [ ] Strong password set (20+ chars)
- [ ] JWT_SECRET changed from default
- [ ] .env files NOT in GitHub
- [ ] Razorpay keys from environment
- [ ] CORS URL matches frontend
- [ ] All secrets in platform UI, not code

---

## 🌐 Your URLs

```
Website:    https://ecommerce-client.vercel.app
Admin:      https://ecommerce-client.vercel.app/admin
Backend API: https://ecommerce-backend.onrender.com
API Test:   https://ecommerce-backend.onrender.com/api/products
```

---

## 📊 Test Credentials

```
Email: admin@ecommerce.com
Password: admin123
```

---

## 🆘 Quick Fixes

| Problem | Fix |
|---------|-----|
| Products empty | Run seed data |
| Can't login | Check MongoDB |
| API not found | Check VITE_API_URL |
| Payment error | Use test Razorpay keys |
| Slow load | Render free tier wakes up |

---

## 📞 Help Resources

- **Getting stuck?** → See DEPLOYMENT_CHECKLIST.md
- **Step by step?** → See DEPLOYMENT_INSTRUCTIONS.md
- **Interactive help?** → Run `.\deploy-helper.ps1`
- **Local testing?** → See DEPLOYMENT_GUIDE.md

---

**🎉 You're ready to go live!**
