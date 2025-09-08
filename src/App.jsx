// App.jsx
import { lazy, Suspense } from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { UserProfileProvider } from "./context/UserProfileContext"
import './App.css'
import { useApiClientSetup } from './hooks/shared/useApiClient'
import ProfileSettings from "./pages/Profile/Profile"

const Authentication = lazy(() => import('./pages/Authentication/Authentication'))
const AttendanceRecord = lazy(() => import('./pages/AttendanceRecord/AttendanceRecord'))
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'))
const Calendar = lazy(() => import('./pages/Calendar/Calendar'))
const RequestLeave = lazy(() => import('./pages/RequestLeave/RequestLeave'))  
const Profile = lazy(() => import('./pages/Profile/Profile'))

const AppContent = () => {
  useApiClientSetup() 
  
  return (
    <AuthProvider>
      <UserProfileProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/authentication" element={<Authentication />}/>
            <Route path="/attendance-record" element={<AttendanceRecord />}/>
            <Route path="/dashboard" element={<Dashboard />}/>
            <Route path="/calendar" element={<Calendar />}/>
            <Route path="/request-leave" element={<RequestLeave />}/>
            <Route path="/profile-settings" element={<ProfileSettings />}/>
            <Route path="/profile" element={<Profile />}/>
          </Routes>
        </Suspense>
      </UserProfileProvider>
    </AuthProvider>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App