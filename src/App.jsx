import { lazy, Suspense } from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient()

const Authentication = lazy(() => import('./pages/Authentication/Authentication'))
const AttendanceRecord = lazy(() => import('./pages/AttendanceRecord/AttendanceRecord'))
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'))

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/authentication" element={<Authentication />}/>
            <Route path="/attendance-record" element={<AttendanceRecord />}/>
            <Route path="/dashboard" element={<Dashboard />}/>
          </Routes>
        </QueryClientProvider>
      </Suspense>
    </Router>
  )
}

export default App