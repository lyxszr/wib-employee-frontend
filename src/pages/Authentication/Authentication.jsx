import { useNavigate } from "react-router-dom"
import React, { useState } from "react"
import "./Authentication.css"

const Authentication = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [signInError, setSignInError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setSignInError("")
    try {
      const res = await fetch("http://localhost:5000/api/auth/v1/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      if (res.status === 200) {
        navigate("/dashboard")
      }
      // Optionally handle successful sign in (e.g., save token, redirect)
    } catch (err) {
      setSignInError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
  <>
    <div className="container">
      <div className="left-panel">
        <img src="Wib.png" alt="When in Baguio Logo" className="main-logo" />
        <div className="blob-shape1"></div>
        <div className="blob-shape2"></div>
      </div>

      <div className="right-panel">
        <button onClick={() => navigate("/authentication")} className="time-in-header">Time In</button>

        <div className="logo-section">
          <img src="WIB LOGO.png" className="baguio-logo" alt="WIB Logo" />
        </div>

        <form className="login-form" onSubmit={handleSignIn}>
          <div className="form-group">
            <input
              type="email"
              id="email"
              placeholder="Email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              id="password"
              placeholder="Password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-login" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Login"}
          </button>
          {signInError && <div style={{ color: "red", marginTop: 8 }}>{signInError}</div>}
        </form>
      </div>
    </div>
  </>
)
}

export default Authentication