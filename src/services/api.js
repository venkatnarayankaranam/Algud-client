import axios from 'axios'



axios.defaults.withCredentials = true
// Default to port 5001 because the server may fall back to that port when 5000 is in use.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // If a token has been stored (login/register flows), attach it as a Bearer header.
    // Also allow cookie-based auth via withCredentials.
    try {
      const stored = localStorage.getItem('token')
      if (stored) {
        config.headers = config.headers || {}
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${stored}`
        }
      }
    } catch (e) {
      // ignore localStorage errors
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't perform navigation here. Let callers handle 401 so we avoid redirect loops.
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  googleAuth: (data) => api.post('/auth/google', data, { withCredentials: true }),
  logout: () => api.post('/auth/logout', {}, { withCredentials: true })
}

// Products API
export const productsAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  getCategories: () => api.get('/products/categories'),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
}

// Orders API
export const ordersAPI = {
  createOrder: (data) => api.post('/orders', data),
  getUserOrders: () => api.get('/orders/user'),
  getAllOrders: (params) => api.get('/orders/admin', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, data) => api.put(`/orders/admin/${id}`, data),
}

// Payment API
export const paymentAPI = {
  createPayment: (data) => api.post('/payment/create', data),
  verifyPayment: (data) => api.post('/payment/verify', data),
}

// Admin API
export const adminAPI = {
  // Setup
  createAdminUser: () => api.post('/admin/setup'),
  
  // Dashboard
  getRevenueAnalytics: (params) => api.get('/admin/revenue', { params }),
  getDashboardStats: () => api.get('/admin/dashboard'),
  
  // Products
  getAllProducts: (params) => api.get('/admin/products', { params }),
  createProduct: (data) => {
    // If an image File is present, send multipart/form-data. Otherwise send JSON.
    const isFileUpload = data.image instanceof File

    if (isFileUpload) {
      const formData = new FormData()
      Object.keys(data).forEach(key => {
        if (key === 'sizes' && Array.isArray(data[key])) {
          data[key].forEach(size => formData.append('sizes', size))
        } else if (key === 'image' && data[key]) {
          formData.append('image', data[key])
        } else if (key !== 'image' && key !== 'imageURL') {
          // Do not append imageURL when uploading a file
          formData.append(key, data[key])
        }
      })
      // Let axios set Content-Type with boundary automatically
      return api.post('/admin/products', formData)
    } else {
      // JSON path: remove the image property and avoid sending empty imageURL
      const jsonData = { ...data }
      delete jsonData.image
      if (typeof jsonData.imageURL === 'string' && jsonData.imageURL.trim() === '') {
        delete jsonData.imageURL
      }
      return api.post('/admin/products', jsonData)
    }
  },
  updateProduct: (id, data) => {
    // If an image File is present, send multipart/form-data. Otherwise send JSON.
    const isFileUpload = data.image instanceof File

    if (isFileUpload) {
      const formData = new FormData()
      Object.keys(data).forEach(key => {
        if (key === 'sizes' && Array.isArray(data[key])) {
          data[key].forEach(size => formData.append('sizes', size))
        } else if (key === 'image' && data[key]) {
          formData.append('image', data[key])
        } else if (key !== 'image' && key !== 'imageURL') {
          // Do not append imageURL when uploading a file
          formData.append(key, data[key])
        }
      })
      // Let axios set Content-Type with boundary automatically
      return api.put(`/admin/products/${id}`, formData)
    } else {
      // JSON path: remove image property and avoid sending empty imageURL
      const jsonData = { ...data }
      delete jsonData.image
      if (typeof jsonData.imageURL === 'string' && jsonData.imageURL.trim() === '') {
        delete jsonData.imageURL
      }
      return api.put(`/admin/products/${id}`, jsonData)
    }
  },
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  bulkUpdateInventory: (data) => api.put('/admin/products/inventory/bulk', data),
  
  // Orders
  getAllOrders: (params) => api.get('/admin/orders', { params }),
  getOrderDetails: (id) => api.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, data) => api.put(`/admin/orders/${id}/status`, data),
  
  // Categories
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  
  // Users
  getAllUsers: (params) => api.get('/admin/users', { params }),
}

export default api
