// import { createContext, useContext, useReducer, useEffect, useRef } from 'react'
// import { authAPI } from '../services/api'

// const AuthContext = createContext()

// const initialState = {
//   user: null,
//   isAuthenticated: false,
//   loading: true
// }

// const authReducer = (state, action) => {
//   switch (action.type) {
//     case 'LOGIN_SUCCESS':
//     case 'REGISTER_SUCCESS':
//       return {
//         ...state,
//         user: action.payload.user,
//         isAuthenticated: true,
//         loading: false
//       }
//     case 'LOGOUT':
//       return {
//         ...state,
//         user: null,
//         isAuthenticated: false,
//         loading: false
//       }
//     case 'AUTH_ERROR':
//       return {
//         ...state,
//         user: null,
//         isAuthenticated: false,
//         loading: false
//       }
//     case 'USER_LOADED':
//       return {
//         ...state,
//         user: action.payload,
//         isAuthenticated: true,
//         loading: false
//       }
//     case 'SET_LOADING':
//       return {
//         ...state,
//         loading: action.payload
//       }
//     default:
//       return state
//   }
// }

// export const AuthProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(authReducer, initialState)
//   const triedLoadRef = useRef(false)

//   // Load user on app start (once). We cannot check for httpOnly cookie from JS,
//   // so always attempt a single /auth/me. If 401, we simply clear loading.
//   useEffect(() => {
//     if (triedLoadRef.current) return
//     triedLoadRef.current = true
//     loadUser().catch(() => dispatch({ type: 'SET_LOADING', payload: false }))
//   }, [])

//   const loadUser = async () => {
//     try {
//       const response = await authAPI.getMe()
//       dispatch({
//         type: 'USER_LOADED',
//         payload: response.data.data
//       })
//     } catch (error) {
//       dispatch({ type: 'AUTH_ERROR' })
//     }
//   }

//   const login = async (email, password) => {
//     try {
//       const response = await authAPI.login({ email, password })
//       // Normalize payload to match reducer expectations: { user, token }
//       // Persist token so api helper can attach Authorization header on subsequent requests
//       try { localStorage.setItem('token', response.data.data.token) } catch (e) {}
//       dispatch({
//         type: 'LOGIN_SUCCESS',
//         payload: { user: response.data.data, token: response.data.data.token }
//       })
//       return { success: true, data: response.data.data }
//     } catch (error) {
//       return {
//         success: false,
//         message: error.response?.data?.message || 'Login failed'
//       }
//     }
//   }

//   const register = async (name, email, password) => {
//     try {
//       const response = await authAPI.register({ name, email, password })
//       // Normalize payload to match reducer expectations: { user, token }
//       // Persist token
//       try { localStorage.setItem('token', response.data.data.token) } catch (e) {}
//       dispatch({
//         type: 'REGISTER_SUCCESS',
//         payload: { user: response.data.data, token: response.data.data.token }
//       })
//       return { success: true, data: response.data.data }
//     } catch (error) {
//       return {
//         success: false,
//         message: error.response?.data?.message || 'Registration failed'
//       }
//     }
//   }

//   const logout = () => {
//     try {
//       authAPI.logout().catch(() => {})
//     } catch (e) {
//       console.warn('Logout request failed', e)
//     }
//     try { localStorage.removeItem('token') } catch (e) {}
//     dispatch({ type: 'LOGOUT' })
//   }

//   const googleSignIn = async (idToken) => {
//     try {
//       const response = await authAPI.googleAuth({ idToken })
//       // Server sets httpOnly cookie; loadUser will fetch user info
//       // If server also returned a token in payload, persist it for header-based requests
//       try { if (response?.data?.data?.token) localStorage.setItem('token', response.data.data.token) } catch (e) {}
//       await loadUser()
//       return { success: true, data: response.data.data }
//     } catch (error) {
//       return { success: false, message: error.response?.data?.message || 'Google auth failed' }
//     }
//   }

//   const value = {
//     ...state,
//     login,
//     register,
//     logout,
//     googleSignIn,
//     loadUser
//   }

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }
import { createContext, useContext, useReducer, useEffect, useRef } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return { ...state, user: action.payload, isAuthenticated: true, loading: false }
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return { ...state, user: action.payload, isAuthenticated: true, loading: false }
    case 'LOGOUT':
    case 'AUTH_ERROR':
      return { ...state, user: null, isAuthenticated: false, loading: false }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const triedLoadRef = useRef(false)

  useEffect(() => {
    if (triedLoadRef.current) return
    triedLoadRef.current = true
    loadUser().catch(() => dispatch({ type: 'SET_LOADING', payload: false }))
  }, [])

  const loadUser = async () => {
    try {
      const response = await authAPI.getMe()
      dispatch({ type: 'USER_LOADED', payload: response.data.data })
    } catch {
      dispatch({ type: 'AUTH_ERROR' })
    }
  }

  const login = async (email, password) => {
    try {
      await authAPI.login({ email, password })
      await loadUser()   // ✅ Fetch user from httpOnly cookie
      return { success: true }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' }
    }
  }

  const register = async (name, email, password) => {
    try {
      await authAPI.register({ name, email, password })
      await loadUser()   // ✅ Fetch user after register
      return { success: true }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' }
    }
  }

  const googleSignIn = () => {
    // Always use relative path so production uses Vercel rewrite (/api -> Render)
    window.location.href = '/api/auth/google'
  }

  const logout = () => {
    authAPI.logout().catch(() => {})
    dispatch({ type: 'LOGOUT' })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    googleSignIn,
    loadUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)