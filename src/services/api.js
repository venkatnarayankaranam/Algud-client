import axios from 'axios'

// Always send cookies (token is stored in httpOnly cookie)
axios.defaults.withCredentials = true

// Backend URL
// Use relative '/api' by default so:
// - Dev: Vite proxy forwards to local server (vite.config.js)
// - Prod: Vercel rewrite forwards to Render backend (vercel.json)
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true
});
// Request interceptor (⚠️ Do NOT attach Bearer token — Google login uses cookies)
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
)

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  googleAuth: (data) => api.post('/auth/google', data),
  logout: () => api.post('/auth/logout')
}

// Products API
export const productsAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  getCategories: () => api.get('/products/categories'),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`)
}

// Orders API
export const ordersAPI = {
  createOrder: (data) => api.post('/orders', data),
  getUserOrders: () => api.get('/orders/user'),
  getAllOrders: (params) => api.get('/orders/admin', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, data) => api.put(`/orders/admin/${id}`, data)
}

// Payment API
export const paymentAPI = {
  createPayment: (data) => api.post('/payment/create', data),
  verifyPayment: (data) => api.post('/payment/verify', data)
}

// Admin API
export const adminAPI = {
  createAdminUser: () => api.post('/admin/setup'),
  getRevenueAnalytics: (params) => api.get('/admin/revenue', { params }),
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAllProducts: (params) => api.get('/admin/products', { params }),
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),

  getAllOrders: (params) => api.get('/admin/orders', { params }),
  getOrderDetails: (id) => api.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, data) => api.put(`/admin/orders/${id}/status`, data),

  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),

  getAllUsers: (params) => api.get('/admin/users', { params })
}

export default api
