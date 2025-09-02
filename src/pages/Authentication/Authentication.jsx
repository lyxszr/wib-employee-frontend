import "./Authentication.css"

const Authentication = () => {
  return (
    <>
   <div className="container">
  <div className="left-panel">
    <img src="Wib.png" alt="When in Baguio Logo" className="main-logo" />
    <div className="blob-shape1"></div>
    <div className="blob-shape2"></div>
  </div>

  <div className="right-panel">
    <a href="index.html" className="time-in-header">Time In</a>

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

      <a href="#" className="forgot-password">Forgot Password?</a>

      <a href="employeedashboard.html" className="btn-login">Login</a>
    </form>
  </div>
</div>


  </>
)
}

export default Authentication
