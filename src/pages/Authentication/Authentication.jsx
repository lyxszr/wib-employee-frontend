import "./Authentication.css"

const Authentication = () => {
  return (
    <>
    <div class="container">
      <div class="left-panel">
        <img src="Wib.png" alt="When in Baguio Logo" class="main-logo"/>
        <div class="blob-shape1"></div>
        <div class="blob-shape2"></div>
    </div>

  <div class="right-panel">
    <a href="index.html" class="time-in-header">Time In</a>

      <div class="logo-section">
        <img src="WIB LOGO.png" class="baguio-logo" />
      </div>
      
      <form class="login-form" onsubmit="handleLogin(event)">
        <div class="form-group">
          <input type="email" id="email" placeholder="Email" required/>
        </div>
        
        <div class="form-group">
          <input type="password" id="password" placeholder="Password" required/>
        </div>
        
        <a href="#" class="forgot-password">Forgot Password?</a>
        
        <a href="employeedashboard.html" class="btn-login">Login</a>

      </form>
    </div>
  </div>

  </>
)
}

export default Authentication