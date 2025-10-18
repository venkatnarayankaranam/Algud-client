import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

const initialState = {
  items: [],
  totalItems: 0,
  totalAmount: 0
}
initialState.lastAction = null

const computeTotals = (items) => {
  const totalItems = items.reduce((sum, it) => sum + (it.quantity || 0), 0)
  const totalAmount = items.reduce((sum, it) => sum + ((it.price || 0) * (it.quantity || 0)), 0)
  return { totalItems, totalAmount }
}

const init = () => {
  try {
    const raw = localStorage.getItem('cart')
    if (!raw) return initialState
  const parsed = JSON.parse(raw)
    // Ensure structure and totals are correct
    const items = Array.isArray(parsed.items) ? parsed.items : []
    const totals = computeTotals(items)
    // preserve lastAction if present in storage
    return { items, ...totals, lastAction: parsed.lastAction || null }
  } catch (err) {
    console.warn('Failed to load cart from localStorage:', err)
    return initialState
  }
}

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(
        item => item.productId === action.payload.productId && item.size === action.payload.size
      )

      let newItems
      if (existingItem) {
        newItems = state.items.map(item =>
          item.productId === action.payload.productId && item.size === action.payload.size
            ? { ...item, quantity: (item.quantity || 0) + (action.payload.quantity || 0) }
            : item
        )
      } else {
        newItems = [...state.items, action.payload]
      }

      const totals = computeTotals(newItems)
      return { items: newItems, ...totals, lastAction: action.type }
    }

    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(
        item => !(item.productId === action.payload.productId && item.size === action.payload.size)
      )
      const totals = computeTotals(newItems)
      return { items: newItems, ...totals, lastAction: action.type }
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.productId === action.payload.productId && item.size === action.payload.size
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(i => (i.quantity || 0) > 0)
      const totals = computeTotals(newItems)
      return { items: newItems, ...totals, lastAction: action.type }
    }

    case 'CLEAR_CART':
      return { items: [], totalItems: 0, totalAmount: 0, lastAction: action.type }

    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, init)

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      // Avoid overwriting an existing non-empty stored cart with an empty state
      const prevRaw = localStorage.getItem('cart')
      if (state.items.length === 0 && prevRaw) {
        try {
          const prev = JSON.parse(prevRaw)
          const prevHasItems = Array.isArray(prev.items) && prev.items.length > 0
          // Only persist the empty state if the clear was intentional (CLEAR_CART)
          if (prevHasItems && state.lastAction !== 'CLEAR_CART') {
            return
          }
        } catch (err) {
          // fallthrough to overwrite if previous is malformed
        }
      }

      localStorage.setItem('cart', JSON.stringify(state))
    } catch (err) {
      console.warn('Failed to save cart to localStorage:', err)
    }
  }, [state])

  const addToCart = (product, size, quantity = 1) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        productId: product._id,
        name: product.name,
        price: product.price,
        imageURL: product.imageURL,
        size,
        quantity
      }
    })
  }

  const removeFromCart = (productId, size) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: { productId, size }
    })
  }

  const updateQuantity = (productId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size)
    } else {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { productId, size, quantity }
      })
    }
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
