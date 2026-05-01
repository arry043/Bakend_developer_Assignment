import { createContext, useReducer, useEffect } from 'react'
import * as authApi from '../api/auth.api'
import { getToken, setToken, setUser, clearAuth, getUser } from '../utils/storage'

export const AuthContext = createContext(null)

const initialState = {
  user: getUser(),
  isAuthenticated: !!getToken(),
  isLoading: true, // initial load check
  error: null
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, error: null }
    case 'AUTH_SUCCESS':
      return { 
        ...state, 
        user: action.payload.user, 
        isAuthenticated: true, 
        isLoading: false,
        error: null
      }
    case 'AUTH_ERROR':
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: action.payload 
      }
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: null
      }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken()
      if (token) {
        try {
          const res = await authApi.getMe()
          setUser(res.data.user)
          dispatch({ type: 'AUTH_SUCCESS', payload: { user: res.data.user } })
        } catch (err) {
          clearAuth()
          dispatch({ type: 'AUTH_ERROR', payload: null })
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    initializeAuth()
  }, [])

  const login = async (credentials) => {
    dispatch({ type: 'AUTH_START' })
    try {
      const res = await authApi.login(credentials)
      setToken(res.data.accessToken)
      setUser(res.data.user)
      dispatch({ type: 'AUTH_SUCCESS', payload: { user: res.data.user } })
      return res
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error.message })
      throw error
    }
  }

  const registerUser = async (data) => {
    dispatch({ type: 'AUTH_START' })
    try {
      const res = await authApi.register(data)
      dispatch({ type: 'SET_LOADING', payload: false })
      return res
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error.message })
      throw error
    }
  }

  const logout = () => {
    clearAuth()
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
