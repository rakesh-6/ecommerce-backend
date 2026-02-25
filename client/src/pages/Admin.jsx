import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { productAPI, orderAPI, userAPI } from '../api';
import '../styles/AdminDashboard.css';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    countInStock: '',
  });

  if (user?.role !== 'admin') {
    return (
      <div className="container">
        <p className="error">Access Denied. Admin only.</p>
      </div>
    );
  }

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'products') {
        const res = await productAPI.getAll();
        setProducts(res.data);
      } else if (activeTab === 'orders') {
        const res = await orderAPI.getAll();
        setOrders(res.data);
      } else if (activeTab === 'users') {
        const res = await userAPI.getUsers();
        setUsers(res.data);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await productAPI.create(formData);
      alert('Product created successfully!');
      setFormData({ name: '', description: '', price: '', image: '', countInStock: '' });
      setShowProductForm(false);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await productAPI.delete(id);
        alert('Product deleted!');
        loadData();
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      alert('Order status updated!');
      loadData();
    } catch (err) {
      alert('Failed to update order');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1>Admin Dashboard</h1>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
          <button
            className={`tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </div>

        {loading && <p>Loading...</p>}

        {activeTab === 'orders' && (
          <div className="tab-content">
            <h2>Orders</h2>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id.substring(0, 8)}</td>
                      <td>{order.user?.name}</td>
                      <td>₹{order.totalPrice}</td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleUpdateOrderStatus(order._id, e.target.value)
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <a
                          href={`/order/${order._id}`}
                          className="view-link"
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="tab-content">
            <div className="products-header">
              <h2>Products</h2>
              <button
                onClick={() => setShowProductForm(!showProductForm)}
                className="add-btn"
              >
                {showProductForm ? 'Cancel' : '+ Add Product'}
              </button>
            </div>

            {showProductForm && (
              <form onSubmit={handleAddProduct} className="product-form">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Stock Count"
                  value={formData.countInStock}
                  onChange={(e) =>
                    setFormData({ ...formData, countInStock: e.target.value })
                  }
                  required
                />
                <button type="submit">Create Product</button>
              </form>
            )}

            <div className="products-grid">
              {products.map((product) => (
                <div key={product._id} className="product-item">
                  <img src={product.image} alt={product.name} />
                  <h4>{product.name}</h4>
                  <p>₹{product.price}</p>
                  <p>Stock: {product.countInStock}</p>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="tab-content">
            <h2>Users</h2>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`role-badge ${u.role}`}>
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
