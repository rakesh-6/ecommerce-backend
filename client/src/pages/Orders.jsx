import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../api';
import '../styles/Orders.css';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getMyOrders();
      setOrders(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container"><p>Loading orders...</p></div>;

  return (
    <div className="orders-page">
      <div className="container">
        <h1>My Orders</h1>

        {error && <div className="error-message">{error}</div>}

        {orders.length === 0 ? (
          <div className="empty-orders">
            <p>You haven't placed any orders yet</p>
            <Link to="/" className="shop-btn">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order._id.substring(0, 8)}</h3>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="order-status">
                    <span className={`status ${order.status}`}>
                      {order.status?.toUpperCase() || 'PENDING'}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  <h4>Items ({order.orderItems?.length || 0})</h4>
                  {order.orderItems?.map((item, idx) => (
                    <div key={idx} className="item">
                      <p>{item.name} x {item.qty}</p>
                      <p>₹{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="total">
                    <strong>Total: ₹{order.totalPrice?.toLocaleString()}</strong>
                  </div>
                  <Link to={`/order/${order._id}`} className="view-btn">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
