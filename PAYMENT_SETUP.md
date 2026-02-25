# Razorpay Payment Integration Setup Guide

## ✅ Completed Components

### Backend
- ✅ Payment Controller (`/server/controllers/paymentController.js`)
  - `createPaymentOrder()` - Creates Razorpay order
  - `verifyPayment()` - Verifies payment signature and updates order
- ✅ Payment Routes (`/server/routes/paymentRoutes.js`)
  - `POST /api/payment/create-order` - Protected route for creating Razorpay order
  - `POST /api/payment/verify` - Protected route for verifying payment
- ✅ Order Model Updated - Added payment-related fields:
  - `paymentMethod` - Payment method used
  - `transactionId` - Razorpay payment ID
  - `shippingAddress` - Full shipping address object
  - `isPaid` - Payment status flag
  - `paidAt` - Payment timestamp

### Frontend
- ✅ Payment API Service (`/client/src/api.js`)
  - `paymentAPI.createOrder()` - Creates payment order
  - `paymentAPI.verifyPayment()` - Verifies payment with signature
- ✅ Checkout Integration (`/client/src/pages/Checkout.jsx`)
  - Razorpay payment modal integration
  - Automatic payment verification
  - Success/error handling
  - Order creation workflow with payment

### Database
- ✅ Product Scaling - Added 20 products (was 5, now 20)
  - Electronics: Laptop, Smartphone, Tablet, Monitor, etc.
  - Accessories: Headphones, Mouse, Keyboard, USB cables, etc.
  - Protective: Phone case, screen protector
  - Storage: External SSD, Power bank
  - Run `node seedData.js` to load new products

### Environment Configuration
- ✅ Server `.env` - Added Razorpay placeholders
- ✅ Client `.env` - Added Razorpay key ID placeholder

---

## 🔧 Step 1: Get Razorpay Credentials

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or login to your account
3. Navigate to **Settings → API Keys**
4. You'll see:
   - **Key ID** (public key)
   - **Key Secret** (private key - keep it secure!)

---

## 🔐 Step 2: Update Environment Variables

### Backend Configuration (`/server/.env`)
Replace placeholders with your actual Razorpay credentials:

```env
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=RakeshEcommerce@2026!SecureKey#9843
CLIENT_URL=http://localhost:5173
PORT=5000
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE
```

### Frontend Configuration (`/client/.env`)
Add your public Key ID:

```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
```

**⚠️ Important:** Never commit private keys to git. Add `.env` to `.gitignore`

---

## 🚀 Step 3: Install Dependencies

### Backend
```bash
cd server
npm install razorpay
npm install
```

Razorpay package is already in `package.json`, just ensure it's installed.

### Frontend
No additional packages needed - Razorpay script loads dynamically.

---

## 🧪 Step 4: Testing the Payment Flow

### Test Mode (Sandbox)
Razorpay provides test credentials for safe testing:

**Test Card Details (for Razorpay test mode):**
- Card Number: `4111 1111 1111 1111`
- Expiry: Any future date (e.g., 12/25)
- CVV: Any 3 digits (e.g., 123)

### Payment Flow

1. **Start Backend**
   ```bash
   cd server
   npm start
   # Should see: Server running on port 5000
   ```

2. **Start Frontend**
   ```bash
   cd client
   npm run dev
   # Should see: VITE v... ready in 100 ms
   ```

3. **Test Complete Flow**
   - Open `http://localhost:5173`
   - Login/Register as a user
   - Add products to cart
   - Go to checkout
   - Fill shipping information
   - Click "Pay Now"
   - Razorpay modal appears
   - Enter test card credentials
   - Complete payment

4. **Verification**
   - After payment, you'll be redirected to order details
   - Order status shows as "processing"
   - `isPaid` field is `true`
   - `transactionId` shows Razorpay payment ID

---

## 📊 Database: Product Scaling Complete

Now have **20 products** available:

| Category | Products |
|----------|----------|
| **Electronics** | Laptop, Smartphone, Tablet, Monitor, Smart Watch |
| **Audio** | Headphones, Portable Speaker, Webcam |
| **Accessories** | USB-C Cable, Wireless Mouse, Mechanical Keyboard, Phone Case, Screen Protector, USB Hub, HDMI Cable |
| **Storage** | External SSD 1TB, Power Bank (20000mAh) |
| **Carrying** | Laptop Bag, Laptop Stand |
| **Power** | Charger Adapter (65W) |

To reload/reseed the database:
```bash
cd server
node seedData.js
```

---

## 🔄 Payment Processing Flow

### Frontend → Backend Flow:

```
1. User fills checkout form
   ↓
2. Frontend creates order in database
   ↓
3. Frontend calls /api/payment/create-order
   ↓
4. Backend creates Razorpay order (returns order_id)
   ↓
5. Frontend loads Razorpay script
   ↓
6. Razorpay modal opens with payment form
   ↓
7. User enters card details
   ↓
8. Razorpay processes payment
   ↓
9. Payment success → Frontend receives razorpay_payment_id
   ↓
10. Frontend calls /api/payment/verify with:
    - razorpay_order_id
    - razorpay_payment_id
    - razorpay_signature
    - orderId (database order ID)
   ↓
11. Backend verifies HMAC-SHA256 signature
   ↓
12. If verified: Updates order (isPaid=true, status=processing)
   ↓
13. Frontend redirects to order details with success message
```

### Security Details:
- **HMAC-SHA256** signature verification ensures payment authenticity
- **Private key secret** never exposed to frontend
- **JWT tokens** required for payment endpoints
- **Order ownership** validated before payment verification

---

## 🛠️ Code Structure

### Backend

**Payment Controller** (`paymentController.js`):
```javascript
// Creates Razorpay order (converts amount to paise)
createPaymentOrder(amount, orderId)

// Verifies signature and updates order status
verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId)
```

**Payment Routes** (`paymentRoutes.js`):
```
POST /api/payment/create-order → createPaymentOrder
POST /api/payment/verify → verifyPayment
```

### Frontend

**Payment API** (`api.js`):
```javascript
paymentAPI.createOrder(amount, orderId)
paymentAPI.verifyPayment(paymentData)
```

**Checkout Page** (`Checkout.jsx`):
- Form submission → Order creation → Payment order creation
- Razorpay modal display
- Payment verification
- Order status update

---

## 🐛 Troubleshooting

### Issue: "Razorpay script failed to load"
- Check internet connection
- Verify CORS is enabled on backend
- Check browser console for errors

### Issue: "Payment verification failed"
- Verify RAZORPAY_KEY_SECRET is correct in .env
- Check payment signature in browser console
- Ensure backend has correct credentials

### Issue: "Order not found during verification"
- Verify orderId is correctly passed in verification
- Ensure order was successfully created before payment
- Check database for order existence

### Issue: "VITE_RAZORPAY_KEY_ID undefined"
- Check `.env` file in client folder
- Restart development server after updating .env
- Verify Key ID format: `rzp_test_...` or `rzp_live_...`

---

## 📱 Order Status Tracking

After successful payment:
- **isPaid**: `true`
- **paidAt**: Timestamp of payment
- **paymentMethod**: "Razorpay"
- **transactionId**: Razorpay payment ID
- **status**: "processing" (order is being prepared)

Track order progression:
- processing → shipped → delivered

---

## 🚢 Production Deployment

When ready for production:

1. **Get Live Credentials**
   - Change Razorpay account to "Live" mode
   - Get live Key ID and Secret (starts with `rzp_live_`)

2. **Update Environment**
   ```env
   RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY
   RAZORPAY_KEY_SECRET=YOUR_LIVE_SECRET
   ```

3. **Deploy Securely**
   - Use environment variables from hosting platform (Render, Railway, Vercel)
   - Never commit sensitive keys to git
   - Use `.env` file only in development

4. **Update URLs**
   - Backend: Update `CLIENT_URL` to production domain
   - Frontend: Update `VITE_API_URL` to production API URL

---

## ✨ Features Implemented

✅ Order creation with shipping address  
✅ Razorpay integration (test & live modes)  
✅ Secure payment verification  
✅ Order tracking with payment status  
✅ Admin dashboard showing paid/unpaid orders  
✅ Product scaling (20 products)  
✅ Error handling & user feedback  
✅ JWT protected payment endpoints  
✅ HMAC signature validation  
✅ Order status workflow  

---

## 📚 Additional Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Integration Guide](https://razorpay.com/docs/integration/)
- [Payment Security Best Practices](https://razorpay.com/docs/payment-gateway/)
- [Test Credentials](https://razorpay.com/docs/payments/test-mode/)

---

## 🎯 Next Steps

1. ✅ Get Razorpay credentials (Step 1)
2. ✅ Update .env files (Step 2)
3. ✅ Install dependencies (Step 3)
4. ✅ Test payment flow on test mode (Step 4)
5. 📋 Monitor orders in admin dashboard
6. 📋 Add email notifications for orders (optional)
7. 📋 Add invoice PDF generation (optional)
8. 📋 Deploy to production

---

**Payment integration complete! 🎉**

For questions or issues, check the troubleshooting section or review the code comments in payment-related files.
