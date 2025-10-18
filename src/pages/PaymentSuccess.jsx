import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { paymentAPI } from '../services/api'
import { useCart } from '../contexts/CartContext'
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react'
import toast from 'react-hot-toast'

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { clearCart } = useCart()
  const [verifying, setVerifying] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState(null)
  const [transactionId, setTransactionId] = useState(null)
  const orderId = searchParams.get('order_id')
  const mode = searchParams.get('mode')

  useEffect(() => {
    // If the query contains verified flag, respect it and avoid re-verification
    const verifiedFlag = searchParams.get('verified')
    if (verifiedFlag === 'true') {
      setPaymentStatus('success')
      clearCart()
      setVerifying(false)
      return
    }

    if (verifiedFlag === 'false') {
      setPaymentStatus('failed')
      setVerifying(false)
      return
    }

    // If Razorpay returned params in the URL after redirect, use them to verify
    const rzpOrderId = searchParams.get('razorpay_order_id')
    const rzpPaymentId = searchParams.get('razorpay_payment_id')
    const rzpSignature = searchParams.get('razorpay_signature')

    if (rzpOrderId && rzpPaymentId && rzpSignature && orderId) {
      // Call verify with razorpay params
      (async () => {
        try {
          setVerifying(true)
          const resp = await paymentAPI.verifyPayment({
            orderId,
            razorpay_order_id: rzpOrderId,
            razorpay_payment_id: rzpPaymentId,
            razorpay_signature: rzpSignature,
          })
          if (resp.data?.success) {
            setPaymentStatus('success')
            clearCart()
            toast.success('Payment verified')
          } else {
            setPaymentStatus('failed')
            toast.error(resp.data?.message || 'Verification failed')
          }
        } catch (err) {
          console.error('Payment verification error:', err)
          if (err.response) console.error('Server data:', err.response.data)
          setPaymentStatus('failed')
          toast.error('Payment verification failed')
        } finally {
          setVerifying(false)
        }
      })()
    } else if (orderId) {
      verifyPayment()
    } else {
      setVerifying(false)
      setPaymentStatus('error')
    }
  }, [orderId, mode])

  const verifyPayment = async () => {
    try {
      setVerifying(true)
      const response = await paymentAPI.verifyPayment({ orderId })
      
      if (response.data.success) {
        setPaymentStatus('success')
        clearCart()
        toast.success('Payment successful!')
      } else {
        setPaymentStatus('failed')
        toast.error('Payment verification failed')
      }
    } catch (error) {
      console.error('Payment verification error:', error)
      setPaymentStatus('error')
      toast.error('Payment verification failed')
    } finally {
      setVerifying(false)
    }
  }

  useEffect(() => {
    const statusParam = searchParams.get('status')
    const mih = searchParams.get('mihpayid')
    if (statusParam) setPaymentStatus(String(statusParam))
    if (mih) setTransactionId(mih)
  }, [searchParams])

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-charcoal-800 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-primary-900 mb-2">Verifying Payment</h2>
          <p className="text-primary-700">Please wait while we confirm your payment...</p>
        </div>
      </div>
    )
  }

  if (paymentStatus === 'error' || paymentStatus === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-100">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-charcoal-900" />
          </div>
          <h2 className="text-2xl font-bold text-charcoal-900 mb-4">Payment Failed</h2>
          <p className="text-primary-700 mb-6">
            We're sorry, but there was an issue processing your payment. Please try again.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/cart')}
              className="btn-primary w-full py-3"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn-secondary w-full py-3"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-100">
  <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-gold-500" />
        </div>

  <h1 className="text-3xl font-serif font-bold text-primary-900 mb-2">Payment Successful!</h1>
        {paymentStatus && (
          <div className="inline-block mt-2 mb-4 px-3 py-1 rounded-full bg-primary-50 text-primary-900 font-medium">
            {String(paymentStatus).toUpperCase()}
          </div>
        )}

  <p className="text-lg text-primary-700 mb-8">Thank you for your purchase. Your order has been confirmed and will be processed shortly.</p>

        {orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <p className="text-sm text-visible/80 mb-2">Order ID</p>
            <p className="font-mono text-lg font-semibold text-visible">
              #{orderId.slice(-8).toUpperCase()}
            </p>
          </div>
        )}

        {transactionId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-visible/80 mb-2">Transaction ID</p>
            <p className="font-mono text-sm font-semibold text-visible">{transactionId}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2 text-visible/80">
            <Package className="w-5 h-5" />
            <span>You will receive a confirmation email shortly</span>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-visible/80">
            <CheckCircle className="w-5 h-5" />
            <span>Your order will be shipped within 2-3 business days</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={() => navigate('/')}
            className="btn-primary flex-1 py-3 inline-flex items-center justify-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </button>
          <button
            onClick={() => navigate('/products')}
            className="btn-secondary flex-1 py-3 inline-flex items-center justify-center"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
