import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { ShoppingBag, User, Menu, X, Search } from 'lucide-react'

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
  <nav className="bg-black text-white shadow-lg sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="relative grid grid-cols-[auto_1fr_auto] items-center h-16 lg:flex lg:justify-between">
          {/* Mobile MENU button (left) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden flex items-center space-x-2 text-sm font-medium p-2 text-white hover:text-gold-500 transition-colors duration-300 justify-self-start"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <>
                <X className="w-5 h-5" />
                <span>Close</span>
              </>
            ) : (
              <>
                <Menu className="w-5 h-5" />
                <span>Menu</span>
              </>
            )}
          </button>

          {/* Logo */}
          <Link
            to="/"
            aria-label="ALGUD"
            className="justify-self-center lg:static lg:transform-none flex items-center space-x-3 flex-shrink-0 transition-all duration-300 ease-in-out text-white col-start-2 z-10"
          >
            <div className="w-10 h-10 flex items-center justify-center relative">
              {/* Always render the image so a valid file is displayed immediately. Hide it if it errors. */}
              <img
                src="/algud-logo.jpg2.png"
                alt="ALGUD"
                width={40}
                height={40}
                loading="lazy"
                className="w-10 h-10 object-contain transition-transform duration-300 ease-in-out hover:scale-105"
                onLoad={() => setLogoLoaded(true)}
                onError={() => setLogoError(true)}
                style={{ display: logoError ? 'none' : 'block' }}
              />

              {/* Inline SVG fallback shown when the image fails to load */}
              {logoError && (
                <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ALGUD logo" className="rounded-lg">
                  <rect width="100" height="100" rx="8" fill="#0f172a" />
                  <g transform="translate(50,50)">
                    <polygon points="0,-40 36,0 0,40 -36,0" fill="#fff" opacity="0.95" />
                    <text x="0" y="6" textAnchor="middle" fontSize="22" fontFamily="Playfair Display, serif" fontWeight="700" fill="#0f172a">ALGUD</text>
                  </g>
                </svg>
              )}
            </div>
            <div className="flex items-center leading-none lg:ml-0 ml-0 gap-2">
              {/* Hide wordmark on very small screens to prevent overlap; show from sm and up */}
              <span className="hidden md:inline text-xl md:text-2xl font-serif font-bold text-white tracking-tight transition-transform duration-300 ease-in-out hover:scale-102 algud-word">
                {Array.from('ALGUD').map((ch, idx) => (
                  <span key={idx} className="inline-block algud-letter mx-0.5">
                    {ch}
                  </span>
                ))}
              </span>
              {/* Provide a single readable label for screen readers */}
              <span className="sr-only">ALGUD</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link
              to="/"
              className="text-white hover:text-gold-500 font-medium transition-colors duration-300 text-sm xl:text-base"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-white hover:text-gold-500 font-medium transition-colors duration-300 text-sm xl:text-base"
            >
              Shop
            </Link>
            <Link
              to="/products?category=Dresses"
              className="text-white hover:text-gold-500 font-medium transition-colors duration-300 text-sm xl:text-base"
            >
              Dresses
            </Link>
            <Link
              to="/products?category=Accessories"
              className="text-white hover:text-gold-500 font-medium transition-colors duration-300 text-sm xl:text-base"
            >
              Accessories
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-2 sm:space-x-4 w-auto lg:w-auto min-w-[120px] justify-self-end justify-end col-start-3">
            {/* Search - visible on mobile */}
            <button className="p-2 text-white hover:text-gold-500 transition-colors duration-300">
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-white hover:text-gold-500 transition-colors duration-300"
            >
              {/* Apply the slow spin only to the cart icon SVG for a subtle premium effect */}
              <ShoppingBag className="w-5 h-5 animate-spin-slow" />
              {totalItems > 0 && (
                <span className="cart-badge">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* User Profile */}
            {loading ? null : isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-1 sm:space-x-2 p-2 text-white hover:text-gold-500 transition-colors duration-300"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:block text-sm lg:text-base max-w-20 truncate">{user?.name}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-lg border border-primary-200 py-2 z-50 max-h-80 overflow-auto">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-visible truncate">{user?.name}</p>
                      <p className="text-xs text-visible/70 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/account"
                      className="block px-4 py-2 text-sm text-visible/90 hover:bg-primary-50 transition-colors duration-200"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      My Account
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-visible/90 hover:bg-primary-50 transition-colors duration-200"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Orders
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : loading ? null : (
              /* Hide these on mobile; they will appear inside the mobile menu */
              <div className="hidden sm:flex flex-row items-center sm:space-x-2">
                  <Link
                    to="/login"
                    className="text-white hover:text-gold-500 font-medium transition-colors text-sm lg:text-base duration-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary text-xs sm:text-sm px-3 py-2 sm:px-4"
                  >
                    Sign Up
                  </Link>
                </div>
            )}

            {/* (mobile MENU moved to left) */}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-primary-200 py-4">
            <div className="flex flex-col space-y-4">
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
              {/* Mobile auth links */}
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
              {/* Mobile Search */}
              <div className="pt-4 border-t border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-700/60 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none bg-white text-primary-900"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
