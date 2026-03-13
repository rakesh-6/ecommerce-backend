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

      // Payment successful (Bypassing for now as requested)
      clearCart();
      navigate(`/order/${createdOrder._id}`, {
        state: { paymentSuccess: true }
      });

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
