// hooks/shared/useApiClient.jsx
import { useState, useEffect, useCallback, useRef, useContext } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../../utils/apiClient'
import AuthContext from '../../context/AuthContext' // Use your actual AuthContext
import { useAuth } from '../../context/AuthContext'

export const useApiClientSetup = () => {
  const { auth, setAuth } = useContext(AuthContext) // Use useContext instead of useAuth
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [isInitialized, setIsInitialized] = useState(false)
  const initializationAttempted = useRef(false)

  // Memoize the refresh function to prevent recreating on every render
  const refreshTokenFunction = useCallback(async () => {
    try {
      console.log('Attempting token refresh...')
      const response = await apiClient.post('/api/token/refresh', {}, {
        withCredentials: true,
      })

      const newToken = response.data?.accessToken || response.accessToken
      
      if (!newToken) {
        throw new Error('No access token received from refresh')
      }

      setAuth((prev) => ({
        ...prev,
        accessToken: newToken,
      }))

      console.log('Token refresh successful')
      return newToken
    } catch (error) {
      console.error('Token refresh failed:', error)
      throw error
    }
  }, [setAuth])

  // Memoize the auth failure handler
  const onAuthFailure = useCallback((error) => {
    console.error('Authentication failed:', error)
    setAuth({}) // Clear auth state (empty object to match your AuthContext)
    queryClient.clear()
    navigate('/authentication')
  }, [setAuth, queryClient, navigate])

  // Configure apiClient whenever auth changes
  useEffect(() => {
    console.log('Configuring apiClient with auth:', !!auth?.accessToken)
    
    apiClient.configure({
      getToken: () => auth?.accessToken,
      refreshToken: refreshTokenFunction,
      onAuthFailure,
    })
  }, [auth?.accessToken, refreshTokenFunction, onAuthFailure])

  // Handle initial authentication - only run once
  useEffect(() => {
    const initializeAuth = async () => {
      if (initializationAttempted.current) {
        return
      }
      
      initializationAttempted.current = true
      
      try {
        // Check if auth object exists and has keys (is not empty)
        const hasAuth = auth && Object.keys(auth).length > 0
        
        // If no access token, try to refresh
        if (!hasAuth || !auth.accessToken) {
          console.log('No access token found, attempting initial refresh...')
          await refreshTokenFunction()
        } else {
          console.log('Access token already exists, skipping refresh')
        }
      } catch (error) {
        console.error('Initial token refresh failed:', error)
        onAuthFailure(error)
      } finally {
        setIsInitialized(true)
      }
    }

    // Only initialize if we haven't already attempted it
    if (!isInitialized && !initializationAttempted.current) {
      initializeAuth()
    }
  }, [auth, refreshTokenFunction, onAuthFailure, isInitialized])

  return {
    isInitialized,
    apiClient,
    refreshToken: refreshTokenFunction,
  }
}