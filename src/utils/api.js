// API utility functions for backend integration
// Replace baseURL with your backend API URL

import axios from 'axios'

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Provider Profile APIs
export const getProviderProfile = async () => {
  const response = await api.get('/provider/profile')
  return response.data
}

export const updateProviderProfile = async (profileData) => {
  const response = await api.put('/provider/profile', profileData)
  return response.data
}

// Services APIs
export const getServices = async () => {
  const response = await api.get('/provider/services')
  return response.data
}

export const createService = async (serviceData) => {
  const response = await api.post('/provider/services', serviceData)
  return response.data
}

export const updateService = async (id, serviceData) => {
  const response = await api.put(`/provider/services/${id}`, serviceData)
  return response.data
}

export const deleteService = async (id) => {
  const response = await api.delete(`/provider/services/${id}`)
  return response.data
}

// Bookings APIs
export const getBookings = async (params = {}) => {
  const response = await api.get('/provider/bookings', { params })
  return response.data
}

export const updateBookingStatus = async (id, status) => {
  const response = await api.put(`/provider/bookings/${id}`, { status })
  return response.data
}

// Availability APIs
export const getAvailability = async () => {
  const response = await api.get('/provider/availability')
  return response.data
}

export const updateAvailability = async (availabilityData) => {
  const response = await api.put('/provider/availability', availabilityData)
  return response.data
}

// Earnings APIs
export const getEarnings = async (params = {}) => {
  const response = await api.get('/provider/earnings', { params })
  return response.data
}

export const getEarningsReport = async (params = {}) => {
  const response = await api.get('/provider/earnings/report', { params })
  return response.data
}

// Auth APIs
export const login = async (credentials) => {
  const response = await api.post('/auth/provider/login', credentials)
  return response.data
}

export const register = async (providerData) => {
  const response = await api.post('/auth/provider/register', providerData)
  return response.data
}

export default api
