import { useState, useEffect } from 'react'
import axios from 'axios'
import { adminAPI } from '../../services/api'
import { Plus, Edit, Trash2, Eye, Search, Filter, Upload, Package } from 'lucide-react'
import formatCurrency from '../../utils/formatCurrency'
import { pillClass, getStatusColor } from './themeHelpers'
import toast from 'react-hot-toast'

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getAllProducts({ limit: 50 })
      setProducts(response.data.data.products)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      await adminAPI.deleteProduct(productId)
      toast.success('Product deleted successfully')
      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowModal(true)
  }

  const handleAddNew = () => {
    setEditingProduct(null)
    setShowModal(true)
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-800"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-max section-padding py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-4">
                Manage Products
              </h1>
              <p className="text-lg text-gray-600">
                Add, edit, and manage your product inventory
              </p>
            </div>
            <button
              onClick={handleAddNew}
              className="btn-primary inline-flex items-center px-6 py-3"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Product
            </button>
          </div>
        </div>

        {/* Filters */}
  <div className="bg-white rounded-lg shadow-sm border border-white/10 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Categories</option>
                <option value="Tops">Tops</option>
                <option value="Bottoms">Bottoms</option>
                <option value="Dresses">Dresses</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Accessories">Accessories</option>
                <option value="Shoes">Shoes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
  <div className="bg-white rounded-lg shadow-sm border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 flex-shrink-0">
                          <img
                            src={product.imageURL}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`${pillClass()} ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-primary-600 hover:text-primary-900 p-1"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-charcoal-900 hover:text-charcoal-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || categoryFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by adding your first product'
              }
            </p>
            <button
              onClick={handleAddNew}
              className="btn-primary inline-flex items-center px-6 py-3"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Product
            </button>
          </div>
        )}

        {/* Product Modal */}
        {showModal && (
          <ProductModal
            product={editingProduct}
            onClose={() => {
              setShowModal(false)
              setEditingProduct(null)
            }}
            onSave={() => {
              setShowModal(false)
              setEditingProduct(null)
              fetchProducts()
            }}
          />
        )}
      </div>
    </div>
  )
}

// Product Modal Component
const ProductModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || 'Tops',
    sizes: product?.sizes || [],
    imageURL: product?.imageURL || '',
    stock: product?.stock || 0
  })
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(product?.imageURL || '')
  const [imageUploadProgress, setImageUploadProgress] = useState(0)
  const [uploadController, setUploadController] = useState(null)
  const [formErrors, setFormErrors] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSizeChange = (e) => {
    const { value, checked } = e.target
    if (checked) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, value]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        sizes: prev.sizes.filter(size => size !== value)
      }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Simple client-side image compression using canvas
  const compressImage = async (file, maxSize = 1200, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      try {
        const img = new Image()
        const reader = new FileReader()
        reader.onload = (ev) => {
          img.onload = () => {
            const canvas = document.createElement('canvas')
            let { width, height } = img
            if (width > maxSize || height > maxSize) {
              if (width > height) {
                height = Math.round((height *= maxSize / width))
                width = maxSize
              } else {
                width = Math.round((width *= maxSize / height))
                height = maxSize
              }
            }
            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, width, height)
            canvas.toBlob((blob) => {
              const compressedFile = new File([blob], file.name, { type: blob.type })
              resolve(compressedFile)
            }, 'image/jpeg', quality)
          }
          img.onerror = reject
          img.src = ev.target.result
        }
        reader.readAsDataURL(file)
      } catch (err) {
        reject(err)
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Client-side validations to avoid round trips for obvious issues
      const errors = []
      if (!formData.name.trim()) errors.push('Product name is required.')
      if (!formData.description.trim()) errors.push('Description is required.')
      if (formData.price === '' || Number(formData.price) < 0) errors.push('Price must be a non-negative number.')
      if (!formData.category) errors.push('Category is required.')
      if (formData.stock === '' || Number(formData.stock) < 0) errors.push('Stock must be a non-negative number.')
      if (!imageFile && !formData.imageURL.trim()) errors.push('Please upload an image or provide an image URL.')
      if (!formData.sizes.length) errors.push('Select at least one size.')
      if (errors.length) {
        setFormErrors(errors)
        // Show first error prominently
        toast.error(errors[0])
        setLoading(false)
        return
      }
      // Prepare payload: only include image file when a new file was selected.
      const submitData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock)
      }
      if (imageFile) submitData.image = imageFile

      // If Cloudinary direct upload is configured, upload directly from client to Cloudinary
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      const folder = import.meta.env.VITE_CLOUDINARY_FOLDER || ''
      // Debug: log image state so we can diagnose empty imageURL issues
      console.log('Submitting product. imageFile present:', !!imageFile, 'cloudName:', cloudName, 'initial imageURL:', submitData.imageURL)

      // Client-side guard: require either an uploaded file or an image URL
      if (!imageFile && !submitData.imageURL) {
        toast.error('Please provide a product image (upload a file or enter an image URL)')
        setLoading(false)
        return
      }
      if (imageFile && cloudName) {
        // Compress image first
        let fileToUpload = imageFile
        try {
          fileToUpload = await compressImage(imageFile, 1200, 0.8)
        } catch (err) {
          console.warn('Image compression failed, uploading original', err)
          fileToUpload = imageFile
        }

        // Request signature from server
        const signResp = await axios.get('/api/upload/cloudinary-sign', { params: { folder } })
        if (!signResp.data?.success) throw new Error('Failed to get signature')

        const { timestamp, signature, api_key } = signResp.data.data
        const cloudUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`
        const form = new FormData()
        form.append('file', fileToUpload)
        form.append('api_key', api_key)
        form.append('timestamp', timestamp)
        form.append('signature', signature)
        if (folder) form.append('folder', folder)

        // Create an AbortController to allow cancel
        const controller = new AbortController()
        setUploadController(controller)

        const uploadResp = await axios.post(cloudUrl, form, {
          signal: controller.signal,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
              setImageUploadProgress(percentCompleted)
            }
          }
        })

        // Cloudinary returns secure_url
        submitData.imageURL = uploadResp.data.secure_url || uploadResp.data.url
        // Remove file key to avoid multipart when sending to server
        delete submitData.image
        setUploadController(null)
      }

      if (product) {
        await adminAPI.updateProduct(product._id, submitData)
        toast.success('Product updated successfully')
      } else {
        await adminAPI.createProduct(submitData)
        toast.success('Product created successfully')
      }
      onSave()
    } catch (error) {
      console.error('Error saving product:', error)
      // Attempt to surface server-side validation details
      const resp = error.response?.data
      if (resp) {
        if (resp.errors && Array.isArray(resp.errors) && resp.errors.length) {
          setFormErrors(resp.errors)
          // Show up to 3 errors as individual toasts for visibility
          resp.errors.slice(0,3).forEach(msg => toast.error(msg))
        } else if (resp.message) {
          setFormErrors([resp.message])
          toast.error(resp.message)
        } else {
          toast.error('Failed to save product')
        }
      } else {
        toast.error('Failed to save product')
      }
    } finally {
      setLoading(false)
      setImageUploadProgress(0)
    }
  }

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '42']

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
  <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {formErrors.length > 0 && (
              <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700 space-y-1">
                {formErrors.map((err, idx) => (
                  <div key={idx}>• {err}</div>
                ))}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter price"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                required
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter product description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="Tops">Tops</option>
                  <option value="Bottoms">Bottoms</option>
                  <option value="Dresses">Dresses</option>
                  <option value="Outerwear">Outerwear</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Shoes">Shoes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  name="stock"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter stock quantity"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image *
              </label>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-4">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                  />
                  {imageUploadProgress > 0 && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${imageUploadProgress}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Uploading: {imageUploadProgress}%</div>
                    </div>
                  )}
                </div>
              )}
              
              {/* File Upload */}
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              
              {/* Fallback URL input */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or enter image URL
                </label>
                <input
                  type="url"
                  name="imageURL"
                  value={formData.imageURL}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Sizes *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {availableSizes.map((size) => (
                  <label key={size} className="flex items-center">
                    <input
                      type="checkbox"
                      value={size}
                      checked={formData.sizes.includes(size)}
                      onChange={handleSizeChange}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">{size}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary px-6 py-2"
              >
                Cancel
              </button>
              {uploadController && (
                <button
                  type="button"
                  onClick={() => {
                    try {
                      uploadController.abort()
                    } catch (err) {
                      console.warn('Abort failed', err)
                    }
                    setUploadController(null)
                    setImageUploadProgress(0)
                  }}
                  className="btn-secondary px-4 py-2 bg-primary-50 text-primary-900"
                >
                  Cancel Upload
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-6 py-2 disabled:opacity-50"
              >
                {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminProducts
