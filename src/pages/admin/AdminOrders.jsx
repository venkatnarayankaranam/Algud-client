import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import formatCurrency from '../../utils/formatCurrency'
import { Search, Filter, Eye, Edit, CheckCircle, XCircle } from 'lucide-react'
import { pillClass } from './themeHelpers'
import toast from 'react-hot-toast'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getAllOrders({ limit: 50 })
      // Only include orders with successful payments (paymentStatus === 'Paid')
      const allOrders = response?.data?.data?.orders || []
      const paidOrders = allOrders.filter(o => String(o.paymentStatus || '').toLowerCase() === 'paid')
      setOrders(paidOrders)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, { orderStatus: newStatus })
      toast.success('Order status updated successfully')
      fetchOrders()
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Failed to update order status')
    }
  }

  const handlePaymentUpdate = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, { paymentStatus: newStatus })
      toast.success('Payment status updated successfully')
      fetchOrders()
    } catch (error) {
      console.error('Error updating payment status:', error)
      toast.error('Failed to update payment status')
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter
    const method = order.paymentMethod || (order.paymentId ? 'online' : 'COD')
    const matchesMethod = paymentMethodFilter === 'all' || method === paymentMethodFilter
    return matchesSearch && matchesStatus && matchesPayment && matchesMethod
  })

  const getStatusColor = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800'
  const s = String(status).toLowerCase()
  // Use clear semantic colors: green for success/delivered, amber for pending/processing/shipped, red for cancelled
  if (s === 'delivered') return 'bg-green-100 text-green-800'
  if (s === 'pending' || s === 'processing' || s === 'shipped') return 'bg-amber-100 text-amber-800'
  if (s === 'cancelled' || s === 'canceled') return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
  }

  const getPaymentColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800'
    const s = String(status).toLowerCase()
    // Payment: Paid -> green, Pending -> amber, Failed -> red, Refunded -> blue/neutral
    if (s === 'paid') return 'bg-green-100 text-green-800'
    if (s === 'pending') return 'bg-amber-100 text-amber-800'
    if (s === 'failed') return 'bg-red-100 text-red-800'
    if (s === 'refunded') return 'bg-blue-100 text-blue-800'
    return 'bg-gray-100 text-gray-800'
  }

  // Modal state for viewing / editing a single order
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const viewOrderDetails = async (orderId) => {
    try {
      setModalLoading(true)
      const res = await adminAPI.getOrderDetails(orderId)
      setSelectedOrder(res.data.data)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to fetch order details', error)
      toast.error('Failed to fetch order details')
    } finally {
      setModalLoading(false)
    }
  }

  const openEditOrder = async (orderId) => {
    // Load details and enable edit mode
    await viewOrderDetails(orderId)
    setIsEditing(true)
  }

  const saveOrderEdits = async () => {
    if (!selectedOrder) return
    try {
      setModalLoading(true)
      const payload = {
        orderStatus: selectedOrder.orderStatus,
        paymentStatus: selectedOrder.paymentStatus
      }
      await adminAPI.updateOrderStatus(selectedOrder._id, payload)
      toast.success('Order updated')
      setIsEditing(false)
      // refresh table
      fetchOrders()
      // refresh modal with latest data
      await viewOrderDetails(selectedOrder._id)
    } catch (error) {
      console.error('Failed to update order', error)
      toast.error('Failed to update order')
    } finally {
      setModalLoading(false)
    }
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
      <div className="container-max section-padding py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-4">
            Manage Orders
          </h1>
          <p className="text-lg text-gray-600">
            View and manage customer orders and their status
          </p>
        </div>

        {/* Filters */}
  <div className="bg-white rounded-lg shadow-sm border border-white/10 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Payments</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
            <div>
              <select
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Methods</option>
                <option value="online">Online</option>
                <option value="COD">COD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
  <div className="bg-white rounded-lg shadow-sm border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order._id.slice(-8).toUpperCase()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.userId?.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.userId?.email || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.products.length} item{order.products.length !== 1 ? 's' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className={`text-xs font-medium rounded-full px-2 py-1 border-0 ${getStatusColor(order.orderStatus)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => handlePaymentUpdate(order._id, e.target.value)}
                        className={`text-xs font-medium rounded-full px-2 py-1 border-0 ${getPaymentColor(order.paymentStatus)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Failed">Failed</option>
                        <option value="Refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="text-sm text-gray-900">{order.paymentMethod || (order.paymentId ? 'online' : 'COD')}</div>
                      <div className={`text-sm inline-block mt-1 px-2 py-1 rounded ${getPaymentColor(order.paymentStatus)}`}>{order.paymentStatus || 'Pending'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => viewOrderDetails(order._id)}
                          className="text-primary-600 hover:text-primary-900 p-1"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditOrder(order._id)}
                          className="text-gray-600 hover:text-gray-900 p-1"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order details modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
            <div className="fixed inset-0 bg-black opacity-40" onClick={() => { if (!modalLoading) setSelectedOrder(null); setIsEditing(false); }} />
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl z-50 overflow-auto max-h-[80vh] border border-white/10">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-medium">Order Details</h3>
                <div className="flex items-center space-x-2">
                  <button onClick={() => { setSelectedOrder(null); setIsEditing(false); }} className="text-gray-600 hover:text-gray-900 p-2">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {modalLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold">Order</h4>
                        <p className="text-sm text-gray-600">#{selectedOrder._id}</p>
                        <p className="text-sm text-gray-600">Placed: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                        <p className="mt-2 text-sm"><strong>Customer:</strong> {selectedOrder.userId?.name || 'N/A'} ({selectedOrder.userId?.email || 'N/A'})</p>
                      </div>

                      <div>
                        <h4 className="font-semibold">Shipping Address</h4>
                        <div className="text-sm text-gray-600">
                          <p>{selectedOrder.shippingAddress?.name}</p>
                          <p>{selectedOrder.shippingAddress?.address}</p>
                          <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}</p>
                          <p>Phone: {selectedOrder.shippingAddress?.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mt-4">Items</h4>
                      <div className="space-y-3 mt-2">
                        {selectedOrder.products.map((p, idx) => (
                          <div key={idx} className="flex items-center space-x-4 border rounded p-3">
                            <img src={p.productId?.imageURL || '/placeholder.png'} alt={p.productId?.name || 'Product image'} className="w-20 h-20 object-cover rounded" />
                            <div className="flex-1">
                              <div className="font-medium">{p.productId?.name || 'Product'}</div>
                              <div className="text-sm text-gray-500">Qty: {p.quantity} × {formatCurrency(p.price)}</div>
                            </div>
                            <div className="text-sm font-medium">{formatCurrency(p.price * p.quantity)}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <h4 className="font-semibold">Payment</h4>
                        <div className="mt-2">
                          {isEditing ? (
                            <select value={selectedOrder.paymentStatus} onChange={(e) => setSelectedOrder({...selectedOrder, paymentStatus: e.target.value})} className="input-field">
                              <option value="Pending">Pending</option>
                              <option value="Paid">Paid</option>
                              <option value="Failed">Failed</option>
                              <option value="Refunded">Refunded</option>
                            </select>
                          ) : (
                            <span className={`${pillClass()} ${getPaymentColor(selectedOrder.paymentStatus)}`}>{selectedOrder.paymentStatus}</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold">Order Status</h4>
                        <div className="mt-2">
                          {isEditing ? (
                            <select value={selectedOrder.orderStatus} onChange={(e) => setSelectedOrder({...selectedOrder, orderStatus: e.target.value})} className="input-field">
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          ) : (
                            <span className={`${pillClass()} ${getStatusColor(selectedOrder.orderStatus)}`}>{selectedOrder.orderStatus}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <div className="text-lg font-semibold">Total: {formatCurrency(selectedOrder.totalAmount)}</div>
                      <div className="space-x-2">
                        {isEditing ? (
                          <>
                            <button onClick={saveOrderEdits} className="btn-primary px-4 py-2">Save</button>
                            <button onClick={() => { setIsEditing(false); fetchOrders(); }} className="px-4 py-2 border rounded">Cancel</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => setIsEditing(true)} className="px-4 py-2 border rounded">Edit</button>
                            <button onClick={() => { setSelectedOrder(null); }} className="px-4 py-2 border rounded">Close</button>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || paymentFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Orders will appear here when customers make purchases'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOrders
