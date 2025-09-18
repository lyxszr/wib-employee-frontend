// App.jsx
import { lazy, Suspense } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { UserProfileProvider } from "./context/UserProfileContext"
import './App.css'
import { useApiClientSetup } from './hooks/shared/useApiClient'
import ProfileSettings from "./pages/Profile/Profile"
import EmployeeAccountActivation from "./components/EmployeeAccountActivation/EmployeeAccountActivation"

const Authentication = lazy(() => import('./pages/Authentication/Authentication'))
const AttendanceRecord = lazy(() => import('./pages/AttendanceRecord/AttendanceRecord'))
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'))
const Calendar = lazy(() => import('./pages/Calendar/Calendar'))
const RequestLeave = lazy(() => import('./pages/RequestLeave/RequestLeave'))  
const Profile = lazy(() => import('./pages/Profile/Profile'))
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'))


const AppContent = () => {
  const { isInitialized } = useApiClientSetup()
  
  // Show loading while initializing authentication
  if (!isInitialized) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        <div>Initializing application...</div>
      </div>
    )
  }
  
  return (
    <UserProfileProvider>
      <Suspense fallback={
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          Loading...
        </div>
      }>
        <Routes>
          {/* Public routes */}
          <Route path="/authentication" element={<Authentication />} />
          <Route path="/activate-account" element={<EmployeeAccountActivation />} />
          
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Protected routes - ALL routes except authentication and activation are protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/attendance-record" element={<AttendanceRecord />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/request-leave" element={<RequestLeave />} />
            <Route path="/profile-settings" element={<ProfileSettings />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          
          {/* Catch-all route - redirect unknown paths to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </UserProfileProvider>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App