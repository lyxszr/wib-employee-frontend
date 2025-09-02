import { lazy, Suspense } from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

const Authentication = lazy(() => import('./pages/Authentication/Authentication'))
const AttendanceRecord = lazy(() => import('./pages/AttendanceRecord/AttendanceRecord'))

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/authentication" element={<Authentication />}/>
          <Route path="/attendance-record" element={<AttendanceRecord />}/>
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App