import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import formatCurrency from '../utils/formatCurrency'
import { productsAPI } from '../services/api'
import { useCart } from '../contexts/CartContext'
import { ShoppingBag, Star, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

const videoList = [
  // Replace with your actual video URLs or local paths
  'https://res.cloudinary.com/dnkymbveu/video/upload/v1760722668/ALGUD_Reversible_T_Shirt_Video_Ad_qu729l.mp4'
]

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const [currentVideo, setCurrentVideo] = useState(0)

  useEffect(() => {
    fetchProducts()
  }, [])

  // Auto-advance video every 12 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentVideo((prev) => (prev + 1) % videoList.length)
    }, 12000)
    return () => clearTimeout(timer)
  }, [currentVideo])

  const handlePrev = () => {
    setCurrentVideo((prev) => (prev - 1 + videoList.length) % videoList.length)
  }
  const handleNext = () => {
    setCurrentVideo((prev) => (prev + 1) % videoList.length)
  }

  const fetchProducts = async () => {
    try {
      const [featuredResponse, newArrivalsResponse] = await Promise.all([
        productsAPI.getProducts({ limit: 8, status: 'Available' }),
        productsAPI.getProducts({ limit: 4, status: 'Available' })
      ])
      setFeaturedProducts(featuredResponse.data.data)
      setNewArrivals(newArrivalsResponse.data.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product, size) => {
    if (!size) {
      toast.error('Please select a size')
      return
    }
    addToCart(product, size, 1)
    toast.success('Added to cart!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-800"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Video Carousel */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-gold-600 text-white">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <video
            key={currentVideo}
            src={videoList[currentVideo]}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            style={{ opacity: 0.5 }}
          />
        </div>
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-36 sm:py-40 lg:py-44 xl:py-52">
          <div className="max-w-4xl pt-6 sm:pt-8 lg:pt-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold mb-8 sm:mb-10 leading-tight text-white">
              <div className="cinematic-line animate delay-1">INDIA'S FIRST PREMIUM</div>
              <div className="cinematic-line animate delay-2"><span className="text-gold-400 gold-glow">REVERSIBLE</span></div>
              <div className="cinematic-line animate delay-3"><span className="text-gold-400 gold-glow">T-SHIRTS</span></div>
            </h1>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                to="/products"
                className="btn-gold inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-lg animate-hero-in"
                style={{ animationDelay: '120ms' }}
              >
                Shop Now
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link
                to="/products?category=Dresses"
                className="btn-secondary inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-lg animate-hero-in"
                style={{ animationDelay: '220ms' }}
              >
                View Dresses
              </Link>
            </div>
            {/* Carousel Dots (centered) - only show when there are multiple videos */}
            {videoList.length > 1 && (
              <div className="flex justify-center mt-10">
                <div className="flex space-x-2 bg-black bg-opacity-50 rounded-full px-3 py-2 items-center">
                  {videoList.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentVideo(idx)}
                      aria-label={`Go to video ${idx + 1}`}
                      className={`w-3 h-3 rounded-full focus:outline-none ${idx === currentVideo ? 'bg-gold-400' : 'bg-white bg-opacity-40'}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(31,41,55,0.7) 0%, rgba(31,41,55,0.2) 60%, rgba(31,41,55,0.8) 100%)' }} />
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-serif font-bold text-visible mb-3 sm:mb-4">
              Featured Collection
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-visible/80 max-w-2xl mx-auto">
              Curated selection of our most popular and luxurious pieces
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Link
              to="/products"
              className="btn-primary inline-flex items-center px-6 sm:px-8 py-3 text-sm sm:text-base font-medium"
            >
              View All Products
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-serif font-bold text-visible mb-3 sm:mb-4">
              New Arrivals
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-visible/80 max-w-2xl mx-auto">
              Fresh styles and latest trends just added to our collection
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {newArrivals.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-serif font-bold mb-3 sm:mb-4 text-white">
            Join the ALGUD Community
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Be the first to know about new collections, exclusive offers, and fashion trends
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-visible focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm sm:text-base"
            />
            <button className="btn-gold px-6 sm:px-8 py-3 text-sm sm:text-base font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

// Product Card Component
const ProductCard = ({ product, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('')
  const [showSizes, setShowSizes] = useState(false)

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize)
  }

  return (
    <div className="card-hover group">
      <div className="relative overflow-hidden">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.imageURL}
            alt={product.name}
            className="w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setShowSizes(!showSizes)}
            className="bg-white text-gray-900 p-1.5 sm:p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
        {product.status === 'Out of Stock' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <span className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide">
            {product.category}
          </span>
          <div className="flex items-center">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-gold-400 fill-current" />
            <span className="text-xs sm:text-sm text-gray-600 ml-1">4.8</span>
          </div>
        </div>
        
        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 group-hover:text-primary-800 transition-colors line-clamp-2">
          <Link to={`/product/${product._id}`} className="block">
            {product.name}
          </Link>
        </h3>
        
        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg sm:text-xl lg:text-2xl font-bold text-primary-800">
            {formatCurrency(product.price)}
          </span>
          {product.status === 'Available' && (
            <button
              onClick={() => setShowSizes(!showSizes)}
              className="text-xs sm:text-sm text-primary-800 hover:text-primary-700 font-medium"
            >
              Select Size
            </button>
          )}
        </div>

        {/* Size Selection */}
        {showSizes && product.status === 'Available' && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full border transition-colors ${
                    selectedSize === size
                      ? 'bg-primary-800 text-white border-primary-800'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary-800'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className="btn-primary w-full py-2 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
