import { useState } from 'react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { ordersAPI, paymentAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { CreditCard, MapPin, User, Phone, Mail, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

const Checkout = () => {
  const { items, totalAmount, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [rzpLoading, setRzpLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('online')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      // Create order
      const orderData = {
        products: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          phone: formData.phone
        }
      }

      // Include payment method when creating the order
      const orderResponse = await ordersAPI.createOrder({ ...orderData, paymentMethod })
      const order = orderResponse.data.data

      // Only online payments supported -> continue with payment session

      // Create Razorpay order on the server
      const paymentData = {
        orderId: order._id,
        customerDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        }
      }

      const paymentResponse = await paymentAPI.createPayment(paymentData)
      console.debug('paymentResponse', paymentResponse)
      if (!paymentResponse.data || paymentResponse.data.success === false) {
        throw new Error(paymentResponse.data?.message || 'Payment gateway did not return an order. Ensure Razorpay is configured on the server.')
      }
      const payment = paymentResponse.data.data

      if (!payment || !payment.razorpay_order_id) {
        throw new Error('Payment gateway did not return an order. Ensure Razorpay is configured on the server.')
      }

      // Load Razorpay script if not already present
      const loadRazorpay = () => new Promise((resolve, reject) => {
        if (document.getElementById('razorpay-sdk')) return resolve()
        const script = document.createElement('script')
        script.id = 'razorpay-sdk'
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = resolve
        script.onerror = reject
        document.body.appendChild(script)
      })

      await loadRazorpay()

      const options = {
        key: payment.key_id,
        amount: payment.razorpay_amount,
        currency: payment.currency || 'INR',
        name: 'ALGUD',
        description: `Order ${order._id}`,
        order_id: payment.razorpay_order_id,
        handler: async function (response) {
          // On success, verify signature on the server
          try {
            setRzpLoading(true)
            const verifyResp = await paymentAPI.verifyPayment({
              orderId: order._id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            })

            if (verifyResp.data.success) {
              toast.success('Payment successful')
              clearCart()
              // include verified=true so the PaymentSuccess page does not re-run verification
              navigate(`/payment/success?order_id=${order._id}&status=success&verified=true`)
            } else {
              toast.error(verifyResp.data.message || 'Payment verification failed')
              navigate(`/payment/success?order_id=${order._id}&status=failed&verified=false`)
            }
          } catch (err) {
            console.error('Payment verification error:', err)
            // Print server response body if present
            if (err.response) {
              console.error('Server status:', err.response.status)
              console.error('Server data:', err.response.data)
            }
            toast.error('Payment verification failed')
            navigate(`/payment/success?order_id=${order._id}&status=failed&verified=false`)
          } finally {
            setRzpLoading(false)
          }
        },
        prefill: {
          name: payment.customer.name,
          email: payment.customer.email,
          contact: payment.customer.contact,
        },
    theme: { color: '#000000' },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
      return

    } catch (error) {
      console.error('Checkout error:', error)
      toast.error(error.response?.data?.message || 'Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  const tax = totalAmount * 0.08
  const total = totalAmount + tax

  // No COD flow: always use online payment flow

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-max section-padding py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center text-visible/80 hover:text-visible mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </button>
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-visible mb-4">
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-8">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <MapPin className="w-5 h-5 text-primary-800 mr-2" />
                <h2 className="text-xl font-semibold text-visible">Shipping Information</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-visible/80 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-visible/80 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-visible/80 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-visible/80 mb-1">
                    Street Address *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="input-field"
                    placeholder="Enter your street address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-visible/80 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-visible/80 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter state"
                    />
                  </div>
                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-visible/80 mb-1">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      required
                      value={formData.pincode}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter ZIP code"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <CreditCard className="w-5 h-5 text-primary-800 mr-2" />
                <h2 className="text-xl font-semibold text-visible">Payment Method</h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-visible/80">
                  You will be redirected to our secure payment gateway to complete your purchase
                </p>
                <div className="mt-4 text-left">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={() => setPaymentMethod('online')}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-visible">Pay Online (Card / UPI)</span>
                  </label>
                </div>
                <div className="flex items-center justify-center mt-4 space-x-4">
                  <div className="bg-charcoal-800 text-white px-3 py-1 rounded text-sm font-medium">
                    Credit Card
                  </div>
                  <div className="bg-charcoal-700 text-white px-3 py-1 rounded text-sm font-medium">
                    Debit Card
                  </div>
                  <div className="bg-charcoal-600 text-white px-3 py-1 rounded text-sm font-medium">
                    UPI
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-visible mb-4">Order Summary</h3>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="flex items-center space-x-3">
                    <div className="w-12 h-12 flex-shrink-0">
                      <img
                        src={item.imageURL}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-visible truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-visible/80">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                    </div>
                      <p className="text-sm font-medium text-visible">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-visible mb-4">Order Total</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-visible/80">Subtotal</span>
                  <span className="font-medium">₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-visible/80">Shipping</span>
                  <span className="font-medium text-primary-700">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-visible/80">Tax</span>
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || items.length === 0}
                className="btn-primary w-full py-4 text-lg font-medium mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Complete Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
