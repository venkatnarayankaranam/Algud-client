import React, { useState, useEffect } from 'react'
import formatCurrency from '../utils/formatCurrency'
import { useSearchParams, Link } from 'react-router-dom'
import { productsAPI } from '../services/api'
import { useCart } from '../contexts/CartContext'
import { ShoppingBag, Star, Filter, Grid, List, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    status: searchParams.get('status') || 'all',
    sort: searchParams.get('sort') || 'newest',
    page: 1,
    limit: 12
  })
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [filters])

  useEffect(() => {
    // Update URL when filters change
    const params = new URLSearchParams()
    if (filters.category !== 'all') params.set('category', filters.category)
    if (filters.status !== 'all') params.set('status', filters.status)
    if (filters.sort !== 'newest') params.set('sort', filters.sort)
    setSearchParams(params)
  }, [filters, setSearchParams])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await productsAPI.getProducts(filters)
      setProducts(response.data.data)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await productsAPI.getCategories()
      setCategories(response.data.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }))
  }

  const handleAddToCart = (product, size) => {
    if (!size) {
      toast.error('Please select a size')
      return
    }
    addToCart(product, size, 1)
    toast.success('Added to cart!')
  }

  const clearFilters = () => {
    setFilters({
      category: 'all',
      status: 'all',
      sort: 'newest',
      page: 1,
      limit: 12
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-800"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-serif font-bold text-visible mb-2 sm:mb-4">
            {filters.category !== 'all' ? filters.category : 'All Products'}
          </h1>
          <p className="text-base sm:text-lg text-visible/80">
            Discover our complete collection of luxury fashion
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-visible">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-xs sm:text-sm text-primary-800 hover:text-primary-700 font-medium"
                >
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-4 sm:mb-6">
                <h4 className="text-sm font-medium text-visible mb-2 sm:mb-3">Category</h4>
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={filters.category === 'all'}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-xs sm:text-sm text-visible/90">All Categories</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={filters.category === category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-xs sm:text-sm text-visible/90">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div className="mb-4 sm:mb-6">
                <h4 className="text-sm font-medium text-visible mb-2 sm:mb-3">Availability</h4>
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="all"
                      checked={filters.status === 'all'}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-xs sm:text-sm text-visible/90">All Items</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="Available"
                      checked={filters.status === 'Available'}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-xs sm:text-sm text-visible/90">In Stock</span>
                  </label>
                </div>
              </div>

              {/* Sort Filter */}
              <div>
                <h4 className="text-sm font-medium text-visible mb-2 sm:mb-3">Sort By</h4>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
              <p className="text-xs sm:text-sm text-visible/80">
                Showing {products.length} products
              </p>
              <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 sm:p-2 rounded-lg ${
                      viewMode === 'grid'
                        ? 'bg-primary-800 text-white'
                        : 'bg-gray-200 text-visible/80 hover:bg-gray-300'
                    }`}
                  >
                    <Grid className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 sm:p-2 rounded-lg ${
                      viewMode === 'list'
                        ? 'bg-primary-800 text-white'
                        : 'bg-gray-200 text-visible/80 hover:bg-gray-300'
                    }`}
                  >
                    <List className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center space-x-1 sm:space-x-2 px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Filters</span>
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            {/* Products */}
            {products.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <p className="text-base sm:text-lg text-visible/80">No products found</p>
                <button
                  onClick={clearFilters}
                  className="mt-3 sm:mt-4 text-primary-800 hover:text-primary-700 font-medium text-sm sm:text-base"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-4 sm:gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
              }`}>
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    viewMode={viewMode}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Product Card Component
const ProductCard = ({ product, viewMode, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('')
  const [showSizes, setShowSizes] = useState(false)

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize)
  }

  if (viewMode === 'list') {
    return (
      <div className="card-hover group">
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-32 md:w-40 lg:w-48 h-48 sm:h-32 md:h-40 lg:h-48 flex-shrink-0">
            <Link to={`/product/${product._id}`}>
              <img
                src={product.imageURL}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>
          <div className="flex-1 p-3 sm:p-4 lg:p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <span className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide">
                    {product.category}
                  </span>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-gold-400 fill-current" />
                    <span className="text-xs sm:text-sm text-gray-600 ml-1">4.8</span>
                  </div>
                </div>
                
                <h3 className="text-sm sm:text-base lg:text-xl font-semibold text-gray-900 mb-1 sm:mb-2 group-hover:text-primary-800 transition-colors line-clamp-2">
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
              </div>
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
                  className="btn-primary py-2 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
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

export default Products
