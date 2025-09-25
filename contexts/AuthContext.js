import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = Cookies.get('auth-token')
      if (!token) {
        setLoading(false)
        return
      }

      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      const response = await axios.get('/api/auth/verify')
      if (response.data.authenticated) {
        setIsAuthenticated(true)
        setUsername(response.data.username)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, accessCode) => {
    try {
      const response = await axios.post('/api/auth/login', {
        username,
        access_code: accessCode
      })
      
      const { access_token } = response.data
      
      // Store token in cookie
      Cookies.set('auth-token', access_token, { expires: 1 }) // 1 day
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      
      setIsAuthenticated(true)
      setUsername(username)
      
      return { success: true }
    } catch (error) {
      console.error('Login failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      }
    }
  }

  const logout = () => {
    Cookies.remove('auth-token')
    delete axios.defaults.headers.common['Authorization']
    setIsAuthenticated(false)
    setUsername('')
  }

  const value = {
    isAuthenticated,
    username,
    loading,
    login,
    logout
  }

  return React.createElement(AuthContext.Provider, { value }, children)
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}