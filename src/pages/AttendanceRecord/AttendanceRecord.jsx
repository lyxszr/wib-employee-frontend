import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./AttendanceRecord.css"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const AttendanceRecord = () => {
  const [time, setTime] = useState("")
  const [date, setDate] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [currentState, setCurrentState] = useState("TIME_IN") // TIME_IN, BREAK, BACK_FROM_BREAK, TIME_OUT
  const navigate = useNavigate()

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()

      const timeString = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })

      const dateString = now.toLocaleDateString("en-US", {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })

      setTime(timeString);
      setDate(`Today is ${dateString}`);
    }

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  // Mutation for Time In
  const timeInMutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await fetch('http://localhost:5000/api/employee/v1/time-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) throw new Error('Failed to time in')
      return res.json()
    },
  })

  // Mutation for Break
  const breakMutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await fetch('http://localhost:5000/api/employee/v1/break', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) throw new Error('Failed to start break')
      return res.json()
    },
  })

  // Mutation for Back from Break (second time in)
  const backFromBreakMutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await fetch('http://localhost:5000/api/employee/v1/back-from-break', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) throw new Error('Failed to return from break')
      return res.json()
    },
  })

  // Mutation for Time Out
  const timeOutMutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await fetch('http://localhost:5000/api/employee/v1/time-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) throw new Error('Failed to time out')
      return res.json()
    },
  })

  const handleTimeIn = () => {
    const now = new Date()
    if (currentState === "TIME_IN") {
      // First time in
      setCurrentState("BREAK")
      timeInMutation.mutate({ email, password })
      console.log("First Time In at:", now.toLocaleTimeString())
    } else if (currentState === "BACK_FROM_BREAK") {
      // Second time in (back from break)
      setCurrentState("TIME_OUT")
      backFromBreakMutation.mutate({ email, password })
      console.log("Back from Break at:", now.toLocaleTimeString())
    }
  }

  const handleBreak = () => {
    const now = new Date()
    setCurrentState("BACK_FROM_BREAK")
    breakMutation.mutate({ email, password })
    console.log("Break started at:", now.toLocaleTimeString())
  }

  const handleTimeOut = () => {
    const now = new Date()
    timeOutMutation.mutate({ email, password })
    console.log("Time Out at:", now.toLocaleTimeString())
    
    // Reset to initial state
    setCurrentState("TIME_IN")
  }

  const getButtonText = () => {
    switch (currentState) {
      case "TIME_IN":
        return "Time In"
      case "BREAK":
        return "Break"
      case "BACK_FROM_BREAK":
        return "Time In"
      case "TIME_OUT":
        return "Time Out"
      default:
        return "Time In"
    }
  }

  const getButtonClass = () => {
    switch (currentState) {
      case "TIME_IN":
      case "BACK_FROM_BREAK":
        return "btn-time-in"
      case "BREAK":
        return "btn-break"
      case "TIME_OUT":
        return "btn-time-out"
      default:
        return "btn-time-in"
    }
  }

  const handleButtonClick = () => {
    switch (currentState) {
      case "TIME_IN":
        handleTimeIn()
        break
      case "BREAK":
        handleBreak()
        break
      case "BACK_FROM_BREAK":
        handleTimeIn()
        break
      case "TIME_OUT":
        handleTimeOut()
        break
      default:
        break
    }
  }

  const getStatusMessage = () => {
    switch (currentState) {
      case "TIME_IN":
        return "Ready to start your work day"
      case "BREAK":
        return "Work session started - you can take a break when ready"
      case "BACK_FROM_BREAK":
        return "On break - click to return to work"
      case "TIME_OUT":
        return "Work session active - you can time out when done"
      default:
        return ""
    }
  }

  const isLoading = timeInMutation.isLoading || breakMutation.isLoading || 
                   backFromBreakMutation.isLoading || timeOutMutation.isLoading

  const getError = () => {
    if (timeInMutation.isError) return timeInMutation.error.message
    if (breakMutation.isError) return breakMutation.error.message
    if (backFromBreakMutation.isError) return backFromBreakMutation.error.message
    if (timeOutMutation.isError) return timeOutMutation.error.message
    return null
  }

  const isSuccess = timeInMutation.isSuccess || breakMutation.isSuccess || 
                   backFromBreakMutation.isSuccess || timeOutMutation.isSuccess

  return (
    <div className="container">
      {/* Left Panel */}
      <div className="left-panel">
        <img src="Wib.png" alt="When in Baguio Logo" className="main-logo" />
        <div className="blob-shape1"></div>
        <div className="blob-shape2"></div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <a onClick={() => navigate("/authentication")} className="signup-header">
          Sign in
        </a>

        <div className="date-time">{date}</div>
        <div className="time-display">{time}</div>

        {/* Status Message */}
        <div className="status-message">
          {getStatusMessage()}
        </div>

        <div className="signup-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="Enter your email acc."
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="checkbox-group">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>

          <div className="button-group">
            <button
              className={getButtonClass()}
              onClick={handleButtonClick}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : getButtonText()}
            </button>
          </div>

          {/* Show feedback */}
          {getError() && (
            <div className="error-message">
              Failed: {getError()}
            </div>
          )}
          {isSuccess && (
            <div className="success-message">
              Action completed successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AttendanceRecord