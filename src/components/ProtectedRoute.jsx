// components/ProtectedRoute.jsx
import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const ProtectedRoute = ({ allowedRoles = null }) => {
  const { auth } = useContext(AuthContext)

  console.log('🔍 ProtectedRoute Debug:')
  console.log('- Auth object:', auth)
  console.log('- Auth keys:', Object.keys(auth))
  console.log('- Has accessToken:', !!auth?.accessToken)
  console.log('- AccessToken value:', auth?.accessToken)
  console.log('- Current URL:', window.location.pathname)

  // Check if user is authenticated (has token)
  const isAuthenticated = auth && 
    Object.keys(auth).length > 0 && 
    auth.accessToken && 
    auth.accessToken.trim() !== ''

  console.log('- Is Authenticated:', isAuthenticated)

  if (!isAuthenticated) {
    console.log('❌ No valid token found, redirecting to /authentication')
    return <Navigate to="/authentication" replace />
  }

  // Optional: Check roles if provided
  if (allowedRoles && auth.roles) {
    const hasRequiredRole = allowedRoles.some(role => 
      auth.roles.includes(role)
    )
    
    if (!hasRequiredRole) {
      console.log('❌ Insufficient permissions')
      return <Navigate to="/authentication" replace />
    }
  }

  console.log('✅ Authentication valid, allowing access')
  return <Outlet />
}

export default ProtectedRoute