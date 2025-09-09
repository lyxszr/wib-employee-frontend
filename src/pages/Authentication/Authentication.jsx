import { useNavigate } from "react-router-dom"
import { useSignIn } from "../../hooks/authentication/useAuthMutations"
import { useState } from "react"
import "./Authentication.css"

const Authentication = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const signInMutation = useSignIn()

  const handleSignIn = async (e) => {
    e.preventDefault()
    signInMutation.mutate({ email, password })
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

  <button 
    type="submit" 
    className="btn-login" 
    disabled={signInMutation.isPending}
  >
    {signInMutation.isPending ? "Signing In..." : "Login"}
  </button>

  {/* Time In button under Login button */}
  <button 
    type="button" 
    onClick={() => navigate("/attendance-record")} 
    className="time-in-header"
  >
    Time In
  </button>

  {signInMutation.error && (
    <div style={{ color: "red", marginTop: 8 }}>
      {signInMutation.error.message}
    </div>
  )}
</form>

        </div>
      </div>
    </>
  )
}

export default Authentication
