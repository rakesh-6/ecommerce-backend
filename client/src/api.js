import axios from 'axios';

// In production (same-origin deploy), VITE_API_URL can be empty so API calls go to the same host.
// In development, it falls back to localhost:5000.
const API_URL = import.meta.env.VITE_API_URL !== undefined
  ? import.meta.env.VITE_API_URL
  : 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User APIs
export const userAPI = {
  register: (name, email, password) =>
    api.post('/users', { name, email, password }),
  login: (email, password) =>
    api.post('/users/login', { email, password }),
  getProfile: () => api.get('/users/profile'),
  getUsers: () => api.get('/users'), // Admin
};

// Product APIs
export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (product) => api.post('/products', product),
  update: (id, product) => api.put(`/products/${id}`, product),
  delete: (id) => api.delete(`/products/${id}`),
};

// Order APIs
export const orderAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/myorders'),
  getAll: () => api.get('/orders'), // Admin
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) =>
    api.put(`/orders/${id}`, { status }),
};

// Payment APIs
export const paymentAPI = {
  createOrder: (amount, orderId) =>
    api.post('/payment/create-order', { amount, orderId }),
  verifyPayment: (paymentData) =>
    api.post('/payment/verify', paymentData),
};

export default api;
