import { useState, useEffect } from 'react'
import formatCurrency from '../utils/formatCurrency'
import { useParams, useNavigate } from 'react-router-dom'
import { productsAPI } from '../services/api'
import { useCart } from '../contexts/CartContext'
import { ShoppingBag, Star, Heart, Share2, Minus, Plus, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await productsAPI.getProduct(id)
      setProduct(response.data.data)
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Failed to load product')
      navigate('/products')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size')
      return
    }
    addToCart(product, selectedSize, quantity)
    toast.success('Added to cart!')
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-800"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary-900 mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  return (
  <div className="min-h-screen bg-primary-50">
      <div className="container-max section-padding py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-primary-700/80 hover:text-primary-900 mb-8 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg">
              <img
                src={product.imageURL}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-visible/70 uppercase tracking-wide">
                  {product.category}
                </span>
                <div className="flex items-center space-x-4">
                  <button className="p-2 text-primary-700/60 hover:text-primary-900 transition-colors duration-200">
                    <Heart className="w-5 h-5" />
                  </button>
                    <button className="p-2 text-primary-700/60 hover:text-primary-900 transition-colors duration-200">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-visible mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-gold-500 fill-current" />
                    ))}
                </div>
                <span className="text-sm text-visible/80 ml-2">(4.8) 128 reviews</span>
              </div>
              
              <p className="text-3xl font-bold text-primary-900 mb-6">
                {formatCurrency(product.price)}
              </p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-primary-900 mb-3">Description</h3>
              <p className="text-primary-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold text-primary-900 mb-3">
                Size <span className="text-primary-900">*</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                      selectedSize === size
                        ? 'bg-charcoal-900 text-white border-charcoal-900'
                        : 'bg-white text-primary-700 border-primary-200 hover:border-charcoal-900'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-visible mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-primary-200 rounded-lg bg-white">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 text-lg font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="p-2 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-visible/80">
                  {product.stock} available
                </span>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
                {product.status === 'Available' ? (
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize}
                  className="btn-primary w-full py-4 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
              ) : (
                <div className="w-full py-4 text-center bg-primary-50 text-primary-700 rounded-lg font-medium">
                  Out of Stock
                </div>
              )}
              
              <button className="btn-secondary w-full py-4 text-lg font-medium">
                Buy Now
              </button>
            </div>

            {/* Product Details */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">Product Details</h3>
              <div className="space-y-2 text-sm text-primary-700">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`font-medium ${
                    product.status === 'Available' ? 'text-primary-700' : 'text-charcoal-900'
                  }`}>
                    {product.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Stock:</span>
                  <span className="font-medium">{product.stock} units</span>
                </div>
                <div className="flex justify-between">
                  <span>SKU:</span>
                  <span className="font-medium">ALG-{product._id.slice(-6).toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
