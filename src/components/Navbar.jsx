import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { ShoppingBag, User, Menu, X, Heart } from 'lucide-react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, isAuthenticated, logout, loading } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsProfileOpen(false)
  }

  const [logoLoaded, setLogoLoaded] = useState(false)
  const [logoError, setLogoError] = useState(false)

  return (
  <nav className="bg-white text-black shadow-lg sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative flex items-center h-16 justify-between">
        {/* Brand logo and name (left) */}
        <Link
          to="/"
          aria-label="ALGUD"
          className="flex items-center space-x-2 flex-shrink-0 text-black"
        >
          <div className="w-10 h-10 flex items-center justify-center relative">
            <img
              src="/algud-logo-black.png"
              alt="ALGUD"
              width={40}
              height={40}
              loading="lazy"
              className="w-10 h-10 object-contain transition-transform duration-300 ease-in-out hover:scale-105"
              onLoad={() => setLogoLoaded(true)}
              onError={() => setLogoError(true)}
              style={{ display: logoError ? 'none' : 'block' }}
            />
          </div>
          <span className="ml-2 text-lg md:text-2xl font-serif font-bold tracking-tight transition-transform duration-300 ease-in-out hover:scale-102 algud-word text-black">ALGUD</span>
          <span className="sr-only">ALGUD</span>
        </Link>

        {/* Right side: Cart, Admin Dashboard (desktop), Hamburger */}
        <div className="flex items-center space-x-2 sm:space-x-4 w-auto lg:w-auto min-w-[80px] justify-end">
          {user?.role === 'admin' && (
            <Link
              to="/admin/dashboard"
              className="hidden lg:inline-flex items-center px-3 py-1 rounded text-white bg-yellow-600 hover:bg-yellow-700 font-semibold text-sm mr-2 transition-colors duration-300"
            >
              <span className="mr-2">🛠️</span> Admin Dashboard
            </Link>
          )}
          <Link
            to="/cart"
            className="relative p-2 text-black hover:text-gold-500 transition-colors duration-300"
          >
            <ShoppingBag className="w-5 h-5 animate-spin-slow" />
            {totalItems > 0 && (
              <span className="cart-badge">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>
          {/* Hamburger toggle (no text, right) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center p-2 text-black hover:text-gold-500 transition-colors duration-300"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        </div>

      {/* Mobile Navigation (toggle menu) */}
      {isMenuOpen && (
        <div className="border-t border-primary-200 py-4 absolute left-0 top-16 w-full bg-black z-40">
          <div className="flex flex-col space-y-4 px-4">
            {/* Wishlist link */}
            <Link
              to="/wishlist"
              className="flex items-center text-white hover:text-gold-500 font-medium transition-colors py-2 duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              <Heart className="w-5 h-5 mr-2" />
              Wishlist
            </Link>
            {/* Admin Dashboard link (mobile) */}
            {user?.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className="flex items-center text-white hover:text-gold-500 font-medium transition-colors py-2 duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-2">🛠️</span> Admin Dashboard
              </Link>
            )}
            <Link
              to="/"
              className="text-white hover:text-gold-500 font-medium transition-colors py-2 duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-white hover:text-gold-500 font-medium transition-colors py-2 duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              to="/products?category=Dresses"
              className="text-white hover:text-gold-500 font-medium transition-colors py-2 duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Dresses
            </Link>
            <Link
              to="/products?category=Accessories"
              className="text-white hover:text-gold-500 font-medium transition-colors py-2 duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Accessories
            </Link>
            {/* Mobile profile/auth links */}
            {isAuthenticated ? (
              <div className="pt-2 border-t border-gray-100 flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span className="text-white font-medium">{user?.name}</span>
                  {user?.role === 'admin' && (
                    <span className="ml-2 px-2 py-0.5 rounded bg-yellow-600 text-xs text-white">Admin</span>
                  )}
                </div>
                <Link
                  to="/account"
                  className="block text-white hover:text-gold-500 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Account
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="block text-red-500 hover:text-red-700 font-medium py-2 text-left w-full"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-gray-100 flex flex-col space-y-2">
                <Link
                  to="/login"
                  className="block text-white hover:text-gold-500 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block btn-secondary text-center py-2 px-4 w-full text-primary-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </nav>
  )
}

export default Navbar
