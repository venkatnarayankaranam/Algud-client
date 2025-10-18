import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Account from './pages/Account'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCategories from './pages/admin/AdminCategories'
import AdminInventory from './pages/admin/AdminInventory'
import AdminUsers from './pages/admin/AdminUsers'
import SeedGallery from './pages/admin/SeedGallery'
import PaymentSuccess from './pages/PaymentSuccess'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Cookies from './pages/Cookies'
import SizeGuide from './pages/SizeGuide'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AdminNavbar from './components/AdminNavbar'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

function App() {
  React.useEffect(() => {
    // Dispatch an event to signal the app is ready (loader listens for this)
    const t = setTimeout(() => window.dispatchEvent(new Event('app:ready')), 50)
    return () => clearTimeout(t)
  }, [])
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-primary-100">
            <Routes>
              {/* Public Routes */}
              <Route path="/*" element={
                <>
                  <Navbar />
                  <main>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/cookies" element={<Cookies />} />
                      <Route path="/size-guide" element={<SizeGuide />} />
                      <Route path="/payment/success" element={<PaymentSuccess />} />
                      <Route path="/orders" element={
                        <ProtectedRoute>
                          <Orders />
                        </ProtectedRoute>
                      } />
                      <Route path="/account" element={
                        <ProtectedRoute>
                          <Account />
                        </ProtectedRoute>
                      } />
                      
                      {/* Protected Routes */}
                      <Route path="/checkout" element={
                        <ProtectedRoute>
                          <Checkout />
                        </ProtectedRoute>
                      } />
                    </Routes>
                  </main>
                  <Footer />
                </>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/*" element={
                <div className="site-dark">
                  <AdminNavbar />
                  <main className="lg:ml-64">
                    <Routes>
                      <Route path="/dashboard" element={
                        <AdminRoute>
                          <AdminDashboard />
                        </AdminRoute>
                      } />
                      <Route path="/products" element={
                        <AdminRoute>
                          <AdminProducts />
                        </AdminRoute>
                      } />
                      <Route path="/orders" element={
                        <AdminRoute>
                          <AdminOrders />
                        </AdminRoute>
                      } />
                      <Route path="/categories" element={
                        <AdminRoute>
                          <AdminCategories />
                        </AdminRoute>
                      } />
                      <Route path="/inventory" element={
                        <AdminRoute>
                          <AdminInventory />
                        </AdminRoute>
                      } />
                      <Route path="/users" element={
                        <AdminRoute>
                          <AdminUsers />
                        </AdminRoute>
                      } />
                      <Route path="/seed-gallery" element={
                        <AdminRoute>
                          <SeedGallery />
                        </AdminRoute>
                      } />
                    </Routes>
                  </main>
                </div>
              } />
            </Routes>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#000000',
                  color: '#ffffff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#d4af37',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#1a1a1a',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
