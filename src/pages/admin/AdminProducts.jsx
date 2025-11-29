import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import { Plus, Edit, Trash2, Search, Upload, Package } from 'lucide-react'
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

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getAllProducts({ limit: 50 })
      setProducts(response?.data?.data?.products || [])
    } catch (err) {
      console.error(err)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await adminAPI.deleteProduct(id)
      toast.success('Product deleted')
      fetchProducts()
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete')
    }
  }

  const handleEdit = (product) => { setEditingProduct(product); setShowModal(true) }
  const handleAddNew = () => { setEditingProduct(null); setShowModal(true) }

  const filteredProducts = products.filter(p => {
    const q = searchTerm.toLowerCase()
    const matchesSearch = p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  if (loading) return (<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-24 w-24 border-b-2 border-primary-800"/></div>)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-max section-padding py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-4">Manage Products</h1>
              <p className="text-lg text-gray-600">Add, edit, and manage your product inventory</p>
            </div>
            <button onClick={handleAddNew} className="btn-primary inline-flex items-center px-6 py-3"><Plus className="w-5 h-5 mr-2"/>Add Product</button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-white/10 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="text" placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="input-field pl-10" />
              </div>
            </div>
            <div className="md:w-48">
              <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="input-field">
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

        <div className="bg-white rounded-lg shadow-sm border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 flex-shrink-0">
                          <img src={p.imageURL || p.media?.[0]?.url} alt={p.name} className="w-full h-full object-cover rounded-lg" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{p.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{p.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">{p.category}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(p.price)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`${pillClass()} ${getStatusColor(p.status)}`}>{p.status}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => handleEdit(p)} className="text-primary-600 hover:text-primary-900 p-1"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(p._id)} className="text-charcoal-900 hover:text-charcoal-700 p-1"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">{searchTerm || categoryFilter !== 'all' ? 'Try adjusting your search or filter criteria' : 'Get started by adding your first product'}</p>
            <button onClick={handleAddNew} className="btn-primary inline-flex items-center px-6 py-3"><Plus className="w-5 h-5 mr-2"/> Add Product</button>
          </div>
        )}

        {showModal && (
          <ProductModal product={editingProduct} onClose={() => { setShowModal(false); setEditingProduct(null) }} onSave={() => { setShowModal(false); setEditingProduct(null); fetchProducts() }} />
        )}
      </div>
    </div>
  )
}

const ProductModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || 'Tops',
    sizes: product?.sizes || [],
    stock: product?.stock || 0,
  })
  const [loading, setLoading] = useState(false)
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState(product?.media?.map(m => m.url) || [])
  const [formErrors, setFormErrors] = useState([])

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSizeChange = (e) => {
    const val = e.target.value
    setFormData(prev => {
      const has = prev.sizes.includes(val)
      return { ...prev, sizes: has ? prev.sizes.filter(s => s !== val) : [...prev.sizes, val] }
    })
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const newPreviews = files.map(f => URL.createObjectURL(f))
    setImageFiles(prev => [...prev, ...files])
    setImagePreviews(prev => [...prev, ...newPreviews])
  }

  const handleRemoveImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
    setImageFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleAddImageUrl = (url) => {
    if (!url) return
    setImagePreviews(prev => [...prev, url])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormErrors([])
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('name', formData.name)
      fd.append('description', formData.description)
      fd.append('price', String(formData.price))
      fd.append('category', formData.category)
      fd.append('stock', String(formData.stock))
      fd.append('sizes', JSON.stringify(formData.sizes || []))
      imageFiles.forEach(file => fd.append('media', file))

      if (product && product._id) {
        await adminAPI.updateProduct(product._id, fd)
        toast.success('Product updated successfully')
      } else {
        await adminAPI.createProduct(fd)
        toast.success('Product created successfully')
      }
      onSave()
    } catch (err) {
      console.error('Failed to save product', err)
      const resp = err.response?.data
      if (resp?.errors && Array.isArray(resp.errors)) {
        setFormErrors(resp.errors)
        resp.errors.slice(0,3).forEach(m => toast.error(m))
      } else if (resp?.message) {
        setFormErrors([resp.message])
        toast.error(resp.message)
      } else {
        toast.error('Failed to save product')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10 relative">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{product ? 'Edit Product' : 'Add New Product'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 absolute top-4 right-4" style={{ zIndex: 10 }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {formErrors.length > 0 && (
              <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700 space-y-1">
                {formErrors.map((err, idx) => <div key={idx}>• {err}</div>)}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="input-field" placeholder="Enter product name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                <input type="number" name="price" required min="0" step="0.01" value={formData.price} onChange={handleChange} className="input-field" placeholder="Enter price" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea name="description" required rows={3} value={formData.description} onChange={handleChange} className="input-field" placeholder="Enter product description" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select name="category" required value={formData.category} onChange={handleChange} className="input-field">
                  <option value="Tops">Tops</option>
                  <option value="Bottoms">Bottoms</option>
                  <option value="Dresses">Dresses</option>
                  <option value="Outerwear">Outerwear</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Shoes">Shoes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                <input type="number" name="stock" required min="0" value={formData.stock} onChange={handleChange} className="input-field" placeholder="Enter stock quantity" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Images/Videos</label>
              {imagePreviews.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {imagePreviews.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img src={img} alt={`Product preview ${idx+1}`} className="w-24 h-24 object-cover rounded-lg border border-gray-200" />
                      <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-xs text-red-600 group-hover:opacity-100 opacity-0 transition-opacity">✕</button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF, MP4 up to 5MB each</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*,video/*" multiple onChange={handleImageChange} />
                </label>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Or enter image URLs (comma or new line separated)</label>
                <textarea className="input-field" placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" rows={2} onBlur={e => {
                  const urls = e.target.value.split(/[,\n]/).map(u => u.trim()).filter(Boolean)
                  urls.forEach(handleAddImageUrl)
                }} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes *</label>
              <div className="grid grid-cols-4 gap-2">
                {availableSizes.map(size => (
                  <label key={size} className="flex items-center">
                    <input type="checkbox" value={size} checked={formData.sizes.includes(size)} onChange={handleSizeChange} className="mr-2" />
                    <span className="text-sm text-gray-700">{size}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button type="button" onClick={onClose} className="btn-secondary px-6 py-2">Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary px-6 py-2 disabled:opacity-50">{loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminProducts
