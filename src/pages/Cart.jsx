import { useCart } from '../contexts/CartContext'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import formatCurrency from '../utils/formatCurrency'
import toast from 'react-hot-toast'

const Cart = () => {
  const { items, totalItems, totalAmount, updateQuantity, removeFromCart, clearCart } = useCart()
  const navigate = useNavigate()

  const handleQuantityChange = (productId, size, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, size)
      toast.success('Item removed from cart')
    } else {
      updateQuantity(productId, size, newQuantity)
    }
  }

  const handleRemoveItem = (productId, size) => {
    removeFromCart(productId, size)
    toast.success('Item removed from cart')
  }

  const handleClearCart = () => {
    clearCart()
    toast.success('Cart cleared')
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <ShoppingBag className="w-24 h-24 text-primary-300 mx-auto mb-6" />
            <h2 className="text-3xl font-serif font-bold text-primary-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-lg text-primary-700 mb-8">
              Looks like you haven't added any items to your cart yet
            </p>
            <button
              onClick={() => navigate('/products')}
              className="btn-primary inline-flex items-center px-8 py-3"
            >
              Start Shopping
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

    return (
    <div className="min-h-screen bg-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-primary-900 mb-2 sm:mb-4">
            Shopping Cart
          </h1>
          <p className="text-base sm:text-lg text-primary-700">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem
                key={`${item.productId}-${item.size}`}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
              />
            ))}

            {/* Clear Cart Button */}
            <div className="pt-4 border-t border-primary-200">
              <button
                onClick={handleClearCart}
                className="text-charcoal-900 hover:text-gold-500 font-medium transition-colors duration-200"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-primary-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-primary-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-primary-700">Subtotal ({totalItems} items)</span>
                  <span className="font-medium">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-primary-700">Shipping</span>
                  <span className="font-medium text-primary-700">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-primary-700">Tax</span>
                  <span className="font-medium">{formatCurrency(totalAmount * 0.08)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(totalAmount * 1.08)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="btn-primary w-full py-4 text-lg font-medium mb-4"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/products')}
                className="btn-secondary w-full py-3"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Cart Item Component
const CartItem = ({ item, onQuantityChange, onRemove }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        {/* Product Image */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
          <img
            src={item.imageURL}
            alt={item.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0 w-full sm:w-auto">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
            {item.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
            Size: {item.size}
          </p>
          <p className="text-base sm:text-lg font-bold text-primary-800">
            {formatCurrency(item.price)}
          </p>
        </div>

        {/* Quantity Controls and Actions */}
        <div className="flex items-center justify-between w-full sm:w-auto space-x-3">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => onQuantityChange(item.productId, item.size, item.quantity - 1)}
              className="p-1.5 sm:p-2 hover:bg-gray-50"
            >
              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <span className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => onQuantityChange(item.productId, item.size, item.quantity + 1)}
              className="p-1.5 sm:p-2 hover:bg-gray-50"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => onRemove(item.productId, item.size)}
            className="p-1.5 sm:p-2 text-charcoal-900 hover:text-gold-500 hover:bg-primary-50 rounded-lg transition-colors duration-150"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Item Total */}
        <div className="text-right sm:text-left w-full sm:w-auto">
          <p className="text-base sm:text-lg font-semibold text-gray-900">
            {formatCurrency(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Cart
