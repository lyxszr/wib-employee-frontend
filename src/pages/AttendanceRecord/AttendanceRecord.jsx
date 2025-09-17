import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./AttendanceRecord.css"
import { useQueryClient } from '@tanstack/react-query'
import { 
  useGetEmployeeStatus, 
  useTimeInAction, 
  useTimeOutAction 
} from '../../hooks/employees/useEmployeesServices'

const AttendanceRecord = () => {
  const [time, setTime] = useState("")
  const [date, setDate] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Fetch employee status
  const { data: employeeStatus, isLoading: statusLoading, error: statusError } = useGetEmployeeStatus(email)
  
  // Mutations
  const timeInMutation = useTimeInAction()
  const timeOutMutation = useTimeOutAction()

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

  // Refetch status after successful mutations
  const invalidateStatus = () => {
    queryClient.invalidateQueries(['employeeStatus', email])
  }

  const handleTimeInAction = (skipBreak = false) => {
    timeInMutation.mutate(
      { email, password, skipBreak },
      {
        onSuccess: () => {
          invalidateStatus()
          console.log("Time in action completed at:", new Date().toLocaleTimeString())
        }
      }
    )
  }

  const handleTimeOut = () => {
    timeOutMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          invalidateStatus()
          console.log("Time out completed at:", new Date().toLocaleTimeString())
        }
      }
    )
  }

  const handleButtonClick = () => {
    if (!employeeStatus) return

    switch (employeeStatus.action) {
      case 'time_in':
      case 'back_from_break':
        handleTimeInAction()
        break
      case 'go_on_break':
        handleTimeInAction() // This will start break
        break
      case 'time_out':
        handleTimeOut()
        break
      case 'skip_break_time_out':
        handleTimeInAction(true) // Skip break and time out
        break
      default:
        break
    }
  }

  const getButtonText = () => {
    if (!employeeStatus) return "Loading..."
    return employeeStatus.buttonText || "Time In"
  }

  const getButtonClass = () => {
    if (!employeeStatus) return "btn-time-in"
    
    switch (employeeStatus.action) {
      case 'time_in':
      case 'back_from_break':
        return "btn-time-in"
      case 'go_on_break':
        return "btn-break"
      case 'time_out':
        return "btn-time-out"
      default:
        return "btn-time-in"
    }
  }

  const getStatusMessage = () => {
    if (statusLoading) return "Loading status..."
    if (statusError) return "Error loading status"
    if (!employeeStatus) return "Enter credentials to check status"

    switch (employeeStatus?.status) {
      case 'not_clocked_in':
        return "Ready to start your work day"
      case 'working':
        return "Work session active - you can take a break when ready"
      case 'on_break':
        return "On break - click to return to work"
      case 'ready_for_time_out': 
        return "Click to end your working day"
      case 'completed':
        return `Work day completed - Total: ${employeeStatus.totalHours?.toFixed(2) || 0}hrs`
      case 'not_employee':
        return "Account not found as employee"
      case 'logged_out':
        return "Please enter your credentials"
      default:
        return ""
    }
  }

  const isLoading = timeInMutation.isPending || timeOutMutation.isPending || statusLoading

  const getError = () => {
    if (timeInMutation.isError) return timeInMutation.error?.message || 'Time in failed'
    if (timeOutMutation.isError) return timeOutMutation.error?.message || 'Time out failed'
    if (statusError) return 'Failed to load status'
    return null
  }

  const isSuccess = timeInMutation.isSuccess || timeOutMutation.isSuccess

  const isButtonDisabled = () => {
    return isLoading || 
           !email || 
           !password || 
           !employeeStatus || 
           employeeStatus.action === 'none'
  }

  // Show additional info if available
  const getAdditionalInfo = () => {
    if (!employeeStatus) return null

    const info = []
    if (employeeStatus.workStarted) {
      info.push(`Work started: ${new Date(employeeStatus.workStarted).toLocaleTimeString()}`)
    }
    if (employeeStatus.breakTime) {
      info.push(`Break time: ${employeeStatus.breakTime.toFixed(2)}hrs`)
    }
    if (employeeStatus.canSkipBreak) {
      info.push(`You can skip break and end your day`)
    }

    return info.length > 0 ? info.join(' | ') : null
  }

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

        {/* Additional Info */}
        {getAdditionalInfo() && (
          <div className="additional-info">
            {getAdditionalInfo()}
          </div>
        )}

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
              disabled={isButtonDisabled()}
            >
              {isLoading ? "Processing..." : getButtonText()}
            </button>
          </div>

          {/* Show feedback */}
          {getError() && (
            <div className="error-message">
              Error: {getError()}
            </div>
          )}
          {isSuccess && (
            <div className="success-message">
              Action completed successfully!
            </div>
          )}

          {/* Skip Break Option - only show when user is working and can take break */}
          {employeeStatus?.status === 'working' && employeeStatus?.canSkipBreak && (
            <div className="button-group">
              <button
                className="btn-skip-break"
                onClick={() => handleTimeInAction(true)}
                disabled={isLoading}
              >
                Skip Break & End Day
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AttendanceRecord
