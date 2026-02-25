import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../api';
import '../styles/OrderDetail.css';

export const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getById(id);
      setOrder(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container"><p>Loading order...</p></div>;
  if (error) return <div className="container"><p className="error">{error}</p></div>;
  if (!order) return <div className="container"><p className="error">Order not found</p></div>;

  return (
    <div className="order-detail-page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>

        <h1>Order #{order._id.substring(0, 8)}</h1>

        <div className="order-detail-layout">
          <div className="order-info">
            <div className="section">
              <h3>Order Status</h3>
              <p className={`status-badge ${order.status}`}>
                {order.status?.toUpperCase() || 'PENDING'}
              </p>
              <p className="order-date">
                Placed on: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="section">
              <h3>Items</h3>
              <div className="items-table">
                {order.orderItems?.map((item, idx) => (
                  <div key={idx} className="table-row">
                    <div className="col-product">
                      <img src={item.image} alt={item.name} />
                      <span>{item.name}</span>
                    </div>
                    <div className="col-qty">Qty: {item.qty}</div>
                    <div className="col-price">₹{item.price}</div>
                    <div className="col-total">
                      ₹{(item.price * item.qty).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section payment-section">
              <h3>Payment Status</h3>
              <p className={order.isPaid ? 'paid' : 'unpaid'}>
                {order.isPaid ? '✓ Paid' : '✗ Pending'}
              </p>
              {order.paidAt && (
                <p>Paid on: {new Date(order.paidAt).toLocaleDateString()}</p>
              )}
            </div>
          </div>

          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-box">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{order.totalPrice?.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>FREE</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{order.totalPrice?.toLocaleString()}</span>
              </div>
            </div>

            <div className="shipping-info">
              <h4>Shipping Address</h4>
              {order.shippingAddress ? (
                <div>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                  <p>Phone: {order.shippingAddress.phone}</p>
                </div>
              ) : (
                <p>Address not provided</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
