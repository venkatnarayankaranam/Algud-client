import { useEffect, useState } from 'react'
import { ordersAPI } from '../services/api'
import formatCurrency from '../utils/formatCurrency'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

// Lightweight local date formatter to avoid adding date-fns as a dependency
const formatDate = (iso) => {
  try {
    const d = new Date(iso)
    return d.toLocaleString()
  } catch (e) {
    return iso
  }
}

const statusSteps = ['Pending', 'Processing', 'Shipped', 'Delivered']

const Orders = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await ordersAPI.getUserOrders()
      setOrders(res.data.data)
    } catch (err) {
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-charcoal-800" />
      </div>
    )
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-primary-900">No orders yet</h2>
          <p className="text-primary-700">Looks like you haven't placed any orders.</p>
          <button onClick={() => navigate('/products')} className="btn-primary mt-4">Shop Now</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-100">
      <div className="container-max section-padding py-8">
        <h1 className="text-3xl font-serif font-bold text-primary-900 mb-6">My Orders</h1>

        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-primary-700">Order ID</p>
                  <p className="font-mono font-semibold text-primary-900">#{order._id.slice(-8).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-primary-700">Placed</p>
                  <p className="font-medium text-primary-900">{formatDate(order.createdAt)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-2 text-primary-900">Items</h3>
                  <div className="space-y-2">
                    {order.products.map(item => (
                      <div key={`${item.productId?._id || item.productId}-${item.size || ''}`} className="flex items-center space-x-3">
                        <div className="w-14 h-14 flex-shrink-0">
                          <img src={item.imageURL || item.productId?.imageURL} alt={item.productId?.name || ''} className="w-full h-full object-cover rounded" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate text-primary-900">{item.name || item.productId?.name}</p>
                          <p className="text-xs text-primary-700">Qty: {item.quantity} • Price: {formatCurrency(item.price)}</p>
                        </div>
                        <div className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-primary-900">Status</h3>
                  <OrderStatusBadge status={order.orderStatus} paymentStatus={order.paymentStatus} />
                  <div className="mt-4">
                    <p className="text-sm text-primary-700">Total</p>
                    <p className="font-semibold text-lg text-primary-900">{formatCurrency(order.totalAmount)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const OrderStatusBadge = ({ status, paymentStatus }) => {
  const idx = statusSteps.indexOf(status)
  return (
    <div>
      <div className="flex items-center space-x-2">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${paymentStatus === 'Paid' ? 'bg-primary-50 text-primary-900' : 'bg-primary-50 text-charcoal-900'}`}>
          {paymentStatus}
        </span>
        <span className="text-sm text-primary-700">•</span>
        <span className="text-sm text-primary-900">{status}</span>
      </div>

      <div className="mt-3">
        <div className="w-full bg-primary-50 h-2 rounded">
          <div className="h-2 rounded bg-charcoal-900" style={{ width: `${Math.max(0, (idx + 1) / statusSteps.length * 100)}%` }} />
        </div>
        <div className="flex justify-between text-xs text-primary-700 mt-2">
          {statusSteps.map(s => <span key={s}>{s}</span>)}
        </div>
      </div>
    </div>
  )
}

export default Orders
