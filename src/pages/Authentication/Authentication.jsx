import { useNavigate } from "react-router-dom"
import "./Authentication.css"

const Authentication = () => {
  const navigate = useNavigate();

  return (
  <>
    <div className="container">
      <div className="left-panel">
        <img src="Wib.png" alt="When in Baguio Logo" className="main-logo" />
        <div className="blob-shape1"></div>
        <div className="blob-shape2"></div>
      </div>

      <div className="right-panel">
        <button onClick={() => navigate("/attendance-record")} className="time-in-header">Time In</button>

        <div className="logo-section">
          <img src="WIB LOGO.png" className="baguio-logo" alt="WIB Logo" />
        
        </div>

        <form className="login-form">
          <div className="form-group">
            <input type="email" id="email" placeholder="Email" required />
          </div>

          <div className="form-group">
            <input type="password" id="password" placeholder="Password" required />
          </div>

          <button type="submit" className="btn-login">Login</button>
        </form>
      </div>
    </div>
  </>
)
}

export default Authentication