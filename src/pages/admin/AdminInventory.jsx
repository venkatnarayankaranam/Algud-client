import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import { Package, Save, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react'
import { pillClass, getStatusColor } from './themeHelpers'
import toast from 'react-hot-toast'

const AdminInventory = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [inventoryUpdates, setInventoryUpdates] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getAllProducts({ limit: 100 })
      setProducts(response.data.data.products)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleStockChange = (productId, newStock) => {
    setInventoryUpdates(prev => ({
      ...prev,
      [productId]: parseInt(newStock) || 0
    }))
  }

  const handleBulkUpdate = async () => {
    const updates = Object.entries(inventoryUpdates).map(([productId, stock]) => ({
      productId,
      stock
    }))

    if (updates.length === 0) {
      toast.error('No changes to save')
      return
    }

    try {
      setSaving(true)
      await adminAPI.bulkUpdateInventory({ updates })
      toast.success('Inventory updated successfully')
      setInventoryUpdates({})
      fetchProducts()
    } catch (error) {
      console.error('Error updating inventory:', error)
      toast.error('Failed to update inventory')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setInventoryUpdates({})
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const hasChanges = Object.keys(inventoryUpdates).length > 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-charcoal-800"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-100">
      <div className="container-max section-padding py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-primary-900 mb-4">
            Inventory Management
          </h1>
          <p className="text-lg text-primary-700">
            Update product stock levels in bulk
          </p>
        </div>

        {/* Controls */}
  <div className="bg-white rounded-lg shadow-sm border border-white/10 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field"
                />
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
            
              <div className="flex gap-3">
              {hasChanges && (
                <button
                  onClick={handleReset}
                  className="btn-secondary inline-flex items-center px-4 py-2"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </button>
              )}
              <button
                onClick={handleBulkUpdate}
                disabled={!hasChanges || saving}
                className="btn-primary inline-flex items-center px-6 py-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
  <div className="bg-white rounded-lg shadow-sm border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-primary-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                    Product
                  </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                    Category
                  </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                    Current Stock
                  </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                    New Stock
                  </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
                <tbody className="bg-white divide-y divide-primary-200">
                {filteredProducts.map((product) => {
                  const currentStock = product.stock
                  const newStock = inventoryUpdates[product._id] !== undefined 
                    ? inventoryUpdates[product._id] 
                    : currentStock
                  const hasChanged = newStock !== currentStock
                  
                  return (
                    <tr key={product._id} className={`hover:bg-primary-50 ${hasChanged ? 'bg-primary-50' : ''}`}>
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
                              <div className="text-sm font-medium text-primary-900">
                              {product.name}
                            </div>
                              <div className="text-sm text-primary-700 truncate max-w-xs">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`${pillClass()} bg-gray-100 text-gray-800 border-gray-200`}>{product.category}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            <span className={`text-sm font-medium ${
                              currentStock === 0 ? 'text-charcoal-900' : 
                              currentStock < 10 ? 'text-primary-700' : 'text-primary-900'
                            }`}>
                            {currentStock}
                          </span>
                            {currentStock === 0 && (
                              <AlertTriangle className="w-4 h-4 text-charcoal-900 ml-2" />
                            )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          value={newStock}
                          onChange={(e) => handleStockChange(product._id, e.target.value)}
                            className={`w-20 px-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-charcoal-800 ${
                              hasChanged 
                                ? 'border-charcoal-900 bg-primary-50' 
                                : 'border-primary-200'
                            }`}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            {hasChanged ? (
                              <div className="flex items-center text-primary-900">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                <span className="text-xs font-medium">Modified</span>
                              </div>
                            ) : (
                              <span className={`${pillClass()} ${
                                currentStock === 0
                                  ? 'bg-red-100 text-red-800 border-red-200'
                                  : currentStock < 10
                                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                                  : 'bg-green-100 text-green-800 border-green-200'
                              }`}>
                                {currentStock === 0 ? 'Out of Stock' : 
                                 currentStock < 10 ? 'Low Stock' : 'In Stock'}
                              </span>
                            )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-primary-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-primary-900 mb-2">No products found</h3>
            <p className="text-primary-700">
              {searchTerm || categoryFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'No products available for inventory management'
              }
            </p>
          </div>
        )}

        {/* Summary */}
        {hasChanges && (
          <div className="mt-6 bg-primary-50 border border-primary-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-primary-900 mr-2" />
                <span className="text-sm font-medium text-primary-900">
                  {Object.keys(inventoryUpdates).length} product{Object.keys(inventoryUpdates).length !== 1 ? 's' : ''} modified
                </span>
              </div>
              <button
                onClick={handleBulkUpdate}
                disabled={saving}
                className="btn-primary text-sm px-4 py-2 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminInventory
