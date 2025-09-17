import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./eaa.css"

const EmployeeAccountActivation = () => {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("") // "error" or "success"
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setMessage("")
    setMessageType("")

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.")
      setMessageType("error")
      return
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long.")
      setMessageType("error")
      return
    }

    setMessage("Your account has been successfully activated!")
    setMessageType("success")

    // Reset fields
    setNewPassword("")
    setConfirmPassword("")
  }

  return (
    <div className="activation-container">
      <div className="activation-card">
        <h2>Activate Your Account</h2>
        <p className="subtext">Set your new password to get started.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {message && (
            <p className={`message ${messageType}`}>{message}</p>
          )}

          <button type="submit" className="activate-btn">
            Activate Account
          </button>
        </form>

        {/* Optional: Add navigation if needed */}
        <div style={{ marginTop: "15px" }}>
          <button onClick={() => navigate("/authentication")} className="back-btn">
            Back to Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmployeeAccountActivation
