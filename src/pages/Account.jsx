import { useEffect, useState } from 'react'
import formatCurrency from '../utils/formatCurrency'
import { useAuth } from '../contexts/AuthContext'
import { ordersAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'

const formatDate = (iso) => {
  try { return new Date(iso).toLocaleString() } catch (e) { return iso }
}

const Account = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await ordersAPI.getUserOrders()
      setOrders(res.data.data || [])
    } catch (err) {
      console.error('Failed to fetch orders for account', err)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-max section-padding py-8">
  <h1 className="text-3xl font-serif font-bold text-visible mb-6">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4 text-visible">Profile</h2>
            <p className="text-sm text-visible/80 mb-2"><strong>Name:</strong> {user?.name}</p>
            <p className="text-sm text-visible/80 mb-2"><strong>Email:</strong> {user?.email}</p>
            <button onClick={() => navigate('/orders')} className="btn-primary mt-4">View All Orders</button>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4 text-visible">My Orders</h2>
              {loading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800" />
              ) : orders.length ? (
                <div className="space-y-4">
                  {orders.map(o => (
                    <div key={o._id} className="p-4 border rounded">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="text-sm text-visible/70">Order</p>
                          <p className="font-mono font-semibold text-visible">#{o._id.slice(-8).toUpperCase()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-visible/70">Placed</p>
                          <p className="font-medium text-visible">{formatDate(o.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-visible/90">Items: {o.products.length}</p>
                        <p className="text-sm font-semibold text-visible">{formatCurrency(o.totalAmount)}</p>
                        <button onClick={() => navigate(`/orders?order=${o._id}`)} className="text-sm text-primary-800">View</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">You have no orders yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account
