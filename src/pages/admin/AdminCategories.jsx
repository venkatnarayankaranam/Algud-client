import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import { Plus, Edit, Trash2, Package, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  // Demo/sample categories to preview the design without backend changes
  const sampleCategories = [
    { name: 'Tops', productCount: 24, outOfStockCount: 2, description: 'Shirts, blouses, tees & more' },
    { name: 'Dresses', productCount: 18, outOfStockCount: 1, description: 'Casual and formal dresses' },
    { name: 'Bottoms', productCount: 12, outOfStockCount: 0, description: 'Jeans, skirts, trousers' },
    { name: 'Outerwear', productCount: 6, outOfStockCount: 1, description: 'Jackets, coats, blazers' },
    { name: 'Accessories', productCount: 30, outOfStockCount: 4, description: 'Bags, belts, hats' },
    { name: 'Footwear', productCount: 10, outOfStockCount: 0, description: 'Shoes & sandals' }
  ]

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getCategories()
      setCategories(response.data.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setShowModal(true)
  }

  const handleAddNew = () => {
    setEditingCategory(null)
    setShowModal(true)
  }

  const loadDemoCategories = () => {
    setCategories(sampleCategories)
  }

  const handleLocalDelete = (name) => {
    if (!confirm(`Delete category "${name}" locally? This does not affect server data.`)) return
    setCategories(prev => prev.filter(c => c.name !== name))
    toast.success('Category removed locally')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-800"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-100">
      <div className="container-max section-padding py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-primary-900 mb-4">
                Category Management
              </h1>
              <p className="text-lg text-primary-700">
                Manage product categories and view inventory status
              </p>
            </div>
            <button
              onClick={handleAddNew}
              className="btn-primary inline-flex items-center px-6 py-3"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Category
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="w-full max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-4 w-full"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3 ml-4">
            <button onClick={loadDemoCategories} className="btn-secondary px-4 py-2">Load Demo</button>
            <button
              onClick={handleAddNew}
              className="btn-primary inline-flex items-center px-6 py-3"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Category
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((category) => {
            const available = Math.max(0, (category.productCount || 0) - (category.outOfStockCount || 0))
            const percent = category.productCount ? Math.round((available / category.productCount) * 100) : 100
            return (
              <div key={category.name} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 transform hover:-translate-y-1 transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-200 to-primary-400 rounded-xl flex items-center justify-center mr-4">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.description || 'Category'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleEdit(category)} className="text-primary-600 hover:text-primary-900 p-2"><Edit className="w-4 h-4" /></button>
                    <button onClick={async () => {
                      if (category._id) {
                        if (!confirm(`Delete category "${category.name}"? This action cannot be undone.`)) return
                        try {
                          await adminAPI.deleteCategory(category._id)
                          toast.success('Category deleted')
                          fetchCategories()
                        } catch (err) {
                          console.error('Failed to delete category', err)
                          toast.error('Failed to delete category')
                        }
                      } else {
                        handleLocalDelete(category.name)
                      }
                    }} className="text-charcoal-900 hover:text-red-700 p-2"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Products</span>
                    <span className="text-lg font-semibold text-gray-900">{category.productCount || 0}</span>
                  </div>

                  <div>
                    <div className="w-full bg-primary-50 rounded-full h-3 overflow-hidden">
                      <div className="h-3 bg-charcoal-900" style={{ width: `${percent}%` }} />
                    </div>
                    <div className="flex justify-between items-center mt-2 text-sm text-primary-700">
                      <div>Available: <span className="font-medium text-primary-900">{available}</span></div>
                      <div>Out: <span className="font-medium text-charcoal-900">{category.outOfStockCount || 0}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-500 mb-4">
              Categories will appear here when products are added
            </p>
            <button
              onClick={handleAddNew}
              className="btn-primary inline-flex items-center px-6 py-3"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Category
            </button>
          </div>
        )}

        {/* Category Modal */}
        {showModal && (
          <CategoryModal
            category={editingCategory}
            onClose={() => {
              setShowModal(false)
              setEditingCategory(null)
            }}
            onSave={() => {
              setShowModal(false)
              setEditingCategory(null)
              fetchCategories()
            }}
          />
        )}
      </div>
    </div>
  )
}

// Category Modal Component
const CategoryModal = ({ category, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (category && category._id) {
        // Update existing
        await adminAPI.updateCategory(category._id, formData)
        toast.success('Category updated')
      } else {
        // Create new
        await adminAPI.createCategory(formData)
        toast.success('Category created')
      }
      onSave()
    } catch (error) {
      console.error('Error saving category:', error)
      toast.error('Failed to save category')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {category ? 'Edit Category' : 'Add New Category'}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter category name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter category description"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary px-6 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-6 py-2 disabled:opacity-50"
              >
                {loading ? 'Saving...' : (category ? 'Update Category' : 'Create Category')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminCategories
