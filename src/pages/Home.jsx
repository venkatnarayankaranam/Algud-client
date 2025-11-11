import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import formatCurrency from '../utils/formatCurrency'
import { productsAPI } from '../services/api'
import { useCart } from '../contexts/CartContext'
import { ShoppingBag, Star, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

const videoList = [
  'https://res.cloudinary.com/dnkymbveu/video/upload/v1760722668/ALGUD_Reversible_T_Shirt_Video_Ad_qu729l.mp4'
]

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const [currentVideo, setCurrentVideo] = useState(0)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true
    fetchProducts()
  }, [])

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
      {/* Fullscreen Hero Video Section */}
      <section
        className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-gold-600 text-white"
        style={{
          width: '100vw',
          height: '100vh',
          maxHeight: '100vh',
          minHeight: '350px',
          overflow: 'hidden',
        }}
      >
        <video
          key={currentVideo}
          src={videoList[currentVideo]}
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          style={{ opacity: 0.5, width: '100vw', height: '100vh', objectFit: 'cover' }}
        />
        {/* Carousel Dots (centered) - only show when there are multiple videos */}
        {videoList.length > 1 && (
          <div className="absolute bottom-4 left-0 w-full flex justify-center z-20">
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20 pointer-events-none" />
      </section>

      {/* Hero Text Below Video */}
      <div className="w-full flex justify-center items-center py-6 bg-black">
        <h1
          className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-serif font-extrabold text-center mb-0 px-2 sm:px-0 text-white"
          style={{
            letterSpacing: '0.04em',
            textShadow: '0 2px 8px rgba(0,0,0,0.18)',
            lineHeight: 1.15,
            wordBreak: 'break-word',
            maxWidth: '100%',
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
          }}
        >
          INDIA'S FIRST PREMIUM<br className="block sm:hidden" /> REVERSIBLE T-SHIRTS
        </h1>
      </div>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-4xl font-serif font-bold mb-6">Featured Collection</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/products" className="btn-primary px-8 py-3 inline-flex items-center">
              View All Products <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals section removed as requested */}

      {/* Join the ALGUD Community section removed as requested */}
    </div>
  )
}

const ProductCard = ({ product, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('')
  const [showSizes, setShowSizes] = useState(false)

  return (
    <div className="card-hover group">
      <div className="relative flex justify-center items-center overflow-hidden p-2 sm:p-4" style={{ minHeight: '140px', height: 'auto' }}>
        <Link to={`/product/${product._id}`} className="block w-full">
          <img
            src={product.imageURL}
            alt={product.name}
            className="mx-auto w-32 h-32 sm:w-40 sm:h-40 object-contain group-hover:scale-105 duration-300"
            style={{ maxHeight: '9rem', minHeight: '6rem' }}
          />
        </Link>
        <button
          onClick={() => setShowSizes(!showSizes)}
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow"
        >
          <ShoppingBag className="w-4 h-4 text-gray-900" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900">
          <Link to={`/product/${product._id}`}>{product.name}</Link>
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
        <div className="flex justify-between mt-3">
          <span className="text-xl font-bold text-primary-800">{formatCurrency(product.price)}</span>
          <button onClick={() => setShowSizes(!showSizes)} className="text-primary-800 text-sm">
            Select Size
          </button>
        </div>

        {showSizes && (
          <div className="mt-4 border-t pt-4">
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 text-sm rounded-full border ${
                    selectedSize === size ? 'bg-primary-800 text-white' : 'text-gray-700 border-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            <button
              className="btn-primary w-full py-2 mt-4"
              disabled={!selectedSize}
              onClick={() => onAddToCart(product, selectedSize)}
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
