// components/ProtectedRoute.jsx
import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import useUserProfile from '../hooks/user/useUserProfile'

const ProtectedRoute = ({ allowedRoles }) => {
  const { auth } = useContext(AuthContext)
  const { userProfile } = useUserProfile()

  // Check if user is authenticated (has token)
  const isAuthenticated = auth && 
    Object.keys(auth).length > 0 && 
    auth.accessToken && 
    auth.accessToken.trim() !== ''

  if (!isAuthenticated) {
    return <Navigate to="/authentication" replace />
  }

  // Optional: Check roles if provided
  if (allowedRoles && userProfile.role) {
    const hasRequiredRole = allowedRoles.includes(userProfile.role)
    
    if (!hasRequiredRole) {
      return <Navigate to="/authentication" replace />
    }
  }

  return <Outlet />
}

export default ProtectedRoute