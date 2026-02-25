import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI, paymentAPI } from '../api';
import '../styles/Checkout.css';

export const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <div className="empty-cart">
          <h2>No items in cart</h2>
          <button onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.address || !formData.city || !formData.postalCode || !formData.phone) {
      setError('Please fill all fields');
      return;
    }

    const orderItems = cartItems.map((item) => ({
      name: item.name,
      qty: item.qty,
      image: item.image,
      price: item.price,
      product: item._id,
    }));

    try {
      setLoading(true);
      const orderData = {
        orderItems,
        totalPrice: getTotalPrice(),
        shippingAddress: formData,
      };

      // Step 1: Create order in database
      const orderResponse = await orderAPI.create(orderData);
      const createdOrder = orderResponse.data;
      
      // Step 2: Create payment order with Razorpay
      const paymentOrderResponse = await paymentAPI.createOrder(
        getTotalPrice(),
        createdOrder._id
      );
      const razorpayOrder = paymentOrderResponse.data;

      // Step 3: Load Razorpay script and open payment modal
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Failed to load Razorpay script');
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'YOUR_KEY_ID',
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order_id: razorpayOrder.id,
        name: 'E-Commerce Store',
        description: 'Order Payment',
        customer_notification: 1,
        handler: async (response) => {
          try {
            // Step 4: Verify payment
            const verificationResponse = await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: createdOrder._id,
            });

            // Payment successful
            clearCart();
            navigate(`/order/${createdOrder._id}`, {
              state: { paymentSuccess: true }
            });
          } catch (err) {
            setError('Payment verification failed: ' + (err.response?.data?.message || err.message));
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: formData.phone,
        },
        theme: {
          color: '#6366f1',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to process order');
      setLoading(false);
    }
  };

  const total = getTotalPrice();

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-layout">
          <div className="checkout-form">
            <h1>Checkout</h1>
            
            {error && <div className="error-message">{error}</div>}

            <div className="order-summary">
              <h3>Order Summary</h3>
              {cartItems.map((item) => (
                <div key={item._id} className="summary-item">
                  <span>{item.name} x {item.qty}</span>
                  <span>₹{(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
              <div className="summary-total">
                <strong>Total: ₹{total.toLocaleString()}</strong>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <h3>Shipping Information</h3>
              
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={user?.name} readOnly />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" value={user?.email} readOnly />
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main St"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="New York"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="10001"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1-800-123-4567"
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="place-order-btn">
                {loading ? 'Processing...' : 'Pay Now'}
              </button>
            </form>
          </div>

          <div className="order-review">
            <h2>Order Review</h2>
            <div className="items">
              {cartItems.map((item) => (
                <div key={item._id} className="review-item">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <p>{item.name}</p>
                    <p>Qty: {item.qty}</p>
                    <p className="price">₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="total-box">
              <p>Subtotal: ₹{total.toLocaleString()}</p>
              <p>Shipping: FREE</p>
              <h3>Total: ₹{total.toLocaleString()}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
