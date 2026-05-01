import axios from 'axios'
import { getToken, clearAuth } from '../utils/storage'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1'

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth()
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data || { message: 'Network Error' })
  }
)

export default axiosInstance
